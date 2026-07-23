import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

/* ═══════════════════════════════════════════════════════════════
   INDUSTRIES SERVED.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Yingde, Samator, Linde
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .industries-corporate {
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
  }

  /* ── Corporate Industries Section ── */
  .industries-section {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .industries-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Header ── */
  .industries-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .industries-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--navy-dark);
    margin: 0 0 24px;
  }

  .industries-title .accent {
    color: var(--navy-dark);
  }

  .industries-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: var(--slate-600);
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Corporate Industries Carousel ── */
  .industries-carousel-wrapper {
    position: relative;
    margin: 0 -6vw;
    padding: 0 6vw;
  }

  .industries-carousel {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 20px 4px;
    scrollbar-width: none;
    contain: layout;
  }

  .industries-carousel::-webkit-scrollbar {
    display: none;
  }

  .industry-card {
    flex: 0 0 calc(33.333% - 16px);
    background: var(--white);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--slate-200);
    transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
    scroll-snap-align: start;
    position: relative;
    will-change: transform;
  }

  .industry-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.12);
    border-color: var(--sky-light);
  }

  .industry-card:active {
    transform: translateY(-3px);
  }

  .industry-card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
    background: var(--slate-100);
  }

  .industry-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .industry-card-image .skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--slate-200) 25%, var(--slate-100) 50%, var(--slate-200) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .industry-card-content {
    padding: 24px;
    text-align: center;
  }

  .industry-title {
    font-family: var(--ff-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0;
    letter-spacing: -0.01em;
  }

  /* ── Navigation Buttons ── */
  .carousel-nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
  }

  .carousel-nav-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--white);
    border: 2px solid var(--slate-200);
    color: var(--slate-700);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s var(--ease);
  }

  .carousel-nav-button:hover {
    background: var(--blue);
    border-color: var(--blue);
    color: var(--white);
    transform: scale(1.1);
  }

  .carousel-nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .carousel-nav-button:disabled:hover {
    background: var(--white);
    border-color: var(--slate-200);
    color: var(--slate-700);
    transform: none;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1200px) {
    .industry-card {
      flex: 0 0 calc(50% - 12px);
    }
  }

  @media (max-width: 768px) {
    .industries-section {
      padding: 80px 6vw;
    }

    .industries-header {
      margin-bottom: 48px;
    }

    .industry-card {
      flex: 0 0 calc(100% - 0px);
    }

    .industry-card-image {
      height: 180px;
    }

    .carousel-nav-button {
      width: 48px;
      height: 48px;
    }
  }
`;

type Industry = {
  id: string;
  title: string;
  image: string;
  imageSrcSet?: string;
  width?: number;
  height?: number;
};

export function IndustriesServed() {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const industries: Industry[] = [
    {
      id: 'manufaktur',
      title: t('industriesServed.industries.manufaktur'),
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    },
    {
      id: 'kesehatan',
      title: t('industriesServed.industries.kesehatan'),
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    },
    {
      id: 'makanan-minuman',
      title: t('industriesServed.industries.makanan-minuman'),
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    },
    {
      id: 'minyak-gas',
      title: t('industriesServed.industries.minyak-gas'),
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    },
    {
      id: 'energi',
      title: t('industriesServed.industries.energi'),
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    },
    {
      id: 'konstruksi',
      title: t('industriesServed.industries.konstruksi'),
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      imageSrcSet: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80 800w',
      width: 800,
      height: 533
    }
  ];

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'auto' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'auto' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    let timeoutId: number;
    const carousel = carouselRef.current;
    if (carousel) {
      const handleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScrollButtons, 100);
      };
      carousel.addEventListener('scroll', handleScroll);
      return () => {
        clearTimeout(timeoutId);
        carousel.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="industries-corporate">
      <style>{css}</style>

      <section className="industries-section" id="industries">
        <div className="industries-container">

          {/* Corporate Header */}
          <div className="industries-header">
            <h2 className="industries-title">
              {t('industriesServed.title')}
            </h2>
            <p className="industries-subtitle">
              {t('industriesServed.subtitle')}
            </p>
          </div>

          {/* Corporate Industries Carousel */}
          <div className="industries-carousel-wrapper">
            <div
              ref={carouselRef}
              className="industries-carousel"
            >
              {industries.map((industry) => (
                <div key={industry.id} className="industry-card">
                  <div className="industry-card-image">
                    <img
                      src={industry.image}
                      srcSet={industry.imageSrcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={industry.title}
                      width={industry.width}
                      height={industry.height}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.background = '#e2e8f0';
                      }}
                    />
                  </div>
                  <div className="industry-card-content">
                    <h3 className="industry-title">
                      {industry.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="carousel-nav">
              <button
                className="carousel-nav-button"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label={t('hero.previousSlide')}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="carousel-nav-button"
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label={t('hero.nextSlide')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}