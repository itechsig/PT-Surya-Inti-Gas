'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Check, Search, X, Calendar, Clock } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { useTranslation } from 'react-i18next';

// ─── Data ─────────────────────────────────────────────────────
const openings = [
  {
    id: 1,

    titleKey: "career.openings.salesExecutive.title",
    divisionKey: "career.openings.salesExecutive.division",
    locationKey: "career.openings.salesExecutive.location",
    typeKey: "career.openings.salesExecutive.type",
    levelKey: "career.openings.salesExecutive.level",
    postedDate: "2026-07-01",
    expiredDate: "2026-010-01",
    descKey: "career.openings.salesExecutive.description",
    requirementsKeys: [
      "career.openings.salesExecutive.requirements.0",
      "career.openings.salesExecutive.requirements.1",
      "career.openings.salesExecutive.requirements.2",
      "career.openings.salesExecutive.requirements.3",
    ],
  },
  {
    id: 2,

    titleKey: "career.openings.installationTechnician.title",
    divisionKey: "career.openings.installationTechnician.division",
    locationKey: "career.openings.installationTechnician.location",
    typeKey: "career.openings.installationTechnician.type",
    levelKey: "career.openings.installationTechnician.level",
    postedDate: "2025-06-03",
    expiredDate: "2025-07-03",
    descKey: "career.openings.installationTechnician.description",
    requirementsKeys: [
      "career.openings.installationTechnician.requirements.0",
      "career.openings.installationTechnician.requirements.1",
      "career.openings.installationTechnician.requirements.2",
      "career.openings.installationTechnician.requirements.3",
    ],
  },
  {
    id: 3,

    titleKey: "career.openings.adminFinanceStaff.title",
    divisionKey: "career.openings.adminFinanceStaff.division",
    locationKey: "career.openings.adminFinanceStaff.location",
    typeKey: "career.openings.adminFinanceStaff.type",
    levelKey: "career.openings.adminFinanceStaff.level",
    postedDate: "2025-06-05",
    expiredDate: "2025-06-25",
    descKey: "career.openings.adminFinanceStaff.description",
    requirementsKeys: [
      "career.openings.adminFinanceStaff.requirements.0",
      "career.openings.adminFinanceStaff.requirements.1",
      "career.openings.adminFinanceStaff.requirements.2",
      "career.openings.adminFinanceStaff.requirements.3",
    ],
  },
  {
    id: 4,

    titleKey: "career.openings.gasDeliveryDriver.title",
    divisionKey: "career.openings.gasDeliveryDriver.division",
    locationKey: "career.openings.gasDeliveryDriver.location",
    typeKey: "career.openings.gasDeliveryDriver.type",
    levelKey: "career.openings.gasDeliveryDriver.level",
    postedDate: "2025-06-07",
    expiredDate: "2025-07-07",
    descKey: "career.openings.gasDeliveryDriver.description",
    requirementsKeys: [
      "career.openings.gasDeliveryDriver.requirements.0",
      "career.openings.gasDeliveryDriver.requirements.1",
      "career.openings.gasDeliveryDriver.requirements.2",
      "career.openings.gasDeliveryDriver.requirements.3",
    ],
  },
];

const divisions = ["career.divisions.all", "career.divisions.salesMarketing", "career.divisions.technicalOperations", "career.divisions.financeAdmin", "career.divisions.logisticsDistribution"];
const locations = ["career.locations.all", "career.locations.surabaya", "career.locations.surabayaSidoarjo"];
const levels = ["career.levels.all", "career.levels.entry", "career.levels.junior", "career.levels.juniorMid", "career.levels.midLevel"];

const steps = [
  { step: "01", titleKey: "career.application.steps.sendApplication", descKey: "career.application.steps.sendApplicationDesc" },
  { step: "02", titleKey: "career.application.steps.adminSelection", descKey: "career.application.steps.adminSelectionDesc" },
  { step: "03", titleKey: "career.application.steps.testInterview", descKey: "career.application.steps.testInterviewDesc" },
  { step: "04", titleKey: "career.application.steps.jobOffer", descKey: "career.application.steps.jobOfferDesc" },
];

