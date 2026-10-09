// Post-build step: writes one static HTML shell per public route per language
// into dist/prerender/ (e.g. dist/prerender/en/produk.html). Backend/public/.htaccess
// serves these instead of the bare index.html, so crawlers and link-preview bots
// that don't run JavaScript still get the right <html lang>, title, description,
// canonical, hreflang, Open Graph tags and a real <h1> for every page.
//
// The shell is the normal SPA: the same bundle boots and React replaces the
// placeholder content in #root. Head tags are marked data-rh="true" so
// react-helmet-async swaps them out instead of duplicating them.
//
// Keep ROUTES in sync with the prerender RewriteRule in Backend/public/.htaccess
// and with STATIC_PAGES in Backend/app/Http/Controllers/SitemapController.php.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const SITE = 'https://suryaintigas.com';
const LANGS = ['id', 'en', 'zh'];
const OG_LOCALE = { id: 'id_ID', en: 'en_US', zh: 'zh_CN' };
const IMAGE = `${SITE}/office-optimized.jpg`;

// [path segment, locale seo key, locale header key for the nav]
const ROUTES = [
  ['', 'home', 'home'],
  ['tentang-kami', 'about', 'about'],
  ['produk', 'products', 'productsServices'],
  ['jaringan-distribusi', 'distribution', 'distribution'],
  ['portofolio', 'portfolio', 'portfolio'],
  ['galeri', 'gallery', 'gallery'],
  ['karir', 'career', 'career'],
  ['kontak', 'contact', 'contact'],
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender-seo: <div id="root"></div> not found in dist/index.html');
}

// Fallback tags from index.html that every page gets its own version of below.
const stripFallbacks = (html) => html.replace(/\s*<meta data-rh="true"[^>]*>/g, '');

let count = 0;
for (const lang of LANGS) {
  const locale = JSON.parse(fs.readFileSync(path.join(root, 'src/locales', `${lang}.json`), 'utf8'));

  const nav = ROUTES.map(([seg, , headerKey]) =>
    `<a href="/${lang}${seg ? `/${seg}` : ''}">${esc(locale.header[headerKey])}</a>`,
  ).join('');

  for (const [segment, seoKey] of ROUTES) {
    const { title, description } = locale.seo[seoKey];
    const urlPath = segment ? `/${segment}` : '';
    const canonical = `${SITE}/${lang}${urlPath}`;
    // Visible heading: the page title without the trailing "| Brand" part.
    const h1 = title.includes(' | ') ? title.slice(0, title.lastIndexOf(' | ')) : title;

    const head = [
      `<meta data-rh="true" name="description" content="${esc(description)}" />`,
      `<link data-rh="true" rel="canonical" href="${canonical}" />`,
      ...LANGS.map((l) => `<link data-rh="true" rel="alternate" hreflang="${l}" href="${SITE}/${l}${urlPath}" />`),
      `<link data-rh="true" rel="alternate" hreflang="x-default" href="${SITE}/id${urlPath}" />`,
      `<meta data-rh="true" property="og:title" content="${esc(title)}" />`,
      `<meta data-rh="true" property="og:description" content="${esc(description)}" />`,
      `<meta data-rh="true" property="og:type" content="website" />`,
      `<meta data-rh="true" property="og:url" content="${canonical}" />`,
      `<meta data-rh="true" property="og:image" content="${IMAGE}" />`,
      `<meta data-rh="true" property="og:locale" content="${OG_LOCALE[lang]}" />`,
      `<meta data-rh="true" property="og:site_name" content="PT Surya Inti Gas" />`,
      `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
      `<meta data-rh="true" name="twitter:title" content="${esc(title)}" />`,
      `<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`,
      `<meta data-rh="true" name="twitter:image" content="${IMAGE}" />`,
    ].map((t) => `    ${t}`).join('\n');

    // Placeholder until the bundle boots: a plain navy screen (like every page's
    // hero band). The h1/description/links are in the HTML for non-JS crawlers but
    // visually hidden — shown on screen they flashed text that differed from the
    // real page on every refresh.
    const hidden = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
    const body =
      `<div id="root"><div style="min-height:100vh;background:#0f172a">` +
      `<div style="${hidden}"><h1>${esc(h1)}</h1><p>${esc(description)}</p><nav>${nav}</nav></div>` +
      `</div></div>`;

    const html = stripFallbacks(template)
      .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>\n${head}`)
      .replace('<div id="root"></div>', body);

    const out = path.join(dist, 'prerender', lang, segment ? `${segment}.html` : '');
    const file = segment ? out : path.join(dist, 'prerender', `${lang}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    count++;
  }
}

console.log(`prerender-seo: wrote ${count} pages to dist/prerender/`);
