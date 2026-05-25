'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────
const subProducts = [
  {
    id: 1,
    title: "Oksigen (O₂)",
    desc: "Gas oksigen untuk industri dan medis dengan kemurnian tinggi.",
    image: "https://images.unsplash.com/photo-1581092160607-8d7f9c8c5b5f?q=80&w=800",
  },
  {
    id: 2,
    title: "Nitrogen (N₂)",
    desc: "Gas nitrogen untuk pengawetan, las, dan aplikasi industri.",
    image: "https://images.unsplash.com/photo-1611849343921-2e0d0f7f1e2c?q=80&w=800",
  },
  {
    id: 3,
    title: "Argon (Ar)",
    desc: "Gas argon untuk pengelasan TIG dan aplikasi khusus.",
    image: "https://images.unsplash.com/photo-1586528116314-0d7d8c0d4d8b?q=80&w=800",
  },
  {
    id: 4,
    title: "Acetylene (C₂H₂)",
    desc: "Gas asetilena untuk pemotongan dan pengelasan logam.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=800",
  },
];

const layanan = {
  title: "Instalasi Gas",
  desc: "Layanan instalasi pipa gas industri dan medis yang aman dan sesuai standar. Termasuk perencanaan, pemasangan, dan pengujian sistem distribusi gas.",
  image: "https://images.unsplash.com/photo-1581092580497-6c8e4e4b3a3f?q=80&w=800",
};

const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=2070";

// ─── Main Component ───────────────────────────────────────────
export function Product() {
  const [step, setStep] = useState<'hero' | 'selection' | 'produk' | 'layanan'>('hero');

  return (
    <div id="produk" className="min-h-screen bg-gray-50">

      {/* ══ STEP 1: HERO FULL SCREEN ══ */}
      {step === 'hero' && (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-slate-900/70 to-blue-900/75" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm tracking-widest font-semibold uppercase">
              PT. Surya Inti Gas
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              PRODUK & LAYANAN<br />GAS INDUSTRI
            </h1>
            <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              Distributor resmi gas industri, medis, dan speciality gas sejak 2003
            </p>

            <button
              onClick={() => setStep('selection')}
              className="group px-10 py-5 bg-white text-emerald-900 font-semibold text-lg rounded-2xl hover:bg-emerald-50 transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:scale-105 active:scale-95"
            >
              LIHAT PRODUK & LAYANAN KAMI
              <span className="text-2xl group-hover:translate-y-1 transition-transform">↓</span>
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 2: SELECTION GRID ══ */}
      {step === 'selection' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
            <Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">
              Produk & Layanan
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium">Pilih Kategori</span>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Pilih Kategori</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Silakan pilih salah satu untuk melihat detail produk atau layanan kami.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card Produk */}
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
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                    Gas Industri & Medis
                  </span>
                  <p className="text-white text-2xl font-bold mt-1">PRODUK</p>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">🛢️</div>
                  <h3 className="text-xl font-bold text-gray-800">Gas & Tabung</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Oksigen, Nitrogen, Argon, Acetylene, Speciality Gas, Mixed Gas,
                  dan berbagai jenis tabung bertekanan tinggi berkualitas.
                </p>
                <div className="mt-5 flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  Lihat Produk <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>

            {/* Card Layanan */}
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
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                    Instalasi Profesional
                  </span>
                  <p className="text-white text-2xl font-bold mt-1">LAYANAN</p>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl">🔧</div>
                  <h3 className="text-xl font-bold text-gray-800">Instalasi Gas</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Layanan instalasi sistem distribusi gas industri dan medis secara
                  profesional, mencakup perencanaan, pemasangan, dan pengujian.
                </p>
                <div className="mt-5 flex items-center gap-2 text-teal-600 font-semibold text-sm">
                  Lihat Layanan <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP 3: DETAIL PRODUK ══ */}
      {step === 'produk' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">
              Produk & Layanan
            </button>
            <span>/</span>
            <button onClick={() => setStep('selection')} className="hover:text-blue-600 transition-colors">
              Pilih Kategori
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium">Produk</span>
          </div>

          <button
            onClick={() => setStep('selection')}
            className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors"
          >
            ← Kembali ke Pilihan
          </button>

          <div className="space-y-14">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-3 text-gray-800">Produk Unggulan</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Berbagai jenis gas berkualitas tinggi untuk industri dan medis
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-gray-800">{product.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{product.desc}</p>
                  </div>
                </div>
              ))}
            </div>  
          </div>
        </div>
      )}

      {/* ══ STEP 3: DETAIL LAYANAN ══ */}
      {step === 'layanan' && (
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <span>/</span>
            <button onClick={() => setStep('hero')} className="hover:text-blue-600 transition-colors">
              Produk & Layanan
            </button>
            <span>/</span>
            <button onClick={() => setStep('selection')} className="hover:text-blue-600 transition-colors">
              Pilih Kategori
            </button>
            <span>/</span>
            <span className="text-gray-600 font-medium">Layanan</span>
          </div>

          <button
            onClick={() => setStep('selection')}
            className="mb-8 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors"
          >
            ← Kembali ke Pilihan
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={layanan.image}
                  alt="Instalasi Gas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent" />
                <div className="absolute bottom-8 left-10">
                  <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">
                    Layanan Profesional
                  </span>
                  <h2 className="text-white text-4xl font-bold mt-2">{layanan.title}</h2>
                </div>
              </div>

              <div className="p-12 md:p-16">
                <p className="text-lg text-gray-600 leading-relaxed mb-10">{layanan.desc}</p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {[
                    { icon: "📐", label: "Perencanaan" },
                    { icon: "🔧", label: "Pemasangan" },
                    { icon: "✅", label: "Pengujian & Commissioning" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                        {item.icon}
                      </div>
                      <p className="font-semibold text-gray-700">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