// ─── Date Helpers ──────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysLeft(expiredDate: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiredDate);
  exp.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Fade-in Hook ─────────────────────────────────────────────
function useFadeIn() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fade-up {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .fade-up.delay-1 { transition-delay: 0.1s; }
      .fade-up.delay-2 { transition-delay: 0.2s; }
      .fade-up.delay-3 { transition-delay: 0.3s; }
      .fade-up.delay-4 { transition-delay: 0.4s; }
      .fade-up.delay-5 { transition-delay: 0.5s; }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);
}

// ─── Custom Select with Search ────────────────────────────────
function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
}) {
  const { t } = useTranslation();
  const [dropSearch, setDropSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filteredOpts = options.filter(o =>
    t(o).toLowerCase().includes(dropSearch.toLowerCase())
  );

  const displayValue = value ? t(value) : placeholder;
  const displayLabel = t(label);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setDropSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold px-0.5">
        {displayLabel}
      </span>
      <div ref={ref} className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setDropSearch(''); }}
          className={`
            inline-flex items-center justify-between gap-2
            px-3.5 py-2.5 min-w-[170px] w-full
            bg-white border rounded-xl
            text-sm font-medium transition-all cursor-pointer shadow-sm whitespace-nowrap
            ${open
              ? 'border-emerald-400 ring-2 ring-emerald-100 text-emerald-700'
              : 'border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40'}
          `}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown
            size={15}
            className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Panel */}
        {open && (
          <div className="absolute z-50 mt-1.5 w-full min-w-[200px] bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            {/* Search inside dropdown */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={dropSearch}
                  onChange={e => setDropSearch(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all"
                />
                {dropSearch && (
                  <button
                    onClick={() => setDropSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="p-1.5 max-h-52 overflow-y-auto">
              {filteredOpts.length > 0 ? (
                filteredOpts.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onValueChange(opt);
                      setOpen(false);
                      setDropSearch('');
                    }}
                    className={`
                      w-full flex items-center justify-between gap-2
                      px-3 py-2.5 rounded-xl text-sm text-left transition-colors
                      ${value === opt
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'}
                    `}
                  >
                    <span>{t(opt)}</span>
                    {value === opt && <Check size={14} className="text-emerald-500 flex-shrink-0" />}
                  </button>
                ))
              ) : (
                <p className="text-center text-xs text-slate-400 py-4">{t('common.notFound')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Apply Modal ───────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: typeof openings[0]; onClose: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    setErrors(prev => ({ ...prev, cvFile: '' }));
    if (!allowed.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        cvFile: t('career.application.validation.fileFormat')
      }));
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        cvFile: t('career.application.validation.fileTooLarge', { size: formatSize(file.size) })
      }));
      setCvFile(null);
      return;
    }
    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const generateCSRFToken = () =>
    Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10,15}$/.test(phone.replace(/[^0-9]/g, ''));

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Nama lengkap wajib diisi.';
        if (value.trim().length < 3) return 'Nama terlalu pendek. Minimal 3 karakter. Contoh: Budi Santoso';
        if (!/^[a-zA-Z\s'.,-]+$/.test(value))
          return 'Nama hanya boleh mengandung huruf, spasi, dan tanda baca umum (titik, koma, apostrof).';
        return '';
      case 'email':
        if (!value.trim()) return 'Alamat email wajib diisi.';
        if (!validateEmail(value))
          return 'Format email tidak valid. Pastikan menggunakan format: budi@gmail.com';
        return '';
      case 'phone':
        if (!value.trim()) return 'Nomor WhatsApp wajib diisi.';
        if (!/^[0-9+\-\s()]+$/.test(value))
          return 'Nomor hanya boleh berisi angka. Hapus karakter selain angka.';
        if (!validatePhone(value))
          return 'Nomor harus 10–15 digit. Contoh: 081234567890';
        if (!value.startsWith('08') && !value.startsWith('+62') && !value.startsWith('62'))
          return 'Gunakan format nomor Indonesia. Contoh: 081234567890 atau +6281234567890';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const phoneErr = validateField('phone', form.phone);
    const newErrors: Record<string, string> = {
      ...(nameErr && { name: nameErr }),
      ...(emailErr && { email: emailErr }),
      ...(phoneErr && { phone: phoneErr }),
      ...(!cvFile && { cvFile: 'File CV wajib diupload sebelum mengirim lamaran.' }),
    };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('position', t(job.titleKey));
      formData.append('division', t(job.divisionKey));
      formData.append('location', t(job.locationKey));
      if (cvFile) {
        formData.append('cv_file', cvFile);
      }
      formData.append('_token', generateCSRFToken());

      const response = await fetch(getApiUrl(API_ENDPOINTS.CAREER), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          setErrors({
            submit: '⚠️ ' + errorMessages.join(' ')
          });
          throw new Error(errorMessages.join(', '));
        }
        setErrors({
          submit: '⚠️ ' + (result.message || t('career.application.validation.submitFailed'))
        });
        throw new Error(result.message || 'Gagal mengirim lamaran');
      }
      if (result.success) {
        setSubmitted(true);
        setErrors({});
      } else {
        setErrors({
          submit: '⚠️ ' + (result.message || t('career.application.validation.submitFailed'))
        });
        throw new Error(result.message || t('career.application.validation.submitFailed'));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      if (!errors.submit) {
        setErrors({
          submit: t('career.application.validation.submitError')
        });
      }
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const isFormComplete =
    form.name && form.email && form.phone && cvFile &&
    !errors.name && !errors.email && !errors.phone && !errors.cvFile;

  const daysLeft = getDaysLeft(job.expiredDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 rounded-t-3xl px-8 py-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
          >✕</button>
          <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-1">{t('career.application.applyFor')}</p>
          <h3 className="text-white text-xl font-bold leading-snug">{t(job.titleKey)}</h3>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{t(job.divisionKey)}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">📍 {t(job.locationKey)}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{t(job.typeKey)}</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Calendar size={12} />
              <span>Dibuka: <span className="text-white/90 font-medium">{formatDate(job.postedDate)}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock size={12} className={daysLeft <= 7 ? 'text-red-400' : 'text-amber-400'} />
              <span className="text-white/60">Ditutup: </span>
              <span className={`font-medium ${daysLeft <= 0 ? 'text-red-400' : daysLeft <= 7 ? 'text-red-300' : 'text-amber-300'}`}>
                {formatDate(job.expiredDate)}
                {daysLeft > 0 ? ` (${daysLeft} hari lagi)` : ' (Ditutup)'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>

              <h4 className="text-xl font-bold text-slate-800 mb-2">{t('career.application.applicationSent')}</h4>
              <p className="text-slate-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t('career.application.applicationSentMessage', { name: form.name }) }}> 
              Tim HR kami akan menghubungi Anda via email atau WhatsApp dalam 3–5 hari kerja.
              </p>
              <button onClick={onClose} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                {t('career.application.close')}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Nama */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">{t('career.application.form.fullName')} *</label>
                <input
                  type="text"
                  placeholder={t('career.application.form.fullNamePlaceholder')}
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                  }`}
                  maxLength={80}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">{t('career.application.form.email')} *</label>
                <input
                  type="email"
                  placeholder={t('career.application.form.emailPlaceholder')}
                  value={form.email}
                  onChange={e => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                  }`}
                />
                {errors.email && (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-red-600">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">{t('career.application.form.phone')} *</label>
                <input
                  type="tel"
                  placeholder={t('career.application.form.phonePlaceholder')}
                  value={form.phone}
                  onChange={e => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                    errors.phone 
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                  }`}
                />
                {errors.phone && (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-red-600">
                    <span>⚠️</span>
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              {/* Upload CV */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  {t('career.application.form.uploadCV')} *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />
                {cvFile ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{cvFile.name}</p>
                      <p className="text-xs text-emerald-600">✅ {formatSize(cvFile.size)} · Siap diupload</p>
                    </div>
                    <button
                      onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center text-xs transition-colors flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl px-6 py-8 text-center transition-all ${
                      errors.cvFile
                        ? 'border-red-300 bg-red-50/50'
                        : dragOver
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${errors.cvFile ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Klik atau drag & drop file CV di sini</p>
                    <p className="text-xs text-slate-400">Format: PDF, DOC, atau DOCX · Maks. 5 MB</p>
                  </div>
                )}
                {!errors.cvFile && !cvFile && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      📄 <strong>Tips CV yang baik:</strong> cantumkan pengalaman kerja, riwayat pendidikan, dan keahlian yang relevan dengan posisi yang dilamar.
                    </p>
                    <p className={`text-xs ${errors.cvFile ? 'text-red-500' : 'text-slate-400'}`}>
                      {errors.cvFile ? errors.cvFile : t('career.application.form.uploadCVDescription')}
                    </p>
                  </div>
                )}
                {errors.cvFile && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.cvFile}
                  </p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">⚠️ {errors.submit}</p>
                </div>
              )}

              <div className="pt-1 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormComplete}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('career.application.form.submit')} →
                </button>
                <button onClick={onClose} className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Search & Filter Bar ──────────────────────────────────────
function SearchFilterBar({
  search, setSearch,
  activeDiv, setActiveDiv,
  activeLocation, setActiveLocation,
  activeLevel, setActiveLevel,
  resultCount,
  t,
}: {
  search: string; setSearch: (v: string) => void;
  activeDiv: string; setActiveDiv: (v: string) => void;
  activeLocation: string; setActiveLocation: (v: string) => void;
  activeLevel: string; setActiveLevel: (v: string) => void;
  resultCount: number;
  t: (key: string) => string;
}) {
  const hasFilter = search || activeDiv !== "career.divisions.all" || activeLocation !== "career.locations.all" || activeLevel !== "career.levels.all";

  const reset = () => {
    setSearch('');
    setActiveDiv('career.divisions.all');
    setActiveLocation('career.locations.all');
    setActiveLevel('career.levels.all');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-10 max-w-4xl mx-auto fade-up">
      {/* Search Bar */}
      <div className="mb-5">
        <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold block mb-1.5">
          {t('career.search.searchPositions')}
        </span>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder={t('career.search.placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 mb-4" />

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 items-end">
        <CustomSelect
          value={activeDiv}
          onValueChange={setActiveDiv}
          options={divisions}
          placeholder={t('career.search.allDivisions')}
          label="career.search.filterDivision"
        />
        <CustomSelect
          value={activeLocation}
          onValueChange={setActiveLocation}
          options={locations}
          placeholder={t('career.search.allLocations')}
          label="career.search.filterLocation"
        />
        <CustomSelect
          value={activeLevel}
          onValueChange={setActiveLevel}
          options={levels}
          placeholder={t('career.search.allLevels')}
          label="career.search.filterLevel"
        />

        <div className="ml-auto flex items-center gap-3 pb-0.5">
          <span className="text-xs text-slate-400 font-medium">{resultCount} {t('career.search.found')}</span>
          {hasFilter && (
            <button
              onClick={reset}
              className="px-3 py-2 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 rounded-lg transition-colors"
            >
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasFilter && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
              🔍 "{search}"
              <button onClick={() => setSearch('')} className="hover:text-emerald-900"><X size={11} /></button>
            </span>
          )}
          {activeDiv !== "career.divisions.all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">

              {t(activeDiv)}
              <button onClick={() => setActiveDiv('career.divisions.all')} className="hover:text-slate-300"><X size={11} /></button>
            </span>
          )}
          {activeLocation !== "career.locations.all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">

              📍 {t(activeLocation)}
              <button onClick={() => setActiveLocation('career.locations.all')} className="hover:text-slate-300"><X size={11} /></button>

            </span>
          )}
          {activeLevel !== "career.levels.all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">

        {t(activeLevel)}
              <button onClick={() => setActiveLevel('career.levels.all')} className="hover:text-slate-300"><X size={11} /></button>

            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Career() {
  const { t } = useTranslation();
  useFadeIn();

  const [search, setSearch] = useState('');
  const [activeDiv, setActiveDiv] = useState("career.divisions.all");
  const [activeLocation, setActiveLocation] = useState("career.locations.all");
  const [activeLevel, setActiveLevel] = useState("career.levels.all");
  const [applyJob, setApplyJob] = useState<typeof openings[0] | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = openings.filter(job => {
    const matchDiv = activeDiv === "career.divisions.all" || job.divisionKey === activeDiv;
    const matchLoc = activeLocation === "career.locations.all" || job.locationKey === activeLocation;
    const matchLevel = activeLevel === "career.levels.all" || job.levelKey === activeLevel;
    const matchSearch = !search || [t(job.titleKey), t(job.divisionKey), t(job.locationKey), t(job.descKey), ...job.requirementsKeys.map(r => t(r))]
      .some(str => str.toLowerCase().includes(search.toLowerCase()));
    return matchDiv && matchLoc && matchLevel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&auto=format&fit=crop&q=80"
          alt="Karir"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs uppercase tracking-[4px] font-semibold rounded-full mb-6">
            {t('career.hero.badge')}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            {t('career.hero.title')}<br />
            <span className="text-emerald-400">{t('career.hero.titleHighlight')}</span>
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto">
            {t('career.hero.description')}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="#lowongan"
              className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              {t('career.search.title')} →
            </a>
            <a
              href="#proses"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
            >
              {t('career.recruitment.title')}
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 fade-up">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-emerald-600 transition-colors">{t('header.home')}</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">{t('header.career')}</span>
        </div>
      </div>

      {/* LOWONGAN */}
      <section id="lowongan" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">{t('career.search.title')}</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">{t('career.search.title')}</h2>
            <p className="text-slate-500 text-sm">{t('career.search.description')}</p>
          </div>

          <SearchFilterBar
            search={search} setSearch={setSearch}
            activeDiv={activeDiv} setActiveDiv={setActiveDiv}
            activeLocation={activeLocation} setActiveLocation={setActiveLocation}
            activeLevel={activeLevel} setActiveLevel={setActiveLevel}
            resultCount={filtered.length}
            t={t}
          />

          <div className="space-y-4 max-w-4xl mx-auto">
            {filtered.map((job) => {
              const isOpen = expandedId === job.id;
              const daysLeft = getDaysLeft(job.expiredDate);
              const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
              const isExpired = daysLeft <= 0;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => setExpandedId(isOpen ? null : job.id)}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">{t(job.divisionKey)}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">📍 {t(job.locationKey)}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{t(job.typeKey)}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{t(job.levelKey)}</span>
                        {isExpired && (
                          <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">Ditutup</span>
                        )}
                        {isExpiringSoon && (
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full animate-pulse">
                            ⏳ Segera Ditutup
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{t(job.titleKey)}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar size={11} />
                          Dibuka {formatDate(job.postedDate)}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-slate-400'}`}>
                          <Clock size={11} />
                          {isExpired
                            ? `Ditutup ${formatDate(job.expiredDate)}`
                            : `Ditutup ${formatDate(job.expiredDate)} · ${daysLeft} hari lagi`}
                        </span>
                      </div>
                    </div>
                    <div className={`ml-4 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-slate-200 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-7 border-t border-slate-100 pt-5 space-y-5">
                      <p className="text-slate-600 text-sm leading-relaxed">{t(job.descKey)}</p>

                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">{t('career.application.form.requirements')}</p>
                        <ul className="space-y-2">
                          {job.requirementsKeys.map(r => (
                            <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center flex-shrink-0">✓</span>
                              {t(r)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => setApplyJob(job)}
                        disabled={isExpired}
                        className="mt-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isExpired ? 'Lamaran Ditutup' : 'Lamar Sekarang →'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">{t('career.application.empty.title')}</p>
                <p className="text-sm mt-1">{t('career.application.empty.description')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROSES REKRUTMEN */}
      <section id="proses" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14 fade-up">
          <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">Tahapan</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Proses Rekrutmen</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Transparan, adil, dan efisien — kami menghargai waktu Anda.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.step} className={`relative text-center fade-up delay-${i + 1}`}>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-slate-200 z-0" />
              )}
              <div className="relative z-10 inline-flex w-16 h-16 bg-slate-900 text-white rounded-2xl items-center justify-center text-xl font-bold mb-4 mx-auto">
                {s.step}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{t(s.titleKey)}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
