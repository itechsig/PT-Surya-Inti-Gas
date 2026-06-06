'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────
export type ProductSpec = {
  icon: string;
  labelKey: string;
  valueKey: string;
};

export type ProductDetail = {
  colorKey: string;
  pressureKey: string;
  cylinderSizesKey: string;
  applicationsKey: string;
  safetyKey: string;
};

export type GasProduct = {
  id: number;
  titleKey: string;
  descKey: string;
  image: string;
  slug: string;
  specs: ProductSpec[];
  detail: ProductDetail;
  tag: string;
  accentColor: string;
  accentLight: string;
};

// ─── Data ─────────────────────────────────────────────────────
const gasProducts: GasProduct[] = [
  {
    id: 1,
    titleKey: 'product.products.oxygen.title',
    descKey:  'product.products.oxygen.description',
    image:    'https://plus.unsplash.com/premium_photo-1681426676206-0f2c02b48aff?w=900&auto=format&fit=crop&q=80',
    slug:     'gas-industri',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.products.oxygen.purity'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.products.oxygen.usage'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'       },
    ],
    detail: {
      colorKey:         'product.products.oxygen.color',
      pressureKey:      'product.products.oxygen.pressure',
      cylinderSizesKey: 'product.products.oxygen.cylinderSizes',
      applicationsKey:  'product.products.oxygen.applications',
      safetyKey:        'product.products.oxygen.safety',
    },
    tag:         'Industri',
    accentColor: '#1d4ed8',
    accentLight: '#dbeafe',
  },
  {
    id: 2,
    titleKey: 'product.products.nitrogen.title',
    descKey:  'product.products.nitrogen.description',
    image:    'https://media.istockphoto.com/id/638504688/photo/sample-of-sperm-frozen-tank.webp?a=1&b=1&s=612x612&w=0&k=20&c=cbLDA5dA3_RrIX3tuQysyAlPBeboUc4bYupJI5PokBE=',
    slug:     'gas-medis',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.products.nitrogen.purity'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.products.nitrogen.usage'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'         },
    ],
    detail: {
      colorKey:         'product.products.nitrogen.color',
      pressureKey:      'product.products.nitrogen.pressure',
      cylinderSizesKey: 'product.products.nitrogen.cylinderSizes',
      applicationsKey:  'product.products.nitrogen.applications',
      safetyKey:        'product.products.nitrogen.safety',
    },
    tag:         'Medis',
    accentColor: '#0d7c5f',
    accentLight: '#d1fae5',
  },
  {
    id: 3,
    titleKey: 'product.products.argon.title',
    descKey:  'product.products.argon.description',
    image:    'https://images.unsplash.com/photo-1683470156390-703e9313dab6?w=900&auto=format&fit=crop&q=80',
    slug:     'gas-campuran',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.products.argon.purity'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.products.argon.usage'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'      },
    ],
    detail: {
      colorKey:         'product.products.argon.color',
      pressureKey:      'product.products.argon.pressure',
      cylinderSizesKey: 'product.products.argon.cylinderSizes',
      applicationsKey:  'product.products.argon.applications',
      safetyKey:        'product.products.argon.safety',
    },
    tag:         'Pengelasan',
    accentColor: '#5b21b6',
    accentLight: '#ede9fe',
  },
  {
    id: 4,
    titleKey: 'product.products.acetylene.title',
    descKey:  'product.products.acetylene.description',
    image:    'https://images.unsplash.com/photo-1609361528925-2d177061540c?w=900&auto=format&fit=crop&q=80',
    slug:     'speciality-gas',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.products.acetylene.purity'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.products.acetylene.usage'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.products.acetylene.color',
      pressureKey:      'product.products.acetylene.pressure',
      cylinderSizesKey: 'product.products.acetylene.cylinderSizes',
      applicationsKey:  'product.products.acetylene.applications',
      safetyKey:        'product.products.acetylene.safety',
    },
    tag:         'Spesialiti',
    accentColor: '#92400e',
    accentLight: '#fef3c7',
  },
];

// ─── Props ─────────────────────────────────────────────────────
type HeroProductProps = {
  onViewAll: () => void;
};

