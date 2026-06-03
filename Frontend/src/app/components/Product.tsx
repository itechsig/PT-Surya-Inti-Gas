'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ─── Data ─────────────────────────────────────────────────────
const subProducts = [
  {
    id: 1,
    titleKey: "product.products.oxygen.title",
    descKey: "product.products.oxygen.description",
    image: "https://plus.unsplash.com/premium_photo-1681426676206-0f2c02b48aff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bzJ8ZW58MHx8MHx8fDA%3D",
    slug: "gas-industri",
    specs: [
      { icon: "💧", labelKey: "product.details.purity", valueKey: "product.products.oxygen.purity" },
      { icon: "🏭", labelKey: "product.details.usage", valueKey: "product.products.oxygen.usage" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.products.oxygen.color",
      pressureKey: "product.products.oxygen.pressure",
      cylinderSizesKey: "product.products.oxygen.cylinderSizes",
      applicationsKey: "product.products.oxygen.applications",
      safetyKey: "product.products.oxygen.safety",
    },
  },
  {
    id: 2,
    titleKey: "product.products.nitrogen.title",
    descKey: "product.products.nitrogen.description",
    image: "https://media.istockphoto.com/id/638504688/photo/sample-of-sperm-frozen-tank.webp?a=1&b=1&s=612x612&w=0&k=20&c=cbLDA5dA3_RrIX3tuQysyAlPBeboUc4bYupJI5PokBE=",
    slug: "gas-medis",
    specs: [
      { icon: "💧", labelKey: "product.details.purity", valueKey: "product.products.nitrogen.purity" },
      { icon: "🏭", labelKey: "product.details.usage", valueKey: "product.products.nitrogen.usage" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.products.nitrogen.color",
      pressureKey: "product.products.nitrogen.pressure",
      cylinderSizesKey: "product.products.nitrogen.cylinderSizes",
      applicationsKey: "product.products.nitrogen.applications",
      safetyKey: "product.products.nitrogen.safety",
    },
  },
  {
    id: 3,
    titleKey: "product.products.argon.title",
    descKey: "product.products.argon.description",
    image: "https://images.unsplash.com/photo-1683470156390-703e9313dab6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QXJnb258ZW58MHx8MHx8fDA%3D",
    slug: "gas-campuran",
    specs: [
      { icon: "💧", labelKey: "product.details.purity", valueKey: "product.products.argon.purity" },
      { icon: "🏭", labelKey: "product.details.usage", valueKey: "product.products.argon.usage" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.products.argon.color",
      pressureKey: "product.products.argon.pressure",
      cylinderSizesKey: "product.products.argon.cylinderSizes",
      applicationsKey: "product.products.argon.applications",
      safetyKey: "product.products.argon.safety",
    },
  },
  {
    id: 4,
    titleKey: "product.products.acetylene.title",
    descKey: "product.products.acetylene.description",
    image: "https://images.unsplash.com/photo-1609361528925-2d177061540c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QWNldHlsZW5lfGVufDB8fDB8fHww",
    slug: "speciality-gas",
    specs: [
      { icon: "💧", labelKey: "product.details.purity", valueKey: "product.products.acetylene.purity" },
      { icon: "🏭", labelKey: "product.details.usage", valueKey: "product.products.acetylene.usage" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.products.acetylene.color",
      pressureKey: "product.products.acetylene.pressure",
      cylinderSizesKey: "product.products.acetylene.cylinderSizes",
      applicationsKey: "product.products.acetylene.applications",
      safetyKey: "product.products.acetylene.safety",
    },
  },
];

const layananList = [
  {
    id: 1,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.installation.title",
    descKey: "product.services.installation.description",
    image: "https://plus.unsplash.com/premium_photo-1661921394349-9e3f394d80da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGluc3RhbGFzaSUyMGdhc3xlbnwwfHwwfHx8MA%3D%3D",
    color: "emerald",
    steps: [
      { icon: "📐", labelKey: "product.services.installation.steps.planning" },
      { icon: "🔧", labelKey: "product.services.installation.steps.installation" },
      { icon: "✅", labelKey: "product.services.installation.steps.testing" },
    ],
    highlightsKey: "product.services.installation.highlights",
  },
  {
    id: 2,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.tanks.title",
    descKey: "product.services.tanks.description",
    image: "https://plus.unsplash.com/premium_photo-1664299488927-4352e3d2a71e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVtYXNhbmdhbiUyMHRhbmdraXxlbnwwfHwwfHx8MA%3D%3D",
    color: "teal",
    steps: [
      { icon: "📋", labelKey: "product.services.tanks.steps.survey" },
      { icon: "🏗️", labelKey: "product.services.tanks.steps.installation" },
      { icon: "🔒", labelKey: "product.services.tanks.steps.commissioning" },
    ],
    highlightsKey: "product.services.tanks.highlights",
  },
];

// ─── Types ────────────────────────────────────────────────────
type StepType = 'hero' | 'selection' | 'produk' | 'layanan';
type ProductType = typeof subProducts[0];

// ─── Modal Component ──────────────────────────────────────────
function ProductModal({ product, onClose }: { product: ProductType; onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-t-3xl" style={{ height: '340px' }}>
          <img
            src={product.image}
            alt={t(product.titleKey)}
            className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute top-5 left-6">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest rounded-full border border-white/30">
              {t('product.modal.detailProduct')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors border border-white/30"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 pt-10">
            <h3 className="text-white text-3xl font-bold drop-shadow-lg">{t(product.titleKey)}</h3>
            <p className="text-white/70 text-sm mt-1 leading-relaxed line-clamp-2">{t(product.descKey)}</p>
          </div>
        </div>

        <div className="p-8 space-y-7">
          <div className="grid grid-cols-3 gap-4">
            {product.specs.map(spec => (
              <div key={spec.labelKey} className="bg-slate-50 rounded-2xl p-4 text-center">
                <span className="text-2xl">{spec.icon}</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-2 mb-1">{t(spec.labelKey)}</p>
                <p className="text-sm font-semibold text-slate-800">{t(spec.valueKey)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🎨</div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{t('product.details.color')}</p>
                <p className="text-sm text-slate-700 font-medium">{t(product.detail.colorKey)}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔩</div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{t('product.details.pressure')}</p>
                <p className="text-sm text-slate-700 font-medium">{t(product.detail.pressureKey)}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🛢️</div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('product.details.cylinderSize')}</p>
                <div className="flex flex-wrap gap-2">
                  {(t(product.detail.cylinderSizesKey, { returnObjects: true }) as string[]).map((u, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚙️</div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('product.details.applications')}</p>
                <ul className="space-y-1">
                  {(t(product.detail.applicationsKey, { returnObjects: true }) as string[]).map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-red-50 rounded-2xl p-4">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
              <div>
                <p className="text-xs text-red-400 uppercase tracking-wider mb-0.5">{t('product.details.safety')}</p>
                <p className="text-sm text-red-700">{t(product.detail.safetyKey)}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
            >
              {t('product.modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Layanan Modal ────────────────────────────────────────────
type LayananType = typeof layananList[0];

function LayananModal({ item, onClose }: { item: LayananType; onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-t-3xl" style={{ height: '320px' }}>
          <img src={item.image} alt={t(item.titleKey)} className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute top-5 left-6">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest rounded-full border border-white/30">
              {t(item.badgeKey)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors border border-white/30"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 pt-10">
            <h3 className="text-white text-3xl font-bold drop-shadow-lg">{t(item.titleKey)}</h3>
            <p className="text-white/70 text-sm mt-1 leading-relaxed">{t(item.descKey)}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-5">Tahapan Proses</p>
            <div className="flex flex-col gap-4">
              {item.steps.map((s, idx) => (
                <div key={s.labelKey} className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.color === 'teal' ? 'bg-teal-100' : 'bg-emerald-100'}`}>
                    {s.icon}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300">{String(idx + 1).padStart(2, '0')}</span>
                    <p className="text-sm font-semibold text-slate-700">{t(s.labelKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-5">Keunggulan</p>
            <ul className="space-y-3">
              {(t(item.highlightsKey, { returnObjects: true }) as string[]).map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${item.color === 'teal' ? 'bg-teal-500' : 'bg-emerald-500'}`}>✓</span>
                  <p className="text-sm text-slate-600">{h}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
            >
              {t('product.modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function Product() {
  const location = useLocation();
  const [step, setStep] = useState<StepType>('hero');
  const [current, setCurrent] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedLayanan, setSelectedLayanan] = useState<LayananType | null>(null);

  // ── Baca query param dari URL saat pertama mount ──
  // Contoh: /produk?step=produk&item=gas-medis
  //         /produk?step=layanan
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step') as StepType | null;
    const itemParam = params.get('item');

    if (stepParam === 'produk' || stepParam === 'layanan' || stepParam === 'selection') {
      setStep(stepParam);

      // Jika ada item slug, langsung buka modal produk yang sesuai
      if (stepParam === 'produk' && itemParam) {
        const matched = subProducts.find(p => p.slug === itemParam);
        if (matched) setSelectedProduct(matched);
      }
    }
  }, [location.search]);



  return (
    <div id="produk" className="min-h-screen bg-white">

      {/* ══ MODAL PRODUK ══ */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* ══ MODAL LAYANAN ══ */}
      {selectedLayanan && (
        <LayananModal item={selectedLayanan} onClose={() => setSelectedLayanan(null)} />
      )}

      {/* ══ STEP 1: HERO ══ */}
      {step === 'hero' && (
        <div className="min-h-screen flex items-center bg-white px-10 py-28 gap-16 max-w-7xl mx-auto">
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-[4px] mb-4 font-medium">
                {t('header.products')}
              </p>
              <h1 className="text-6xl font-bold text-slate-900 leading-[1.05] tracking-tight">
                {t('product.title')},<br />
                <span className="text-slate-300 font-light">{t('product.medicalSpecialty')}</span>
              </h1>
            </div>
            <p className="text-slate-500 text-base leading-relaxed max-w-xs">
              {t('hero.description')}
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setStep('selection')}
                className="w-fit flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                {t('hero.viewProducts')}
                <span className="text-base">→</span>
              </button>
            </div>
            <div className="w-12 h-px bg-slate-200 my-2" />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm" style={{ height: '400px' }}>
              {subProducts.map((product, i) => (
                <img
                  key={product.id}
                  src={product.image}
                  alt={t(product.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium">{t('product.currentlyDisplaying')}</p>
                <p className="text-white text-base font-semibold mt-0.5">
                  {t(subProducts[current].titleKey)}
                </p>
              </div>
              <div className="absolute bottom-5 right-5 flex gap-1.5">
                {subProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 transition-all duration-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{t('product.productLabel')}</p>
                  <p className="text-base font-semibold text-slate-800">{t(subProducts[current].titleKey)}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xs">{t(subProducts[current].descKey)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                {subProducts[current].specs.map((spec) => (
                  <div key={spec.labelKey} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{spec.icon}</span>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{t(spec.labelKey)}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{t(spec.valueKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 2: SELECTION GRID ══ */}
      {step === 'selection' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t('header.home')}</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">
              {t('header.products')}
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium">{t('product.selectCategory')}</span>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">{t('product.selectCategory')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t('product.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              onClick={() => setStep('produk')}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200"
            >
              <div className="h-72 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1664396113489-e50bddd4a777?q=80&w=1171&auto=format&fit=crop"
                  alt="Produk Gas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">{t('product.categories.industrial')} & {t('product.categories.medical')}</span>
                  <p className="text-white text-2xl font-bold mt-1">{t('product.productsLabel')}</p>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">🛢️</div>
                  <h3 className="text-xl font-bold text-gray-800">{t('product.gasAndCylinder')}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t('product.categories.industrial')}, {t('product.categories.medical')}, {t('product.categories.speciality')}, {t('product.categories.mixed')},
                  {t('product.highQualityCylinders')}.
                </p>
                <div className="mt-5 flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  {t('hero.viewProducts')} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => setStep('layanan')}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-200"
            >
              <div className="h-72 relative overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1664298589198-b15ff5382648?q=80&w=1170&auto=format&fit=crop"
                  alt="Layanan Instalasi"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">{t('product.services.professionalService')}</span>
                  <p className="text-white text-2xl font-bold mt-1">{t('product.servicesLabel')}</p>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl">🔧</div>
                  <h3 className="text-xl font-bold text-gray-800">{t('product.services.installation.title')}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t('product.services.installation.description')}
                </p>
                <div className="mt-5 flex items-center gap-2 text-teal-600 font-semibold text-sm">
                  {t('common.search')} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 3: DETAIL PRODUK ══ */}
      {step === 'produk' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t('header.home')}</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">{t('header.products')}</button>
            <span>/</span>
            <button onClick={() => setStep('selection')} className="hover:text-blue-600 transition-colors">{t('common.search')}</button>
            <span>/</span>
            <span className="text-gray-600 font-medium">{t('common.details')}</span>
          </div>

          <button
            onClick={() => setStep('selection')}
            className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors"
          >
            ← {t('common.cancel')}
          </button>

          <div className="space-y-14">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-3 text-gray-800">{t('product.title')}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">{t('product.description')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={t(product.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-gray-800">{t(product.titleKey)}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{t(product.descKey)}</p>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="mt-5 w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {t('product.modal.viewDetails')} <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 4: LAYANAN ══ */}
      {step === 'layanan' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t('header.home')}</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">{t('header.products')}</button>
            <span>/</span>
            <button onClick={() => setStep('selection')} className="hover:text-blue-600 transition-colors">{t('common.search')}</button>
            <span>/</span>
            <span className="text-gray-600 font-medium">{t('product.services.title')}</span>
          </div>

          <button
            onClick={() => setStep('selection')}
            className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors"
          >
            ← {t('common.cancel')}
          </button>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">{t('product.services.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t('product.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {layananList.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col border-2 border-transparent hover:border-emerald-200">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={item.image}
                    alt={t(item.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${item.color === 'teal' ? 'text-teal-300' : 'text-emerald-300'}`}>
                      {t(item.badgeKey)}
                    </span>
                    <h3 className="text-white text-xl font-bold mt-0.5">{t(item.titleKey)}</h3>
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{t(item.descKey)}</p>

                  {/* Step pills — garis besar */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {item.steps.map((s) => (
                      <span key={s.labelKey} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${item.color === 'teal' ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        <span>{s.icon}</span> {t(s.labelKey)}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedLayanan(item)}
                    className="mt-6 w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {t('product.modal.viewDetails')} <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
