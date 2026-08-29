import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowLeft, Send, Upload, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import '../../styles/career.css';
import { useJobVacancies } from '../../hooks/useJobVacancies';
import { API_ENDPOINTS } from '../../config/api';
import { apiRequest, ApiError } from '../../utils/apiClient';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const stepTransition: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

export function JobApplicationForm() {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const { jobs: openings, isLoading: loading } = useJobVacancies(currentLang);
  const job = openings.find(j => j.id === parseInt(id || '0')) || null;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Order matters: the summary lists errors top-to-bottom like the form.
  const FIELD_LABELS: { name: string; label: string }[] = [
    { name: 'fullName', label: t('career.form.fullName') },
    { name: 'email', label: t('career.form.email') },
    { name: 'phone', label: t('career.form.phone') },
    { name: 'address', label: t('career.form.address') },
    { name: 'education', label: t('career.form.education') },
    { name: 'experience', label: t('career.form.experience') },
    { name: 'resume', label: t('career.form.resume') },
  ];

  const ariaProps = (name: string) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` }
      : {};

  const focusErrorSummary = () => {
    requestAnimationFrame(() => errorSummaryRef.current?.focus());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (only PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: t('career.validation.resumeTypeInvalid') }));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: t('career.validation.resumeSizeInvalid') }));
        return;
      }

      setFormData(prev => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('career.validation.fullNameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('career.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('career.validation.emailInvalid');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('career.validation.phoneRequired');
    }
    if (!formData.address.trim()) {
      newErrors.address = t('career.validation.addressRequired');
    }
    if (!formData.education.trim()) {
      newErrors.education = t('career.validation.educationRequired');
    }
    if (!formData.experience.trim()) {
      newErrors.experience = t('career.validation.experienceRequired');
    }
    if (!formData.resume) {
      newErrors.resume = t('career.validation.resumeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !job) {
      focusErrorSummary();
      return;
    }

    setSubmitting(true);

    const payload = new FormData();
    payload.append('name', formData.fullName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('position', job.title);
    payload.append('address', formData.address);
    payload.append('education', formData.education);
    payload.append('experience', formData.experience);
    payload.append('cover_letter', formData.coverLetter);
    if (formData.resume) payload.append('resume', formData.resume);

    try {
      await apiRequest(API_ENDPOINTS.CAREER, {
        method: 'POST',
        body: payload,
        auth: false,
      });
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const mapped: Record<string, string> = {};
        const fieldMap: Record<string, string> = {
          name: 'fullName', email: 'email', phone: 'phone', address: 'address',
          education: 'education', experience: 'experience', resume: 'resume',
        };
        Object.entries(error.errors).forEach(([key, messages]) => {
          const field = fieldMap[key] ?? key;
          mapped[field] = messages[0];
        });
        setErrors(mapped);
        focusErrorSummary();
      } else {
        setErrors({ resume: t('career.validation.submitFailed') });
        focusErrorSummary();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/${currentLang}/karir/${id}`);
  };

  const totalJobs = openings.length;

  const canonicalUrl = job ? `https://suryaintigas.com/${currentLang}/karir/${job.id}/lamar` : '';

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Application - PT Surya Inti Gas Career</title>
          <link rel="canonical" href={`https://suryaintigas.com/${currentLang}/karir/${id}/lamar`} />
        </Helmet>
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
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Helmet>
          <title>Job Not Found - PT Surya Inti Gas Career</title>
          <link rel="canonical" href={`https://suryaintigas.com/${currentLang}/karir/${id}/lamar`} />
        </Helmet>
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
      </>
    );
  }

  return (
    <>
      <Helmet>
        {submitted ? (
          <>
            <title>Application Submitted - PT Surya Inti Gas Career</title>
            <meta name="description" content="Your job application has been successfully submitted to PT Surya Inti Gas." />
            <link rel="canonical" href={canonicalUrl} />
          </>
        ) : (
          <>
            <title>Apply for {job.title} - PT Surya Inti Gas Career</title>
            <meta name="description" content={`Apply for ${job.title} position at PT Surya Inti Gas. ${job.division} - ${job.location}`} />
            <meta name="keywords" content={`${job.title}, job application, ${job.division}, ${job.location}, PT Surya Inti Gas`} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={`Apply for ${job.title} - PT Surya Inti Gas Career`} />
            <meta property="og:description" content={`Apply for ${job.title} position at PT Surya Inti Gas. ${job.division} - ${job.location}`} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
          </>
        )}
      </Helmet>
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

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="application-success-section"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={stepTransition}
          >
            <div className="section-container">
              <div className="success-message">
                <CheckCircle size={64} className="success-icon" />
                <h2>{t('career.page.applicationSuccessTitle')}</h2>
                <p>{t('career.page.applicationSuccessMessage', { title: job.title })}</p>
                <button onClick={() => navigate(`/${currentLang}/karir`)} className="back-button" aria-label={t('career.aria.backToListings')}>
                  {t('career.page.backToListings')}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="application-form-section"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={stepTransition}
          >
            <div className="section-container">
              <button onClick={handleBack} className="back-button" aria-label={t('career.aria.backToDetail')}>
                <ArrowLeft size={16} />
                {t('career.page.backToDetail')}
              </button>

              <motion.div className="form-header" initial="hidden" animate="show" variants={staggerContainer}>
                <motion.h2 variants={fadeUp}>{t('career.page.formTitle')}</motion.h2>
                <motion.p variants={fadeUp}>{t('career.page.position', { title: job.title })}</motion.p>
                <motion.p variants={fadeUp}>{job.division} - {job.location}</motion.p>
              </motion.div>

              <form onSubmit={handleSubmit} className="application-form" noValidate>
                {Object.values(errors).some(Boolean) && (
                  <div
                    ref={errorSummaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="form-error-summary"
                  >
                    <span className="form-error-summary-title">
                      <AlertCircle size={18} aria-hidden="true" />
                      {t('career.validation.summaryTitle', {
                        count: Object.values(errors).filter(Boolean).length,
                      })}
                    </span>
                    <ul>
                      {FIELD_LABELS.filter((f) => errors[f.name]).map((f) => (
                        <li key={f.name}>
                          <a href={`#${f.name}`}>{f.label}: {errors[f.name]}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <motion.div className="form-grid" initial="hidden" animate="show" variants={staggerContainer}>
                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="fullName">{t('career.form.fullName')}</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? 'error' : ''}
                      placeholder={t('career.form.fullNamePlaceholder')}
                      {...ariaProps('fullName')}
                    />
                    {errors.fullName && <span id="fullName-error" className="error-message">{errors.fullName}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="email">{t('career.form.email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder={t('career.form.emailPlaceholder')}
                      {...ariaProps('email')}
                    />
                    {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="phone">{t('career.form.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder={t('career.form.phonePlaceholder')}
                      {...ariaProps('phone')}
                    />
                    {errors.phone && <span id="phone-error" className="error-message">{errors.phone}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="address">{t('career.form.address')}</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      placeholder={t('career.form.addressPlaceholder')}
                      {...ariaProps('address')}
                    />
                    {errors.address && <span id="address-error" className="error-message">{errors.address}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="education">{t('career.form.education')}</label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      required
                      value={formData.education}
                      onChange={handleInputChange}
                      className={errors.education ? 'error' : ''}
                      placeholder={t('career.form.educationPlaceholder')}
                      {...ariaProps('education')}
                    />
                    {errors.education && <span id="education-error" className="error-message">{errors.education}</span>}
                  </motion.div>

                  <motion.div className="form-group" variants={fadeUp}>
                    <label htmlFor="experience">{t('career.form.experience')}</label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={errors.experience ? 'error' : ''}
                      placeholder={t('career.form.experiencePlaceholder')}
                      {...ariaProps('experience')}
                    />
                    {errors.experience && <span id="experience-error" className="error-message">{errors.experience}</span>}
                  </motion.div>

                  <motion.div className="form-group full-width" variants={fadeUp}>
                    <label htmlFor="coverLetter">{t('career.form.coverLetter')}</label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder={t('career.form.coverLetterPlaceholder')}
                    />
                  </motion.div>

                  <motion.div className="form-group full-width" variants={fadeUp}>
                    <label htmlFor="resume">{t('career.form.resume')}</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className={errors.resume ? 'error' : ''}
                        {...ariaProps('resume')}
                      />
                      <div className="file-upload-label">
                        <Upload size={24} aria-hidden="true" />
                        <span>{formData.resume ? formData.resume.name : t('career.form.uploadCta')}</span>
                      </div>
                    </div>
                    {errors.resume && <span id="resume-error" className="error-message">{errors.resume}</span>}
                  </motion.div>
                </motion.div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={submitting}
                    aria-label={t('career.aria.submitApplication')}
                  >
                    {submitting ? t('career.form.submitting') : (
                      <>
                        <Send size={18} />
                        {t('career.form.submit')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}