// ─── Main Component ────────────────────────────────────────────
export function HeroProduct({ onViewAll }: HeroProductProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex,   setPrevIndex  ] = useState<number | null>(null);
  const [direction,   setDirection  ] = useState<'next' | 'prev'>('next');
  const [isVisible,   setIsVisible  ] = useState(false);
  const [isPaused,    setIsPaused   ] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredSpec, setHoveredSpec] = useState<number | null>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = gasProducts.length;

  // ── Intersection observer ──────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Navigate with direction tracking ──────────────────────
  const goTo = useCallback((nextIdx: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setPrevIndex(activeIndex);
    setActiveIndex(nextIdx);
    setTimeout(() => {
      setPrevIndex(null);
      setIsAnimating(false);
    }, 600);
  }, [activeIndex, isAnimating]);

  const handleNext = useCallback(() => goTo((activeIndex + 1) % total, 'next'), [goTo, activeIndex, total]);
  const handlePrev = useCallback(() => goTo((activeIndex - 1 + total) % total, 'prev'), [goTo, activeIndex, total]);

  // ── Auto-play ──────────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(handleNext, 5000);
    return () => clearInterval(id);
  }, [isPaused, handleNext]);

  // ── Swipe ──────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? handleNext() : handlePrev();
    touchStartX.current = null;
  };

  // ── Preload images ─────────────────────────────────────────
  useEffect(() => {
    gasProducts.forEach(p => { const img = new Image(); img.src = p.image; });
  }, []);

  const active = gasProducts[activeIndex];

  // ── Slide direction classes ────────────────────────────────
  const getSlideClass = (idx: number) => {
    if (idx === activeIndex)  return direction === 'next' ? 'slide-in-right' : 'slide-in-left';
    if (idx === prevIndex)    return direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    return 'hidden-slide';
  };

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden"
      style={{
        minHeight: '90svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 5vw 56px',
        background: '#f8fafc',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto w-full">

        {/* ══ Header ══ */}
        <div
          className="text-center mb-10"
          style={{
            opacity:    isVisible ? 1 : 0,
            transform:  isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-slate-300" />
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.22em]">
              {t('header.products')}
            </p>
            <div className="h-px w-8 bg-slate-300" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 leading-tight">
            {t('product.title')}
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>

        {/* ══ Magazine Split Layout ══ */}
        <div
          style={{
            opacity:    isVisible ? 1 : 0,
            transform:  isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              height: '580px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.12)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {/* ── Background image layer (all images stacked) ── */}
            {gasProducts.map((p, i) => (
              <div
                key={p.id}
                className={`absolute inset-0 ${getSlideClass(i)}`}
                style={{ zIndex: i === activeIndex ? 2 : i === prevIndex ? 1 : 0 }}
              >
                <img
                  src={p.image}
                  alt={t(p.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scale(1.04)' }}
                />
                {/* subtle dark overlay on right side only */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(105deg, rgba(10,15,30,0.82) 0%, rgba(10,15,30,0.65) 38%, rgba(10,15,30,0.10) 62%, rgba(10,15,30,0.04) 100%)',
                  }}
                />
              </div>
            ))}

            {/* ── Accent color top strip ── */}
            <div
              className="absolute top-0 left-0 right-0 h-1 transition-all duration-700"
              style={{ background: active.accentColor, zIndex: 10 }}
            />

            {/* ── Progress bar ── */}
            {!isPaused && (
              <div
                className="absolute top-1 left-0 right-0 h-0.5 overflow-hidden"
                style={{ zIndex: 11 }}
              >
                <div
                  key={`prog-${activeIndex}`}
                  style={{
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    animation: 'progress 5s linear forwards',
                  }}
                />
              </div>
            )}

            {/* ── LEFT: Info panel ── */}
            <div
              className="absolute left-0 top-0 bottom-0 flex flex-col justify-between"
              style={{ width: '48%', padding: '48px 44px', zIndex: 10 }}
            >
              {/* Top: tag + counter */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: active.accentColor,
                    color: '#fff',
                    transition: 'background-color 0.5s ease',
                  }}
                >
                  {active.tag}
                </span>
                <span className="text-white/40 text-sm font-medium tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>

              {/* Middle: product name + desc */}
              <div key={`text-${activeIndex}`} className="content-slide-in">
                <h3
                  className="font-bold text-white leading-tight mb-4"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
                >
                  {t(active.titleKey)}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed line-clamp-3 mb-8">
                  {t(active.descKey)}
                </p>

                {/* Specs — interactive hover cards */}
                <div className="flex flex-col gap-2">
                  {active.specs.map((spec, i) => (
                    <div
                      key={spec.labelKey}
                      onMouseEnter={() => setHoveredSpec(i)}
                      onMouseLeave={() => setHoveredSpec(null)}
                      className="flex items-center gap-3 rounded-xl cursor-default transition-all duration-200"
                      style={{
                        padding: '10px 14px',
                        background: hoveredSpec === i
                          ? 'rgba(255,255,255,0.18)'
                          : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${hoveredSpec === i ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.10)'}`,
                        transform: hoveredSpec === i ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      <span style={{ fontSize: '18px', minWidth: '24px' }}>{spec.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/45 uppercase tracking-wider font-semibold leading-none mb-0.5">
                          {t(spec.labelKey)}
                        </p>
                        <p className="text-[13px] text-white font-semibold truncate">
                          {t(spec.valueKey)}
                        </p>
                      </div>
                      {hoveredSpec === i && (
                        <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: dot nav + nav buttons */}
              <div className="flex items-center justify-between">
                {/* Dot nav */}
                <div className="flex gap-2 items-center">
                  {gasProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                      aria-label={`Produk ${i + 1}`}
                      className="rounded-full transition-all duration-300 hover:scale-125"
                      style={{
                        width:           i === activeIndex ? '28px' : '7px',
                        height:          '7px',
                        backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.30)',
                      }}
                    />
                  ))}
                </div>

                {/* Arrow buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Sebelumnya"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.20)',
                      color: '#fff',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Berikutnya"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: active.accentColor,
                      border: '1px solid transparent',
                      color: '#fff',
                      transition: 'background 0.5s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Thumbnail strip (vertical) ── */}
            <div
              className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
              style={{ zIndex: 10 }}
            >
              {gasProducts.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                  aria-label={t(p.titleKey)}
                  className="relative rounded-xl overflow-hidden transition-all duration-300 block"
                  style={{
                    width:   i === activeIndex ? '80px' : '64px',
                    height:  i === activeIndex ? '80px' : '64px',
                    opacity: i === activeIndex ? 1 : 0.55,
                    border:  i === activeIndex
                      ? `2px solid ${p.accentColor}`
                      : '2px solid rgba(255,255,255,0.15)',
                    transform: i === activeIndex ? 'scale(1)' : 'scale(0.9)',
                  }}
                  onMouseEnter={e => { if (i !== activeIndex) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={e => { if (i !== activeIndex) (e.currentTarget as HTMLElement).style.opacity = '0.55'; }}
                >
                  <img src={p.image} alt={t(p.titleKey)} className="w-full h-full object-cover" />
                  {i === activeIndex && (
                    <div
                      className="absolute inset-0 flex items-end p-1.5"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                    >
                      <span
                        className="text-[8px] font-bold uppercase text-white leading-none"
                        style={{ letterSpacing: '0.05em' }}
                      >
                        {p.tag}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Button Lihat Selengkapnya ══ */}
        <div
          className="flex justify-center mt-8"
          style={{
            opacity:    isVisible ? 1 : 0,
            transform:  isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          <button
            onClick={onViewAll}
            className="group flex items-center gap-2 px-10 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg"
            style={{
              backgroundColor: '#1a4fa0',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.opacity = '0.9';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            Lihat Selengkapnya
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      {/* ── Keyframes & utility animations ── */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* Magazine slide transitions */
        .slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .slide-in-left {
          animation: slideInLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .slide-out-left {
          animation: slideOutLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .slide-out-right {
          animation: slideOutRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hidden-slide {
          opacity: 0;
          pointer-events: none;
        }

        @keyframes slideInRight {
          from { transform: translateX(6%) scale(1.02); opacity: 0; }
          to   { transform: translateX(0)  scale(1);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-6%) scale(1.02); opacity: 0; }
          to   { transform: translateX(0)   scale(1);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0)   scale(1);    opacity: 1; }
          to   { transform: translateX(-4%) scale(0.99); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0)  scale(1);    opacity: 1; }
          to   { transform: translateX(4%) scale(0.99); opacity: 0; }
        }

        /* Info panel text entrance */
        .content-slide-in {
          animation: contentIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes contentIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.35s ease forwards;
        }
      `}</style>
    </section>
  );
}
