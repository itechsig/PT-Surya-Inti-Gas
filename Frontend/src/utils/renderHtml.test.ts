import { describe, expect, it } from 'vitest';
import { firstRichText, htmlToPlainText, isBlankHtml, renderHtml, toRichHtml } from './renderHtml';

describe('renderHtml helpers', () => {
  it('converts legacy plain text to one paragraph per line', () => {
    expect(toRichHtml('Baris 1\n\nBaris <2>')).toBe('<p>Baris 1</p><p><br></p><p>Baris &lt;2&gt;</p>');
    expect(toRichHtml('<p>Sudah HTML</p>')).toBe('<p>Sudah HTML</p>');
  });

  it('treats an emptied Quill editor as blank', () => {
    expect(isBlankHtml('<p><br></p>')).toBe(true);
    expect(isBlankHtml('<ul><li><br></li></ul>')).toBe(true);
    expect(isBlankHtml('<p>Isi</p>')).toBe(false);
    expect(firstRichText('<p><br></p>', 'Deskripsi singkat')).toBe('Deskripsi singkat');
  });

  it('extracts plain text for meta tags without merging paragraphs', () => {
    expect(htmlToPlainText('<p>Satu &amp; dua</p><p><strong>Tiga</strong></p>')).toBe('Satu & dua Tiga');
  });

  it('keeps alignment classes and strips everything else', () => {
    expect(renderHtml('<p class="ql-align-center foo" onclick="x()">A</p><script>bad()</script>'))
      .toBe('<p class="ql-align-center">A</p>');
  });
});
