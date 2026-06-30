

/* ═══════════════════════════════════════════════════════════════
   ABOUT US PAGE.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  /* ── Corporate Variables ── */
  .about-us-corporate {
    --navy-dark: #0f172a;
    --navy: #1e293b;
    --blue-dark: #1e3a8a;
    --blue: #1e40af;
    --sky: #3b82f6;
    --sky-light: #60a5fa;
    --white: #ffffff;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ff-display: 'Barlow', system-ui, sans-serif;
    --ff-body: 'DM Sans', system-ui, sans-serif;
    
    font-family: var(--ff-body);
  }

  /* ── Corporate Hero Section ── */
  .about-us-hero {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .about-us-hero-content {
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    color: var(--white);
  }

  .about-us-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(96, 165, 250, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.3);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 32px;
  }

  .about-us-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
  }

  .about-us-hero-description {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    max-width: 800px;
    margin: 0 auto;
  }

  /* ── Corporate Section ── */
  .about-us-section {
    position: relative;
    background: var(--white);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .about-us-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Section Header ── */
  .about-us-section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .about-us-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(30, 64, 175, 0.08);
    border: 1px solid rgba(30, 64, 175, 0.15);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 24px;
  }

  .about-us-section-title {
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--navy-dark);
    margin: 0 0 24px;
  }

  .about-us-section-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: var(--slate-600);
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Vision Mission Grid ── */
  .vision-mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-bottom: 80px;
  }

  .vision-mission-card {
    background: var(--slate-50);
    border-radius: 24px;
    padding: 48px;
    border: 1px solid var(--slate-200);
    transition: all 0.4s var(--ease);
  }

  .vision-mission-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 60px rgba(30, 64, 175, 0.12);
    border-color: var(--sky-light);
  }

  .vision-mission-title {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .vision-mission-text {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  .vision-mission-list {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
    padding-left: 24px;
    list-style-type: decimal;
  }

  .vision-mission-list-item {
    margin-bottom: 12px;
  }

  .vision-mission-list-item:last-child {
    margin-bottom: 0;
  }

  /* ── Values Section ── */
  .values-section {
    background: var(--white);
    padding: 120px 6vw;
  }

  .values-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
    margin-top: 48px;
  }

  .value-card {
    background: var(--slate-50);
    border-radius: 20px;
    padding: 40px 32px;
    border: 1px solid var(--slate-200);
    transition: all 0.4s var(--ease);
    position: relative;
    overflow: hidden;
  }

  .value-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--sky), var(--sky-light));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s var(--ease);
  }

  .value-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: var(--sky-light);
  }

  .value-card:hover::before {
    transform: scaleX(1);
  }

  .value-title {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .value-description {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── History Timeline ── */
  .history-section {
    background: var(--slate-50);
    padding: 120px 6vw;
  }

  .history-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .timeline-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .timeline-circles {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 80px;
    flex: 1;
    padding: 8px 16px;
    position: relative;
    min-height: 60px;
  }

  .timeline-line-container {
    position: absolute;
    top: 50%;
    left: 16px;
    right: 16px;
    height: 3px;
    background: var(--slate-300);
    transform: translateY(-50%);
    z-index: 0;
    border-radius: 2px;
    pointer-events: none;
  }

  .timeline-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    min-width: 60px;
  }

  .timeline-circle-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--white);
    border: 3px solid var(--slate-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s var(--ease);
    position: relative;
    z-index: 2;
  }

  .timeline-circle-year {
    font-family: var(--ff-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--slate-600);
    margin-bottom: 8px;
    transition: color 0.3s var(--ease);
  }

  .timeline-circle:hover .timeline-circle-year {
    color: var(--sky);
  }

  .timeline-circle:hover .timeline-circle-dot {
    border-color: var(--sky);
    transform: scale(1.2);
  }

  .timeline-circle.active .timeline-circle-year {
    color: var(--sky);
    font-weight: 800;
  }

  .timeline-circle.active .timeline-circle-dot {
    background: var(--sky);
    border-color: var(--sky);
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  .timeline-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInSlide 0.4s ease-in-out forwards;
  }

  @keyframes fadeInSlide {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .timeline-content.reverse {
    direction: rtl;
  }

  .timeline-content.reverse > * {
    direction: ltr;
  }

  .timeline-image {
    width: 100%;
    height: 400px;
    border-radius: 24px;
    overflow: hidden;
    background: linear-gradient(135deg, var(--slate-200) 0%, var(--slate-100) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--slate-400);
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 600;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .timeline-info {
    padding: 24px;
  }

  .timeline-info-year {
    font-family: var(--ff-display);
    font-size: 3rem;
    font-weight: 800;
    color: var(--sky);
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .timeline-info-title {
    font-family: var(--ff-display);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .timeline-info-description {
    font-family: var(--ff-body);
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .vision-mission-grid {
      grid-template-columns: 1fr;
    }

    .timeline-circles {
      gap: 60px;
    }

    .timeline-line-container {
      left: 12px;
      right: 12px;
    }
  }

  @media (max-width: 768px) {
    .about-us-hero,
    .about-us-section,
    .values-section,
    .history-section {
      padding: 80px 6vw;
    }

    .values-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .value-card {
      padding: 32px 24px;
    }

    .timeline-navigation {
      gap: 8px;
    }

    .timeline-nav-button {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    .timeline-circles {
      gap: 40px;
      padding: 8px 12px;
    }

    .timeline-line-container {
      left: 12px;
      right: 12px;
    }

    .timeline-circle-year {
      font-size: 0.875rem;
    }

    .timeline-circle-dot {
      width: 12px;
      height: 12px;
    }

    .timeline-content {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .timeline-content.reverse {
      direction: ltr;
    }

    .timeline-image {
      height: 300px;
    }

    .timeline-info-year {
      font-size: 2.5rem;
    }

    .timeline-info-title {
      font-size: 1.5rem;
    }

    .timeline-info-description {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .timeline-circles {
      gap: 32px;
    }

    .timeline-line-container {
      left: 12px;
      right: 12px;
    }

    .timeline-circle-year {
      font-size: 0.75rem;
    }

    .timeline-circle-dot {
      width: 10px;
      height: 10px;
    }
  }
`;

import { useState } from 'react';

export function AboutUsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleSlideChange = (newIndex: number) => {
    setCurrentSlide(newIndex);
  };

  const values = [
    {
      title: 'Keselamatan',
      description: 'Menjunjung tinggi keselamatan sebagai prioritas utama dalam setiap aktivitas operasional untuk memastikan lingkungan kerja yang aman bagi semua pihak.'
    },
    {
      title: 'Integritas',
      description: 'Menjalankan bisnis dengan kejujuran, transparansi, dan prinsip etika yang kuat dalam setiap pengambilan keputusan.'
    },
    {
      title: 'Profesionalisme',
      description: 'Menyajikan layanan dengan standar profesional tinggi, kompetensi, dan dedikasi dalam setiap aspek operasional.'
    },
    {
      title: 'Tanggung Jawab',
      description: 'Bertanggung jawab penuh atas setiap tindakan dan keputusan, serta berkomitmen terhadap keberlanjutan bisnis.'
    },
    {
      title: 'Fokus Pelanggan',
      description: 'Berfokus pada kebutuhan pelanggan dengan menghadirkan solusi yang tepat, cepat, dan terpercaya.'
    },
    {
      title: 'Kualitas',
      description: 'Berkomitmen memberikan produk dan layanan berkualitas tinggi secara konsisten untuk kepuasan pelanggan.'
    },
    {
      title: 'Inovasi',
      description: 'Melalui inovasi dan perbaikan berkelanjutan, kami terus meningkatkan efisiensi dan standar pelayanan.'
    },
    {
      title: 'Kerja Sama Tim',
      description: 'Diperkuat oleh kerja sama tim yang solid untuk mencapai pertumbuhan dan keberhasilan bersama.'
    }
  ];

  const milestones = [
    {
      year: "2003",
      title: "Awal Berdiri",
      description: "CV. Surya Inti Gas resmi didirikan di Sidoarjo, Jawa Timur, dengan kantor pertama yang berlokasi di Jl. KH. Mukmin. Sejak awal, perusahaan berkomitmen menyediakan solusi gas industri yang berkualitas dan terpercaya."
    },
    {
      year: "2007",
      title: "Perluasan Operasional",
      description: "Seiring pertumbuhan bisnis dan meningkatnya permintaan pasar, kantor operasional dipindahkan ke Komplek Pergudangan & Industri Meiko Abadi Blok B70, Wedi, Gedangan, Sidoarjo guna mendukung kapasitas layanan dan distribusi yang lebih optimal."
    },
    {
      year: "2016",
      title: "Menempati Kantor Pusat",
      description: "Untuk menunjang perkembangan perusahaan, kantor pusat (Head Office) dipindahkan ke Komplek Pergudangan & Industri Safe N Lock Blok V1 No. 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM 5.5, Rangkah Kidul, Sidoarjo, yang hingga kini menjadi pusat operasional PT Surya Inti Gas."
    },
    {
      year: "2017",
      title: "Transformasi dan Ekspansi",
      description: "Perusahaan resmi bertransformasi dari CV. Surya Inti Gas menjadi PT. Surya Inti Gas. Pada tahun yang sama, perusahaan memperluas jangkauan layanan dengan membuka cabang pertama di Balikpapan, Kalimantan Timur, sebagai langkah strategis untuk melayani kebutuhan pelanggan di wilayah Indonesia bagian timur."
    }
  ];

  return (
    <div className="about-us-corporate">
      <style>{css}</style>

      {/* Corporate Hero Section */}
      <section className="about-us-hero">
        <div className="about-us-hero-content">
          <div className="about-us-hero-badge">
            Tentang Kami
          </div>
          <h1 className="about-us-hero-title">
            Mengenal Lebih Dekat <span style={{ color: 'var(--white)' }}>PT Surya Inti Gas</span>
          </h1>
          <p className="about-us-hero-description">
            Sejak 2003, kami telah menjadi mitra terpercaya dalam solusi gas industri untuk berbagai sektor di Indonesia, berkomitmen pada kualitas, inovasi, dan keberlanjutan.
          </p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="about-us-section">
        <div className="about-us-container">
          <div className="about-us-section-header">
            <h2 className="about-us-section-title">
              Tujuan dan Dedikasi Kami
            </h2>
            <p className="about-us-section-subtitle">
              Visi dan misi yang menjadi landasan setiap langkah kami dalam melayani industri Indonesia.
            </p>
          </div>

          <div className="vision-mission-grid">
            <div className="vision-mission-card">
              <h3 className="vision-mission-title">Visi</h3>
              <p className="vision-mission-text">
                Menjadi sebuah perusahaan yang berkembang, memiliki cabang di seluruh kota besar Indonesia, yang mampu untuk memenuhi dan menunjang kebutuhan gas-gas industri di dalam negeri serta melayani kebutuhan gas Oksigen Medis di seluruh Rumah Sakit di Indonesia
              </p>
            </div>

            <div className="vision-mission-card">
              <h3 className="vision-mission-title">Misi</h3>
              <ol className="vision-mission-list">
                <li className="vision-mission-list-item">Mampu menyediakan produk yang berkecukupan dengan standar tinggi</li>
                <li className="vision-mission-list-item">Memiliki sumber daya manusia yang kuat dan solid</li>
                <li className="vision-mission-list-item">Mampu memenuhi kebutuhan dan keinginan pelanggan dengan cepat, tepat dan baik</li>
                <li className="vision-mission-list-item">Kepuasan pelanggan adalah prioritas kami</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="history-section">
        <div className="history-container">
          <div className="about-us-section-header">
            <h2 className="about-us-section-title">
              Perjalanan PT Surya Inti Gas
            </h2>
            <p className="about-us-section-subtitle">
              Milestone penting dalam perjalanan kami menjadi pemimpin industri gas di Indonesia.
            </p>
          </div>

          <div className="timeline-wrapper">
            <div className="timeline-circles">
              <div className="timeline-line-container" />
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`timeline-circle ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => handleSlideChange(index)}
                >
                  <div className="timeline-circle-year">{milestone.year}</div>
                  <div className="timeline-circle-dot" />
                </div>
              ))}
            </div>

            <div className={`timeline-content ${currentSlide % 2 === 1 ? 'reverse' : ''}`} key={currentSlide}>
              <div className="timeline-image">
                Foto {milestones[currentSlide].year}
              </div>
              <div className="timeline-info">
                <div className="timeline-info-year">{milestones[currentSlide].year}</div>
                <h3 className="timeline-info-title">{milestones[currentSlide].title}</h3>
                <p className="timeline-info-description">{milestones[currentSlide].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="about-us-section-header">
            <h2 className="about-us-section-title">
              Nilai-nilai PT Surya Inti Gas
            </h2>
            <p className="about-us-section-subtitle">
              Prinsip yang memandu setiap langkah kami dalam melayani pelanggan dan menjalankan bisnis.
            </p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}