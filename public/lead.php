<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  $data = $_POST;
}

function lead_field($data, $key, $max = 300) {
  if (!isset($data[$key]) || !is_scalar($data[$key])) {
    return '';
  }
  $value = trim(strip_tags((string) $data[$key]));
  $value = preg_replace('/[\r\n\t]+/', ' ', $value);
  if (!is_string($value)) {
    return '';
  }
  if (function_exists('mb_substr')) {
    return mb_substr($value, 0, $max);
  }
  return substr($value, 0, $max);
}

function lead_header_safe($value) {
  return trim(str_replace(array("\r", "\n", "\0"), '', $value));
}

if (lead_field($data, '_honeypot', 50) !== '' || lead_field($data, 'website', 50) !== '') {
  echo json_encode(array('success' => true, 'message' => 'Received'));
  exit;
}

$name = lead_field($data, 'name', 120);
$phone = lead_field($data, 'phone', 20);
$form = lead_field($data, 'Form', 80);
if ($form === '') {
  $form = 'Website form';
}

if ($name === '' || $phone === '') {
  http_response_code(400);
  echo json_encode(array('success' => false, 'message' => 'Name and phone are required'));
  exit;
}

$digits = preg_replace('/\D+/', '', $phone);
if (!is_string($digits) || strlen($digits) < 10) {
  http_response_code(400);
  echo json_encode(array('success' => false, 'message' => 'Invalid phone'));
  exit;
}

$skip = array('_subject' => true, '_template' => true, '_honeypot' => true, '_captcha' => true, 'Sent to' => true, 'website' => true);
$lines = array('Form: ' . $form);

foreach ($data as $key => $value) {
  if (!is_string($key) || isset($skip[$key]) || substr($key, 0, 1) === '_') {
    continue;
  }
  $lines[] = $key . ': ' . lead_field($data, $key, 500);
}

$lines[] = 'Submitted: ' . date('Y-m-d H:i:s T');

$to = 'info@blinkfinance.in';
$subject = lead_field($data, '_subject', 140);
if ($subject === '') {
  $subject = 'Blink Finance lead — ' . $form . ' — ' . $name;
}
$subject = lead_header_safe($subject);
$body = "New Blink Finance website enquiry\n\n" . implode("\n", $lines) . "\n";

$headers = array(
  'From: Blink Finance Website <info@blinkfinance.in>',
  'Reply-To: ' . $to,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: Blink Finance Lead Form',
);

$sent = @mail($to, $subject, $body, implode("\r\n", $headers), '-f info@blinkfinance.in');

if (!$sent) {
  http_response_code(500);
  echo json_encode(array('success' => false, 'message' => 'Mail failed'));
  exit;
}

echo json_encode(array('success' => true, 'message' => 'Sent'));
