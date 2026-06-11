'use client';

import { useState, useEffect, useRef } from 'react';
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
};

// ─── Data ─────────────────────────────────────────────────────
const gasProducts: GasProduct[] = [
  {
    id: 1,
    titleKey: 'product.categories.highPressure',
    descKey:  'product.categories.highPressureDesc',
    image:    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&auto=format&fit=crop&q=80',
    slug:     'high-pressure-gas',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'       },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'High Pressure',
    accentColor: '#1d4ed8',
  },
  {
    id: 2,
    titleKey: 'product.categories.regulator',
    descKey:  'product.categories.regulatorDesc',
    image:    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=900&auto=format&fit=crop&q=80',
    slug:     'regulator-valves',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'         },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Regulator',
    accentColor: '#0d7c5f',
  },
  {
    id: 3,
    titleKey: 'product.categories.industrialMedical',
    descKey:  'product.categories.industrialMedicalDesc',
    image:    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=900&auto=format&fit=crop&q=80',
    slug:     'industrial-medical-gas',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'      },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Industrial',
    accentColor: '#5b21b6',
  },
  {
    id: 4,
    titleKey: 'product.categories.specialityMixed',
    descKey:  'product.categories.specialityMixedDesc',
    image:    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80',
    slug:     'speciality-mixed-gas',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Speciality',
    accentColor: '#92400e',
  },
  {
    id: 5,
    titleKey: 'product.categories.equipment',
    descKey:  'product.categories.equipmentDesc',
    image:    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&auto=format&fit=crop&q=80',
    slug:     'related-equipment',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Equipment',
    accentColor: '#0891b2',
  },
  {
    id: 6,
    titleKey: 'product.categories.assistSupply',
    descKey:  'product.categories.assistSupplyDesc',
    image:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
    slug:     'assist-gas-supply',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Supply',
    accentColor: '#0ea5e9',
  },
  {
    id: 7,
    titleKey: 'product.categories.cyrogenic',
    descKey:  'product.categories.cyrogenicDesc',
    image:    'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=900&auto=format&fit=crop&q=80',
    slug:     'cyrogenic-container',
    specs: [
      { icon: '💧', labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: '🏭', labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: '📦', labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    tag:         'Cyrogenic',
    accentColor: '#6366f1',
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
  const [isVisible,   setIsVisible  ] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const total      = gasProducts.length;
  const handlePrev = () => setActiveIndex(i => (i - 1 + total) % total);
  const handleNext = () => setActiveIndex(i => (i + 1) % total);
  const active     = gasProducts[activeIndex];
  const prevIdx    = (activeIndex - 1 + total) % total;
  const nextIdx    = (activeIndex + 1) % total;

  return (
    <section ref={sectionRef} className="w-full bg-white overflow-hidden" style={{ minHeight: '85svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px 5vw 56px' }}>
      <div className="max-w-7xl mx-auto w-full">

        {/* ══ Header ══ */}
        <div
          className={`text-center mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
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

        {/* ══ Showcase ══ */}
        <div
          className={`relative flex items-center justify-center gap-4 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Nav Left */}
          <button
            onClick={handlePrev}
            aria-label="Sebelumnya"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md
                       flex items-center justify-center text-slate-500
                       hover:text-slate-800 hover:border-slate-400 transition-all duration-200 z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Side card — prev */}
          <div
            onClick={handlePrev}
            className="hidden lg:block flex-shrink-0 cursor-pointer"
            style={{ width: '240px' }}
          >
            <div
              className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm
                         opacity-50 scale-95 hover:opacity-70 hover:scale-[0.97]
                         transition-all duration-400"
              style={{ height: '420px' }}
            >
              <img
                src={gasProducts[prevIdx].image}
                alt={t(gasProducts[prevIdx].titleKey)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: gasProducts[prevIdx].accentColor }}
                >
                  {gasProducts[prevIdx].tag}
                </span>
              </div>
              <div className="absolute bottom-5 left-4 right-4">
                <p className="text-white font-bold text-lg leading-snug">
                  {t(gasProducts[prevIdx].titleKey)}
                </p>
              </div>
            </div>
          </div>

          {/* Center card — large */}
          <div className="flex-1 max-w-2xl flex-shrink-0">
            <div
              className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl w-full"
              style={{ height: '580px' }}
            >
              <img
                key={active.id}
                src={active.image}
                alt={t(active.titleKey)}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Badge top-left */}
              <div className="absolute top-6 left-6">
                <span
                  className="px-4 py-1.5 rounded text-xs font-bold text-white uppercase tracking-widest shadow"
                  style={{ backgroundColor: active.accentColor }}
                >
                  {active.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 pt-4">
                <h3 className="text-white text-3xl font-bold mb-4 drop-shadow leading-tight">
                  {t(active.titleKey)}
                </h3>

                {/* Specs strip */}
                <div
                  className="flex rounded-xl overflow-hidden border border-white/15 mb-4"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                  {active.specs.map((spec, i) => (
                    <div
                      key={spec.labelKey}
                      className={`flex-1 flex flex-col items-center py-3 px-3 gap-1.5 ${
                        i < active.specs.length - 1 ? 'border-r border-white/10' : ''
                      }`}
                    >
                      <span className="text-xl">{spec.icon}</span>
                      <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider text-center">
                        {t(spec.labelKey)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-white/75 text-sm leading-relaxed line-clamp-2 mb-5">
                  {t(active.descKey)}
                </p>

                {/* Dots + CTA row */}
                <div className="flex items-center justify-center">
                  <div className="flex gap-2">
                    {gasProducts.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Produk ${i + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width:           i === activeIndex ? '24px' : '7px',
                          height:          '7px',
                          backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side card — next */}
          <div
            onClick={handleNext}
            className="hidden lg:block flex-shrink-0 cursor-pointer"
            style={{ width: '240px' }}
          >
            <div
              className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm
                         opacity-50 scale-95 hover:opacity-70 hover:scale-[0.97]
                         transition-all duration-400"
              style={{ height: '420px' }}
            >
              <img
                src={gasProducts[nextIdx].image}
                alt={t(gasProducts[nextIdx].titleKey)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: gasProducts[nextIdx].accentColor }}
                >
                  {gasProducts[nextIdx].tag}
                </span>
              </div>
              <div className="absolute bottom-5 left-4 right-4">
                <p className="text-white font-bold text-lg leading-snug">
                  {t(gasProducts[nextIdx].titleKey)}
                </p>
              </div>
            </div>
          </div>

          {/* Nav Right */}
          <button
            onClick={handleNext}
            aria-label="Berikutnya"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md
                       flex items-center justify-center text-slate-500
                       hover:text-slate-800 hover:border-slate-400 transition-all duration-200 z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ══ Button Lihat Selengkapnya — di bawah card ══ */}
        <div
          className={`flex justify-center mt-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={onViewAll}
            className="px-10 py-3.5 rounded-xl text-sm font-semibold text-white
                       shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: active.accentColor }}
          >
            Lihat Selengkapnya
          </button>
        </div>

      </div>
    </section>
  );
}
