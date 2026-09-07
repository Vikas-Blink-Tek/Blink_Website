export const LEAD_EMAIL = 'sharanyapoojari@blinkfinance.in';
const LEAD_PHP_ENDPOINT = '/lead.php';
const FORM_SUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${LEAD_EMAIL}`;

type LeadResult = { ok: boolean; message: string };

function isSuccessPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  const success = (payload as { success?: string | boolean }).success;
  return success === true || success === 'true';
}

function payloadMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
}

async function postJson(url: string, body: Record<string, string>): Promise<LeadResult> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  return {
    ok: response.ok && isSuccessPayload(parsed),
    message: payloadMessage(parsed, text || `HTTP ${response.status}`),
  };
}

export async function submitLead(fields: Record<string, string>): Promise<LeadResult> {
  const payload: Record<string, string> = {
    ...fields,
    'Sent to': LEAD_EMAIL,
  };

  try {
    const local = await postJson(LEAD_PHP_ENDPOINT, payload);
    if (local.ok) {
      return local;
    }
  } catch {
    // Fall through to FormSubmit if the Hostinger mailer is unreachable.
  }

  return postJson(FORM_SUBMIT_ENDPOINT, {
    ...payload,
    _template: 'table',
    _honeypot: '',
    _captcha: 'false',
  });
}
