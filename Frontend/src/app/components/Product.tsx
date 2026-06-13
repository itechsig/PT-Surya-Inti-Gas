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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .product-root {
    --navy  : #0C2D5E;
    --blue  : #1565C0;
    --sky   : #29ABE2;
    --ice   : #EFF6FF;
    --muted : #6B7280;
    --white : #FFFFFF;
    --border: #E5E7EB;
    --bg    : #F9FAFB;
    --ff    : 'Inter', system-ui, sans-serif;
    font-family: var(--ff);
    background: #fff;
    min-height: 100vh;
  }
  .product-root .pr-search-wrap:focus,
  .product-root .pr-search-wrap:focus-within,
  .product-root .pr-search-wrap:focus-visible,
  .product-root .pr-search-input:focus,
  .product-root .pr-search-input:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }

  /* ── Page wrapper ── */
  .pr-page {
    padding: 100px 5vw 80px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .pr-page-header {
    text-align: center;
    margin-bottom: 48px;
  }
  .pr-page-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    color: var(--navy);
    margin: 0 0 10px;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .pr-page-sub {
    font-size: 0.95rem;
    color: var(--muted);
    margin: 0 0 32px;
    text-align: center !important;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── Search bar ── */
  .pr-search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 11px 22px;
    max-width: 380px;
    margin: 0 auto;
    background: #fff;
    transition: none;
  }
  .pr-search-wrap:focus-within {
    border-color: var(--border);
    outline: none;
    box-shadow: none;
  }
  .pr-search-input {
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-family: var(--ff);
    color: var(--navy);
    background: transparent;
    width: 100%;
  }
  .pr-search-input:focus {
    outline: none;
    box-shadow: none;
  }
  .pr-search-input::placeholder { color: #9CA3AF; }

  /* ── Tab navigation ── */
  .pr-tabs {
    display: flex;
    border-bottom: 1.5px solid var(--border);
    margin-bottom: 32px;
    gap: 0;
  }
  .pr-tab {
    padding: 12px 28px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: none;
    font-family: var(--ff);
    border-bottom: 2px solid transparent;
    margin-bottom: -1.5px;
    transition: color 0.2s, border-color 0.2s;
    letter-spacing: -0.01em;
  }
  .pr-tab:hover { color: var(--navy); }
  .pr-tab.active {
    color: var(--navy);
    font-weight: 600;
    border-bottom-color: var(--navy);
  }

  /* ── Count label ── */
  .pr-count {
    font-size: 0.82rem;
    color: var(--muted);
    margin-bottom: 24px;
  }

  /* ── Product grid ── */
  .pr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 28px;
  }
  @media (max-width: 640px) {
    .pr-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }
  @media (max-width: 400px) {
    .pr-grid { grid-template-columns: 1fr; }
  }

  /* ── Product card ── */
  .pr-card {
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #EBEBEB;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .pr-card:hover {
    border-color: #D0D5DD;
    transform: translateY(-2px);
  }
  .pr-card-img {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pr-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }
  .pr-card:hover .pr-card-img img { transform: scale(1.04); }
  .pr-card-img-placeholder {
    width: 100%;
    height: 100%;
    background: #EEF2FF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: #A5B4FC;
  }
  .pr-card-body {
    padding: 16px 18px 20px;
  }
  .pr-card-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .pr-card-meta {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0 0 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pr-card-btn {
    width: 100%;
    padding: 9px 0;
    background: var(--navy);
    color: #fff;
    border: none;
    border-radius: 7px;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--ff);
    transition: background 0.18s;
    letter-spacing: 0.01em;
  }
  .pr-card-btn:hover { background: var(--blue); }

  /* ── Service card (same grid, different CTA style) ── */
  .pr-svc-card {
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #EBEBEB;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
  }
  .pr-svc-card:hover {
    border-color: #D0D5DD;
    transform: translateY(-2px);
  }
  .pr-svc-card-img {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: var(--bg);
  }
  .pr-svc-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }
  .pr-svc-card:hover .pr-svc-card-img img { transform: scale(1.04); }
  .pr-svc-card-body { padding: 16px 18px 20px; }
  .pr-svc-card-icon {
    width: 38px; height: 38px;
    border-radius: 9px;
    background: var(--ice);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
  .pr-svc-card-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px;
  }
  .pr-svc-card-desc {
    font-size: 0.8rem;
    color: var(--muted);
    margin: 0 0 14px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pr-svc-card-btn {
    width: 100%;
    padding: 9px 0;
    background: var(--navy);
    color: #fff;
    border: none;
    border-radius: 7px;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--ff);
    transition: background 0.18s;
    letter-spacing: 0.01em;
  }
  .pr-svc-card-btn:hover { background: var(--blue); }

  /* ── Modal overlay (product/service detail) ── */
  .pr-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
    animation: pr-fade-in 0.18s ease;
  }
  @media (min-width: 640px) {
    .pr-modal-overlay {
      align-items: center;
      padding: 24px;
    }
  }
  @keyframes pr-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .pr-modal {
    background: #fff;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
    animation: pr-slide-up 0.22s ease;
    position: relative;
  }
  @media (min-width: 640px) {
    .pr-modal {
      border-radius: 16px;
    }
  }
  @keyframes pr-slide-up { from { transform: translateY(32px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .pr-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    border: 2px solid rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    color: #333;
    font-weight: bold;
    z-index: 10;
    transition: background 0.15s, border-color 0.15s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .pr-modal-close:hover { 
    background: rgba(255,255,255,1); 
    border-color: rgba(0,0,0,0.2);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .pr-modal-hero {
    width: 100%;
    height: 260px;
    overflow: hidden;
  }
  .pr-modal-hero img { width: 100%; height: 100%; object-fit: cover; }
  .pr-modal-body { padding: 28px 32px 36px; }
  .pr-modal-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--navy);
    margin: 0 0 6px;
    letter-spacing: -0.02em;
  }
  .pr-modal-subtitle {
    font-size: 0.9rem;
    color: var(--muted);
    margin: 0 0 24px;
  }
  .pr-modal-divider { height: 1px; background: var(--border); margin: 20px 0; }

  /* specs row inside modal */
  .pr-modal-specs {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .pr-modal-spec {
    flex: 1; min-width: 90px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    text-align: center;
  }
  .pr-modal-spec-label {
    font-size: 0.68rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--muted); margin: 0 0 3px;
  }
  .pr-modal-spec-value { font-size: 0.85rem; font-weight: 600; color: var(--navy); }

  .pr-modal-row {
    display: flex; gap: 12px; margin-bottom: 12px; font-size: 0.875rem; align-items: flex-start;
  }
  .pr-modal-row-label { width: 120px; flex-shrink: 0; color: var(--muted); font-weight: 500; padding-top: 1px; }
  .pr-modal-row-value { flex: 1; color: #1F2937; line-height: 1.6; }

  .pr-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .pr-tag {
    padding: 3px 10px; background: #F1F5F9;
    border-radius: 5px; font-size: 0.76rem; font-weight: 600; color: var(--navy);
  }
  .pr-apps-list { list-style: none; padding: 0; margin: 0; }
  .pr-apps-list li { padding: 2px 0; font-size: 0.875rem; color: #1F2937; }
  .pr-apps-list li::before { content: '·'; margin-right: 8px; color: var(--sky); font-size: 1.2em; }

  .pr-modal-safety {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 12px 16px;
    display: flex; gap: 10px; align-items: flex-start;
    margin-bottom: 24px; font-size: 0.875rem; color: #B91C1C;
  }
  .pr-modal-safety-icon { flex-shrink: 0; margin-top: 1px; }

  /* service features inside modal */
  .pr-feature-list { list-style: none; padding: 0; margin: 0; }
  .pr-feature-list li {
    font-size: 0.875rem; color: #1F2937;
    padding: 5px 0; display: flex; gap: 10px; align-items: center;
  }
  .pr-feature-check { color: #059669; font-size: 0.95rem; flex-shrink: 0; }

  /* empty state */
  .pr-empty {
    text-align: center; padding: 80px 20px; color: var(--muted);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pr-empty-text { font-size: 0.9rem; text-align: center; }
`;

// ─── Product Detail Modal ─────────────────────────────────────
function ProductModal({ product, onClose }: { product: ProductType; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="pr-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pr-modal">
        <button className="pr-modal-close" onClick={onClose} aria-label="Tutup">✕</button>
        <div className="pr-modal-hero">
          <img src={product.image} alt={t(product.titleKey)} />
        </div>
        <div className="pr-modal-body">
          <h3 className="pr-modal-title">{t(product.titleKey)}</h3>
          <p className="pr-modal-subtitle">{t(product.descKey)}</p>

          {product.specs?.length > 0 && (
            <div className="pr-modal-specs">
              {product.specs.map((s) => (
                <div key={s.labelKey} className="pr-modal-spec">
                  <p className="pr-modal-spec-label">{t(s.labelKey)}</p>
                  <p className="pr-modal-spec-value">{t(s.valueKey)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pr-modal-divider" />

          <div className="pr-modal-row">
            <span className="pr-modal-row-label">{t('product.details.color')}</span>
            <span className="pr-modal-row-value">{t(product.detail.colorKey)}</span>
          </div>
          <div className="pr-modal-row">
            <span className="pr-modal-row-label">{t('product.details.pressure')}</span>
            <span className="pr-modal-row-value">{t(product.detail.pressureKey)}</span>
          </div>
          <div className="pr-modal-row">
            <span className="pr-modal-row-label">{t('product.details.cylinderSize')}</span>
            <span className="pr-modal-row-value">
              <div className="pr-tags">
                {(t(product.detail.cylinderSizesKey, { returnObjects: true }) as string[]).map((u, i) => (
                  <span key={i} className="pr-tag">{u}</span>
                ))}
              </div>
            </span>
          </div>
          <div className="pr-modal-row">
            <span className="pr-modal-row-label">{t('product.details.applications')}</span>
            <span className="pr-modal-row-value">
              <ul className="pr-apps-list">
                {(t(product.detail.applicationsKey, { returnObjects: true }) as string[]).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </span>
          </div>

          <div className="pr-modal-divider" />

          <div className="pr-modal-safety">
            <span className="pr-modal-safety-icon">⚠️</span>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('product.details.safety')}
              </p>
              <p style={{ margin: 0 }}>{t(product.detail.safetyKey)}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Service Detail Modal ─────────────────────────────────────
type LayananType2 = typeof layananList[0];
function ServiceModal({ item, onClose }: { item: LayananType2; onClose: () => void }) {
  const { t } = useTranslation();
  const features = [
    'Layanan profesional dan terpercaya',
    'Tim ahli berpengalaman',
    'Dukungan teknis penuh',
    'Garansi kualitas pekerjaan',
  ];
  return (
    <div className="pr-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pr-modal">
        <button className="pr-modal-close" onClick={onClose} aria-label="Tutup">✕</button>
        <div className="pr-modal-hero">
          <img src={item.image} alt={t(item.titleKey)} />
        </div>
        <div className="pr-modal-body">
          <h3 className="pr-modal-title">{t(item.titleKey)}</h3>
          <p className="pr-modal-subtitle">{t(item.descKey)}</p>
          <div className="pr-modal-divider" />
          <div className="pr-modal-row">
            <span className="pr-modal-row-label">Keunggulan</span>
            <span className="pr-modal-row-value">
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
          <div className="pr-modal-divider" />
        </div>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────
function ProductsTab() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ProductType | null>(null);
  const [search, setSearch] = useState('');

  const filtered = subProducts.filter((p: ProductType) =>
    t(p.titleKey).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="pr-search-wrap" style={{ outline: 'none', boxShadow: 'none' }}>
        <input
          className="pr-search-input"
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ outline: 'none', boxShadow: 'none' }}
        />
      </div>

      <p className="pr-count" style={{ marginTop: 28 }}>{filtered.length} produk</p>

      {filtered.length === 0 ? (
        <div className="pr-empty">
          <p className="pr-empty-text">Produk tidak ditemukan</p>
        </div>
      ) : (
        <div className="pr-grid">
          {filtered.map((p: ProductType) => (
            <div key={p.id} className="pr-card" onClick={() => setSelected(p)}>
              <div className="pr-card-img">
                {p.image
                  ? <img src={p.image} alt={t(p.titleKey)} />
                  : <div className="pr-card-img-placeholder">📦</div>
                }
              </div>
              <div className="pr-card-body">
                <p className="pr-card-name">{t(p.titleKey)}</p>
                <p className="pr-card-meta">{t(p.descKey)}</p>
                <button className="pr-card-btn">Lihat Detail →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ─── Services Tab ─────────────────────────────────────────────
function ServicesTab() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LayananType | null>(null);

  return (
    <>
      <p className="pr-count">{layananList.length} layanan</p>

      <div className="pr-grid">
        {layananList.map((item: Service) => (
          <div key={item.id} className="pr-svc-card" onClick={() => setSelected(item)}>
            <div className="pr-svc-card-img">
              <img src={item.image} alt={t(item.titleKey)} />
            </div>
            <div className="pr-svc-card-body">
              <p className="pr-svc-card-name">{t(item.titleKey)}</p>
              <p className="pr-svc-card-desc">{t(item.descKey)}</p>
              <button className="pr-svc-card-btn">{t('product.modal.viewDetails')} →</button>
            </div>
          </div>
        ))}
      </div>

      {selected && <ServiceModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<StepType>('produk');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step') as StepType | null;
    if (stepParam === 'produk' || stepParam === 'layanan') {
      setStep(stepParam);
    }
  }, [location.search]);

  const handleTabChange = (tab: StepType) => {
    setStep(tab);
    const params = new URLSearchParams(location.search);
    params.set('step', tab);
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <div id="produk" className="product-root">
      <style>{css}</style>

      <div className="pr-page">
        {/* Page header */}
        <div className="pr-page-header">
          <h1 className="pr-page-title">
            {step === 'produk' ? t('product.title') : t('product.services.title')}
          </h1>
          <p className="pr-page-sub">{t('product.description')}</p>
        </div>

        {/* Tab bar */}
        <div className="pr-tabs">
          <button
            className={`pr-tab${step === 'produk' ? ' active' : ''}`}
            onClick={() => handleTabChange('produk')}
          >
            {t('product.title') || 'Produk'}
          </button>
          <button
            className={`pr-tab${step === 'layanan' ? ' active' : ''}`}
            onClick={() => handleTabChange('layanan')}
          >
            {t('product.services.title') || 'Layanan'}
          </button>
        </div>

        {/* Tab content */}
        {step === 'produk' && <ProductsTab />}
        {step === 'layanan' && <ServicesTab />}
      </div>
    </div>
  );
}
