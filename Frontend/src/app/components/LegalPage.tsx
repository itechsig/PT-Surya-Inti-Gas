import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, type Variants } from 'motion/react';
import { PageHero } from './PageHero';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Shared renderer for the Privacy Policy and Terms of Service pages. Both are
 * plain long-form documents: a dark PageHero band, a "last updated" line, then a
 * numbered list of sections pulled from i18n so all three locales stay in sync.
 */
export function LegalPage({ ns }: { ns: 'privacyPolicy' | 'termsOfService' }) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';

  const title = t(`legal.${ns}.title`);
  const intro = t(`legal.${ns}.intro`);
  const updated = t(`legal.${ns}.updated`);
  const sections = t(`legal.${ns}.sections`, { returnObjects: true }) as LegalSection[];

  return (
    <>
      <Helmet>
        <title>{title} | PT Surya Inti Gas</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <PageHero
        title={title}
        subtitle={intro}
        backgroundImage="/images/office/wp2.jpg"
        breadcrumbs={[
          { label: t('common.home', 'Beranda'), href: `/${currentLang}` },
          { label: title },
        ]}
      />

      <section
        data-prose
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 88px) 6vw 120px',
        }}
      >
        <p
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'var(--brand-muted, #64748B)',
            marginBottom: '40px',
          }}
        >
          {t('legal.lastUpdatedLabel', 'Terakhir diperbarui')}: {updated}
        </p>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          style={{ listStyle: 'none', margin: 0, padding: 0, counterReset: 'legal' }}
        >
          {Array.isArray(sections) &&
            sections.map((section, i) => (
              <motion.li key={i} variants={fadeUp} style={{ marginBottom: '36px' }}>
                <h2
                  style={{
                    fontFamily: 'Barlow, system-ui, sans-serif',
                    fontSize: 'clamp(1.15rem, 2.4vw, 1.5rem)',
                    fontWeight: 700,
                    color: 'var(--brand-navy, #0C2D5E)',
                    margin: '0 0 12px',
                  }}
                >
                  {i + 1}. {section.heading}
                </h2>
                <p
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: '#334155',
                    margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {section.body}
                </p>
              </motion.li>
            ))}
        </motion.ol>
      </section>
    </>
  );
}

export function PrivacyPolicyPage() {
  return <LegalPage ns="privacyPolicy" />;
}

export function TermsOfServicePage() {
  return <LegalPage ns="termsOfService" />;
}
