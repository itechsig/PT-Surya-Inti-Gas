'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subProducts, layananList, Service } from './Product/data';
import type { Product } from './Product/data';

// ─── Types ────────────────────────────────────────────────────
type StepType = 'hero' | 'selection' | 'produk' | 'layanan';
type ProductType = Product;

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
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${product.id}`}
      aria-describedby={`modal-desc-${product.id}`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="relative overflow-hidden rounded-t-3xl md:h-[340px] h-[250px]">
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
            aria-label={t('product.modal.close')}
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-7 pb-5 md:pb-7 pt-8 md:pt-10">
            <h3 id={`modal-title-${product.id}`} className="text-white text-xl md:text-3xl font-bold drop-shadow-lg">{t(product.titleKey)}</h3>
            <p id={`modal-desc-${product.id}`} className="text-white/70 text-xs md:text-sm mt-1 leading-relaxed line-clamp-2">{t(product.descKey)}</p>
          </div>
        </div>

        <div className="p-5 md:p-8 space-y-5 md:space-y-7">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {product.specs.map((spec) => (
              <div key={spec.labelKey} className="bg-slate-50 rounded-2xl p-3 md:p-4 text-center">
                <span className="text-xl md:text-2xl">{spec.icon}</span>
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mt-2 mb-1">{t(spec.labelKey)}</p>
                <p className="text-xs md:text-sm font-semibold text-slate-800">{t(spec.valueKey)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 md:space-y-5">
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0">🎨</div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-0.5">{t('product.details.color')}</p>
                <p className="text-xs md:text-sm text-slate-700 font-medium">{t(product.detail.colorKey)}</p>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-100 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0">🔩</div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-0.5">{t('product.details.pressure')}</p>
                <p className="text-xs md:text-sm text-slate-700 font-medium">{t(product.detail.pressureKey)}</p>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-purple-100 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0">🛢️</div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">{t('product.details.cylinderSize')}</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {(t(product.detail.cylinderSizesKey, { returnObjects: true }) as string[]).map((u, i) => (
                    <span key={i} className="px-2.5 md:px-3 py-1 bg-slate-100 text-slate-700 text-[10px] md:text-xs font-medium rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 items-start">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-amber-100 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0">⚙️</div>
              <div>
                <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider mb-1">{t('product.details.applications')}</p>
                <ul className="space-y-1">
                  {(t(product.detail.applicationsKey, { returnObjects: true }) as string[]).map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 items-start bg-red-50 rounded-2xl p-3 md:p-4">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-red-100 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0">⚠️</div>
              <div>
                <p className="text-[10px] md:text-xs text-red-400 uppercase tracking-wider mb-0.5">{t('product.details.safety')}</p>
                <p className="text-xs md:text-sm text-red-700">{t(product.detail.safetyKey)}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 md:py-3 bg-slate-900 text-white rounded-xl font-medium text-xs md:text-sm hover:bg-slate-700 transition-colors"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={`service-modal-title-${item.id}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="relative overflow-hidden rounded-t-3xl md:h-[320px] h-[250px]">
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
            aria-label={t('product.modal.close')}
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-7 pb-5 md:pb-7 pt-8 md:pt-10">
            <h3 id={`service-modal-title-${item.id}`} className="text-white text-xl md:text-3xl font-bold drop-shadow-lg">{t(item.titleKey)}</h3>
            <p className="text-white/70 text-xs md:text-sm mt-1 leading-relaxed">{t(item.descKey)}</p>
          </div>
        </div>

        <div className="p-5 md:p-8 space-y-6 md:space-y-8">
          <div>
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4 md:mb-5">Layanan Utama</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl flex-shrink-0" style={{ backgroundColor: item.color + '20' }}>
                {item.icon}
              </div>
              <p className="text-sm md:text-base font-semibold text-slate-700">Layanan profesional berkualitas tinggi</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4 md:mb-5">Keunggulan</p>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start gap-2 md:gap-3">
                <span className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs flex-shrink-0" style={{ backgroundColor: item.color }}>✓</span>
                <p className="text-xs md:text-sm text-slate-600">Layanan profesional dan terpercaya</p>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <span className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs flex-shrink-0" style={{ backgroundColor: item.color }}>✓</span>
                <p className="text-xs md:text-sm text-slate-600">Tim ahli berpengalaman</p>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <span className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs flex-shrink-0" style={{ backgroundColor: item.color }}>✓</span>
                <p className="text-xs md:text-sm text-slate-600">Dukungan teknis penuh</p>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 md:py-3 bg-slate-900 text-white rounded-xl font-medium text-xs md:text-sm hover:bg-slate-700 transition-colors"
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
  const { t } = useTranslation();
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
        const matched = subProducts.find((p: Product) => p.slug === itemParam);
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
        <div className="min-h-screen flex items-center bg-white px-6 md:px-10 py-16 md:py-28 gap-8 md:gap-16 max-w-7xl mx-auto">
          <div className="flex-1 flex flex-col gap-4 md:gap-6 order-2 md:order-1">
            <div>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-[2px] md:tracking-[4px] mb-3 md:mb-4 font-medium">
                {t('header.products')}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.1] md:leading-[1.05] tracking-tight">
                {t('product.title')},<br />
                <span className="text-slate-300 font-light">{t('product.medicalSpecialty')}</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xs md:max-w-sm">
              {t('hero.description')}
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setStep('selection')}
                className="w-fit flex items-center gap-3 px-5 md:px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                {t('hero.viewProducts')}
                <span className="text-base">→</span>
              </button>
            </div>
            <div className="w-12 h-px bg-slate-200 my-2" />
          </div>

          <div className="flex-1 flex flex-col gap-3 md:gap-4 order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm h-[250px] md:h-[400px]">
              {subProducts.map((product: Product, i: number) => (
                <img
                  key={product.id}
                  src={product.image}
                  alt={t(product.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 md:bottom-4 left-4 md:left-5">
                <p className="text-white/70 text-[10px] md:text-xs uppercase tracking-widest font-medium">{t('product.currentlyDisplaying')}</p>
                <p className="text-white text-sm md:text-base font-semibold mt-0.5">
                  {t(subProducts[current].titleKey)}
                </p>
              </div>
              <div className="absolute bottom-4 md:bottom-5 right-4 md:right-5 flex gap-1.5">
                {subProducts.map((_: Product, i: number) => (
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

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 md:p-5 transition-all duration-500">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">{t('product.productLabel')}</p>
                  <p className="text-sm md:text-base font-semibold text-slate-800">{t(subProducts[current].titleKey)}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-relaxed max-w-xs">{t(subProducts[current].descKey)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-3 pt-3 border-t border-slate-200">
                {subProducts[current].specs.map((spec) => (
                  <div key={spec.labelKey} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <span className="text-xs md:text-sm">{spec.icon}</span>
                      <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">{t(spec.labelKey)}</p>
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">{t(spec.valueKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 2: SELECTION GRID ══ */}
      {step === 'selection' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 md:mb-10 flex-wrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t('header.home')}</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">
              {t('header.products')}
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium">{t('product.selectCategory')}</span>
          </div>

          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">{t('product.selectCategory')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              {t('product.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div
              onClick={() => setStep('produk')}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200"
            >
              <div className="h-56 md:h-72 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1664396113489-e50bddd4a777?q=80&w=1171&auto=format&fit=crop"
                  alt="Produk Gas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 md:bottom-5 left-4 md:left-6">
                  <span className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-widest">{t('product.categories.industrialMedical')}</span>
                  <p className="text-white text-lg md:text-2xl font-bold mt-1">{t('product.productsLabel')}</p>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <div className="flex items-center gap-3 md:gap-4 mb-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl md:text-2xl">🛢️</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{t('product.gasAndCylinder')}</h3>
                </div>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  {t('product.categories.highPressure')}, {t('product.categories.regulator')}, {t('product.categories.industrialMedical')}, {t('product.categories.specialityMixed')}, {t('product.categories.equipment')}, {t('product.categories.assistSupply')}, {t('product.categories.cyrogenic')}.
                </p>
                <div className="mt-4 md:mt-5 flex items-center gap-2 text-emerald-600 font-semibold text-xs md:text-sm">
                  {t('hero.viewProducts')} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => setStep('layanan')}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-200"
            >
              <div className="h-56 md:h-72 relative overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1664298589198-b15ff5382648?q=80&w=1170&auto=format&fit=crop"
                  alt="Layanan Instalasi"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 md:bottom-5 left-4 md:left-6">
                  <span className="text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-widest">{t('product.services.professionalService')}</span>
                  <p className="text-white text-lg md:text-2xl font-bold mt-1">{t('product.servicesLabel')}</p>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <div className="flex items-center gap-3 md:gap-4 mb-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 bg-teal-100 rounded-2xl flex items-center justify-center text-xl md:text-2xl">🔧</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{t('product.services.installation.title')}</h3>
                </div>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  {t('product.services.installation.description')}
                </p>
                <div className="mt-4 md:mt-5 flex items-center gap-2 text-teal-600 font-semibold text-xs md:text-sm">
                  {t('common.search')} <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 3: DETAIL PRODUK ══ */}
      {step === 'produk' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 md:mb-8 flex-wrap">
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
            className="mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium text-sm md:text-base transition-colors"
          >
            ← {t('common.cancel')}
          </button>

          <div className="space-y-10 md:space-y-14">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 text-gray-800">{t('product.title')}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">{t('product.description')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {subProducts.map((product: Product) => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-48 md:h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={t(product.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <h4 className="font-semibold text-base md:text-lg mb-2 text-gray-800">{t(product.titleKey)}</h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed flex-1">{t(product.descKey)}</p>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="mt-4 md:mt-5 w-full py-2.5 bg-slate-900 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-12 md:pb-16">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 md:mb-8 flex-wrap">
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
            className="mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium text-sm md:text-base transition-colors"
          >
            ← {t('common.cancel')}
          </button>

          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">{t('product.services.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              {t('product.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {layananList.map((item: Service) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col border-2 border-transparent hover:border-emerald-200">
                <div className="relative h-52 md:h-60 overflow-hidden">
                  <img
                    src={item.image}
                    alt={t(item.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 md:bottom-5 left-4 md:left-6">
                    <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-widest ${item.color === 'teal' ? 'text-teal-300' : 'text-emerald-300'}`}>
                      {t(item.badgeKey)}
                    </span>
                    <h3 className="text-white text-lg md:text-xl font-bold mt-0.5">{t(item.titleKey)}</h3>
                  </div>
                </div>

                <div className="p-5 md:p-7 flex flex-col flex-1">
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed flex-1 line-clamp-3">{t(item.descKey)}</p>

                  {/* Service icon display */}
                  <div className="flex items-center gap-2 mt-4 md:mt-5">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-lg md:text-xl" style={{ backgroundColor: item.color + '20' }}>
                      {item.icon}
                    </div>
                    <span className="text-xs md:text-sm font-medium text-slate-600">Layanan Profesional</span>
                  </div>
                  <button
                    onClick={() => setSelectedLayanan(item)}
                    className="mt-4 md:mt-6 w-full py-2.5 md:py-3 bg-slate-900 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
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
