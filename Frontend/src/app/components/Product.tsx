'use client';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subProducts, layananList, Service } from './Product/data';
import type { Product } from './Product/data';

type StepType = 'produk' | 'layanan';
type ProductType = Product;
type LayananType = typeof layananList[0];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .product-root {
    --navy  : #0C2D5E;
    --blue  : #1565C0;
    --sky   : #29ABE2;
    --ice   : #EFF6FF;
    --muted : #64748B;
    --white : #FFFFFF;
    --border: #E5E7EB;
    --ff-d  : 'Barlow', system-ui, sans-serif;
    --ff-b  : 'DM Sans', system-ui, sans-serif;
    font-family: var(--ff-b);
  }

  /* ── Breadcrumb / nav ── */
  .pr-nav {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.83rem;
    color: var(--muted);
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .pr-nav a, .pr-nav button {
    background: none; border: none; padding: 0;
    color: var(--muted); font-size: 0.83rem;
    text-decoration: none; cursor: pointer;
    transition: color 0.2s;
  }
  .pr-nav a:hover, .pr-nav button:hover { color: var(--blue); }
  .pr-nav .sep { color: #D1D5DB; }
  .pr-nav .active { color: var(--navy); font-weight: 600; }

  /* ── Split layout (list + detail) ── */
  .pr-split-page {
    background: white;
    min-height: 100vh;
    padding: 40px 5vw;
  }
  .pr-split-page-header {
    margin-bottom: 32px;
  }
  .pr-split-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    min-height: 600px;
  }
  @media (max-width: 900px) {
    .pr-split-layout {
      grid-template-columns: 1fr;
    }
    .pr-detail-panel {
      border-left: none !important;
      border-top: 1px solid var(--border);
    }
  }

  /* ── Left panel: list ── */
  .pr-list-panel {
    background: #FAFAFA;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    max-height: 700px;
  }
  .pr-list-search {
    padding: 16px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: #FAFAFA;
    z-index: 1;
  }
  .pr-list-search input {
    width: 100%;
    padding: 9px 14px 9px 36px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: var(--ff-b);
    color: var(--navy);
    background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
  }
  .pr-list-search input:focus { border-color: var(--blue); }

  .pr-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
    background: white;
  }
  .pr-list-item:last-child { border-bottom: none; }
  .pr-list-item:hover { background: var(--ice); }
  .pr-list-item.active {
    background: var(--ice);
    border-left: 3px solid var(--navy);
  }
  .pr-list-item-thumb {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background: #F3F4F6;
  }
  .pr-list-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .pr-list-item-info { flex: 1; min-width: 0; }
  .pr-list-item-name {
    font-family: var(--ff-d);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--navy);
    margin: 0 0 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pr-list-item-sub {
    font-size: 0.78rem;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pr-list-item-arrow {
    color: #CBD5E1;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .pr-list-item.active .pr-list-item-arrow { color: var(--navy); }
  .pr-list-count {
    padding: 10px 16px;
    font-size: 0.78rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: #FAFAFA;
  }

  /* ── Right panel: detail ── */
  .pr-detail-panel {
    background: white;
    overflow-y: auto;
    max-height: 700px;
  }
  .pr-detail-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    gap: 12px;
    padding: 40px;
    text-align: center;
    min-height: 400px;
  }
  .pr-detail-empty-icon {
    width: 56px; height: 56px;
    background: #F1F5F9;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
  }
  .pr-detail-empty-text { font-size: 0.9rem; color: var(--muted); }

  .pr-detail-hero-img {
    width: 100%;
    height: 260px;
    overflow: hidden;
  }
  .pr-detail-hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .pr-detail-body { padding: 28px 32px; }
  .pr-detail-title {
    font-family: var(--ff-d);
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--navy);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .pr-detail-subtitle {
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0 0 20px;
  }
  .pr-detail-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }
  .pr-detail-desc {
    font-size: 0.95rem;
    color: #374151;
    line-height: 1.7;
    margin: 0 0 24px;
  }

  /* specs row */
  .pr-detail-specs {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .pr-detail-spec {
    flex: 1;
    min-width: 100px;
    background: #F9FAFB;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    text-align: center;
  }
  .pr-detail-spec-label {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin: 0 0 4px;
  }
  .pr-detail-spec-value {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--navy);
  }

  /* detail rows */
  .pr-detail-row {
    display: flex;
    gap: 0;
    margin-bottom: 14px;
    font-size: 0.875rem;
  }
  .pr-detail-row-label {
    width: 130px;
    flex-shrink: 0;
    color: var(--muted);
    font-weight: 500;
  }
  .pr-detail-row-value {
    flex: 1;
    color: var(--navy);
    line-height: 1.55;
  }

  /* tags */
  .pr-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pr-tag {
    padding: 3px 10px;
    background: #F1F5F9;
    border-radius: 4px;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--navy);
  }

  /* safety warning */
  .pr-safety {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 24px;
    font-size: 0.875rem;
    color: #B91C1C;
  }
  .pr-safety-icon { flex-shrink: 0; margin-top: 1px; }

  /* apps / features list */
  .pr-apps-list { list-style: none; padding: 0; margin: 0; }
  .pr-apps-list li {
    padding: 3px 0;
    font-size: 0.875rem;
    color: var(--navy);
  }
  .pr-apps-list li::before {
    content: '•';
    margin-right: 8px;
    color: var(--sky);
  }

  /* service feature list */
  .pr-feature-list { list-style: none; padding: 0; margin: 8px 0 0; }
  .pr-feature-list li {
    font-size: 0.875rem;
    color: var(--navy);
    padding: 4px 0;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .pr-feature-check {
    color: #059669;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  /* CTA button */
  .pr-cta-btn {
    display: inline-block;
    padding: 11px 28px;
    background: var(--navy);
    color: white;
    font-family: var(--ff-d);
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
  }
  .pr-cta-btn:hover { background: var(--blue); }

  /* back button */
  .pr-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: white;
    color: var(--navy);
    font-family: var(--ff-d);
    font-size: 0.85rem;
    font-weight: 600;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 24px;
  }
  .pr-back-btn:hover { border-color: var(--navy); background: #F8FAFC; }

  .pr-section-title {
    font-family: var(--ff-d);
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 700;
    color: var(--navy);
    margin: 0 0 4px;
  }
  .pr-section-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0;
  }
`;

// ─── Product Detail Panel ─────────────────────────────────────
function ProductDetail({ product }: { product: ProductType }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="pr-detail-hero-img">
        <img src={product.image} alt={t(product.titleKey)} />
      </div>
      <div className="pr-detail-body">
        <h3 className="pr-detail-title">{t(product.titleKey)}</h3>
        <p className="pr-detail-subtitle">{t(product.descKey)}</p>
        <div className="pr-detail-divider" />

        {product.specs?.length > 0 && (
          <div className="pr-detail-specs">
            {product.specs.map((s) => (
              <div key={s.labelKey} className="pr-detail-spec">
                <p className="pr-detail-spec-label">{t(s.labelKey)}</p>
                <p className="pr-detail-spec-value">{t(s.valueKey)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="pr-detail-row">
          <span className="pr-detail-row-label">{t('product.details.color')}</span>
          <span className="pr-detail-row-value">{t(product.detail.colorKey)}</span>
        </div>
        <div className="pr-detail-row">
          <span className="pr-detail-row-label">{t('product.details.pressure')}</span>
          <span className="pr-detail-row-value">{t(product.detail.pressureKey)}</span>
        </div>
        <div className="pr-detail-row">
          <span className="pr-detail-row-label">{t('product.details.cylinderSize')}</span>
          <span className="pr-detail-row-value">
            <div className="pr-tags">
              {(t(product.detail.cylinderSizesKey, { returnObjects: true }) as string[]).map((u, i) => (
                <span key={i} className="pr-tag">{u}</span>
              ))}
            </div>
          </span>
        </div>
        <div className="pr-detail-row">
          <span className="pr-detail-row-label">{t('product.details.applications')}</span>
          <span className="pr-detail-row-value">
            <ul className="pr-apps-list">
              {(t(product.detail.applicationsKey, { returnObjects: true }) as string[]).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </span>
        </div>

        <div className="pr-detail-divider" />

        <div className="pr-safety">
          <span className="pr-safety-icon">⚠️</span>
          <div>
            <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('product.details.safety')}
            </p>
            <p style={{ margin: 0 }}>{t(product.detail.safetyKey)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Service Detail Panel ─────────────────────────────────────
type LayananType2 = typeof layananList[0];
function ServiceDetail({ item }: { item: LayananType2 }) {
  const { t } = useTranslation();
  const features = [
    'Layanan profesional dan terpercaya',
    'Tim ahli berpengalaman',
    'Dukungan teknis penuh',
    'Garansi kualitas pekerjaan',
  ];
  return (
    <>
      <div className="pr-detail-hero-img">
        <img src={item.image} alt={t(item.titleKey)} />
      </div>
      <div className="pr-detail-body">
        <h3 className="pr-detail-title">{t(item.titleKey)}</h3>
        <p className="pr-detail-subtitle" style={{ color: item.color }}>{t(item.descKey)}</p>
        <div className="pr-detail-divider" />
        <p className="pr-detail-desc">{t(item.descKey)}</p>
        <div className="pr-detail-row">
          <span className="pr-detail-row-label">Keunggulan</span>
          <span className="pr-detail-row-value">
            <ul className="pr-feature-list">
              {features.map((f, i) => (
                <li key={i}>
                  <span className="pr-feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </span>
        </div>
      </div>
    </>
  );
}

// ─── Split Page: Products ─────────────────────────────────────
function ProductSplitPage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ProductType | null>(null);
  const [search, setSearch] = useState('');

  const filtered = subProducts.filter((p: ProductType) =>
    t(p.titleKey).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pr-split-page">
      <button className="pr-back-btn" onClick={onBack}>
        ← {t('common.cancel')}
      </button>

      <div className="pr-split-page-header">
        <h2 className="pr-section-title">{t('product.title')}</h2>
        <p className="pr-section-sub">{t('product.description')}</p>
      </div>

      <div className="pr-split-layout">
        {/* Left: list */}
        <div className="pr-list-panel">
          <div className="pr-list-search">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="pr-list-count">{filtered.length} produk</div>
          {filtered.map((p: ProductType) => (
            <div
              key={p.id}
              className={`pr-list-item${selected?.id === p.id ? ' active' : ''}`}
              onClick={() => setSelected(p)}
            >
              <div className="pr-list-item-thumb">
                <img src={p.image} alt={t(p.titleKey)} />
              </div>
              <div className="pr-list-item-info">
                <p className="pr-list-item-name">{t(p.titleKey)}</p>
                <p className="pr-list-item-sub">{t(p.descKey)}</p>
              </div>
              <span className="pr-list-item-arrow">›</span>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div className="pr-detail-panel">
          {selected ? (
            <ProductDetail product={selected} />
          ) : (
            <div className="pr-detail-empty">
              <div className="pr-detail-empty-icon">📦</div>
              <p className="pr-detail-empty-text">Pilih produk untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Split Page: Services ─────────────────────────────────────
function ServiceSplitPage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LayananType | null>(null);

  return (
    <div className="pr-split-page">
      <button className="pr-back-btn" onClick={onBack}>
        ← {t('common.cancel')}
      </button>

      <div className="pr-split-page-header">
        <h2 className="pr-section-title">{t('product.services.title')}</h2>
        <p className="pr-section-sub">{t('product.description')}</p>
      </div>

      <div className="pr-split-layout">
        {/* Left: list */}
        <div className="pr-list-panel">
          <div className="pr-list-count">{layananList.length} layanan</div>
          {layananList.map((item: Service) => (
            <div
              key={item.id}
              className={`pr-list-item${selected?.id === item.id ? ' active' : ''}`}
              onClick={() => setSelected(item)}
            >
              <div className="pr-list-item-thumb">
                <img src={item.image} alt={t(item.titleKey)} />
              </div>
              <div className="pr-list-item-info">
                <p className="pr-list-item-name">{t(item.titleKey)}</p>
                <p className="pr-list-item-sub">{t(item.descKey)}</p>
              </div>
              <span className="pr-list-item-arrow">›</span>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div className="pr-detail-panel">
          {selected ? (
            <ServiceDetail item={selected} />
          ) : (
            <div className="pr-detail-empty">
              <div className="pr-detail-empty-icon">🛠️</div>
              <p className="pr-detail-empty-text">Pilih layanan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState<StepType>('produk');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step') as StepType | null;
    if (stepParam === 'produk' || stepParam === 'layanan') {
      setStep(stepParam);
    }
  }, [location.search]);

  return (
    <div id="produk" className="product-root">
      <style>{css}</style>

      {/* ══ STEP 1: PRODUCTS (split layout) ══ */}
      {step === 'produk' && (
        <ProductSplitPage onBack={() => navigate('/')} />
      )}

      {/* ══ STEP 2: SERVICES (split layout) ══ */}
      {step === 'layanan' && (
        <ServiceSplitPage onBack={() => navigate('/')} />
      )}
    </div>
  );
}
