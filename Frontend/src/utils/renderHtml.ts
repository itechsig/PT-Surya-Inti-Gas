import DOMPurify from 'dompurify';

const ALIGN_CLASS = /^ql-align-(center|right|justify)$/;

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

/**
 * Safely render HTML content from rich text editor.
 * Sanitizes HTML to prevent XSS attacks while allowing basic formatting.
 */
export function renderHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['class'],
  });
}
