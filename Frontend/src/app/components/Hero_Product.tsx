'use client';

import { useTranslation } from 'react-i18next';
import { Package, Factory, Droplets, ArrowRight } from 'lucide-react';

import '../../styles/hero-product.css';

// ─── Types ────────────────────────────────────────────────────
export type ProductSpec = {
  icon: React.ReactNode;
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
  category: string;
};

// ─── Data ─────────────────────────────────────────────────────
const gasProducts: GasProduct[] = [
  {
    id: 1,
    titleKey: 'product.categories.highPressure',
    descKey:  'product.categories.highPressureDesc',
    image:    '/images/products/tabung.jpg',
    slug:     'high-pressure-gas',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'       },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'High Pressure',
  },
  {
    id: 2,
    titleKey: 'product.categories.regulator',
    descKey:  'product.categories.regulatorDesc',
    image:    '/images/products/tabung.jpg',
    slug:     'regulator-valves',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'         },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Regulator',
  },
  {
    id: 3,
    titleKey: 'product.categories.industrialMedical',
    descKey:  'product.categories.industrialMedicalDesc',
    image:    '/images/products/tabung.jpg',
    slug:     'industrial-medical-gas',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'      },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Industrial Medical',
  },
  {
    id: 4,
    titleKey: 'product.categories.specialityMixed',
    descKey:  'product.categories.specialityMixedDesc',
    image:    '/images/products/tabung.jpg',
    slug:     'speciality-mixed-gas',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Speciality Mixed',
  },
  {
    id: 5,
    titleKey: 'product.categories.equipment',
    descKey:  'product.categories.equipmentDesc',
    image:    '/images/products/sig-office.jpg',
    slug:     'related-equipment',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Equipment',
  },
  {
    id: 6,
    titleKey: 'product.categories.assistSupply',
    descKey:  'product.categories.assistSupplyDesc',
    image:    '/images/products/sig-office.jpg',
    slug:     'assist-gas-supply',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Assist Supply',
  },
  {
    id: 7,
    titleKey: 'product.categories.cyrogenic',
    descKey:  'product.categories.cyrogenicDesc',
    image:    '/images/products/tabung.jpg',
    slug:     'cyrogenic-container',
    specs: [
      { icon: <Droplets size={16} />, labelKey: 'product.details.purity',       valueKey: 'product.details.available'  },
      { icon: <Factory size={16} />,   labelKey: 'product.details.usage',        valueKey: 'product.details.available'   },
      { icon: <Package size={16} />,   labelKey: 'product.details.availability', valueKey: 'product.details.available'          },
    ],
    detail: {
      colorKey:         'product.details.color',
      pressureKey:      'product.details.pressure',
      cylinderSizesKey: 'product.details.cylinderSize',
      applicationsKey:  'product.details.applications',
      safetyKey:        'product.details.safety',
    },
    category: 'Cyrogenic',
  },
];

// ─── Props ─────────────────────────────────────────────────────
type HeroProductProps = {
  onViewAll: () => void;
};

// ─── Main Component ────────────────────────────────────────────
export function HeroProduct({ onViewAll }: HeroProductProps) {
  const { t } = useTranslation();

  return (
    <section className="product-hero-section">
      {/* Hero Section - Blue Theme Matching Hero.tsx */}
      <div className="product-hero">
        <div className="hero-background" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>{t('product.title')}</h1>
          <p>{t('hero.description')}</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span>Standar Kualitas Internasional</span>
            </div>
            <div className="feature-item">
              <span>Teknologi Terkini</span>
            </div>
            <div className="feature-item">
              <span>Produk Komprehensif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="product-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Kategori Produk Unggulan</h2>
            <p>Solusi gas industri berkualitas tinggi untuk berbagai kebutuhan bisnis</p>
          </div>

          <div className="product-grid">
            {gasProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={t(product.titleKey)} />
                  <span className="product-category">{product.category}</span>
                </div>

                <div className="product-details">
                  <h3>{t(product.titleKey)}</h3>
                  <p>{t(product.descKey)}</p>

                  <div className="product-specs">
                    {product.specs.map((spec) => (
                      <div key={spec.labelKey} className="spec">
                        <div className="spec-icon">{spec.icon}</div>
                        <div className="spec-info">
                          <span className="spec-label">{t(spec.labelKey)}</span>
                          <span className="spec-value">{t(spec.valueKey)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="product-cta">
            <button onClick={onViewAll}>
              Lihat Semua Produk
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
