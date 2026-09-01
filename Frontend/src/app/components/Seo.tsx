import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

// Single source of truth for per-page SEO tags. Every public route renders one
// <Seo> so each URL gets its own <title>, description, canonical and hreflang
// set instead of inheriting the static homepage tags from index.html.
const SITE = 'https://suryaintigas.com';
const LANGS = ['id', 'en', 'zh'] as const;
const OG_LOCALE: Record<string, string> = { id: 'id_ID', en: 'en_US', zh: 'zh_CN' };

interface SeoProps {
  title: string;
  description: string;
  /** Path after the /:lang prefix, without a leading slash. Empty string = homepage. */
  segment?: string;
  /** Query string (including the leading "?") to keep on the canonical + alternates. */
  query?: string;
  /** Absolute or root-relative image for social cards. */
  image?: string;
  type?: 'website' | 'article';
  /** Keep the page out of the index (thin/detail pages with no crawlable data). */
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  segment = '',
  query = '',
  image = '/office-optimized.jpg',
  type = 'website',
  noindex = false,
}: SeoProps) {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = (LANGS as readonly string[]).includes(lang ?? '') ? (lang as string) : 'id';
  const path = (segment ? `/${segment}` : '') + query;
  const canonical = `${SITE}/${currentLang}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE}${image}`;

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <link rel="canonical" href={canonical} />

      {LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${SITE}/${l}${path}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE}/id${path}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={OG_LOCALE[currentLang]} />
      <meta property="og:site_name" content="PT Surya Inti Gas" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

export default Seo;
