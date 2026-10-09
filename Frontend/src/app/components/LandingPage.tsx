import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Seo, SITE } from './Seo';
import { PageHero } from './PageHero';
import { OFFICES, type Office } from '../../data/contact';
import landingPages from '../../data/landingPages.json';

/*
 * Indonesian keyword landing pages (/id/supplier-gas-industri, ...). Content lives in
 * data/landingPages.json, shared with scripts/prerender-seo.mjs so the static SEO
 * shell carries the same text crawlers see after React renders. The pages are
 * Indonesian-only: /en and /zh versions redirect to /id (here and in .htaccess).
 *
 * Adding a page: add it to the JSON, then to the slug lists in Backend/public/.htaccess
 * and Backend/app/Support/SiteUrls.php (LANDING_PAGES).
 */

interface LandingItem {
  name: string;
  text: string;
  /** Path after /id, e.g. "/produk/detail?id=oxygen". */
  href?: string;
}

interface LandingSection {
  heading: string;
  paragraphs?: string[];
  items?: LandingItem[];
}

export interface LandingPageData {
  label: string;
  seoTitle: string;
  description: string;
  h1: string;
  subtitle: string;
  image: string;
  intro: string[];
  sections: LandingSection[];
  office: Office['id'] | 'both';
  faq: { q: string; a: string }[];
  related: string[];
}

export const LANDING_PAGES = landingPages as Record<string, LandingPageData>;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const NAVY = 'var(--brand-navy, #0C2D5E)';
const BODY = '#334155';

const h2Style: React.CSSProperties = {
  fontFamily: 'Barlow, system-ui, sans-serif',
  fontSize: 'clamp(1.35rem, 2.8vw, 1.85rem)',
  fontWeight: 800,
  color: NAVY,
  margin: '0 0 16px',
  lineHeight: 1.25,
};

const pStyle: React.CSSProperties = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '1.0625rem',
  lineHeight: 1.8,
  color: BODY,
  margin: '0 0 16px',
};

