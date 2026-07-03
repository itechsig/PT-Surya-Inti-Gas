import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Facebook, 
  Linkedin, 
  MessageCircle, 
  Link as LinkIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Tag,
  Archive as ArchiveIcon,
  TrendingUp,
  X,
  ArrowLeft
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Types
interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  views: number;
  featuredImage: string;
  content: string;
  tags: string[];
}

type GalleryItem = {
  id: string;
  thumbnail: string;
  fullSize: string;
  alt: string;
  title: string;
  description: string;
  category: string;
};

interface SidebarProps {
  newsItems: NewsArticle[];
}

// Back Button Component
const BackButton = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <button
      onClick={() => navigate('/berita')}
      className="back-button"
      aria-label="Back to news"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize: '0.9375rem',
        fontWeight: '500',
        color: '#64748B',
        background: 'white',
        border: '2px solid #E3F2FD',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '32px',
        width: 'fit-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#EFF6FF';
        e.currentTarget.style.borderColor = '#29ABE2';
        e.currentTarget.style.color = '#0C2D5E';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.borderColor = '#E3F2FD';
        e.currentTarget.style.color = '#64748B';
      }}
    >
      <ArrowLeft size={16} />
      Kembali ke Berita
    </button>
  );
};

// Featured Image Component
const FeaturedImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Toggle body scroll when lightbox is open/closed
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }

    // Cleanup on unmount
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <>
      <div 
        className="featured-image-container"
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '32px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }} />
      </div>

      {isLightboxOpen && createPortal(
        <div className="lightbox-modal">
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            <div className="lightbox-image-wrapper">
              <img
                src={src}
                alt={alt}
                className="lightbox-image"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Article Metadata Component
const ArticleMetadata = ({ article }: { article: NewsArticle }) => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    marginBottom: '32px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
      <Calendar size={16} />
      <span>{article.date}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
      <User size={16} />
      <span>{article.author}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
      <Eye size={16} />
      <span>{article.views} pembaca</span>
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#1e40af',
      fontSize: '14px',
      fontWeight: '600',
      padding: '4px 12px',
      background: '#dbeafe',
      borderRadius: '20px'
    }}>
      <Tag size={14} />
      <span>{article.category}</span>
    </div>
  </div>
);

// Share Buttons Component
const ShareButtons = ({ title, url }: { title: string; url: string }) => {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link berhasil disalin!');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
        <Share2 size={16} />
        <span>Bagikan:</span>
      </div>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#1877f2',
          color: 'white',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Facebook size={18} />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#0a66c2',
          color: 'white',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Linkedin size={18} />
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#25d366',
          color: 'white',
          textDecoration: 'none',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <MessageCircle size={18} />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#64748b',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
};

