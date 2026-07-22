import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowLeft, Send, Calendar, Building, Briefcase } from 'lucide-react';
import '../../styles/career.css';
import { getJobs, type Job } from '../../data/jobs';

export function JobDetail() {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const currentLang = lang || 'id';
  const { t, i18n } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const openings = getJobs(t);
    const foundJob = openings.find(j => j.id === parseInt(id || '0'));
    setJob(foundJob || null);
    setLoading(false);
  }, [id, t, i18n.language]);

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const dateLocale = i18n.language === 'en' ? 'en-US' : i18n.language === 'zh' ? 'zh-CN' : 'id-ID';
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(dateLocale, options);
  };

  const handleApply = () => {
    if (job) {
      navigate(`/${currentLang}/karir/${job.id}/lamar`);
    }
  };

  const totalJobs = getJobs(t).length;

  if (loading) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="section-container">
            <div className="section-header">
              <div className="career-hero-badge">{t('career.page.badge')}</div>
              <h2>{t('career.page.title')}</h2>
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
          <div className="section-container">
            <div className="section-header">
              <div className="career-hero-badge">{t('career.page.badge')}</div>
              <h2>{t('career.page.title')}</h2>
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

  return (
    <div className="career-page">
      {/* Career Hero Section */}
      <div className="career-hero">
        <div className="section-container">
          <div className="section-header">
            <div className="career-hero-badge">{t('career.page.badge')}</div>
            <h2>{t('career.page.title')}</h2>
            <p>{t('career.page.subtitle')}</p>
            <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
          </div>
        </div>
      </div>

      <div className="job-detail-section">
        <div className="section-container">
          <button onClick={() => navigate(`/${currentLang}/karir`)} className="back-button" aria-label={t('career.aria.backToListings')}>
            <ArrowLeft size={16} />
            {t('career.page.backToListings')}
          </button>

          <div className="job-detail-header">
            <h1>{job.title}</h1>
            <div className="job-detail-meta">
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
            </div>
            <div className="job-badges">
              <span className="job-badge division">{job.division}</span>
              <span className="job-badge type">{job.type}</span>
              <span className="job-badge level">{job.level}</span>
            </div>
          </div>

          <div className="job-detail-content">
            <div className="job-description-section">
              <h2>{t('career.page.jobDescription')}</h2>
              <p>{job.fullDescription}</p>
            </div>

            <div className="job-requirements-section">
              <h2>{t('career.page.requirements')}</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="job-detail-actions">
              {deadlinePassed ? (
                <button className="apply-button disabled" disabled aria-label={t('career.aria.applicationClosed')}>
                  {t('career.page.applicationClosed')}
                </button>
              ) : (
                <button onClick={handleApply} className="apply-button" aria-label={t('career.aria.applyForJob')}>
                  <Send size={18} />
                  {t('career.page.applyNow')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}