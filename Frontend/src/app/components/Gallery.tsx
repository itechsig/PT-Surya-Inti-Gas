import '../../styles/ProductsAndServices.css';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

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
    margin-left: -24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .ui-gallery-items > * {
    padding-left: 0;
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

  @media (max-width: 1024px) {
    .ui-gallery-items {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-left: 0;
    }
    .ui-gallery-thumbnail {
      height: 220px;
    }
  }
  
  @media (max-width: 640px) {
    .ui-gallery-items {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-left: 0;
    }
    .ui-gallery-thumbnail {
      height: 200px;
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
  }

  /* Modern Premium Lightbox Styles */
  .lightbox-modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: lightboxFadeIn 0.3s ease;
    backdrop-filter: blur(8px);
    overflow: hidden;
  }

  @keyframes lightboxFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .lightbox-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    animation: contentScaleIn 0.3s ease;
  }

  @keyframes contentScaleIn {
    from {
      transform: scale(0.96);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .lightbox-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
  }

  .lightbox-image {
    max-width: 90vw;
    max-height: 80vh;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 4px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: imageScaleIn 0.3s ease;
  }

  @keyframes imageScaleIn {
    from {
      transform: scale(0.96);
    }
    to {
      transform: scale(1);
    }
  }

  .lightbox-close {
    position: fixed;
    top: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    z-index: 10000;
  }

  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .lightbox-nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    z-index: 10000;
  }

  .lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .lightbox-nav-prev {
    left: 24px;
  }

  .lightbox-nav-next {
    right: 24px;
  }

  .lightbox-caption {
    margin-top: 24px;
    text-align: center;
    max-width: 800px;
    padding: 0 24px;
  }

  .lightbox-title {
    color: white;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  .lightbox-description {
    color: rgba(255, 255, 255, 0.7);
    font-family: 'DM Sans, system-ui, sans-serif';
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 768px) {
    .lightbox-close {
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
    }

    .lightbox-nav {
      width: 48px;
      height: 48px;
    }

    .lightbox-nav-prev {
      left: 16px;
    }

    .lightbox-nav-next {
      right: 16px;
    }

    .lightbox-image {
      max-width: 92vw;
      max-height: calc(100vh - 180px);
    }

    .lightbox-title {
      font-size: 1.25rem;
    }

    .lightbox-description {
      font-size: 0.9rem;
    }

    .lightbox-caption {
      margin-top: 16px;
    }
  }

  @media (max-width: 480px) {
    .lightbox-content {
      padding: 16px;
    }

    .lightbox-close {
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
    }

    .lightbox-nav {
      width: 40px;
      height: 40px;
    }

    .lightbox-nav-prev {
      left: 12px;
    }

    .lightbox-nav-next {
      right: 12px;
    }

    .lightbox-image {
      max-width: 90vw;
      max-height: calc(100vh - 160px);
    }

    .lightbox-title {
      font-size: 1.1rem;
    }

    .lightbox-description {
      font-size: 0.85rem;
    }
  }

  body.lightbox-open {
    overflow: hidden !important;
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
};

const galleryItems: GalleryItem[] = [
  {
    id: 'oxygen',
    thumbnail: '/images/products/Oxygen.webp',
    fullSize: '/images/products/Oxygen.webp',
    alt: 'Oxygen Cylinder',
    title: 'Oksigen (O2)',
    description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
    category: 'products'
  },
  {
    id: 'nitrogen',
    thumbnail: '/images/products/Nitrogen.webp',
    fullSize: '/images/products/Nitrogen.webp',
    alt: 'Nitrogen Cylinder',
    title: 'Nitrogen (N2)',
    description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
    category: 'products'
  },
  {
    id: 'mix-gas',
    thumbnail: '/images/products/Mix_gas.webp',
    fullSize: '/images/products/Mix_gas.webp',
    alt: 'Mix Gas Cylinder',
    title: 'Mix Gas',
    description: 'Gas mix untuk aplikasi khusus',
    category: 'products'
  },
  {
    id: 'vertical-tank',
    thumbnail: '/images/products/Vertical_Tank.webp',
    fullSize: '/images/products/Vertical_Tank.webp',
    alt: 'Vertical Tank',
    title: 'Vertical Tank',
    description: 'Tangki vertikal untuk storage gas',
    category: 'equipment'
  },
  {
    id: 'acetylene',
    thumbnail: '/images/products/Acetylene.webp',
    fullSize: '/images/products/Acetylene.webp',
    alt: 'Acetylene Cylinder',
    title: 'Asetilena (C2H2)',
    description: 'Gas asetilena untuk pengelasan dan pemotongan logam',
    category: 'products'
  },
  {
    id: 'iso-tank',
    thumbnail: '/images/products/ISO_Tank.webp',
    fullSize: '/images/products/ISO_Tank.webp',
    alt: 'ISO Tank',
    title: 'ISO Tank',
    description: 'Tangki ISO untuk transportasi gas cair dalam volume besar',
    category: 'equipment'
  },
  {
    id: 'liquid-filling',
    thumbnail: '/images/products/Liquid_Filling.webp',
    fullSize: '/images/products/Liquid_Filling.webp',
    alt: 'Liquid Filling System',
    title: 'Liquid Filling',
    description: 'Sistem pengisian gas cair untuk tabung dan tangki',
    category: 'facility'
  },
  {
    id: 'microbulk',
    thumbnail: '/images/products/Microbulk.webp',
    fullSize: '/images/products/Microbulk.webp',
    alt: 'Microbulk Tank',
    title: 'Microbulk',
    description: 'Tangki microbulk untuk supply gas dalam volume menengah',
    category: 'equipment'
  },
  {
    id: 'medical-gas',
    thumbnail: '/images/products/Medical_Gas_Cylinder.webp',
    fullSize: '/images/products/Medical_Gas_Cylinder.webp',
    alt: 'Medical Gas Cylinder',
    title: 'Tabung Gas Medis',
    description: 'Tabung gas medis untuk rumah sakit dan fasilitas kesehatan',
    category: 'products'
  },
  {
    id: 'office-view-1',
    thumbnail: '/images/office/office_view.webp',
    fullSize: '/images/office/office_view.webp',
    alt: 'Office View 1',
    title: 'Ruang Kerja',
    description: 'Tampilan ruang kerja',
    category: 'facility'
  },
  {
    id: 'office-view-2',
    thumbnail: '/images/office/office_view2.webp',
    fullSize: '/images/office/office_view2.webp',
    alt: 'Office View 2',
    title: 'Ruang Meeting',
    description: 'Ruang meeting untuk diskusi dan kolaborasi',
    category: 'facility'
  },
  {
    id: 'office-view-3',
    thumbnail: '/images/office/office_view3.webp',
    fullSize: '/images/office/office_view3.webp',
    alt: 'Office View 3',
    title: 'Ruang Kerja',
    description: 'Ruang kerja modern dan profesional',
    category: 'facility'
  }
];

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'products', name: 'Produk' },
  { id: 'equipment', name: 'Peralatan' },
  { id: 'facility', name: 'Fasilitas' }
];

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <article 
      data-tag="" 
      className="uk-first-column"
      style={{ transform: 'translate(0px, 0px)' }}
    >
      <div 
        className="uk-article uk-card uk-overflow-hidden uk-card-custom uk-border-rounded uk-transition-toggle"
        style={{ cursor: 'pointer', position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="ui-gallery-thumbnail uk-display-block uk-card-media-top tz-image-cover">
          <img
            src={item.thumbnail}
            alt={item.alt}
            className=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
              opacity: isHovered ? 0.7 : 1
            }}
          />
        </div>
        <div className="uk-position-cover uk-overlay uk-overlay-primary uk-transition-fade"></div>
        <div className="ui-gallery-info-wrap uk-position-bottom uk-light uk-transition-fade" style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          <div className="uk-card-body">
            <div className="ui-gallery-item-caption uk-article-meta uk-margin-top uk-margin-bottom"></div>
            <h3 className="ui-title uk-margin-remove-top uk-h3 uk-margin-bottom">{item.title}</h3>
          </div>
        </div>
      </div>
    </article>
  );
}

