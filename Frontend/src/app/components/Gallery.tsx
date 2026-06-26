import '../../styles/ProductsAndServices.css';
import { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════
   GALLERY.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

const galleryStyles = `
  @media (max-width: 1024px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  
  @media (max-width: 640px) {
    .gallery-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    
    .gallery-card {
      aspect-ratio: 4/3 !important;
    }
    
    .gallery-overlay h3 {
      font-size: 1rem !important;
    }
    
    .gallery-overlay p {
      font-size: 0.8rem !important;
      padding: 16px !important;
    }
  }
`;

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 'oxygen',
    src: '/images/products/Oxygen.webp',
    alt: 'Oxygen Cylinder',
    title: 'Oksigen (O2)',
    description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri'
  },
  {
    id: 'nitrogen',
    src: '/images/products/Nitrogen.webp',
    alt: 'Nitrogen Cylinder',
    title: 'Nitrogen (N2)',
    description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan'
  },
  {
    id: 'argon',
    src: '/images/products/Argon.webp',
    alt: 'Argon Cylinder',
    title: 'Argon (Ar)',
    description: 'Gas argon untuk pengelasan TIG dan aplikasi elektronik'
  },
  {
    id: 'acetylene',
    src: '/images/products/Acetylene.webp',
    alt: 'Acetylene Cylinder',
    title: 'Asetilena (C2H2)',
    description: 'Gas asetilena untuk pengelasan dan pemotongan logam'
  },
  {
    id: 'helium',
    src: '/images/products/Helium.webp',
    alt: 'Helium Cylinder',
    title: 'Helium (He)',
    description: 'Gas helium untuk aplikasi medis, industri, dan penelitian'
  },
  {
    id: 'iso-tank',
    src: '/images/products/ISO_Tank.webp',
    alt: 'ISO Tank',
    title: 'ISO Tank',
    description: 'Tangki ISO untuk transportasi gas cair dalam volume besar'
  },
  {
    id: 'liquid-filling',
    src: '/images/products/Liquid_Filling.webp',
    alt: 'Liquid Filling System',
    title: 'Liquid Filling',
    description: 'Sistem pengisian gas cair untuk tabung dan tangki'
  },
  {
    id: 'microbulk',
    src: '/images/products/Microbulk.webp',
    alt: 'Microbulk Tank',
    title: 'Microbulk',
    description: 'Tangki microbulk untuk supply gas dalam volume menengah'
  },
  {
    id: 'medical-gas',
    src: '/images/products/Medical_Gas_Cylinder.webp',
    alt: 'Medical Gas Cylinder',
    title: 'Tabung Gas Medis',
    description: 'Tabung gas medis untuk rumah sakit dan fasilitas kesehatan'
  }
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="gallery-card"
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '4/3',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={item.src}
        alt={item.alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease, filter 0.3s ease',
          opacity: isHovered ? 0.7 : 1,
          filter: isHovered ? 'brightness(0.85) contrast(1.1)' : 'brightness(1.05) contrast(1.05) saturate(1.1)'
        }}
      />
      <div
        className="gallery-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(59, 130, 246, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <h3
          style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px',
            textAlign: 'center'
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.5'
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="products-corporate">
      <style>{galleryStyles}</style>
      <section className="products-section" style={{
        paddingTop: '0'
      }}>
        {/* Header Section */}
        <div className="products-header" style={{
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
              Galeri
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
              Dokumentasi Perusahaan
            </h1>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Jelajahi galeri foto PT Surya Inti Gas yang menampilkan fasilitas operasional, kegiatan perusahaan, dan dokumentasi proyek kami dalam melayani berbagai industri di Indonesia.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="products-container">
          <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '40px'
          }}>
            {galleryItems.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;