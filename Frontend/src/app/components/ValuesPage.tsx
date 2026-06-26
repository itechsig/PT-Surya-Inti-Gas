const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .values-page {
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

  .values-hero {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .values-hero-content {
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    color: var(--white);
  }

  .values-hero-badge {
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

  .values-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
  }

  .values-hero-description {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    max-width: 800px;
    margin: 0 auto;
  }

  .values-section {
    padding: 80px 6vw;
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
    background: var(--white);
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

  .value-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--sky) 0%, var(--sky-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    font-size: 28px;
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

  .values-back-section {
    text-align: center;
    padding: 60px 6vw;
    background: var(--white);
    border-top: 1px solid var(--slate-200);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 36px;
    background: var(--blue);
    color: var(--white);
    text-decoration: none;
    border-radius: 50px;
    font-family: var(--ff-body);
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s var(--ease);
  }

  .back-link:hover {
    background: var(--blue-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    .values-hero,
    .values-section {
      padding: 60px 6vw;
    }

    .values-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .value-card {
      padding: 32px 24px;
    }
  }
`;

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

export function ValuesPage() {
  return (
    <div className="values-page">
      <style>{css}</style>

      {/* Hero Section */}
      <section className="values-hero">
        <div className="values-hero-content">
          <div className="values-hero-badge">Nilai Perusahaan</div>
          <h1 className="values-hero-title">
            Nilai-nilai <span style={{ color: 'var(--white)' }}>PT Surya Inti Gas</span>
          </h1>
          <p className="values-hero-description">
            Surya Inti Gas menjunjung tinggi keselamatan sebagai prioritas utama dalam setiap aktivitas operasional, didukung oleh integritas, profesionalisme, dan tanggung jawab dalam menjalankan bisnis.
          </p>
        </div>
      </section>

      {/* Values Grid Section */}
      <section className="values-section">
        <div className="values-container">
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
