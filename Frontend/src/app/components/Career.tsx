'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check, Search, X, ChevronRight } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';

// ─── Data ─────────────────────────────────────────────────────
const openings = [
  {
    id: 1,
    title: "Sales Executive – Gas Industri",
    division: "Sales & Marketing",
    location: "Surabaya",
    type: "Full-time",
    level: "Mid-level",
    desc: "Bertanggung jawab atas penjualan gas industri ke klien manufaktur dan pengolahan. Membangun hubungan jangka panjang dengan pelanggan dan mencapai target bulanan.",
    requirements: [
      "Pendidikan D3/S1 semua jurusan",
      "Pengalaman sales B2B min. 2 tahun",
      "Memiliki kendaraan pribadi & SIM A/C",
      "Komunikatif dan berorientasi target",
    ],
  },
  {
    id: 2,
    title: "Teknisi Instalasi Gas",
    division: "Teknik & Operasional",
    location: "Surabaya & Sidoarjo",
    type: "Full-time",
    level: "Junior – Mid",
    desc: "Melaksanakan instalasi pipa gas, pemasangan regulator, dan commissioning sistem distribusi gas di lokasi klien industri dan medis.",
    requirements: [
      "Pendidikan SMK Teknik / D3 Mesin atau terkait",
      "Memahami sistem perpipaan dan fitting",
      "Sertifikat K3 Umum (diutamakan)",
      "Bersedia bekerja di lapangan",
    ],
  },
  {
    id: 3,
    title: "Staff Administrasi & Keuangan",
    division: "Finance & Admin",
    location: "Surabaya",
    type: "Full-time",
    level: "Junior",
    desc: "Mengelola administrasi harian, pembukuan sederhana, dan koordinasi dokumen operasional perusahaan.",
    requirements: [
      "Pendidikan D3/S1 Akuntansi atau Manajemen",
      "Menguasai Microsoft Office (Excel mahir)",
      "Teliti, rapi, dan bertanggung jawab",
      "Pengalaman administrasi 1 tahun (diutamakan)",
    ],
  },
  {
    id: 4,
    title: "Driver Pengiriman Gas",
    division: "Logistik & Distribusi",
    location: "Surabaya",
    type: "Full-time",
    level: "Entry",
    desc: "Bertanggung jawab atas pengiriman tabung gas ke pelanggan secara tepat waktu dan aman, serta menjaga kondisi armada kendaraan.",
    requirements: [
      "Memiliki SIM B1/B2 aktif",
      "Pengalaman mengemudi kendaraan niaga",
      "Memahami prosedur keselamatan pengiriman",
      "Jujur, disiplin, dan bertanggung jawab",
    ],
  },
];

const divisions = ["Semua", "Sales & Marketing", "Teknik & Operasional", "Finance & Admin", "Logistik & Distribusi"];
const locations = ["Semua Lokasi", "Surabaya", "Surabaya & Sidoarjo"];
const levels = ["Semua Level", "Entry", "Junior", "Junior – Mid", "Mid-level"];

const steps = [
  { step: "01", title: "Kirim Lamaran", desc: "Isi form lamaran dan upload CV serta dokumen pendukung melalui portal ini." },
  { step: "02", title: "Seleksi Administrasi", desc: "Tim HR akan meninjau kelengkapan dan kesesuaian profil Anda dalam 3–5 hari kerja." },
  { step: "03", title: "Tes & Wawancara", desc: "Kandidat terpilih akan diundang untuk tes tertulis dan wawancara dengan tim kami." },
  { step: "04", title: "Penawaran Kerja", desc: "Kandidat terbaik akan menerima offering letter dan bergabung bersama tim kami." },
];

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

