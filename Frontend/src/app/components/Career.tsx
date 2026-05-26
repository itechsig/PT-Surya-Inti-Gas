'use client';

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

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

// ─── Apply Modal ───────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: typeof openings[0]; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan PDF atau DOC/DOCX.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }
    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const generateCSRFToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !cvFile) return;

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('position', job.title);
      formData.append('division', job.division);
      formData.append('location', job.location);
      formData.append('cv_file', cvFile);
      formData.append('csrf_token', generateCSRFToken());

      const response = await fetch(`${API_BASE_URL}/api/career`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        throw new Error(result.message || 'Gagal mengirim lamaran');
      }

      if (result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Gagal mengirim lamaran');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim lamaran');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 rounded-t-3xl px-8 py-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
          >✕</button>
          <p className="text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-1">Lamar Posisi</p>
          <h3 className="text-white text-xl font-bold leading-snug">{job.title}</h3>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{job.division}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">📍 {job.location}</span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs rounded-full">{job.type}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Lamaran Terkirim!</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Terima kasih, <strong>{form.name}</strong>. Tim HR kami akan menghubungi Anda via email atau WhatsApp dalam 3–5 hari kerja.
              </p>
              <button onClick={onClose} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                Tutup
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">Email *</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">No. WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                  Upload CV / Resume *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => handleFile(e.target.files?.[0] ?? null)}
                />

                {cvFile ? (
                  // File already selected — show preview
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{cvFile.name}</p>
                      <p className="text-xs text-slate-400">{formatSize(cvFile.size)}</p>
                    </div>
                    <button
                      onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center text-xs transition-colors flex-shrink-0"
                    >✕</button>
                  </div>
                ) : (
                  // Drop zone
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl px-6 py-8 text-center transition-all ${
                      dragOver
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Klik atau drag & drop file CV di sini</p>
                    <p className="text-xs text-slate-400">Format PDF, DOC, atau DOCX · Maks. 5 MB</p>
                  </div>
                )}
              </div>

              <div className="pt-1 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.phone || !cvFile}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Kirim Lamaran →
                </button>
                <button onClick={onClose} className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors">
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
  const hasFilter = search || activeDiv !== "Semua" || activeLocation !== "Semua Lokasi" || activeLevel !== "Semua Level";

  const reset = () => {
    setSearch('');
    setActiveDiv('Semua');
    setActiveLocation('Semua Lokasi');
    setActiveLevel('Semua Level');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-10 max-w-4xl mx-auto">
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Cari posisi, divisi, atau kata kunci..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600">
            ✕
          </button>
        )}
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Divisi */}
        <select
          value={activeDiv}
          onChange={e => setActiveDiv(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
        >
          {divisions.map(d => (
            <option key={d} value={d}>{d === "Semua" ? "Semua Divisi" : d}</option>
          ))}
        </select>

        {/* Lokasi */}
        <select
          value={activeLocation}
          onChange={e => setActiveLocation(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
        >
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Level */}
        <select
          value={activeLevel}
          onChange={e => setActiveLevel(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
        >
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Result count + reset */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">
            {resultCount} lowongan ditemukan
          </span>
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
              <button onClick={() => setSearch('')} className="hover:text-emerald-900">✕</button>
            </span>
          )}
          {activeDiv !== "Semua" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              {activeDiv}
              <button onClick={() => setActiveDiv('Semua')} className="hover:text-slate-300">✕</button>
            </span>
          )}
          {activeLocation !== "Semua Lokasi" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              📍 {activeLocation}
              <button onClick={() => setActiveLocation('Semua Lokasi')} className="hover:text-slate-300">✕</button>
            </span>
          )}
          {activeLevel !== "Semua Level" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
              {activeLevel}
              <button onClick={() => setActiveLevel('Semua Level')} className="hover:text-slate-300">✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Career() {
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
    const matchSearch = !search || [job.title, job.division, job.location, job.desc, ...job.requirements]
      .some(str => str.toLowerCase().includes(search.toLowerCase()));
    return matchDiv && matchLoc && matchLevel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Modal Apply */}
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
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Karir</span>
        </div>
      </div>

      {/* ══ LOWONGAN ══ */}
      <section id="lowongan" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">Posisi Terbuka</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Lowongan Saat Ini</h2>
            <p className="text-slate-500 text-sm">Temukan posisi yang sesuai dengan keahlian dan minat Anda.</p>
          </div>

          {/* ── Search & Filter ── */}
          <SearchFilterBar
            search={search} setSearch={setSearch}
            activeDiv={activeDiv} setActiveDiv={setActiveDiv}
            activeLocation={activeLocation} setActiveLocation={setActiveLocation}
            activeLevel={activeLevel} setActiveLevel={setActiveLevel}
            resultCount={filtered.length}
          />

          {/* Job cards */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {filtered.map((job) => {
              const isOpen = expandedId === job.id;
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Header row */}
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
                    <div className={`ml-4 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-slate-200 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ↓
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-6 pb-7 border-t border-slate-100 pt-5 space-y-5">
                      <p className="text-slate-600 text-sm leading-relaxed">{job.desc}</p>

                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Kualifikasi</p>
                        <ul className="space-y-2">
                          {job.requirements.map(r => (
                            <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center flex-shrink-0">✓</span>
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
        <div className="text-center mb-14">
          <p className="text-xs text-slate-400 uppercase tracking-[4px] font-medium mb-3">Tahapan</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Proses Rekrutmen</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Transparan, adil, dan efisien — kami menghargai waktu Anda.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
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
