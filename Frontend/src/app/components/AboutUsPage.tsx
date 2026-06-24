

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

  /* ── History Timeline ── */
  .history-section {
    background: var(--slate-50);
    padding: 120px 6vw;
  }

  .history-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .timeline {
    position: relative;
    padding-left: 40px;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--blue), var(--sky-light));
  }

  .timeline-item {
    position: relative;
    padding-bottom: 48px;
    padding-left: 32px;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-dot {
    position: absolute;
    left: -45px;
    top: 0;
    width: 12px;
    height: 12px;
    background: var(--blue);
    border-radius: 50%;
    border: 3px solid var(--white);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
  }

  .timeline-year {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--blue);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }

  .timeline-title {
    font-family: var(--ff-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 12px;
    letter-spacing: -0.01em;
  }

  .timeline-description {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.6;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .vision-mission-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .about-us-hero,
    .about-us-section,
    .history-section {
      padding: 80px 6vw;
    }

    .timeline {
      padding-left: 24px;
    }

    .timeline-item {
      padding-left: 24px;
    }

    .timeline-dot {
      left: -33px;
    }
  }
`;

export function AboutUsPage() {
  const milestones = [
    {
      year: "2003",
      title: "Kami mulai berdiri dan dirintis dengan nama CV. Surya Inti Gas",
      description: "Kantor kami berada di Jl. KH. Mukmin, Sidoarjo, Jawa Timur"
    },
    {
      year: "2007",
      title: "Usaha dan bisnis CV. Surya Inti Gas berkembang dan melihat potensi prospek yang luar biasa",
      description: "Untuk menunjang operasional kantor berpindah ke Komplek Pergudangan dan Industri \"Meiko Abadi\" Blok B 70, Ds. Wedi, Gedangan, Sidoarjo, Jawa Timur"
    },
    {
      year: "2016",
      title: "Kantor CV. Surya Inti Gas berpindah ke Komplek Pergudangan dan Industri \"Safe N Lock\"",
      description: "Blok V 1 No. 3223, 3225, 3232, 3233 Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, sebagai Head Office Sidoarjo"
    },
    {
      year: "2017",
      title: "Berdirinya PT. Surya Inti Gas",
      description: "Pada tahun tersebut pertama kalinya kami membuka cabang di Balikpapan Kalimantan Timur"
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
            Mengenal Lebih Dekat <span style={{ color: 'var(--sky-light)' }}>PT Surya Inti Gas</span>
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
            <div className="about-us-section-badge">
              Visi & Misi
            </div>
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
            <div className="about-us-section-badge">
              Sejarah Kami
            </div>
            <h2 className="about-us-section-title">
              Perjalanan PT Surya Inti Gas
            </h2>
            <p className="about-us-section-subtitle">
              Milestone penting dalam perjalanan kami menjadi pemimpin industri gas di Indonesia.
            </p>
          </div>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-year">{milestone.year}</div>
                <h3 className="timeline-title">{milestone.title}</h3>
                <p className="timeline-description">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}