function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className="
          inline-flex items-center justify-between gap-2
          px-3.5 py-2.5 min-w-[160px]
          bg-white border border-slate-200 rounded-xl
          text-sm text-slate-700 font-medium
          hover:border-emerald-400 hover:bg-emerald-50/40
          focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
          data-[state=open]:border-emerald-400 data-[state=open]:ring-2 data-[state=open]:ring-emerald-100
          transition-all cursor-pointer shadow-sm
          whitespace-nowrap
        "
        aria-label={placeholder}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={15} className="text-slate-400 flex-shrink-0" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 overflow-hidden
            bg-white rounded-2xl border border-slate-100
            shadow-xl shadow-slate-200/60
            animate-in fade-in-0 zoom-in-95
          "
          position="popper"
          sideOffset={6}
          align="start"
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-7 text-slate-400 cursor-default">
            <ChevronUp size={14} />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1.5">
            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className="
                  relative flex items-center gap-2.5
                  px-3 py-2.5 pr-9 rounded-xl
                  text-sm text-slate-700
                  cursor-pointer select-none
                  hover:bg-emerald-50 hover:text-emerald-800
                  data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-800
                  data-[highlighted]:outline-none
                  data-[state=checked]:text-emerald-700 data-[state=checked]:font-semibold
                  transition-colors
                "
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3 flex items-center">
                  <Check size={14} className="text-emerald-500" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center h-7 text-slate-400 cursor-default">
            <ChevronDown size={14} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// ─── Apply Modal ───────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: typeof openings[0]; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<string | null>(null);
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
      setErrors(prev => ({ ...prev, cvFile: 'Format file tidak didukung. Hanya PDF, DOC, atau DOCX yang diperbolehkan.' }));
      setCvFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, cvFile: `Ukuran file terlalu besar (${formatSize(file.size)}). Maksimal 5 MB.` }));
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

  // ── Validasi per field ──────────────────────────────────────
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

  const handleFocus = (field: string) => {
    setFocused(field);
    // Sembunyikan error saat user klik masuk ke field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBlur = (field: string, value: string) => {
    setFocused(null);
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Real-time validation hanya setelah field pernah disentuh (blur)
    // dan tidak sedang difokus (supaya tidak ganggu saat mengetik)
    if (touched[field] && focused !== field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
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
    setTouched({ name: true, email: true, phone: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('position', job.title);
      formData.append('division', job.division);
      formData.append('location', job.location);
      if (cvFile) formData.append('cv_file', cvFile);
      formData.append('_token', generateCSRFToken());

      const response = await fetch(getApiUrl(API_ENDPOINTS.CAREER), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        const msgs = result.errors
          ? Object.values(result.errors).flat()
          : [result.message || 'Gagal mengirim lamaran.'];
        setErrors({ submit: (msgs as string[]).join(' ') });
        return;
      }
      if (result.success) {
        setSubmitted(true);
        setErrors({});
      } else {
        setErrors({ submit: result.message || 'Gagal mengirim lamaran.' });
      }
    } catch {
      setErrors({ submit: 'Terjadi kesalahan jaringan. Pastikan koneksi internet Anda stabil dan coba lagi.' });
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // Styling input berdasarkan state (error / valid / default)
  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
      focused === field
        ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100'
        : errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100 bg-red-50/40'
        : touched[field] && !errors[field] && form[field as keyof typeof form]
        ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100 bg-emerald-50/20'
        : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
    }`;

  const isFormComplete =
    form.name && form.email && form.phone && cvFile &&
    !errors.name && !errors.email && !errors.phone && !errors.cvFile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="bg-slate-900 rounded-t-3xl px-8 py-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
          <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-1">Lamar Posisi</p>
          <h3 className="text-white text-xl font-bold leading-snug">{job.title}</h3>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{job.division}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">📍 {job.location}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{job.type}</span>
          </div>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Lamaran Terkirim!</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Terima kasih, <strong>{form.name}</strong>. Tim HR kami akan menghubungi Anda via email atau WhatsApp dalam 3–5 hari kerja.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {/* ── Nama Lengkap ── */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onFocus={() => handleFocus('name')}
                    onBlur={e => handleBlur('name', e.target.value)}
                    className={inputClass('name')}
                    maxLength={80}
                  />
                  {/* Ikon status validasi — hanya tampil saat tidak focused */}
                  {touched.name && focused !== 'name' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
                      {errors.name ? '❌' : '✅'}
                    </span>
                  )}
                </div>  
                {errors.name && focused !== 'name' && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* ── Email ── */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  Alamat Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Contoh: budi.santoso@gmail.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onFocus={() => handleFocus('email')}
                    onBlur={e => handleBlur('email', e.target.value)}
                    className={inputClass('email')}
                    maxLength={100}
                  />
                  {touched.email && focused !== 'email' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
                      {errors.email ? '❌' : '✅'}
                    </span>
                  )}
                </div>
                {!errors.email && focused !== 'email' && (
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    📧 Gunakan email aktif yang rutin Anda cek. Konfirmasi lamaran akan dikirimkan ke alamat ini.
                  </p>
                )}
                {errors.email && focused !== 'email' && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* ── No. WhatsApp ── */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  No. WhatsApp Aktif <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onFocus={() => handleFocus('phone')}
                    onBlur={e => handleBlur('phone', e.target.value)}
                    className={inputClass('phone')}
                    maxLength={16}
                  />
                  {touched.phone && focused !== 'phone' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
                      {errors.phone ? '❌' : '✅'}
                    </span>
                  )}
                </div>
                {errors.phone && focused !== 'phone' && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.phone}
                  </p>
                )}
              </div>

              {/* ── Upload CV ── */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  Upload CV / Resume <span className="text-red-400">*</span>
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
                      onClick={() => {
                        setCvFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
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
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        errors.cvFile ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
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

                {/* Helper text CV — tampil selama belum ada file & belum ada error */}
                {!errors.cvFile && !cvFile && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      📄 <strong>Tips CV yang baik:</strong> cantumkan pengalaman kerja, riwayat pendidikan, dan keahlian yang relevan dengan posisi yang dilamar.
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      💡 Beri nama file dengan jelas, contoh:{' '}
                      <span className="font-mono bg-slate-100 px-1 rounded">CV_BudiSantoso.pdf</span>
                    </p>
                  </div>
                )}
                {errors.cvFile && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1 leading-relaxed">
                    <span className="flex-shrink-0">⚠️</span> {errors.cvFile}
                  </p>
                )}
              </div>

              {/* Error global submit */}
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">⚠️ {errors.submit}</p>
                </div>
              )}

              {/* ── Tombol Aksi ── */}
              <div className="pt-1 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormComplete}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Kirim Lamaran →
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
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
}: {
  search: string; setSearch: (v: string) => void;
  activeDiv: string; setActiveDiv: (v: string) => void;
  activeLocation: string; setActiveLocation: (v: string) => void;
  activeLevel: string; setActiveLevel: (v: string) => void;
  resultCount: number;
}) {
  const hasFilter =
    search ||
    activeDiv !== "Semua" ||
    activeLocation !== "Semua Lokasi" ||
    activeLevel !== "Semua Level";

  const reset = () => {
    setSearch('');
    setActiveDiv('Semua');
    setActiveLocation('Semua Lokasi');
    setActiveLevel('Semua Level');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-10 max-w-4xl mx-auto fade-up">
      {/* Search */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search size={15} />
        </div>
        <input
          type="text"
          placeholder="Cari posisi, divisi, atau kata kunci..."
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

      {/* Filter row */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <CustomSelect
          value={activeDiv}
          onValueChange={setActiveDiv}
          options={divisions.map(d => d)}
          placeholder="Semua Divisi"
        />
        <CustomSelect
          value={activeLocation}
          onValueChange={setActiveLocation}
          options={locations}
          placeholder="Semua Lokasi"
        />
        <CustomSelect
          value={activeLevel}
          onValueChange={setActiveLevel}
          options={levels}
          placeholder="Semua Level"
        />

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">{resultCount} lowongan ditemukan</span>
          {hasFilter && (
            <button
              onClick={reset}
              className="px-3 py-2 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 bg-red-50 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilter && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
              🔍 "{search}"
              <button onClick={() => setSearch('')} className="hover:text-emerald-900">
                <X size={11} />
              </button>
            </span>
          )}
          {activeDiv !== "Semua" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              {activeDiv}
              <button onClick={() => setActiveDiv('Semua')} className="hover:text-slate-300">
                <X size={11} />
              </button>
            </span>
          )}
          {activeLocation !== "Semua Lokasi" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              📍 {activeLocation}
              <button onClick={() => setActiveLocation('Semua Lokasi')} className="hover:text-slate-300">
                <X size={11} />
              </button>
            </span>
          )}
          {activeLevel !== "Semua Level" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              {activeLevel}
              <button onClick={() => setActiveLevel('Semua Level')} className="hover:text-slate-300">
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Career() {
  useFadeIn();
  const [search, setSearch] = useState('');
  const [activeDiv, setActiveDiv] = useState("Semua");
  const [activeLocation, setActiveLocation] = useState("Semua Lokasi");
  const [activeLevel, setActiveLevel] = useState("Semua Level");
  const [applyJob, setApplyJob] = useState<typeof openings[0] | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = openings.filter(job => {
    const matchDiv = activeDiv === "Semua" || job.division === activeDiv;
    const matchLoc = activeLocation === "Semua Lokasi" || job.location === activeLocation;
    const matchLevel = activeLevel === "Semua Level" || job.level === activeLevel;
    const matchSearch =
      !search ||
      [job.title, job.division, job.location, job.desc, ...job.requirements].some(str =>
        str.toLowerCase().includes(search.toLowerCase())
      );
    return matchDiv && matchLoc && matchLevel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      {/* ══ HERO ══ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&auto=format&fit=crop&q=80"
          alt="Karir"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs uppercase tracking-[4px] font-semibold rounded-full mb-6">
            Bergabung Bersama Kami
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Bangun Karir<br />
            <span className="text-emerald-400">Bersama PT Surya Inti Gas</span>
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto">
            Kami mencari individu berdedikasi yang ingin berkembang bersama perusahaan distribusi gas terpercaya sejak 2003.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="#lowongan"
              className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Lihat Lowongan →
            </a>
            <a
              href="#proses"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-colors"
            >
              Proses Rekrutmen
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 fade-up">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
          <ChevronRight size={14} />
          <span className="text-gray-600 font-medium">Karir</span>
        </div>
      </div>

      {/* ══ LOWONGAN ══ */}
      <section id="lowongan" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">Posisi Terbuka</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Lowongan Saat Ini</h2>
            <p className="text-slate-500 text-sm">Temukan posisi yang sesuai dengan keahlian dan minat Anda.</p>
          </div>

          <SearchFilterBar
            search={search} setSearch={setSearch}
            activeDiv={activeDiv} setActiveDiv={setActiveDiv}
            activeLocation={activeLocation} setActiveLocation={setActiveLocation}
            activeLevel={activeLevel} setActiveLevel={setActiveLevel}
            resultCount={filtered.length}
          />

          <div className="space-y-4 max-w-4xl mx-auto">
            {filtered.map((job) => {
              const isOpen = expandedId === job.id;
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
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">{job.division}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">📍 {job.location}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{job.type}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{job.level}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                    </div>
                    <div
                      className={`ml-4 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-slate-200 text-slate-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-7 border-t border-slate-100 pt-5 space-y-5">
                      <p className="text-slate-600 text-sm leading-relaxed">{job.desc}</p>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Kualifikasi</p>
                        <ul className="space-y-2">
                          {job.requirements.map(r => (
                            <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                                ✓
                              </span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => setApplyJob(job)}
                        className="mt-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        Lamar Sekarang →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">Tidak ada lowongan yang sesuai.</p>
                <p className="text-sm mt-1">Coba ubah kata kunci atau filter pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ PROSES REKRUTMEN ══ */}
      <section id="proses" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14 fade-up">
          <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">Tahapan</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Proses Rekrutmen</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Transparan, adil, dan efisien — kami menghargai waktu Anda.
          </p>
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
              <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
