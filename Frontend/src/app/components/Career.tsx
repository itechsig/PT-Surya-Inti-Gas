import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Send, Search, X } from 'lucide-react';
import '../../styles/career.css';

export function Career() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [divisionSearch, setDivisionSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [levelSearch, setLevelSearch] = useState('');

  const openings = [
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

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredOpenings = useMemo(() => {
    return openings.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDivision = (selectedDivision === '' && divisionSearch === '') || 
                             job.division === selectedDivision || 
                             job.division.toLowerCase().includes(divisionSearch.toLowerCase());
      const matchesLocation = (selectedLocation === '' && locationSearch === '') || 
                             job.location === selectedLocation || 
                             job.location.toLowerCase().includes(locationSearch.toLowerCase());
      const matchesLevel = (selectedLevel === '' && levelSearch === '') || 
                         job.level === selectedLevel || 
                         job.level.toLowerCase().includes(levelSearch.toLowerCase());
      
      return matchesSearch && matchesDivision && matchesLocation && matchesLevel;
    });
  }, [searchQuery, selectedDivision, selectedLocation, selectedLevel, divisionSearch, locationSearch, levelSearch]);

  const totalJobs = filteredOpenings.length;

  const handleViewDetail = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    navigate(`/karir/${jobId}`);
  };

  const handleApply = (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    navigate(`/karir/${jobId}/lamar`);
  };

  const divisions = [...new Set(openings.map(job => job.division))];
  const locations = [...new Set(openings.map(job => job.location))];
  const levels = [...new Set(openings.map(job => job.level))];



  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDivision('');
    setSelectedLocation('');
    setSelectedLevel('');
    setDivisionSearch('');
    setLocationSearch('');
    setLevelSearch('');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="career-page">
      {/* Career Hero Section */}
      <div className="career-hero">
        <div className="section-container">
          <div className="section-header">
            <div className="career-hero-badge">Karir</div>
            <h2>Lowongan Pekerjaan</h2>
            <p>Temukan posisi yang sesuai dengan keahlian dan minat Anda</p>
            <p className="jobs-counter">{totalJobs} Pekerjaan Tersedia</p>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="listings-section">
        <div className="section-container">

          {/* Search and Filters */}
          <div className="search-filters-container">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari lowongan pekerjaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filters">
              <div className="filter-group">
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setDivisionSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">Semua Divisi</option>
                  {divisions.map(division => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari divisi..."
                    value={divisionSearch}
                    onChange={(e) => {
                      setDivisionSearch(e.target.value);
                      setSelectedDivision('');
                    }}
                    className="filter-search-input"
                  />
                  {divisionSearch && (
                    <button onClick={() => setDivisionSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setLocationSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">Semua Kota</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari kota..."
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setSelectedLocation('');
                    }}
                    className="filter-search-input"
                  />
                  {locationSearch && (
                    <button onClick={() => setLocationSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setLevelSearch('');
                  }}
                  className="filter-select"
                >
                  <option value="">Semua Jenjang</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <div className="filter-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Cari jenjang..."
                    value={levelSearch}
                    onChange={(e) => {
                      setLevelSearch(e.target.value);
                      setSelectedLevel('');
                    }}
                    className="filter-search-input"
                  />
                  {levelSearch && (
                    <button onClick={() => setLevelSearch('')} className="clear-filter-search">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-button">
                <X size={16} />
                Reset Filter
              </button>
            </div>
          </div>

          <div className="jobs-grid">
            {filteredOpenings.length === 0 ? (
              <div className="no-jobs-found">
                <p>Tidak ada lowongan yang ditemukan dengan kriteria pencarian Anda.</p>
              </div>
            ) : (
              filteredOpenings.map((job) => {
                const deadlinePassed = isDeadlinePassed(job.deadline);
                return (
                  <div key={job.id} className={`job-card ${deadlinePassed ? 'closed' : ''}`}>
                    <div className="job-header">
                      <div className="job-title">
                        <h3>{job.title}</h3>
                        <div className="job-meta">
                          <span className="job-badge division">{job.division}</span>
                          <span className="job-badge type">{job.type}</span>
                          <span className="job-badge level">{job.level}</span>
                        </div>
                      </div>
                      <span className="job-location">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                    </div>
                    <div className="job-description">
                      <p>{job.description}</p>
                    </div>
                    <div className="job-deadline">
                      <span>Batas Lamar: {formatDate(job.deadline)}</span>
                      {deadlinePassed && <span className="closed-badge">Ditutup</span>}
                    </div>
                    <div className="job-footer">
                      <div className="job-buttons">
                        <Link
                          to={`/karir/${job.id}`}
                          className="detail-button"
                          onClick={(e) => handleViewDetail(e, job.id)}
                        >
                          <Eye size={16} />
                          Lihat Detail
                        </Link>
                        {deadlinePassed ? (
                          <button
                            className="apply-button disabled"
                            disabled
                          >
                            <Send size={16} />
                            Ditutup
                          </button>
                        ) : (
                          <Link
                            to={`/karir/${job.id}/lamar`}
                            className="apply-button"
                            onClick={(e) => handleApply(e, job.id)}
                          >
                            <Send size={16} />
                            Lamar
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}