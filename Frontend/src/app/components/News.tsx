import '../../styles/ProductsAndServices.css';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════
   NEWS.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

function News() {
  const navigate = useNavigate();

  const newsItems = [
    {
      id: 1,
      slug: 'sejarah-2003-pendirian-cv-surya-inti-gas',
      title: "Sejarah 2003: Pendirian CV. Surya Inti Gas",
      date: "1 Januari 2003",
      category: "Sejarah",
      description: "Pendirian CV. Surya Inti Gas di Jl. KH. Mukmin, Sidoarjo, Jawa Timur.",
      image: "/images/office/2003.jpg"
    },
    {
      id: 2,
      slug: 'sejarah-2007-ekspansi-operasional',
      title: "Sejarah 2007: Ekspansi Operasional dan Relokasi Kantor",
      date: "1 Januari 2007",
      category: "Sejarah",
      description: "Relokasi ke Komplek Pergudangan dan Industri \"Meiko Abadi\" di Gedangan, Sidoarjo.",
      image: "/images/office/2007.jpeg"
    },
    {
      id: 3,
      slug: 'sejarah-2016-relokasi-head-office',
      title: "Sejarah 2016: Relokasi Head Office ke Safe N Lock",
      date: "1 Januari 2016",
      category: "Sejarah",
      description: "Pindah ke Komplek Pergudangan dan Industri \"Safe N Lock\" sebagai Head Office Sidoarjo.",
      image: "/images/office/2016.jpg"
    },
    {
      id: 4,
      slug: 'sejarah-2017-pendirian-pt-surya-inti-gas',
      title: "Sejarah 2017: Pendirian PT. Surya Inti Gas dan Cabang Balikpapan",
      date: "1 Januari 2017",
      category: "Sejarah",
      description: "Berdirinya PT. Surya Inti Gas dan pembukaan cabang pertama di Balikpapan, Kalimantan Timur.",
      image: "/images/office/2017.PNG"
    }
  ];

  const handleReadMore = (slug: string) => {
    navigate(`/berita/${slug}`);
  };

  return (
    <div className="products-corporate">
      <style>{`
        @media (max-width: 1024px) {
          .news-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            marginBottom: '80px'
          }} className="news-grid-responsive">
            {newsItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleReadMore(item.slug)}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="news-card-image" style={{
                  height: '200px',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  flexShrink: 0
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
                  padding: '24px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
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
                    marginBottom: '0',
                    flex: 1
                  }}>
                    {item.description}
                  </p>
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