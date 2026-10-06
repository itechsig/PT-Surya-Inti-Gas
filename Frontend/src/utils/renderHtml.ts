import DOMPurify from 'dompurify';

const ALIGN_CLASS = /^ql-align-(center|right|justify)$/;
const HAS_TAG = /<\/?[a-z][^>]*>/i;

// Quill stores paragraph alignment as ql-align-* classes; keep only those.
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName !== 'class') return;
  const kept = data.attrValue.split(/\s+/).filter((c) => ALIGN_CLASS.test(c));
  if (kept.length) {
    data.attrValue = kept.join(' ');
  } else {
    data.keepAttr = false;
  }
});

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Content saved before the rich text editor existed is plain text with newlines.
 * Convert it to one <p> per line (the same shape Quill produces) so line breaks survive.
 */
export function toRichHtml(value: string | null | undefined): string {
  if (!value) return '';
  if (HAS_TAG.test(value)) return value;
  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>'))
    .join('');
}

/** Plain text of a rich text value, e.g. for meta descriptions. */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return '';
  if (!HAS_TAG.test(html)) return html.replace(/\s+/g, ' ').trim();
  // Pad block boundaries so words from adjacent paragraphs don't run together.
  const padded = html.replace(/<\/(p|li|h[1-6])>|<br\s*\/?>/gi, ' $&');
  const doc = new DOMParser().parseFromString(padded, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** True when a rich text value has no visible text (e.g. Quill's empty "<p><br></p>"). */
export function isBlankHtml(html: string | null | undefined): boolean {
  return htmlToPlainText(html) === '';
}

/** The first rich text value that has visible text, for "full description, else short description" fallbacks. */
export function firstRichText(...values: (string | null | undefined)[]): string {
  return values.find((v) => !isBlankHtml(v)) ?? '';
}

/**
 * Safely render HTML content from rich text editor.
 * Sanitizes HTML to prevent XSS attacks while allowing basic formatting.
 */
export function renderHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(toRichHtml(html), {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['class'],
  });
}
