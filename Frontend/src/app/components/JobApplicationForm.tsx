import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Upload, CheckCircle } from 'lucide-react';
import '../../styles/career.css';
import { getJobs } from '../../data/jobs';

interface Job {
  id: number;
  title: string;
  division: string;
  location: string;
}

export function JobApplicationForm() {
  const navigate = useNavigate();
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const openings = getJobs(t);
    const foundJob = openings.find(j => j.id === parseInt(id || '0'));
    setJob(foundJob || null);
    setLoading(false);
  }, [id, t]);

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
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleBack = () => {
    navigate(`/${currentLang}/karir/${id}`);
  };

  const totalJobs = getJobs(t).length;

  if (loading) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="career-hero-bg"></div>
          <div className="section-container">
            <div className="section-header">
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
          <div className="career-hero-bg"></div>
          <div className="section-container">
            <div className="section-header">
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

  if (submitted) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="career-hero-bg"></div>
          <div className="section-container">
            <div className="section-header">
              <h2>{t('career.page.title')}</h2>
              <p>{t('career.page.subtitle')}</p>
              <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
            </div>
          </div>
        </div>
        <div className="application-success-section">
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
        </div>
      </div>
    );
  }

  return (
    <div className="career-page">
      {/* Career Hero Section */}
      <div className="career-hero">
        <div className="career-hero-bg"></div>
        <div className="section-container">
          <div className="section-header">
            <h2>{t('career.page.title')}</h2>
            <p>{t('career.page.subtitle')}</p>
            <p className="jobs-counter">{t('career.page.jobsAvailable', { count: totalJobs })}</p>
          </div>
        </div>
      </div>

      <div className="application-form-section">
        <div className="section-container">
          <button onClick={handleBack} className="back-button" aria-label={t('career.aria.backToDetail')}>
            <ArrowLeft size={16} />
            {t('career.page.backToDetail')}
          </button>

          <div className="form-header">
            <h1>{t('career.page.formTitle')}</h1>
            <p>{t('career.page.position', { title: job.title })}</p>
            <p>{job.division} - {job.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">{t('career.form.fullName')}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder={t('career.form.fullNamePlaceholder')}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('career.form.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder={t('career.form.emailPlaceholder')}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('career.form.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder={t('career.form.phonePlaceholder')}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('career.form.address')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder={t('career.form.addressPlaceholder')}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="education">{t('career.form.education')}</label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className={errors.education ? 'error' : ''}
                  placeholder={t('career.form.educationPlaceholder')}
                />
                {errors.education && <span className="error-message">{errors.education}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="experience">{t('career.form.experience')}</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={errors.experience ? 'error' : ''}
                  placeholder={t('career.form.experiencePlaceholder')}
                />
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="coverLetter">{t('career.form.coverLetter')}</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder={t('career.form.coverLetterPlaceholder')}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="resume">{t('career.form.resume')}</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className={errors.resume ? 'error' : ''}
                  />
                  <div className="file-upload-label">
                    <Upload size={24} />
                    <span>{formData.resume ? formData.resume.name : t('career.form.uploadCta')}</span>
                  </div>
                </div>
                {errors.resume && <span className="error-message">{errors.resume}</span>}
              </div>
            </div>

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
      </div>
    </div>
  );
}