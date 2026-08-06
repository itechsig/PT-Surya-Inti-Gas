import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useGallery } from '../../hooks/useGallery';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

// Styles
const galleryDetailStyles = `
  .gallery-detail-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-family: 'DM Sans, system-ui, sans-serif';
    font-size: 0.9375rem;
    font-weight: 500;
    color: #64748B;
    background: white;
    border: 2px solid #E3F2FD;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 32px;
    width: fit-content;
  }

  .back-button:hover {
    background: #EFF6FF;
    border-color: #29ABE2;
    color: #0C2D5E;
  }

  .gallery-detail-header {
    margin-bottom: 32px;
  }

  .gallery-detail-title {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #0C2D5E;
    margin: 0 0 16px;
    line-height: 1.2;
  }

  .gallery-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .gallery-detail-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
  }

  .gallery-detail-category {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e40af;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 12px;
    background: #dbeafe;
    border-radius: 20px;
  }

  .gallery-detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
    margin-bottom: 32px;
  }

  .gallery-detail-image-container {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .gallery-detail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-detail-description {
    font-family: 'DM Sans, system-ui, sans-serif';
    font-size: 1.125rem;
    line-height: 1.8;
    color: #475569;
    margin: 0;
  }

  .gallery-detail-description p {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .lightbox-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0C2D5E;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0C2D5E;
    transition: background 0.3s ease;
  }

  .lightbox-nav:hover {
    background: #E3F2FD;
  }

  .lightbox-nav-prev {
    left: -60px;
  }

  .lightbox-nav-next {
    right: -60px;
  }

  .lightbox-open {
    overflow: hidden;
  }

  .related-gallery {
    margin-top: 48px;
  }

  .related-gallery-title {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 1.5rem;
    font-weight: 700;
    color: #0C2D5E;
    margin-bottom: 24px;
  }

  .related-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .related-gallery-item {
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .related-gallery-item:hover {
    transform: translateY(-4px);
  }

  .related-gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .related-gallery-item-title {
    padding: 12px;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 0.9rem;
    font-weight: 600;
    color: #0C2D5E;
    background: white;
  }

  @media (max-width: 768px) {
    .gallery-detail-container {
      padding: 20px 16px;
    }

    .gallery-detail-content {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .gallery-detail-image-container {
      height: 300px;
    }

    .lightbox-nav-prev {
      left: 10px;
    }

    .lightbox-nav-next {
      right: 10px;
    }

    .related-gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
`;

// Back Button Component
const BackButton = ({ navigate, currentLang, t }: { navigate: (path: string) => void; currentLang: string; t: (key: string) => string }) => {
  return (
    <button
      onClick={() => navigate(`/${currentLang}/galeri`)}
      className="back-button"
      aria-label={t('gallery.aria.backToGallery')}
    >
      <ArrowLeft size={16} />
      {t('gallery.page.backToGallery')}
    </button>
  );
};

// Main GalleryDetail Component
function GalleryDetail() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const navigate = useNavigate();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { items: galleryItems } = useGallery(currentLang);
  const currentItem = galleryItems.find((item) => item.id === id);

  // Toggle body scroll when lightbox is open/closed
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }

    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [isLightboxOpen]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentImageIndex]);

  // Set current image index when item changes
  useEffect(() => {
    if (currentItem) {
      const index = galleryItems.findIndex(item => item.id === currentItem.id);
      setCurrentImageIndex(index);
    }
  }, [currentItem]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length);
    const nextItem = galleryItems[(currentImageIndex + 1) % galleryItems.length];
    navigate(`/galeri/${nextItem.id}`);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    const prevItem = galleryItems[(currentImageIndex - 1 + galleryItems.length) % galleryItems.length];
    navigate(`/galeri/${prevItem.id}`);
  };

  if (!currentItem) {
    return (
      <div className="products-corporate">
        <style>{galleryDetailStyles}</style>
        
        {/* Header Section */}
        <div className="products-header" style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(/images/products/20260618_135557.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          padding: '120px 6vw 120px 6vw',
          marginBottom: '80px',
          marginLeft: '-6vw',
          marginRight: '-6vw',
          marginTop: '-120px',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div className="products-container">
            <h1 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              {t('gallery.page.title')}
            </h1>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {t('gallery.page.subtitle')}
            </p>
          </div>
        </div>

        <div className="gallery-detail-container">
          <BackButton navigate={navigate} currentLang={currentLang} t={t} />
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontFamily: 'Barlow, system-ui, sans-serif', fontSize: '1.5rem', color: '#0C2D5E' }}>
              {t('gallery.page.notFoundTitle')}
            </h2>
            <p style={{ fontFamily: 'DM Sans, system-ui, sans-serif', color: '#64748b', marginTop: '16px' }}>
              {t('gallery.page.notFoundMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get related items (same category, excluding current item)
  const relatedItems = galleryItems
    .filter(item => item.category === currentItem.category && item.id !== currentItem.id)
    .slice(0, 4);

  return (
    <div className="products-corporate">
      <style>{galleryDetailStyles}</style>
      
      {/* Header Section */}
      <div className="products-header" style={{
        position: 'relative',
        backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(/images/products/20260618_135557.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 65%',
        padding: '120px 6vw 120px 6vw',
        marginBottom: '80px',

        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="products-container">
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

      <div className="gallery-detail-container">
        <BackButton navigate={navigate} currentLang={currentLang} t={t} />

        <div className="gallery-detail-header">
          <h1 className="gallery-detail-title">{currentItem.title}</h1>
          
          <div className="gallery-detail-meta">
            <div className="gallery-detail-meta-item">
              <Calendar size={16} />
              <span>{currentItem.year}</span>
            </div>
            <div className="gallery-detail-category">
              <span>{t(`gallery.categories.${currentItem.category}`)}</span>
            </div>
          </div>
        </div>

        <div className="gallery-detail-content">
          <div className="gallery-detail-image-container">
            <img
              src={getImageUrl(currentItem.fullSize)}
              alt={currentItem.alt}
              className="gallery-detail-image"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
            />
          </div>

          <div className="gallery-detail-description">
            <p>
              {currentItem.detailedDescription || currentItem.description}
            </p>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className="related-gallery">
            <h2 className="related-gallery-title">{t('gallery.page.relatedPhotos')}</h2>
            <div className="related-gallery-grid">
              {relatedItems.map((item) => (
                <div
                  key={item.id}
                  className="related-gallery-item"
                  onClick={() => navigate(`/${currentLang}/galeri/${item.id}`)}
                >
                  <img
                    src={getImageUrl(item.thumbnail)}
                    alt={item.alt}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                  />
                  <div className="related-gallery-item-title">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLightboxOpen && createPortal(
        <div className="lightbox-modal">
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label={t('gallery.aria.closeLightbox')}
            >
              <X size={24} />
            </button>

            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={handlePrevious}
              aria-label={t('gallery.aria.previousImage')}
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={getImageUrl(galleryItems[currentImageIndex].fullSize)}
              alt={galleryItems[currentImageIndex].alt}
              className="lightbox-image"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
            />

            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={handleNext}
              aria-label={t('gallery.aria.nextImage')}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default GalleryDetail;