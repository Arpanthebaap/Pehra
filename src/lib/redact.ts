/**
 * Client-side-first PII redaction.
 *
 * Pehra's promise is that your document is never stored. This goes one step
 * further: identifiers that are never needed to analyse a clause are masked
 * before the text leaves the browser at all, so they are never transmitted,
 * never logged by an upstream provider, and never present in any error trace.
 *
 * Pattern matching is imperfect by nature. It is a harm-reduction layer, not a
 * guarantee, and the UI says so plainly rather than overpromising.
 */

export interface Redaction {
  label: string;
  count: number;
}

export interface RedactionResult {
  text: string;
  redactions: Redaction[];
}

interface Pattern {
  label: string;
  regex: RegExp;
  mask: string;
}

/**
 * Order matters: Aadhaar runs before the generic long-number rule so a 12-digit
 * ID is not swallowed by a less specific match.
 */
const PATTERNS: readonly Pattern[] = [
  {
    label: "Aadhaar number",
    regex: /\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    mask: "[AADHAAR REDACTED]",
  },
  {
    label: "PAN",
    regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
    mask: "[PAN REDACTED]",
  },
  {
    label: "Email address",
    regex: /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
    mask: "[EMAIL REDACTED]",
  },
  {
    label: "Phone number",
    regex: /(?:\+91[\s-]?)?\b[6-9]\d{9}\b/g,
    mask: "[PHONE REDACTED]",
  },
  {
    label: "Bank account number",
    regex: /\b\d{11,18}\b/g,
    mask: "[ACCOUNT REDACTED]",
  },
];

export function redact(input: string): RedactionResult {
  let text = input;
  const redactions: Redaction[] = [];

  for (const pattern of PATTERNS) {
    let count = 0;
    text = text.replace(pattern.regex, () => {
      count += 1;
      return pattern.mask;
    });
    if (count > 0) redactions.push({ label: pattern.label, count });
  }

  return { text, redactions };
}
