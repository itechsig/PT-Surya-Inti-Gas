import '../../styles/ProductsAndServices.css';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import type { GalleryItem } from '../../data/gallery';
import { useGallery } from '../../hooks/useGallery';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const gridStaggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

const galleryStyles = `
  .products-corporate {
    --primary: var(--brand-navy, #0F4C81);
    --primary-dark: var(--brand-navy-hover, #0a3861);
    --secondary: var(--brand-sky, #00AEEF);
    --bg: #F8FAFC;
    --accent: #EAF4FF;
    --navy-dark: #0f172a;
    --navy: #1e293b;
    --blue-dark: var(--brand-navy, #1e3a8a);
    --blue: var(--brand-blue, #1e40af);
    --sky: var(--brand-blue, #3b82f6);
    --sky-light: #7fb5ee;
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
    background: var(--bg);
  }

  .gallery-filters {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 40px;
    gap: 20px;
  }

  .gallery-filter-right {
    display: flex;
    align-items: center;
  }

  .gallery-filter-dropdown-wrapper {
    position: relative;
    display: inline-block;
  }

  .gallery-filter-dropdown {
    padding: 10px 36px 10px 16px;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;
    appearance: none;
  }

  .gallery-filter-dropdown:hover,
  .gallery-filter-dropdown:focus {
    border-color: #1e40af;
    outline: none;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }

  .gallery-filter-dropdown-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #475569;
    transition: color 0.3s ease, transform 0.2s ease;
  }

  .gallery-filter-dropdown-icon.rotated {
    transform: translateY(-50%) rotate(180deg);
  }

  .gallery-filter-dropdown:hover + .gallery-filter-dropdown-icon,
  .gallery-filter-dropdown:focus + .gallery-filter-dropdown-icon {
    color: #1e40af;
  }

  .gallery-filter-custom-dropdown {
    position: relative;
  }

  .gallery-filter-custom-select {
    padding: 10px 36px 10px 16px;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;
    user-select: none;
  }

  .gallery-filter-custom-select:hover,
  .gallery-filter-custom-select:focus {
    border-color: #1e40af;
    outline: none;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  }

  .gallery-filter-custom-options {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 300px;
    overflow-y: auto;
    display: none;
  }

  .gallery-filter-custom-options.show {
    display: block;
  }

  .gallery-filter-custom-option {
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }

  .gallery-filter-custom-option:hover {
    background: #f1f5f9;
    color: #1e40af;
  }

  .gallery-filter-custom-option.selected {
    background: #1e40af;
    color: white;
  }

  .gallery-filter-label {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-right: 12px;
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
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.35s var(--ease);
  }

  .uk-card-custom::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1e3a8a, #3b82f6);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s var(--ease);
    z-index: 2;
  }

  .uk-card-custom:hover::before {
    transform: scaleX(1);
  }

  .uk-card-custom:hover {
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.18);
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
    transform: translateY(10px);
    transition: transform 0.35s var(--ease);
  }

  .gallery-hover-overlay.visible .gallery-hover-title {
    transform: translateY(0);
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease, transform 0.5s var(--ease);
  }

  .uk-card-custom:hover .gallery-image {
    transform: scale(1.05);
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
      justify-content: flex-end;
      gap: 16px;
    }

    .gallery-filter-right {
      width: 100%;
    }

    .gallery-filter-dropdown {
      width: 100%;
      min-width: auto;
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

function GalleryCard({ item, currentLang }: { item: GalleryItem; currentLang: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${currentLang}/galeri/${item.id}`);
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
    <motion.article
      data-tag=""
      className={`uk-first-column ${getSizeClass()}`}
      variants={cardReveal}
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
            src={getImageUrl(item.thumbnail)}
            alt={item.alt}
            loading="lazy"
            width="400"
            height="250"
            className={`gallery-image ${isHovered ? 'dimmed' : ''}`}
            style={{ height: '100%' }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
          />
          <div className={`gallery-hover-overlay ${isHovered ? 'visible' : ''}`}>
            <h3 className="gallery-hover-title">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Gallery() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items: galleryItems } = useGallery(currentLang);

  const activityCategories = useMemo(
    () => [
      { id: 'all', name: t('gallery.categories.all') },
      { id: 'products', name: t('gallery.categories.products') },
      { id: 'equipment', name: t('gallery.categories.equipment') },
      { id: 'facility', name: t('gallery.categories.facility') },
      { id: 'activities', name: t('gallery.categories.activities') },
      { id: 'projects', name: t('gallery.categories.projects') },
    ],
    [t]
  );

  const filteredItems = galleryItems.filter(item => {
    return selectedActivity === 'all' || item.category === selectedActivity;
  });

  const handleActivityChange = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="products-corporate">
      <style>{galleryStyles}</style>
      
      {/* Header Section */}
      <motion.section
        className="products-header"
        style={{
          position: 'relative',
          minHeight: '560px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '140px 6vw',
          textAlign: 'center',
          marginBottom: '0'
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(/images/office/wp.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          zIndex: 0
        }} />
        <motion.div className="products-container" style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }} variants={fadeUp}>
          <motion.h1 className="products-title" style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 24px'
          }} variants={fadeUp}>
            {t('gallery.page.title')}
          </motion.h1>
          <motion.p className="products-subtitle" style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            lineHeight: '1.75',
            color: 'rgba(255, 255, 255, 0.78)',
            maxWidth: '640px',
            margin: '0 auto'
          }} variants={fadeUp}>
            {t('gallery.page.subtitle')}
          </motion.p>
        </motion.div>
      </motion.section>

      <motion.section className="products-section" style={{
        paddingTop: '0'
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      >
        {/* Category Filters */}
        <motion.div className="products-container" style={{
          padding: '100px 6vw'
        }} variants={fadeUp}>
          <div className="gallery-filters">
            <div className="gallery-filter-right">
              <span className="gallery-filter-label">{t('gallery.page.activityLabel')}</span>
              <div className="gallery-filter-custom-dropdown" ref={dropdownRef}>
                <div
                  className="gallery-filter-custom-select"
                  onClick={handleDropdownClick}
                >
                  {activityCategories.find(cat => cat.id === selectedActivity)?.name || t('gallery.categories.all')}
                  <ChevronDown size={16} className={`gallery-filter-dropdown-icon ${isDropdownOpen ? 'rotated' : ''}`} />
                </div>
                <div className={`gallery-filter-custom-options ${isDropdownOpen ? 'show' : ''}`}>
                  {activityCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`gallery-filter-custom-option ${selectedActivity === category.id ? 'selected' : ''}`}
                      onClick={() => {
                        handleActivityChange(category.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div style={{
          marginLeft: '-6vw',
          marginRight: '-6vw',
          width: 'calc(100% + 12vw)'
        }}>
          <div className="ui-gallery">
            <div className="ui-gallery-inner">
              <div className="">
                <motion.div
                  key={selectedActivity}
                  className="ui-gallery-items"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={gridStaggerContainer}
                >
                  {filteredItems.map((item) => (
                    <GalleryCard key={item.id} item={item} currentLang={currentLang} />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Gallery;