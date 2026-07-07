import '../../styles/ProductsAndServices.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const galleryStyles = `
  .gallery-filters {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .gallery-filter-btn {
    padding: 10px 24px;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 50px;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .gallery-filter-btn:hover,
  .gallery-filter-btn.active {
    background: #1e40af;
    border-color: #1e40af;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }

  /* UI Gallery Styles */
  .ui-gallery {
    position: relative;
  }

  .ui-gallery-inner {
    position: relative;
  }

  .ui-gallery-items {
    margin-left: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    gap: 4px;
    grid-auto-flow: dense;
  }

  .ui-gallery-items > * {
    padding-left: 0;
  }

  /* Size variants for gallery items */
  .gallery-item-small {
    grid-column: span 1;
    grid-row: span 1;
  }

  .gallery-item-medium {
    grid-column: span 1;
    grid-row: span 2;
  }

  .gallery-item-large {
    grid-column: span 2;
    grid-row: span 2;
  }

  .gallery-item-wide {
    grid-column: span 2;
    grid-row: span 1;
  }

  .gallery-item-tall {
    grid-column: span 1;
    grid-row: span 2;
  }

  .uk-card-custom {
    border-radius: 8px;
    overflow: hidden;
  }

  .uk-border-rounded {
    border-radius: 8px;
  }

  .ui-gallery-thumbnail {
    position: relative;
    overflow: hidden;
    height: 250px;
  }

  .tz-image-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .uk-transition-toggle:hover .uk-transition-fade {
    opacity: 1;
  }

  .ui-gallery-info-wrap {
    padding: 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
  }

  .ui-title {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .uk-overlay-primary {
    background: rgba(0, 0, 0, 0.5);
  }

  /* Custom Hover Overlay */
  .gallery-hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(30, 64, 175, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .gallery-hover-overlay.visible {
    opacity: 1;
  }

  .gallery-hover-title {
    color: white;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    text-align: center;
    padding: 20px;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }

  .gallery-image.dimmed {
    opacity: 0.6;
  }

  @media (max-width: 1024px) {
    .ui-gallery-items {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 180px;
      gap: 4px;
      margin-left: 0;
      grid-auto-flow: dense;
    }

    .gallery-item-small {
      grid-column: span 1;
      grid-row: span 1;
    }

    .gallery-item-medium {
      grid-column: span 1;
      grid-row: span 2;
    }

    .gallery-item-large {
      grid-column: span 2;
      grid-row: span 2;
    }

    .gallery-item-wide {
      grid-column: span 2;
      grid-row: span 1;
    }

    .gallery-item-tall {
      grid-column: span 1;
      grid-row: span 2;
    }
  }
  
  @media (max-width: 640px) {
    .ui-gallery-items {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 150px;
      gap: 4px;
      margin-left: 0;
      grid-auto-flow: dense;
    }

    .gallery-item-small {
      grid-column: span 1;
      grid-row: span 1;
    }

    .gallery-item-medium {
      grid-column: span 1;
      grid-row: span 2;
    }

    .gallery-item-large {
      grid-column: span 2;
      grid-row: span 2;
    }

    .gallery-item-wide {
      grid-column: span 2;
      grid-row: span 1;
    }

    .gallery-item-tall {
      grid-column: span 1;
      grid-row: span 2;
    }

    .gallery-filters {
      gap: 8px;
    }

    .gallery-filter-btn {
      padding: 8px 16px;
      font-size: 12px;
    }

    .ui-title {
      font-size: 0.9rem;
    }

    .ui-gallery-info-wrap {
      padding: 12px;
    }

    .gallery-hover-title {
      font-size: 1rem;
      padding: 15px;
    }
  }
`;

type GalleryItem = {
  id: string;
  thumbnail: string;
  fullSize: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  year: number;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
};

const galleryItems: GalleryItem[] = [
  {
    id: 'oxygen',
    thumbnail: '/images/products/Oxygen-optimized.webp',
    fullSize: '/images/products/Oxygen-optimized.webp',
    alt: 'Oxygen Cylinder',
    title: 'Oksigen (O2)',
    description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
    category: 'products',
    year: 2007,
    size: 'medium'
  },
  {
    id: 'nitrogen',
    thumbnail: '/images/products/Nitrogen-optimized.webp',
    fullSize: '/images/products/Nitrogen-optimized.webp',
    alt: 'Nitrogen Cylinder',
    title: 'Nitrogen (N2)',
    description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
    category: 'products',
    year: 2008,
    size: 'small'
  },
  {
    id: 'mix-gas',
    thumbnail: '/images/products/Mix_gas.webp',
    fullSize: '/images/products/Mix_gas.webp',
    alt: 'Mix Gas Cylinder',
    title: 'Mix Gas',
    description: 'Gas mix untuk aplikasi khusus',
    category: 'products',
    year: 2009,
    size: 'small'
  },
  {
    id: 'vertical-tank',
    thumbnail: '/images/products/Vertical_Tank.webp',
    fullSize: '/images/products/Vertical_Tank.webp',
    alt: 'Vertical Tank',
    title: 'Vertical Tank',
    description: 'Tangki vertikal untuk storage gas',
    category: 'equipment',
    year: 2010,
    size: 'tall'
  },
  {
    id: 'acetylene',
    thumbnail: '/images/products/Acetylene-optimized.webp',
    fullSize: '/images/products/Acetylene-optimized.webp',
    alt: 'Acetylene Cylinder',
    title: 'Asetilena (C2H2)',
    description: 'Gas asetilena untuk pengelasan dan pemotongan logam',
    category: 'products',
    year: 2011,
    size: 'medium'
  },
  {
    id: 'iso-tank',
    thumbnail: '/images/products/ISO_Tank.webp',
    fullSize: '/images/products/ISO_Tank.webp',
    alt: 'ISO Tank',
    title: 'ISO Tank',
    description: 'Tangki ISO untuk transportasi gas cair dalam volume besar',
    category: 'equipment',
    year: 2012,
    size: 'wide'
  },
  {
    id: 'liquid-filling',
    thumbnail: '/images/products/Liquid_Filling.webp',
    fullSize: '/images/products/Liquid_Filling.webp',
    alt: 'Liquid Filling System',
    title: 'Liquid Filling',
    description: 'Sistem pengisian gas cair untuk tabung dan tangki',
    category: 'facility',
    year: 2013,
    size: 'large'
  },
  {
    id: 'microbulk',
    thumbnail: '/images/products/Microbulk.webp',
    fullSize: '/images/products/Microbulk.webp',
    alt: 'Microbulk Tank',
    title: 'Microbulk',
    description: 'Tangki microbulk untuk supply gas dalam volume menengah',
    category: 'equipment',
    year: 2014,
    size: 'small'
  },
  {
    id: 'medical-gas',
    thumbnail: '/images/products/Medical_Gas_Cylinder.webp',
    fullSize: '/images/products/Medical_Gas_Cylinder.webp',
    alt: 'Medical Gas Cylinder',
    title: 'Tabung Gas Medis',
    description: 'Tabung gas medis untuk rumah sakit dan fasilitas kesehatan',
    category: 'products',
    year: 2015,
    size: 'medium'
  },
  {
    id: 'office-view-2',
    thumbnail: '/images/office/office_view2.webp',
    fullSize: '/images/office/office_view2.webp',
    alt: 'Office View 2',
    title: 'Ruang Meeting',
    description: 'Ruang meeting untuk diskusi dan kolaborasi',
    category: 'facility',
    year: 2016,
    size: 'wide'
  },
  {
    id: 'office-view-3',
    thumbnail: '/images/office/office_view3.webp',
    fullSize: '/images/office/office_view3.webp',
    alt: 'Office View 3',
    title: 'Ruang Kerja',
    description: 'Ruang kerja modern dan profesional',
    category: 'facility',
    year: 2017,
    size: 'tall'
  },
  {
    id: 'gas-cylinder-1',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    alt: 'Gas Cylinder Storage',
    title: 'Penyimpanan Tabung Gas',
    description: 'Area penyimpanan tabung gas yang aman dan terorganisir',
    category: 'facility',
    year: 2018,
    size: 'large'
  },
  {
    id: 'industrial-plant-1',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
    alt: 'Industrial Plant',
    title: 'Pabrik Industri',
    description: 'Fasilitas produksi gas industri modern',
    category: 'facility',
    year: 2019,
    size: 'wide'
  },
  {
    id: 'welding-1',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop',
    alt: 'Welding Process',
    title: 'Proses Pengelasan',
    description: 'Aplikasi gas industri untuk pengelasan',
    category: 'products',
    year: 2020,
    size: 'medium'
  },
  {
    id: 'lab-1',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop',
    alt: 'Laboratory',
    title: 'Laboratorium Gas',
    description: 'Fasilitas laboratorium untuk analisis gas',
    category: 'facility',
    year: 2021,
    size: 'small'
  },
  {
    id: 'delivery-1',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
    alt: 'Gas Delivery',
    title: 'Pengiriman Gas',
    description: 'Armada pengiriman gas untuk pelanggan',
    category: 'facility',
    year: 2022,
    size: 'tall'
  },
  {
    id: 'tank-1',
    thumbnail: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=800&fit=crop',
    alt: 'Storage Tank',
    title: 'Tangki Penyimpanan',
    description: 'Tangki penyimpanan gas cair kapasitas besar',
    category: 'equipment',
    year: 2023,
    size: 'large'
  },
  {
    id: 'valve-1',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    alt: 'Gas Valve',
    title: 'Katup Gas',
    description: 'Sistem katup untuk kontrol aliran gas',
    category: 'equipment',
    year: 2024,
    size: 'small'
  },
  {
    id: 'hospital-1',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
    alt: 'Hospital Gas System',
    title: 'Sistem Gas Rumah Sakit',
    description: 'Instalasi gas medis untuk rumah sakit',
    category: 'facility',
    year: 2025,
    size: 'wide'
  },
  {
    id: 'quality-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop',
    alt: 'Quality Control',
    title: 'Quality Control',
    description: 'Proses quality control untuk produk gas',
    category: 'facility',
    year: 2026,
    size: 'medium'
  },
  {
    id: 'training-1',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop',
    alt: 'Safety Training',
    title: 'Pelatihan Keselamatan',
    description: 'Program pelatihan keselamatan kerja',
    category: 'facility',
    year: 2007,
    size: 'small'
  },
  {
    id: 'pressure-gauge-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop',
    alt: 'Pressure Gauge',
    title: 'Pressure Gauge',
    description: 'Alat pengukur tekanan gas',
    category: 'equipment',
    year: 2009,
    size: 'small'
  },
  {
    id: 'factory-1',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
    alt: 'Factory Floor',
    title: 'Lantai Pabrik',
    description: 'Area produksi pabrik gas',
    category: 'facility',
    year: 2010,
    size: 'large'
  },
  {
    id: 'medical-equipment-1',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop',
    alt: 'Medical Equipment',
    title: 'Peralatan Medis',
    description: 'Peralatan medis menggunakan gas',
    category: 'products',
    year: 2011,
    size: 'medium'
  },
  {
    id: 'cryogenic-1',
    thumbnail: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop',
    alt: 'Cryogenic System',
    title: 'Sistem Kriogenik',
    description: 'Sistem penyimpanan gas cair suhu rendah',
    category: 'equipment',
    year: 2012,
    size: 'tall'
  },
  {
    id: 'assembly-1',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop',
    alt: 'Assembly Line',
    title: 'Lini Perakitan',
    description: 'Lini perakitan tabung gas',
    category: 'facility',
    year: 2013,
    size: 'wide'
  },
  {
    id: 'fire-safety-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop',
    alt: 'Fire Safety',
    title: 'Keselamatan Kebakaran',
    description: 'Sistem keselamatan kebakaran industri',
    category: 'facility',
    year: 2014,
    size: 'small'
  },
  {
    id: 'transport-1',
    thumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop',
    alt: 'Gas Transport',
    title: 'Transportasi Gas',
    description: 'Kendaraan transportasi gas industri',
    category: 'facility',
    year: 2015,
    size: 'large'
  },
  {
    id: 'laboratory-2',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop',
    alt: 'Chemistry Lab',
    title: 'Laboratorium Kimia',
    description: 'Laboratorium untuk penelitian gas',
    category: 'facility',
    year: 2016,
    size: 'medium'
  },
  {
    id: 'regulator-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop',
    alt: 'Gas Regulator',
    title: 'Regulator Gas',
    description: 'Regulator untuk kontrol tekanan gas',
    category: 'equipment',
    year: 2017,
    size: 'small'
  }
];

const categories = [
  { id: 'all', name: 'Semua' },
  ...Array.from({ length: 2026 - 2007 + 1 }, (_, i) => ({
    id: (2007 + i).toString(),
    name: (2007 + i).toString()
  }))
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/galeri/${item.id}`);
  };

  const getSizeClass = () => {
    switch (item.size) {
      case 'small': return 'gallery-item-small';
      case 'medium': return 'gallery-item-medium';
      case 'large': return 'gallery-item-large';
      case 'wide': return 'gallery-item-wide';
      case 'tall': return 'gallery-item-tall';
      default: return 'gallery-item-small';
    }
  };

  return (
    <article 
      data-tag="" 
      className={`uk-first-column ${getSizeClass()}`}
      style={{ transform: 'translate(0px, 0px)' }}
    >
      <div 
        className="uk-article uk-card uk-overflow-hidden uk-card-custom uk-border-rounded uk-transition-toggle"
        style={{ cursor: 'pointer', position: 'relative', height: '100%' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="ui-gallery-thumbnail uk-display-block uk-card-media-top tz-image-cover" style={{ height: '100%' }}>
          <img
            src={item.thumbnail}
            alt={item.alt}
            loading="lazy"
            width="400"
            height="250"
            className={`gallery-image ${isHovered ? 'dimmed' : ''}`}
            style={{ height: '100%' }}
          />
          <div className={`gallery-hover-overlay ${isHovered ? 'visible' : ''}`}>
            <h3 className="gallery-hover-title">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </article>
  );
}

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.year.toString() === selectedCategory);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

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

        {/* Category Filters */}
        <div className="products-container">
          <div className="gallery-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`gallery-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                aria-label={`Filter by ${category.name}`}
                aria-pressed={selectedCategory === category.id}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{
          marginLeft: '-6vw',
          marginRight: '-6vw',
          width: 'calc(100% + 12vw)'
        }}>
          <div className="ui-gallery">
            <div className="ui-gallery-inner">
              <div className="">
                <div className="ui-gallery-items">
                  {filteredItems.map((item) => (
                    <GalleryCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;