// Tags Component
const Tags = ({ tags }: { tags: string[] }) => (
  <div style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <Tag size={16} style={{ color: '#64748b' }} />
      <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Tags:</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            padding: '6px 16px',
            background: '#f1f5f9',
            color: '#475569',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#1e40af';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#475569';
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// Navigation Component
const Navigation = ({ hasPrev, hasNext }: { hasPrev: boolean; hasNext: boolean }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '32px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  }}>
    {hasPrev && (
      <button
        aria-label="Previous news article"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: '#64748b',
          fontSize: '14px',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f1f5f9';
          e.currentTarget.style.color = '#1e40af';
          e.currentTarget.style.borderColor = '#1e40af';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        <ChevronLeft size={16} />
        <span>Berita Sebelumnya</span>
      </button>
    )}
    {hasNext && (
      <button
        aria-label="Next news article"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: '#64748b',
          fontSize: '14px',
          fontWeight: '500',
          marginLeft: 'auto'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f1f5f9';
          e.currentTarget.style.color = '#1e40af';
          e.currentTarget.style.borderColor = '#1e40af';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        <span>Berita Selanjutnya</span>
        <ChevronRight size={16} />
      </button>
    )}
  </div>
);

// Related News Component
const RelatedNews = ({ newsItems }: { newsItems: NewsArticle[] }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{
      fontFamily: 'Barlow, system-ui, sans-serif',
      fontSize: '20px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '24px'
    }}>
      Berita Terkait
    </h3>
    <div style={{ display: 'grid', gap: '16px' }}>
      {newsItems.slice(0, 3).map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <img
            src={item.featuredImage}
            alt={item.title}
            style={{
              width: '100px',
              height: '70px',
              objectFit: 'cover',
              borderRadius: '6px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {item.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
              <Calendar size={12} />
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Sidebar Components
const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{
      marginBottom: '24px',
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Cari berita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 40px 12px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#1e40af';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        />
        <Search
          size={18}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b'
          }}
        />
      </div>
    </div>
  );
};

const sidebarGalleryItems: GalleryItem[] = [
  {
    id: 'news-1',
    thumbnail: '/images/products/Oxygen-optimized.webp',
    fullSize: '/images/products/Oxygen-optimized.webp',
    alt: 'Oxygen Cylinder',
    title: 'Oksigen (O2)',
    description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
    category: 'products'
  },
  {
    id: 'news-2',
    thumbnail: '/images/products/Nitrogen-optimized.webp',
    fullSize: '/images/products/Nitrogen-optimized.webp',
    alt: 'Nitrogen Cylinder',
    title: 'Nitrogen (N2)',
    description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
    category: 'products'
  },
  {
    id: 'news-3',
    thumbnail: '/images/products/Mix_gas.webp',
    fullSize: '/images/products/Mix_gas.webp',
    alt: 'Mix Gas Cylinder',
    title: 'Mix Gas',
    description: 'Gas mix untuk aplikasi khusus',
    category: 'products'
  },
  {
    id: 'news-4',
    thumbnail: '/images/products/Vertical_Tank.webp',
    fullSize: '/images/products/Vertical_Tank.webp',
    alt: 'Vertical Tank',
    title: 'Vertical Tank',
    description: 'Tangki vertikal untuk storage gas',
    category: 'equipment'
  },
  {
    id: 'news-5',
    thumbnail: '/images/products/Acetylene-optimized.webp',
    fullSize: '/images/products/Acetylene-optimized.webp',
    alt: 'Acetylene Cylinder',
    title: 'Asetilena (C2H2)',
    description: 'Gas asetilena untuk pengelasan dan pemotongan logam',
    category: 'products'
  },
  {
    id: 'news-6',
    thumbnail: '/images/office/office_view.webp',
    fullSize: '/images/office/office_view.webp',
    alt: 'Office View',
    title: 'Ruang Kerja',
    description: 'Tampilan ruang kerja',
    category: 'facility'
  }
];

const SidebarGallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
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

  const handleImageClick = (item: GalleryItem) => {
    const index = sidebarGalleryItems.findIndex(i => i.id === item.id);
    setSelectedIndex(index);
    setSelectedItem(item);
  };

  const handleCloseLightbox = () => {
    setSelectedItem(null);
  };

  const handlePrevImage = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : sidebarGalleryItems.length - 1;
    setSelectedIndex(newIndex);
    setSelectedItem(sidebarGalleryItems[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = selectedIndex < sidebarGalleryItems.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedItem(sidebarGalleryItems[newIndex]);
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
    <>
      <div style={{
        marginBottom: '24px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{
          fontFamily: 'Barlow, system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '16px'
        }}>
          Galeri
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {sidebarGalleryItems.map((item) => (
            <img
              key={item.id}
              src={item.thumbnail}
              alt={item.alt}
              style={{
                width: '100%',
                height: '70px',
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => handleImageClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          ))}
        </div>
      </div>

      {selectedItem && createPortal(
        <div
          className="lightbox-modal"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={handleCloseLightbox}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="lightbox-image-wrapper">
              <img
                src={selectedItem.fullSize}
                alt={selectedItem.alt}
                className="lightbox-image"
              />
            </div>

            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            <div className="lightbox-caption">
              <h3 className="lightbox-title">{selectedItem.title}</h3>
              <p className="lightbox-description">{selectedItem.description}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const LatestPosts = ({ newsItems }: { newsItems: NewsArticle[] }) => (
  <div style={{
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  }}>
    <h4 style={{
      fontFamily: 'Barlow, system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '16px'
    }}>
      Berita Terbaru
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {newsItems.slice(0, 4).map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: '12px',
            cursor: 'pointer',
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img
            src={item.featuredImage}
            alt={item.title}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '6px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h5 style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '4px',
              lineHeight: '1.4'
            }}>
              {item.title}
            </h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
              <Calendar size={12} />
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Categories = ({ newsItems }: { newsItems: NewsArticle[] }) => {
  const categories = newsItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{
      marginBottom: '24px',
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <h4 style={{
        fontFamily: 'Barlow, system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '16px'
      }}>
        Kategori
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(categories).map(([category, count]) => (
          <div
            key={category}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', color: '#475569' }}>{category}</span>
            <span style={{
              padding: '2px 8px',
              background: '#e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Archive = () => {
  const archives = [
    'Januari 2024',
    'Desember 2023',
    'November 2023',
    'Oktober 2023'
  ];

  return (
    <div style={{
      marginBottom: '24px',
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <h4 style={{
        fontFamily: 'Barlow, system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <ArchiveIcon size={16} />
        Arsip
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {archives.map((archive, index) => (
          <div
            key={index}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
              fontSize: '14px',
              color: '#475569'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {archive}
          </div>
        ))}
      </div>
    </div>
  );
};

const PopularPosts = ({ newsItems }: { newsItems: NewsArticle[] }) => (
  <div style={{
    marginBottom: '24px',
    padding: '16px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  }}>
    <h4 style={{
      fontFamily: 'Barlow, system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '16px'
    }}>
      <TrendingUp size={16} style={{ marginRight: '8px', display: 'inline' }} />
      Berita Populer
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {newsItems
        .sort((a, b) => b.views - a.views)
        .slice(0, 3)
        .map((item, index) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '12px',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              background: '#1e40af',
              color: 'white',
              borderRadius: '50%',
              fontSize: '12px',
              fontWeight: '700',
              flexShrink: 0
            }}>
              {index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <h5 style={{
                fontFamily: 'Barlow, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '4px',
                lineHeight: '1.4'
              }}>
                {item.title}
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                <Eye size={12} />
                <span>{item.views} pembaca</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
);

// Sidebar Component
const Sidebar = ({ newsItems }: SidebarProps) => (
  <aside className="sidebar-sticky" style={{ position: 'sticky', top: '24px' }}>
    <SearchBox />
    <SidebarGallery />
    <LatestPosts newsItems={newsItems} />
    <Categories newsItems={newsItems} />
    <Archive />
    <PopularPosts newsItems={newsItems} />
  </aside>
);

// News items data
const newsItems: NewsArticle[] = [
  {
    id: 1,
    slug: 'sejarah-2003-pendirian-cv-surya-inti-gas',
    title: "Sejarah 2003: Pendirian CV. Surya Inti Gas",
    date: "1 Januari 2003",
    author: "PT Surya Inti Gas",
    category: "Sejarah",
    views: 3200,
    featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
    content: `
      <p>Pada tahun 2003, CV. Surya Inti Gas didirikan dan mulai beroperasi dengan kantor pertama yang terletak di Jl. KH. Mukmin, Sidoarjo, Jawa Timur. Ini menandai awal perjalanan kami dalam industri gas Indonesia dengan fokus pada penyediaan gas industri berkualitas tinggi untuk berbagai sektor.</p>

      <h3>Awal Perjalanan Kami</h3>
      <p>Didirikan dengan visi untuk menjadi penyedia gas industri terpercaya di Indonesia, CV. Surya Inti Gas memulai operasional dengan fokus pada kualitas dan pelayanan pelanggan.</p>

      <h4>Lokasi Pertama</h4>
      <p>Kantor pertama kami di Jl. KH. Mukmin, Sidoarjo, Jawa Timur menjadi fondasi bagi pertumbuhan perusahaan dan hubungan dengan pelanggan awal kami.</p>

      <blockquote>
        "Setiap perjalanan besar dimulai dengan langkah pertama. Tahun 2003 menandai awal komitmen kami terhadap industri gas Indonesia."
      </blockquote>

      <h4>Fokus Awal</h4>
      <ul>
        <li>Penyediaan gas industri berkualitas tinggi</li>
        <li>Pelayanan pelanggan yang responsif</li>
        <li>Building trust dengan pelanggan lokal</li>
        <li>Investasi dalam infrastruktur dasar</li>
      </ul>
    `,
    tags: ['Sejarah', 'Pendirian', '2003', 'Sidoarjo', 'CV Surya Inti Gas']
  },
  {
    id: 2,
    slug: 'sejarah-2007-ekspansi-operasional',
    title: "Sejarah 2007: Ekspansi Operasional dan Relokasi Kantor",
    date: "1 Januari 2007",
    author: "PT Surya Inti Gas",
    category: "Sejarah",
    views: 2850,
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    content: `
      <p>Pada tahun 2007, usaha dan bisnis CV. Surya Inti Gas mengalami perkembangan signifikan dengan melihat potensi prospek yang luar biasa. Untuk menunjang operasional yang semakin berkembang, kantor kami berpindah ke Komplek Pergudangan dan Industri "Meiko Abadi" Blok B 70, Ds. Wedi, Gedangan, Sidoarjo, Jawa Timur.</p>

      <h3>Perkembangan Bisnis</h3>
      <p>Pertumbuhan yang signifikan dalam bisnis kami memerlukan fasilitas yang lebih besar dan lebih strategis untuk mendukung operasional yang terus berkembang.</p>

      <h4>Relokasi ke Meiko Abadi</h4>
      <p>Pemindahan kantor ke Komplek Pergudangan dan Industri "Meiko Abadi" merupakan langkah strategis untuk:</p>
      <ul>
        <li>Fasilitas yang lebih luas untuk operasional</li>
        <li>Lokasi strategis di kawasan industri</li>
        <li>Akses yang lebih baik untuk distribusi</li>
        <li>Skalabilitas untuk pertumbuhan masa depan</li>
      </ul>

      <blockquote>
        "Pertumbuhan yang pesat memerlukan infrastruktur yang memadai. Relokasi tahun 2007 adalah bukti komitmen kami terhadap ekspansi."
      </blockquote>

      <h4>Dampak pada Operasional</h4>
      <p>Fasilitas baru di Meiko Abadi memungkinkan kami untuk meningkatkan kapasitas produksi dan distribusi, serta memberikan pelayanan yang lebih baik kepada pelanggan yang terus bertambah.</p>
    `,
    tags: ['Sejarah', 'Ekspansi', '2007', 'Relokasi', 'Meiko Abadi']
  },
  {
    id: 3,
    slug: 'sejarah-2016-relokasi-head-office',
    title: "Sejarah 2016: Relokasi Head Office ke Safe N Lock",
    date: "1 Januari 2016",
    author: "PT Surya Inti Gas",
    category: "Sejarah",
    views: 2450,
    featuredImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=600&fit=crop",
    content: `
      <p>Tahun 2016 menandai milestone penting dengan perpindahan kantor CV. Surya Inti Gas ke Komplek Pergudangan dan Industri "Safe N Lock" Blok V 1 No. 3223, 3225, 3232, 3233 Jl. Lingkar Timur KM 5.5, Ds. Rangkah Kidul, yang kemudian menjadi Head Office Sidoarjo hingga saat ini.</p>

      <h3>Milestone Penting</h3>
      <p>Relokasi ke Safe N Lock merupakan langkah strategis yang mendefinisikan posisi kami sebagai pemimpin dalam industri gas di wilayah Sidoarjo dan sekitarnya.</p>

      <h4>Fasilitas Head Office Baru</h4>
      <p>Komplek Pergudangan dan Industri "Safe N Lock" menyediakan:</p>
      <ul>
        <li>Fasilitas modern dan comprehensive</li>
        <li>Lokasi strategis di Jl. Lingkar Timur</li>
        <li>Multiple unit untuk berbagai divisi</li>
        <li>Infrastructure yang mendukung pertumbuhan</li>
      </ul>

      <blockquote>
        "Safe N Lock bukan hanya sekadar lokasi baru, tetapi representasi dari pertumbuhan dan maturity perusahaan kami."
      </blockquote>

      <h4>Transformasi Organisasi</h4>
      <p>Head Office baru ini menjadi simbol transformasi kami dari perusahaan kecil menjadi pemain utama dalam industri gas, dengan kapabilitas untuk melayani pelanggan di seluruh Indonesia.</p>
    `,
    tags: ['Sejarah', 'Relokasi', '2016', 'Head Office', 'Safe N Lock']
  },
  {
    id: 4,
    slug: 'sejarah-2017-pendirian-pt-surya-inti-gas',
    title: "Sejarah 2017: Pendirian PT. Surya Inti Gas dan Cabang Balikpapan",
    date: "1 Januari 2017",
    author: "PT Surya Inti Gas",
    category: "Sejarah",
    views: 3100,
    featuredImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
    content: `
      <p>Tahun 2017 merupakan tahun transformasi bagi perusahaan kami dengan berdirinya PT. Surya Inti Gas. Pada tahun yang sama, untuk pertama kalinya kami membuka cabang di Balikpapan, Kalimantan Timur, sebagai langkah strategis dalam ekspansi layanan ke seluruh Indonesia.</p>

      <h3>Transformasi Menjadi PT</h3>
      <p>Perubahan bentuk hukum dari CV menjadi PT merupakan langkah penting yang mencerminkan pertumbuhan dan komitmen kami untuk terus berkembang dan memberikan layanan yang lebih profesional.</p>

      <h4>Ekspansi ke Balikpapan</h4>
      <p>Pembukaan cabang pertama di Balikpapan, Kalimantan Timur adalah langkah strategis untuk:</p>
      <ul>
        <li>Ekspansi geografis ke luar Jawa</li>
        <li>Melayani industri di Kalimantan Timur</li>
        <li>Memperkuat jaringan distribusi nasional</li>
        <li>Mendekatkan layanan ke pelanggan regional</li>
      </ul>

      <blockquote>
        "Transformasi menjadi PT dan ekspansi ke Balikpapan adalah bukti komitmen kami untuk menjadi pemimpin industri gas di Indonesia."
      </blockquote>

      <h4>Dampak Nasional</h4>
      <p>Langkah ini menandai awal dari ekspansi nasional kami, dengan rencana untuk membuka lebih banyak cabang di kota-kota besar lainnya di seluruh Indonesia.</p>
    `,
    tags: ['Sejarah', 'Pendirian', '2017', 'PT Surya Inti Gas', 'Balikpapan', 'Ekspansi']
  }
];

// Main NewsDetail Component
function NewsDetail() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  // Find the article based on the slug
  const newsArticle = newsItems.find(item => item.slug === slug) || newsItems[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F5F5',
      fontFamily: 'DM Sans, system-ui, sans-serif'
    }}>
      <style>{`
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

        @media (max-width: 768px) {
          .news-header-responsive {
            padding: 160px 6vw 80px 6vw !important;
            margin-top: -80px !important;
            margin-bottom: 40px !important;
          }
          .news-detail-container {
            padding: 0 16px !important;
          }
          .news-detail-article {
            padding: 20px !important;
          }
          .featured-image-container {
            height: 250px !important;
          }
          .article-title {
            font-size: 20px !important;
          }
          .article-content {
            font-size: 15px !important;
          }
          .back-button {
            padding: 8px 16px !important;
            font-size: 0.875rem !important;
          }
        }
        @media (max-width: 480px) {
          .news-header-responsive {
            padding: 120px 6vw 60px 6vw !important;
            margin-top: -60px !important;
          }
        }

        @media (min-width: 1024px) {
          .news-detail-layout {
            grid-template-columns: 70% 30%;
          }
        }
        @media (max-width: 1023px) {
          .news-detail-layout {
            grid-template-columns: 1fr;
          }
          .sidebar-sticky {
            position: static !important;
          }
        }
        
        /* Article Content Typography */
        .article-content h2 {
          font-family: 'Barlow, system-ui, sans-serif';
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 32px 0 16px 0;
          line-height: 1.3;
        }
        
        .article-content h3 {
          font-family: 'Barlow, system-ui, sans-serif';
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 24px 0 12px 0;
          line-height: 1.4;
        }
        
        .article-content p {
          margin-bottom: 16px;
        }
        
        .article-content ul, .article-content ol {
          margin: 16px 0;
          padding-left: 24px;
        }
        
        .article-content li {
          margin-bottom: 8px;
        }
        
        .article-content blockquote {
          margin: 24px 0;
          padding: 16px 24px;
          background: #f8fafc;
          border-left: 4px solid #1e40af;
          font-style: italic;
          color: #475569;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }
        
        .article-content th, .article-content td {
          padding: 12px;
          border: 1px solid #e2e8f0;
          text-align: left;
        }
        
        .article-content th {
          background: #f8fafc;
          font-weight: 600;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .news-detail-layout {
            grid-template-columns: 1fr !important;
          }

          .sidebar-sticky {
            position: static !important;
          }

          .news-header-responsive {
            padding: 180px 6vw 80px 6vw !important;
          }
        }

        @media (max-width: 768px) {
          .news-header-responsive {
            padding: 140px 6vw 60px 6vw !important;
            margin-bottom: 40px !important;
          }

          .news-detail-article {
            padding: 20px !important;
          }

          .article-title {
            font-size: clamp(20px, 5vw, 28px) !important;
          }

          .article-content {
            font-size: 15px !important;
          }

          .article-content h2 {
            font-size: 20px !important;
          }

          .article-content h3 {
            font-size: 18px !important;
          }

          .article-content blockquote {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .news-header-responsive {
            padding: 120px 6vw 40px 6vw !important;
          }

          .news-detail-article {
            padding: 16px !important;
            border-radius: 8px !important;
          }

          .article-content {
            font-size: 14px !important;
            line-height: 1.6 !important;
          }

          .article-content h2 {
            font-size: 18px !important;
            margin: 24px 0 12px 0 !important;
          }

          .article-content h3 {
            font-size: 16px !important;
            margin: 20px 0 10px 0 !important;
          }

          .article-content ul, .article-content ol {
            padding-left: 20px !important;
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
        }}
        >
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
          <div className="news-detail-container" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <BackButton navigate={navigate} />
            
            <div className="news-detail-layout" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 300px',
              gap: '32px'
            }}>
          {/* Main Content */}
          <article className="news-detail-article" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h2 className="article-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              {newsArticle.title}
            </h2>
            
            <FeaturedImage src={newsArticle.featuredImage} alt={newsArticle.title} />
            <ArticleMetadata article={newsArticle} />
            
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: newsArticle.content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#334155',
                textAlign: 'justify',
                marginBottom: '32px'
              }}
            />
            
            <ShareButtons 
              title={newsArticle.title} 
              url={window.location.href} 
            />
            <Tags tags={newsArticle.tags} />
            <Navigation hasPrev={true} hasNext={true} />
            <RelatedNews newsItems={newsItems} />
          </article>
          
          {/* Sidebar */}
          <aside className="sidebar-sticky">
            <Sidebar newsItems={newsItems} />
          </aside>
        </div>
      </div>
        </div>
      </section>
    </div>
  );
}

export default NewsDetail;