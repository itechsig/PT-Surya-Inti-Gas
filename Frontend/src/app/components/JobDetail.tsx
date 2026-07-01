import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ArrowLeft, Send, Calendar, Building, Briefcase } from 'lucide-react';
import '../../styles/career.css';

interface Job {
  id: number;
  title: string;
  division: string;
  location: string;
  type: string;
  level: string;
  description: string;
  fullDescription: string;
  requirements: string[];
  deadline: string;
}

export function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const openings: Job[] = [
    {
      id: 1,
      title: "Sales Executive",
      division: "Sales & Marketing",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Bertanggung jawab atas penjualan produk gas industri ke pelanggan baru dan mempertahankan hubungan dengan pelanggan yang ada.",
      fullDescription: "Sales Executive bertanggung jawab untuk mengembangkan bisnis perusahaan dengan mencari pelanggan baru dan mempertahankan hubungan dengan pelanggan yang sudah ada. Tugas ini mencakup presentasi produk, negosiasi harga, dan mencapai target penjualan yang ditetapkan perusahaan.",
      requirements: [
        "Pendidikan minimal D3/S1 semua jurusan",
        "Pengalaman minimal 2 tahun di bidang sales",
        "Kemampuan komunikasi dan negosiasi yang baik",
        "Memiliki kendaraan pribadi dan SIM C",
        "Mampu bekerja dengan target dan under pressure",
        "Berdomisili di Sidoarjo atau sekitarnya"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 2,
      title: "Installation Technician",
      division: "Technical Operations",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Melakukan instalasi dan maintenance sistem gas industri, tabung bertekanan tinggi, dan peralatan terkait di lokasi pelanggan.",
      fullDescription: "Installation Technician bertanggung jawab untuk instalasi, maintenance, dan troubleshooting sistem gas industri di lokasi pelanggan. Tugas ini memastikan semua peralatan berfungsi dengan baik dan memenuhi standar keselamatan.",
      requirements: [
        "Pendidikan minimal SMK Teknik Mesin/Teknik Listrik",
        "Pengalaman minimal 2 tahun di bidang instalasi gas",
        "Memiliki sertifikat keahlian teknik diutamakan",
        "Mampu membaca schematic dan technical drawing",
        "Bersedia bekerja di lapangan dan perjalanan dinas",
        "Memahami standar keselamatan kerja"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 3,
      title: "Admin & Finance Staff",
      division: "Finance & Admin",
      location: "Balikpapan",
      type: "Full-time",
      level: "Entry-level",
      description: "Menangani administrasi keuangan dan operasional kantor, termasuk pembukuan, laporan keuangan, dan administrasi HR.",
      fullDescription: "Admin & Finance Staff bertanggung jawab untuk mengelola administrasi keuangan harian, pembukuan, pembuatan laporan keuangan, dan administrasi HR sederhana. Tugas ini mencakup pengeluaran operasional, invoice, dan dokumentasi kantor.",
      requirements: [
        "Pendidikan minimal D3 Akuntansi/Manajemen Keuangan",
        "Fresh graduate dipertimbangkan",
        "Menguasai Microsoft Office (Excel, Word, PowerPoint)",
        "Teliti dan terorganisir dalam administrasi",
        "Mampu bekerja dalam tim maupun individu",
        "Berdomisili di Balikpapan"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 4,
      title: "Gas Delivery Driver",
      division: "Logistics & Distribution",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Entry-level",
      description: "Bertanggung jawab pengiriman gas industri ke lokasi pelanggan dengan aman dan tepat waktu sesuai jadwal yang ditentukan.",
      fullDescription: "Gas Delivery Driver bertanggung jawab untuk mengantar produk gas industri ke lokasi pelanggan dengan aman dan tepat waktu. Tugas ini mencakup pengecekan kondisi tabung, pengiriman sesuai rute, dan dokumentasi pengiriman.",
      requirements: [
        "Pendidikan minimal SMA/SMK sederajat",
        "Memiliki SIM B1 yang masih berlaku",
        "Pengalaman mengendarai truck min 3 tahun",
        "Memahami rute Sidoarjo dan sekitarnya",
        "Jujur, disiplin, dan bertanggung jawab",
        "Bersedia bekerja dengan shift"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 5,
      title: "Quality Control Engineer",
      division: "Technical Operations",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Memastikan kualitas produk gas industri sesuai standar dan melakukan pengujian rutin terhadap produk.",
      fullDescription: "Quality Control Engineer bertanggung jawab untuk memastikan semua produk gas industri memenuhi standar kualitas yang ditetapkan. Tugas ini mencakup pengujian produk, inspeksi proses produksi, dan dokumentasi hasil QC.",
      requirements: [
        "Pendidikan minimal S1 Teknik Kimia/Teknik Industri",
        "Pengalaman minimal 2 tahun di bidang Quality Control",
        "Memahami standar ISO dan regulasi industri gas",
        "Mampu menganalisa data dan membuat laporan QC",
        "Teliti dan detail dalam pemeriksaan",
        "Bersedia bekerja di area produksi"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 6,
      title: "Marketing Specialist",
      division: "Sales & Marketing",
      location: "Balikpapan",
      type: "Full-time",
      level: "Mid-level",
      description: "Mengembangkan strategi pemasaran dan mempromosikan produk gas industri kepada pasar target.",
      fullDescription: "Marketing Specialist bertanggung jawab untuk mengembangkan dan implementasi strategi pemasaran produk gas industri. Tugas ini mencakup market research, digital marketing, event management, dan analisis campaign.",
      requirements: [
        "Pendidikan minimal S1 Marketing/Komunikasi",
        "Pengalaman minimal 2 tahun di bidang marketing",
        "Menguasai digital marketing dan social media",
        "Kemampuan analisis pasar yang baik",
        "Kreatif dalam membuat konten marketing",
        "Berdomisili di Balikpapan"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 7,
      title: "Warehouse Supervisor",
      division: "Logistics & Distribution",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Senior-level",
      description: "Mengelola operasional gudang, inventaris, dan koordinasi distribusi produk gas.",
      fullDescription: "Warehouse Supervisor bertanggung jawab untuk mengelola seluruh operasional gudang termasuk receiving, storage, picking, packing, dan shipping. Tugas ini mencakup manajemen tim, inventory control, dan koordinasi dengan departemen lain.",
      requirements: [
        "Pendidikan minimal D3/S1 Manajemen/Logistik",
        "Pengalaman minimal 5 tahun di bidang warehouse",
        "Pengalaman memimpin tim minimal 3 tahun",
        "Menguasai sistem inventory management",
        "Memiliki sertifikat forklift diutamakan",
        "Mampu membuat laporan inventory dan KPI"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 8,
      title: "HR Manager",
      division: "Finance & Admin",
      location: "Balikpapan",
      type: "Full-time",
      level: "Senior-level",
      description: "Mengelola rekrutmen, pengembangan karyawan, dan kebijakan sumber daya manusia perusahaan.",
      fullDescription: "HR Manager bertanggung jawab untuk seluruh fungsi HR termasuk rekrutmen, training & development, compensation & benefits, employee relations, dan HR operations. Tugas ini mencakup pengembangan kebijakan HR dan implementasi strategi SDM.",
      requirements: [
        "Pendidikan minimal S1 Psikologi/Hukum/Manajemen SDM",
        "Pengalaman minimal 5 tahun di bidang HR",
        "Pengalaman memimpin tim HR minimal 3 tahun",
        "Memahami regulasi ketenagakerjaan Indonesia",
        "Kemampuan leadership dan komunikasi yang kuat",
        "Berdomisili di Balikpapan"
      ],
      deadline: "2027-12-30"
    },
    {
      id: 9,
      title: "Safety Officer",
      division: "Technical Operations",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Memastikan kepatuhan terhadap standar keselamatan kerja dalam operasional gas industri.",
      fullDescription: "Safety Officer bertanggung jawab untuk memastikan kepatuhan terhadap standar keselamatan kerja (HSE) di seluruh operasional perusahaan. Tugas ini mencakup inspeksi keselamatan, investigasi kecelakaan, training K3, dan implementasi program keselamatan.",
      requirements: [
        "Pendidikan minimal D3 K3/Teknik Lingkungan",
        "Memiliki sertifikat Ahli K3 Umum/K3 Industri",
        "Pengalaman minimal 3 tahun di bidang HSE",
        "Memahami regulasi K3 dan perundangan terkait",
        "Mampu melakukan audit keselamatan dan risiko assessment",
        "Bersedia bekerja di area operasional"
      ],
      deadline: "2027-12-30"
    }
  ];

  useEffect(() => {
    const foundJob = openings.find(j => j.id === parseInt(id || '0'));
    setJob(foundJob || null);
    setLoading(false);
  }, [id]);

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleApply = () => {
    if (job) {
      navigate(`/karir/${job.id}/lamar`);
    }
  };

  if (loading) {
    return (
      <div className="career-page">
        {/* Career Hero Section */}
        <div className="career-hero">
          <div className="section-container">
            <div className="section-header">
              <div className="career-hero-badge">Karir</div>
              <h2>Lowongan Pekerjaan</h2>
              <p>Temukan posisi yang sesuai dengan keahlian dan minat Anda</p>
              <p className="jobs-counter">9 Pekerjaan Tersedia</p>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="loading">Loading...</div>
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
              <div className="career-hero-badge">Karir</div>
              <h2>Lowongan Pekerjaan</h2>
              <p>Temukan posisi yang sesuai dengan keahlian dan minat Anda</p>
              <p className="jobs-counter">9 Pekerjaan Tersedia</p>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="no-jobs-found">
            <p>Lowongan tidak ditemukan.</p>
            <button onClick={() => navigate('/karir')} className="back-button" aria-label="Back to job listings">
              <ArrowLeft size={16} />
              Kembali ke Lowongan
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
            <div className="career-hero-badge">Karir</div>
            <h2>Lowongan Pekerjaan</h2>
            <p>Temukan posisi yang sesuai dengan keahlian dan minat Anda</p>
            <p className="jobs-counter">9 Pekerjaan Tersedia</p>
          </div>
        </div>
      </div>

      <div className="job-detail-section">
        <div className="section-container">
          <button onClick={() => navigate('/karir')} className="back-button" aria-label="Back to job listings">
            <ArrowLeft size={16} />
            Kembali ke Lowongan
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
              <h2>Deskripsi Pekerjaan</h2>
              <p>{job.fullDescription}</p>
            </div>

            <div className="job-requirements-section">
              <h2>Persyaratan</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="job-detail-actions">
              {deadlinePassed ? (
                <button className="apply-button disabled" disabled aria-label="Job application closed">
                  Lowongan Ditutup
                </button>
              ) : (
                <button onClick={handleApply} className="apply-button" aria-label="Apply for this job">
                  <Send size={18} />
                  Lamar Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}