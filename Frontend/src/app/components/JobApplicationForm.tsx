import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Upload, CheckCircle } from 'lucide-react';
import '../../styles/career.css';

interface Job {
  id: number;
  title: string;
  division: string;
  location: string;
}

export function JobApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const openings: Job[] = [
    {
      id: 1,
      title: "Sales Executive",
      division: "Sales & Marketing",
      location: "Sidoarjo"
    },
    {
      id: 2,
      title: "Installation Technician",
      division: "Technical Operations",
      location: "Sidoarjo"
    },
    {
      id: 3,
      title: "Admin & Finance Staff",
      division: "Finance & Admin",
      location: "Balikpapan"
    },
    {
      id: 4,
      title: "Gas Delivery Driver",
      division: "Logistics & Distribution",
      location: "Sidoarjo"
    },
    {
      id: 5,
      title: "Quality Control Engineer",
      division: "Technical Operations",
      location: "Sidoarjo"
    },
    {
      id: 6,
      title: "Marketing Specialist",
      division: "Sales & Marketing",
      location: "Balikpapan"
    },
    {
      id: 7,
      title: "Warehouse Supervisor",
      division: "Logistics & Distribution",
      location: "Sidoarjo"
    },
    {
      id: 8,
      title: "HR Manager",
      division: "Finance & Admin",
      location: "Balikpapan"
    },
    {
      id: 9,
      title: "Safety Officer",
      division: "Technical Operations",
      location: "Sidoarjo"
    }
  ];

  useEffect(() => {
    const foundJob = openings.find(j => j.id === parseInt(id || '0'));
    setJob(foundJob || null);
    setLoading(false);
  }, [id]);

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
        setErrors(prev => ({ ...prev, resume: 'Hanya file PDF, DOC, atau DOCX yang diperbolehkan' }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'Ukuran file maksimal 5MB' }));
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
      newErrors.fullName = 'Nama lengkap harus diisi';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat harus diisi';
    }
    if (!formData.education.trim()) {
      newErrors.education = 'Pendidikan terakhir harus diisi';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Pengalaman kerja harus diisi';
    }
    if (!formData.resume) {
      newErrors.resume = 'CV/Resume harus diunggah';
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
    navigate(`/karir/${id}`);
  };

  if (loading) {
    return (
      <div className="career-page">
        <div className="section-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="career-page">
        <div className="section-container">
          <div className="no-jobs-found">
            <p>Lowongan tidak ditemukan.</p>
            <button onClick={() => navigate('/karir')} className="back-button">
              <ArrowLeft size={16} />
              Kembali ke Lowongan
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="career-page">
        <div className="application-success-section">
          <div className="section-container">
            <div className="success-message">
              <CheckCircle size={64} className="success-icon" />
              <h2>Lamaran Berhasil Dikirim!</h2>
              <p>Terima kasih telah melamar untuk posisi {job.title}. Tim HR kami akan menghubungi Anda jika Anda memenuhi kualifikasi.</p>
              <button onClick={() => navigate('/karir')} className="back-button">
                Kembali ke Lowongan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="career-page">
      <div className="application-form-section">
        <div className="section-container">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={16} />
            Kembali ke Detail Lowongan
          </button>

          <div className="form-header">
            <h1>Form Lamaran</h1>
            <p>Posisi: {job.title}</p>
            <p>{job.division} - {job.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Nama Lengkap *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Masukkan nama lengkap Anda"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="contoh@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Alamat *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Alamat lengkap Anda"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="education">Pendidikan Terakhir *</label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className={errors.education ? 'error' : ''}
                  placeholder="Contoh: S1 Teknik Mesin"
                />
                {errors.education && <span className="error-message">{errors.education}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="experience">Pengalaman Kerja *</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={errors.experience ? 'error' : ''}
                  placeholder="Contoh: 2 tahun di bidang sales"
                />
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Jelaskan mengapa Anda cocok untuk posisi ini..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="resume">CV/Resume * (PDF, DOC, DOCX - Max 5MB)</label>
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
                    <span>{formData.resume ? formData.resume.name : 'Klik untuk upload CV/Resume'}</span>
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
              >
                {submitting ? 'Mengirim...' : (
                  <>
                    <Send size={18} />
                    Kirim Lamaran
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