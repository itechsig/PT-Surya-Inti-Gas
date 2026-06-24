const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .leadership-page {
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
    min-height: 100vh;
    background: var(--slate-50);
  }

  .leadership-hero {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .leadership-hero-content {
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    color: var(--white);
  }

  .leadership-hero-badge {
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

  .leadership-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
  }

  .leadership-hero-description {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    max-width: 900px;
    margin: 0 auto;
  }

  .leadership-section {
    padding: 80px 6vw;
  }

  .leadership-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .leadership-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
    margin-top: 48px;
  }

  .leadership-card {
    background: var(--white);
    border-radius: 20px;
    padding: 40px 32px;
    border: 1px solid var(--slate-200);
    transition: all 0.4s var(--ease);
    position: relative;
    overflow: hidden;
  }

  .leadership-card::before {
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

  .leadership-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: var(--sky-light);
  }

  .leadership-card:hover::before {
    transform: scaleX(1);
  }

  .leadership-number {
    font-family: var(--ff-display);
    font-size: 3rem;
    font-weight: 800;
    color: var(--sky-light);
    line-height: 1;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .leadership-title {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .leadership-description {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  .leadership-mission {
    background: var(--white);
    border-radius: 20px;
    padding: 48px;
    border: 1px solid var(--slate-200);
    margin-top: 48px;
  }

  .leadership-mission-title {
    font-family: var(--ff-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 24px;
    letter-spacing: -0.02em;
  }

  .leadership-mission-text {
    font-family: var(--ff-body);
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--slate-600);
    margin: 0;
  }

  @media (max-width: 768px) {
    .leadership-hero,
    .leadership-section {
      padding: 60px 6vw;
    }

    .leadership-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .leadership-card {
      padding: 32px 24px;
    }

    .leadership-mission {
      padding: 32px 24px;
    }
  }
`;

const leadershipValues = [
  {
    number: '01',
    title: 'Kualitas',
    description: 'Memberikan nilai terbaik bagi pelanggan melalui standar kualitas yang tinggi dan konsisten dalam setiap produk dan layanan.'
  },
  {
    number: '02',
    title: 'Keandalan',
    description: 'Menghadirkan solusi gas industri yang aman dan efisien dengan pengiriman yang andal dan tepat waktu.'
  },
  {
    number: '03',
    title: 'Integritas',
    description: 'Menjalankan bisnis dengan prinsip etika yang kuat, transparansi, dan kejujuran dalam setiap pengambilan keputusan.'
  },
  {
    number: '04',
    title: 'Inovasi',
    description: 'Terus meningkatkan kompetensi sumber daya manusia dan mengadopsi teknologi terbaru untuk layanan yang lebih baik.'
  },
  {
    number: '05',
    title: 'Kemitraan',
    description: 'Membangun kemitraan jangka panjang yang memberikan manfaat bagi seluruh pemangku kepentingan.'
  },
  {
    number: '06',
    title: 'Pertumbuhan',
    description: 'Berkomitmen untuk pertumbuhan berkelanjutan yang seimbang antara keuntungan dan tanggung jawab sosial.'
  }
];

export function LeadershipPage() {
  return (
    <div className="leadership-page">
      <style>{css}</style>

      {/* Hero Section */}
      <section className="leadership-hero">
        <div className="leadership-hero-content">
          <div className="leadership-hero-badge">Kepemimpinan</div>
          <h1 className="leadership-hero-title">
            Visi <span style={{ color: 'var(--sky-light)' }}>Kepemimpinan</span>
          </h1>
          <p className="leadership-hero-description">
            Perjalanan Surya Inti Gas dibangun atas satu prinsip sederhana: memberikan nilai terbaik bagi pelanggan melalui kualitas, keandalan, dan integritas.
          </p>
        </div>
      </section>

      {/* Leadership Values Section */}
      <section className="leadership-section">
        <div className="leadership-container">
          <div className="leadership-grid">
            {leadershipValues.map((value, index) => (
              <div key={index} className="leadership-card">
                <div className="leadership-number">{value.number}</div>
                <h3 className="leadership-title">{value.title}</h3>
                <p className="leadership-description">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="leadership-mission">
            <h2 className="leadership-mission-title">Komitmen Kami</h2>
            <p className="leadership-mission-text">
              Selama lebih dari 20 tahun, kami telah melayani berbagai sektor industri dengan komitmen yang tidak berubah. Ke depan, kami akan terus memperkuat layanan, meningkatkan kompetensi sumber daya manusia, dan membangun kemitraan jangka panjang yang memberikan manfaat bagi seluruh pemangku kepentingan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
