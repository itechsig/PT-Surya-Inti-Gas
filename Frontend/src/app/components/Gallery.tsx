import '../../styles/ProductsAndServices.css';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { getGalleryItems, type GalleryItem } from '../../data/gallery';

const galleryStyles = `
  .gallery-filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    gap: 20px;
  }

  .gallery-filter-left {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .gallery-filter-right {
    display: flex;
    align-items: center;
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
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .gallery-filter-left {
      width: 100%;
    }

    .gallery-filter-right {
      width: 100%;
    }

    .gallery-filter-dropdown {
      width: 100%;
      min-width: auto;
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
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t, i18n } = useTranslation();
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const galleryItems = useMemo(() => getGalleryItems(t), [t, i18n.language]);

  const years = useMemo(
    () => [
      { id: 'all', name: t('gallery.page.allYears') },
      ...Array.from({ length: 2026 - 2022 + 1 }, (_, i) => ({
        id: (2022 + i).toString(),
        name: (2022 + i).toString(),
      })),
    ],
    [t]
  );

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
    const yearMatch = selectedYear === 'all' || item.year.toString() === selectedYear;
    const activityMatch = selectedActivity === 'all' || item.category === selectedActivity;
    return yearMatch && activityMatch;
  });

  const handleYearChange = (yearId: string) => {
    setSelectedYear(yearId);
  };

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
              {t('gallery.page.badge')}
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

        {/* Category Filters */}
        <div className="products-container">
          <div className="gallery-filters">
            <div className="gallery-filter-left">
              {years.map((year) => (
                <button
                  key={year.id}
                  className={`gallery-filter-btn ${selectedYear === year.id ? 'active' : ''}`}
                  onClick={() => handleYearChange(year.id)}
                  aria-label={t('gallery.page.filterByYearAria', { year: year.name })}
                  aria-pressed={selectedYear === year.id}
                >
                  {year.name}
                </button>
              ))}
            </div>
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
                    <GalleryCard key={item.id} item={item} currentLang={currentLang} />
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