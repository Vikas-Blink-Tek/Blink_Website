/** Strip HTML tags and script content to prevent XSS via form data */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};

/** Validate Indian phone number: 10 digits, optionally prefixed with +91 or 0 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
};

/** Letters, spaces, and common name punctuation only */
export const isValidPersonName = (name: string): boolean => {
  const cleaned = name.trim();
  if (cleaned.length < 2 || cleaned.length > 80) return false;
  return /^[A-Za-z][A-Za-z .'-]{1,79}$/.test(cleaned);
};