function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Toggle body scroll when lightbox is open/closed
  useEffect(() => {
    if (selectedItem) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [selectedItem]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;

      switch (e.key) {
        case 'Escape':
          handleCloseLightbox();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, selectedIndex]);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleImageClick = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setSelectedIndex(index);
    setSelectedItem(item);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handlePrevImage = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1;
    setSelectedIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedItem(null);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
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
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="products-container">
          <div className="ui-gallery">
            <div className="ui-gallery-inner">
              <div className="">
                <div className="ui-gallery-items">
                  {filteredItems.map((item) => (
                    <GalleryCard key={item.id} item={item} onClick={() => handleImageClick(item)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal - Rendered via Portal to body */}
      {selectedItem && createPortal(
        <div 
          className="lightbox-modal" 
          onClick={handleCloseLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            className="lightbox-close" 
            onClick={(e) => { e.stopPropagation(); handleCloseLightbox(); }}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          
          <button 
            className="lightbox-nav lightbox-nav-prev" 
            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-wrapper">
              <img
                src={selectedItem.fullSize}
                alt={selectedItem.alt}
                className="lightbox-image"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="lightbox-caption">
              <h2 className="lightbox-title">{selectedItem.title}</h2>
              <p className="lightbox-description">{selectedItem.description}</p>
            </div>
          </div>
          
          <button 
            className="lightbox-nav lightbox-nav-next" 
            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Gallery;