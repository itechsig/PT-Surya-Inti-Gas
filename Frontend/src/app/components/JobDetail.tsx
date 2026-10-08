import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowLeft, Send, Calendar, Building, Briefcase } from 'lucide-react';
import { Seo } from './Seo';
import { htmlToPlainText } from '../../utils/renderHtml';
import { motion, type Variants } from 'motion/react';
import '../../styles/career.css';
import '../../styles/rich-text.css';
import { useJobVacancies } from '../../hooks/useJobVacancies';
import { renderHtml } from '../../utils/renderHtml';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function JobDetail() {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const currentLang = lang || 'id';
  const { t, i18n } = useTranslation();
  const { jobs: openings, isLoading: loading } = useJobVacancies(currentLang);
  const job = openings.find(j => j.id === parseInt(id || '0')) || null;

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const dateLocale = i18n.language === 'en' ? 'en-US' : i18n.language === 'zh' ? 'zh-CN' : 'id-ID';
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(dateLocale, options);
  };

  const totalJobs = openings.length;

  if (loading) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="career-hero-bg"></div>
          <div className="section-container">
            <div className="section-header">
              <h1>{t('career.page.title')}</h1>
              <p>{t('career.page.subtitle')}</p>
              <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="loading">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="career-hero-bg"></div>
          <div className="section-container">
            <div className="section-header">
              <h1>{t('career.page.title')}</h1>
              <p>{t('career.page.subtitle')}</p>
              <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="no-jobs-found">
            <p>{t('career.page.jobNotFound')}</p>
            <button onClick={() => navigate(`/${currentLang}/karir`)} className="back-button" aria-label={t('career.aria.backToListings')}>
              <ArrowLeft size={16} />
              {t('career.page.backToListings')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(job.deadline);

  // Google for Jobs: only emitted while the vacancy is still open, since an
  // expired JobPosting left in the markup is a structured-data policy violation.
  const jobPostingJsonLd = deadlinePassed ? undefined : {
    '@type': 'JobPosting',
    title: job.title,
    description: [job.fullDescription || job.description, ...(job.requirements.length ? [`<ul>${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`] : [])].join(''),
    datePosted: job.postedAt,
    validThrough: `${job.deadline}T23:59:59+07:00`,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'PT Surya Inti Gas',
      sameAs: 'https://suryaintigas.com',
      logo: 'https://suryaintigas.com/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'ID' },
    },
    directApply: true,
  };

  return (
    <>
      <Seo
        title={t('seo.jobDetail.title', { title: job.title, location: job.location })}
        description={t('seo.jobDetail.description', {
          title: job.title, division: job.division, location: job.location,
          summary: htmlToPlainText(job.description).slice(0, 120),
        })}
        segment={`karir/${job.id}`}
        jsonLd={jobPostingJsonLd}
      />
      <div className="career-page">
      {/* Career Hero Section */}
      <div className="career-hero">
        <div className="career-hero-bg"></div>
        <div className="section-container">
          <div className="section-header">
            <h1>{t('career.page.title')}</h1>
            <p>{t('career.page.subtitle')}</p>
            <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
          </div>
        </div>
      </div>

      <div className="job-detail-section">
        <div className="section-container">
          <motion.button
            onClick={() => navigate(`/${currentLang}/karir`)}
            className="back-button"
            aria-label={t('career.aria.backToListings')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <ArrowLeft size={16} />
            {t('career.page.backToListings')}
          </motion.button>

          <motion.div
            className="job-detail-header"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp}>{job.title}</motion.h2>
            <motion.div className="job-detail-meta" variants={fadeUp}>
              <span className="meta-item">
                <Building size={16} />
                {job.division}
              </span>
              <span className="meta-item">
                <MapPin size={16} />
                {job.location}
              </span>
              <span className="meta-item">
                <Briefcase size={16} />
                {job.type}
              </span>
              <span className="meta-item">
                <Calendar size={16} />
                {formatDate(job.deadline)}
              </span>
            </motion.div>
            <motion.div className="job-badges" variants={fadeUp}>
              <span className="job-badge division">{job.division}</span>
              <span className="job-badge type">{job.type}</span>
              <span className="job-badge level">{job.level}</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="job-detail-content"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div className="job-description-section" variants={fadeUp}>
              <h2>{t('career.page.jobDescription')}</h2>
              <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: renderHtml(job.fullDescription) }} />
            </motion.div>

            <motion.div className="job-requirements-section" variants={fadeUp}>
              <h2>{t('career.page.requirements')}</h2>
              <motion.ul
                className="requirements-list"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={staggerContainer}
              >
                {job.requirements.map((req, index) => (
                  <motion.li key={index} variants={fadeUp}>{req}</motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div className="job-detail-actions" variants={fadeUp}>
              {deadlinePassed ? (
                <button className="apply-button disabled" disabled aria-label={t('career.aria.applicationClosed')}>
                  {t('career.page.applicationClosed')}
                </button>
              ) : (
                <Link to={`/${currentLang}/karir/${job.id}/lamar`} className="apply-button" aria-label={`${t('career.aria.applyForJob')} — ${job.title}`}>
                  <Send size={18} aria-hidden="true" />
                  {t('career.page.applyNow')}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}