const cardStyle: React.CSSProperties = {
  display: 'block',
  height: '100%',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px 22px',
  textDecoration: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function ItemCard({ item }: { item: LandingItem }) {
  const body = (
    <>
      <h3 style={{ fontFamily: 'Barlow, system-ui, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: NAVY, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
        {item.name}
        {item.href && <ArrowRight size={16} aria-hidden="true" style={{ flexShrink: 0, color: '#2563eb' }} />}
      </h3>
      <p style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '0.95rem', lineHeight: 1.65, color: '#475569', margin: 0 }}>
        {item.text}
      </p>
    </>
  );
  return item.href ? (
    <Link to={`/id${item.href}`} style={cardStyle} className="landing-card">{body}</Link>
  ) : (
    <div style={cardStyle}>{body}</div>
  );
}

function OfficeCard({ office }: { office: Office }) {
  const row: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'flex-start', color: BODY, fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '0.95rem', lineHeight: 1.6, textDecoration: 'none', marginTop: 10 };
  return (
    <div style={{ ...cardStyle, padding: '24px' }}>
      <h3 style={{ fontFamily: 'Barlow, system-ui, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: NAVY, margin: 0 }}>
        {office.city} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem' }}>— {office.role}</span>
      </h3>
      <div style={row}><MapPin size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />{office.address}</div>
      <a href={`tel:+${office.phoneE164}`} style={row}><Phone size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />{office.phoneDisplay}</a>
      <a href={`mailto:${office.email}`} style={row}><Mail size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />{office.email}</a>
      <a
        href={office.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '10px 18px', borderRadius: 8, background: '#16a34a', color: '#fff', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 600, textDecoration: 'none' }}
      >
        <FaWhatsapp size={18} aria-hidden="true" /> Minta Penawaran via WhatsApp
      </a>
    </div>
  );
}

export function LandingPage() {
  const { lang, slug = '' } = useParams<{ lang: string; slug: string }>();
  const page = Object.prototype.hasOwnProperty.call(LANDING_PAGES, slug) ? LANDING_PAGES[slug] : undefined;

  // Mounted on the catch-all /:lang/:slug route: unknown paths go home, like the old "*" route.
  if (!page) return <Navigate to={`/${lang === 'en' || lang === 'zh' ? lang : 'id'}`} replace />;
  // Indonesian-only content: keep a single URL per page.
  if (lang !== 'id') return <Navigate to={`/id/${slug}`} replace />;

  const offices = page.office === 'both' ? [OFFICES.sidoarjo, OFFICES.balikpapan] : [OFFICES[page.office]];
  const pageUrl = `${SITE}/id/${slug}`;

  const jsonLd = [
    {
      '@type': 'Service',
      name: page.h1,
      description: page.description,
      url: pageUrl,
      provider: { '@id': page.office === 'both' ? `${SITE}/#organization` : `${SITE}/#${page.office}` },
      areaServed: page.office === 'balikpapan'
        ? ['Balikpapan', 'Kalimantan Timur']
        : page.office === 'sidoarjo'
          ? ['Sidoarjo', 'Surabaya', 'Jawa Timur']
          : ['Jawa Timur', 'Jawa Tengah', 'DI Yogyakarta', 'Kalimantan Timur'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: page.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.description}
        segment={slug}
        image={page.image}
        alternates={false}
        jsonLd={jsonLd}
      />
      <style>{`.landing-card:hover{border-color:#93c5fd;box-shadow:0 6px 20px rgba(15,23,42,.08)}`}</style>

      <PageHero
        title={page.h1}
        subtitle={page.subtitle}
        backgroundImage={page.image}
        breadcrumbs={[{ label: 'Beranda', href: '/id' }, { label: page.label }]}
      />

      <article style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(48px, 8vw, 88px) 16px 96px' }}>
        <div style={{ maxWidth: '820px' }}>
          {page.intro.map((p, i) => <p key={i} style={pStyle}>{p}</p>)}
        </div>

        {page.sections.map((section) => (
          <motion.section
            key={section.heading}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            style={{ marginTop: 'clamp(40px, 6vw, 64px)' }}
          >
            <h2 style={h2Style}>{section.heading}</h2>
            {section.paragraphs?.map((p, i) => <p key={i} style={{ ...pStyle, maxWidth: '820px' }}>{p}</p>)}
            {section.items && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16, marginTop: 8 }}>
                {section.items.map((item) => <ItemCard key={item.name} item={item} />)}
              </div>
            )}
          </motion.section>
        ))}

        <section style={{ marginTop: 'clamp(40px, 6vw, 64px)' }}>
          <h2 style={h2Style}>Hubungi Kami</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
            {offices.map((office) => <OfficeCard key={office.id} office={office} />)}
          </div>
        </section>

        <section style={{ marginTop: 'clamp(40px, 6vw, 64px)', maxWidth: '820px' }}>
          <h2 style={h2Style}>Pertanyaan yang Sering Diajukan</h2>
          {page.faq.map(({ q, a }) => (
            <details key={q} style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
              <summary style={{ cursor: 'pointer', fontFamily: 'Barlow, system-ui, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: NAVY }}>
                {q}
              </summary>
              <p style={{ ...pStyle, margin: '12px 0 0' }}>{a}</p>
            </details>
          ))}
        </section>

        <nav aria-label="Halaman terkait" style={{ marginTop: 'clamp(40px, 6vw, 64px)' }}>
          <h2 style={h2Style}>Halaman Terkait</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {page.related.filter((s) => LANDING_PAGES[s]).map((s) => (
              <Link
                key={s}
                to={`/id/${s}`}
                style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid #cbd5e1', color: NAVY, background: '#fff', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}
              >
                {LANDING_PAGES[s].label}
              </Link>
            ))}
            <Link
              to="/id/produk"
              style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid #cbd5e1', color: NAVY, background: '#fff', fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}
            >
              Semua Produk
            </Link>
          </div>
        </nav>
      </article>
    </>
  );
}

export default LandingPage;
