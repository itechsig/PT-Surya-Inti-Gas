import '../../styles/ProductsAndServices.css';

/* ═══════════════════════════════════════════════════════════════
   NEWS.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

function News() {
  const newsItems = [
    {
      id: 1,
      title: "PT Surya Inti Gas Menambah Cabang Baru di Balikpapan",
      date: "15 Januari 2024",
      category: "Ekspansi",
      description: "PT Surya Inti Gas terus melakukan ekspansi dengan membuka cabang baru di Balikpapan. Cabang ini akan melayani kebutuhan gas industri untuk sektor manufaktur dan kesehatan di wilayah Kalimantan Timur.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Pencapaian K3 Excellence Award 2023",
      date: "10 November 2023",
      category: "Prestasi",
      description: "PT Surya Inti Gas berhasil meraih penghargaan K3 Excellence Award 2023 atas komitmen perusahaan dalam menerapkan standar Keselamatan dan Kesehatan Kerja (K3) yang tinggi di seluruh operasional.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Pengenalan Sistem Pengisian Gas Baru dengan Teknologi Terkini",
      date: "25 Oktober 2023",
      category: "Inovasi",
      description: "PT Surya Inti Gas mengimplementasikan sistem pengisian gas baru dengan teknologi otomatis terkini untuk meningkatkan efisiensi dan keamanan dalam proses produksi dan distribusi gas industri.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="products-corporate">
      <style>{`
        @media (max-width: 768px) {
          .news-header-responsive {
            padding: 160px 6vw 80px 6vw !important;
            margin-top: -80px !important;
            margin-bottom: 40px !important;
          }
          .news-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .news-card-image {
            height: 180px !important;
          }
          .news-card-content {
            padding: 20px !important;
          }
          .news-title {
            font-size: 1.1rem !important;
          }
          .news-description {
            font-size: 0.9rem !important;
          }
        }
        @media (max-width: 480px) {
          .news-header-responsive {
            padding: 120px 6vw 60px 6vw !important;
            margin-top: -60px !important;
          }
          .news-card-image {
            height: 150px !important;
          }
          .news-card-content {
            padding: 16px !important;
          }
          .news-title {
            font-size: 1rem !important;
          }
          .news-description {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
      <section className="products-section" style={{
        paddingTop: '0'
      }}>
        {/* Header Section */}
        <div className="products-header news-header-responsive" style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '240px 6vw 120px 6vw',
          marginBottom: '80px',
          marginLeft: '-6vw',
          marginRight: '-6vw',
          marginTop: '-120px',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div className="products-container">
            <div className="products-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 24px',
              borderRadius: '50px',
              background: 'rgba(96, 165, 250, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px'
            }}>
              Berita
            </div>
            <h1 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              Berita & Kegiatan
            </h1>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Dapatkan informasi terbaru tentang PT Surya Inti Gas, termasuk kegiatan perusahaan, prestasi, dan berita industri gas terkini.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="products-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '80px'
          }} className="news-grid-responsive">
            {newsItems.map((item) => (
              <div key={item.id} style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="news-card-image" style={{
                  height: '200px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#ffffff',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.category}
                  </div>
                </div>
                <div className="news-card-content" style={{
                  padding: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#64748b',
                    fontFamily: 'DM Sans, system-ui, sans-serif'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {item.date}
                  </div>
                  <h3 className="news-title" style={{
                    fontFamily: 'Barlow, system-ui, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>
                    {item.title}
                  </h3>
                  <p className="news-description" style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: '0.95rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#1e40af',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}>
                    Baca Selengkapnya
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default News;