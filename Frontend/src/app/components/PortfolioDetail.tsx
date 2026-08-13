import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ArrowLeft, Building2, Calendar, FolderOpen, MapPin, Wrench } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import '../../styles/Portfolio.css';
import { PageHero } from './PageHero';
import { Skeleton } from './ui/skeleton';
import { usePortfolioDetail } from '../../hooks/usePortfolioDetail';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function PortfolioDetail() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const currentLang = lang || 'id';
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: portfolio, isLoading } = usePortfolioDetail(slug ?? null, currentLang);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="portfolio-corporate">
        <div className="portfolio-container" style={{ paddingTop: '80px' }}>
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="portfolio-detail-summary">
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="portfolio-corporate">
        <div className="portfolio-empty-state" style={{ padding: '180px 20px' }}>
          <FolderOpen size={40} strokeWidth={1.5} />
          <p>{t('portfolio.detail.notFound')}</p>
          <button className="portfolio-cta-btn" style={{ display: 'inline-flex' }} onClick={() => navigate(`/${currentLang}/portofolio`)}>
            <ArrowLeft size={16} /> {t('portfolio.detail.backToList')}
          </button>
        </div>
      </div>
    );
  }

  const facts: { icon: typeof Building2; label: string; value: string }[] = [
    { icon: Building2, label: t('portfolio.detail.industry'), value: portfolio.industry?.name ?? '—' },
    { icon: Wrench, label: t('portfolio.detail.service'), value: portfolio.serviceType?.name ?? '—' },
    { icon: MapPin, label: t('portfolio.detail.location'), value: portfolio.location },
    { icon: Calendar, label: t('portfolio.detail.completionDate'), value: portfolio.completionDate },
  ];

  return (
    <div className="portfolio-corporate">
      <Helmet>
        <title>{portfolio.title} | PT Surya Inti Gas</title>
        <meta name="description" content={portfolio.summary} />
        <meta property="og:title" content={portfolio.title} />
        <meta property="og:description" content={portfolio.summary} />
        <meta property="og:image" content={getImageUrl(portfolio.thumbnail)} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://suryaintigas.com/${currentLang}/portofolio/${portfolio.id}`} />
      </Helmet>

      <PageHero
        title={portfolio.title}
        backgroundImage="/images/products/20260618_135557.webp"
        breadcrumbs={[
          { label: t('header.home'), href: `/${currentLang}` },
          { label: t('portfolio.page.title'), href: `/${currentLang}/portofolio` },
          { label: portfolio.title },
        ]}
      />

      <div className="portfolio-container" style={{ paddingTop: '48px' }}>
        <button className="portfolio-back-link" onClick={() => navigate(`/${currentLang}/portofolio`)}>
          <ArrowLeft size={14} /> {t('portfolio.detail.backToList')}
        </button>

        <motion.div
          className="portfolio-detail-hero-image"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <img
            src={getImageUrl(portfolio.thumbnail)}
            alt={portfolio.title}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
          />
        </motion.div>

        <motion.div
          className="portfolio-detail-facts"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {facts.map((fact) => (
            <motion.div key={fact.label} className="portfolio-detail-fact" variants={fadeUp}>
              <fact.icon size={18} />
              <div className="portfolio-detail-fact-text">
                <span className="portfolio-detail-fact-label">{fact.label}</span>
                <span className="portfolio-detail-fact-value">{fact.value}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="portfolio-detail-product">
          <div className="portfolio-detail-product-label">{t('portfolio.detail.productSolution')}</div>
          <div className="portfolio-detail-product-value">{portfolio.productSolution}</div>
        </div>

        <div className="portfolio-detail-summary">
          <h2 className="portfolio-section-title">{t('portfolio.detail.summary')}</h2>
          <p>{portfolio.summary}</p>
        </div>

        {portfolio.gallery.length > 0 && (
          <>
            <h2 className="portfolio-section-title">{t('portfolio.detail.gallery')}</h2>
            <motion.div
              className="portfolio-gallery-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
            >
              {portfolio.gallery.map((img, i) => (
                <motion.div key={i} className="portfolio-gallery-thumb" onClick={() => setLightboxIndex(i)} variants={fadeUp} whileHover={{ scale: 1.03 }}>
                  <img
                    src={getImageUrl(img.image)}
                    alt={img.caption || portfolio.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                  />
                </motion.div>
              ))}
            </motion.div>
            <Lightbox
              open={lightboxIndex !== null}
              index={lightboxIndex ?? 0}
              close={() => setLightboxIndex(null)}
              slides={portfolio.gallery.map((img) => ({ src: getImageUrl(img.image), alt: img.caption ?? portfolio.title }))}
            />
          </>
        )}
      </div>

      <div className="portfolio-cta">
        <h2 className="portfolio-cta-title">{t('portfolio.cta.needSimilarTitle')}</h2>
        <p className="portfolio-cta-subtitle">{t('portfolio.cta.needSimilarSubtitle')}</p>
        <a href={`/${currentLang}/kontak`} className="portfolio-cta-btn">
          {t('portfolio.cta.contactButton')}
        </a>
      </div>
    </div>
  );
}

export default PortfolioDetail;
