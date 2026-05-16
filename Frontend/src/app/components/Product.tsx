import { useState, useEffect, useRef } from "react";

/*
  Google Font: IBM Plex Sans
  Tambahkan di index.html:
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
*/

// ─── Keyframes injected once ──────────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93) translateY(12px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-animate {
    opacity: 0;
    animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .modal-overlay-animate {
    animation: fadeIn 0.25s ease forwards;
  }

  .modal-content-animate {
    animation: scaleIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .tab-label-animate {
    animation: slideDown 0.25s ease forwards;
  }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  /* Smooth image zoom on card hover */
  .product-img {
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .product-img:hover {
    transform: scale(1.06);
  }

  /* Underline slide for tab active indicator */
  .tab-btn {
    position: relative;
    transition: color 0.2s ease;
  }
  .tab-btn::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 999px;
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .tab-btn.active::after {
    transform: scaleX(1);
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductItem {
  id: string;
  name: string;
  description: string;
  specs: string[];
  imageUrl: string;
  imageAlt: string;
}

interface ProductCategory {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  tagColor: string;
  products: ProductItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLACEHOLDER = (label: string) =>
  `https://placehold.co/800x500/e8f0fe/1e40af?text=${encodeURIComponent(label)}`;

const categories: ProductCategory[] = [
  {
    id: "gas-industri-medis",
    title: "Gas Industri & Medis",
    subtitle: "O₂  ·  N₂  ·  Ar  ·  C₂H₂  ·  He  ·  Mixed Gas",
    accentColor: "#1d4ed8",
    tagColor: "#dbeafe",
    products: [
      {
        id: "oxygen",
        name: "Oksigen (O₂)",
        description: "Untuk kebutuhan medis, pemotongan logam, dan proses industri.",
        specs: ["Kemurnian: 99.5% – 99.9%", "Tekanan: 150 bar", "Kemasan: Silinder & Bulk"],
        imageUrl: "/images/products/tabung.jpg",
        imageAlt: "Tabung gas oksigen O2",
      },
      {
        id: "nitrogen",
        name: "Nitrogen (N₂)",
        description: "Untuk pendinginan, inert blanket, dan food processing.",
        specs: ["Kemurnian: 99.9% – 99.999%", "Tekanan: 200 bar", "Kemasan: Silinder, Dewar, Isotank"],
        imageUrl: PLACEHOLDER("Nitrogen N₂"),
        imageAlt: "Tabung gas nitrogen N2",
      },
      {
        id: "argon",
        name: "Argon (Ar)",
        description: "Untuk pengelasan TIG/MIG, metalurgi, dan perlindungan atmosfer.",
        specs: ["Kemurnian: 99.9% – 99.999%", "Tekanan: 200 bar", "Kemasan: Silinder & Bulk"],
        imageUrl: PLACEHOLDER("Argon Ar"),
        imageAlt: "Tabung gas argon",
      },
      {
        id: "acetylene",
        name: "Asetilena (C₂H₂)",
        description: "Untuk pemotongan dan pengelasan logam bernyala api tinggi.",
        specs: ["Kemurnian: 99.5%", "Tekanan: 16 bar", "Kemasan: Silinder khusus"],
        imageUrl: PLACEHOLDER("Asetilena C₂H₂"),
        imageAlt: "Tabung gas asetilena",
      },
      {
        id: "helium",
        name: "Helium (He)",
        description: "Untuk MRI medis, laboratorium kriogenik, dan filling balon.",
        specs: ["Kemurnian: 99.9% – 99.9999%", "Tekanan: 150 bar", "Kemasan: Silinder & Dewar"],
        imageUrl: PLACEHOLDER("Helium He"),
        imageAlt: "Tabung gas helium",
      },
      {
        id: "mixed-gas",
        name: "Mixed Gas",
        description: "Campuran gas custom untuk kalibrasi dan aplikasi analitik.",
        specs: ["Custom Mixture", "Sertifikat Analisis", "Kemasan: Berbagai ukuran"],
        imageUrl: PLACEHOLDER("Mixed Gas"),
        imageAlt: "Tabung mixed gas",
      },
    ],
  },
  {
    id: "cryogenic-equipment",
    title: "Cryogenic Equipment",
    subtitle: "Cylinder  ·  Tank  ·  Isotank",
    accentColor: "#0369a1",
    tagColor: "#e0f2fe",
    products: [
      {
        id: "cryogenic-cylinder",
        name: "Cryogenic Cylinder",
        description: "Tabung portabel untuk penyimpanan gas cair (LO₂, LN₂, LAr).",
        specs: ["Kapasitas: 50 – 500 L", "Tekanan: 350 psi", "Material: Stainless Steel"],
        imageUrl: PLACEHOLDER("Cryogenic Cylinder"),
        imageAlt: "Cryogenic cylinder",
      },
      {
        id: "storage-tank",
        name: "Storage Tank",
        description: "Tangki gas cair skala besar untuk industri dan rumah sakit.",
        specs: ["Kapasitas: 3.000 – 100.000 L", "Tekanan: 350 psi", "Instalasi: On-site"],
        imageUrl: PLACEHOLDER("Storage Tank"),
        imageAlt: "Storage tank cryogenic",
      },
      {
        id: "isotank",
        name: "Isotank",
        description: "Kontainer ISO kriogenik untuk transportasi gas cair massal.",
        specs: ["Kapasitas: 20.000 – 26.000 L", "Sertifikasi: ISO 1496-3", "Moda: Darat & Laut"],
        imageUrl: PLACEHOLDER("Isotank"),
        imageAlt: "Isotank cryogenic",
      },
    ],
  },
  {
    id: "regulators-valves",
    title: "Regulators & Valves",
    subtitle: "High Pressure  ·  Cryogenic",
    accentColor: "#1e40af",
    tagColor: "#ede9fe",
    products: [
      {
        id: "high-pressure-regulator",
        name: "High Pressure Regulator",
        description: "Regulator single/dual stage untuk berbagai jenis gas industri.",
        specs: ["Inlet: hingga 300 bar", "Outlet: 0.1 – 200 bar", "Koneksi: CGA, DIN, BS"],
        imageUrl: PLACEHOLDER("HP Regulator"),
        imageAlt: "High pressure regulator",
      },
      {
        id: "cryogenic-valve",
        name: "Cryogenic Valve",
        description: "Katup untuk operasi pada suhu ekstrem hingga -196°C.",
        specs: ["Suhu: -196°C hingga +65°C", "Tekanan: hingga 40 bar", "Material: SS316L"],
        imageUrl: PLACEHOLDER("Cryogenic Valve"),
        imageAlt: "Cryogenic valve",
      },
      {
        id: "safety-relief-valve",
        name: "Safety Relief Valve",
        description: "Katup pengaman otomatis dari tekanan berlebih.",
        specs: ["Set pressure: custom", "Sertifikasi: ASME, CE", "Material: Brass / SS"],
        imageUrl: PLACEHOLDER("Safety Valve"),
        imageAlt: "Safety relief valve",
      },
      {
        id: "flowmeter",
        name: "Flowmeter & Gauge",
        description: "Alat ukur aliran dan tekanan gas yang presisi.",
        specs: ["Akurasi: ±2%", "Range: 0 – 200 bar", "Display: Analog & Digital"],
        imageUrl: PLACEHOLDER("Flowmeter"),
        imageAlt: "Flowmeter gauge",
      },
    ],
  },
  {
    id: "assist-gas-supply",
    title: "Assist Gas Supply",
    subtitle: "Laser Cutting Support",
    accentColor: "#b45309",
    tagColor: "#fef3c7",
    products: [
      {
        id: "nitrogen-laser",
        name: "Nitrogen — Laser Cutting",
        description: "Assist gas untuk pemotongan stainless steel dan aluminium.",
        specs: ["Kemurnian: 99.99% – 99.999%", "Tekanan: hingga 25 bar", "Supply: On-site / Bulk"],
        imageUrl: PLACEHOLDER("N₂ Laser Cutting"),
        imageAlt: "Nitrogen laser cutting",
      },
      {
        id: "oxygen-laser",
        name: "Oksigen — Laser Cutting",
        description: "Assist gas untuk pemotongan mild steel berkecepatan tinggi.",
        specs: ["Kemurnian: 99.5% – 99.9%", "Tekanan: hingga 6 bar", "Supply: Silinder / Manifold"],
        imageUrl: PLACEHOLDER("O₂ Laser Cutting"),
        imageAlt: "Oksigen laser cutting",
      },
      {
        id: "gas-manifold",
        name: "Gas Manifold System",
        description: "Sistem manifold otomatis untuk pasokan gas tanpa gangguan.",
        specs: ["Kapasitas: 2 – 50 silinder", "Auto-switchover", "Monitoring digital"],
        imageUrl: PLACEHOLDER("Gas Manifold"),
        imageAlt: "Gas manifold system",
      },
    ],
  },
];

// ─── Modal ─────────────────────────────────────────────────────────────────────

function ProductModal({
  product,
  accentColor,
  onClose,
}: {
  product: ProductItem;
  accentColor: string;
  onClose: () => void;
}) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay-animate"
      style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(5px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg modal-content-animate"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 flex items-center justify-center transition-colors shadow"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="w-full overflow-hidden" style={{ height: 280 }}>
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER(product.name); }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{product.description}</p>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Spesifikasi</p>
            <ul className="space-y-2">
              {product.specs.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-700"
                  style={{
                    animation: `fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#kontak"
            onClick={onClose}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: accentColor }}
          >
            Minta Penawaran
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  accentColor,
  tagColor,
  index,
  onView,
}: {
  product: ProductItem;
  accentColor: string;
  tagColor: string;
  index: number;
  onView: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-animate bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col cursor-pointer"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        animationDelay: `${index * 60}ms`,
        // Subtle lift on hover via CSS transition
        transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06)",
        borderColor: hovered ? accentColor + "55" : "#e5e7eb",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-gray-50" style={{ height: 180 }}>
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          className="product-img w-full h-full object-cover"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER(product.name); }}
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            backgroundColor: "rgba(0,0,0,0.22)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <span
            className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow"
            style={{
              transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
              opacity: hovered ? 1 : 0,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Name + Button */}
      <div className="p-3 flex flex-col gap-2 text-center">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h4>
        <button
          className="w-full py-2 rounded-lg text-xs font-semibold border"
          style={{
            color: hovered ? "#fff" : accentColor,
            borderColor: hovered ? accentColor : accentColor + "60",
            backgroundColor: hovered ? accentColor : tagColor,
            transition: "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
          }}
        >
          Lihat Gambar &amp; Detail
        </button>
      </div>
    </div>
  );
}

// ─── Category Tab ──────────────────────────────────────────────────────────────

function CategoryTab({
  category,
  isActive,
  onClick,
}: {
  category: ProductCategory;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`tab-btn flex flex-col items-start px-5 py-3 border-b-2 whitespace-nowrap text-left flex-shrink-0 ${isActive ? "active" : ""}`}
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        borderBottomColor: isActive ? category.accentColor : "transparent",
        color: isActive ? category.accentColor : "#6b7280",
      }}
    >
      <span className="font-semibold text-sm" style={{ transition: "color 0.2s ease" }}>
        {category.title}
      </span>
      <span className="text-xs mt-0.5 opacity-60">{category.subtitle}</span>
    </button>
  );
}

// ─── Product Grid with re-mount key for stagger ────────────────────────────────

function ProductGrid({
  category,
  onView,
}: {
  category: ProductCategory;
  onView: (product: ProductItem) => void;
}) {
  // key change → re-mounts grid → re-triggers stagger animations
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {category.products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          accentColor={category.accentColor}
          tagColor={category.tagColor}
          index={i}
          onView={() => onView(product)}
        />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function Product() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [gridKey, setGridKey] = useState(0); // force re-mount for stagger
  const [modalProduct, setModalProduct] = useState<{
    product: ProductItem;
    accentColor: string;
  } | null>(null);

  const current = categories.find((c) => c.id === activeCategory)!;

  function handleTabChange(id: string) {
    setActiveCategory(id);
    setGridKey((k) => k + 1); // re-trigger card animations
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <section
        id="produk"
        className="min-h-screen py-14 px-4"
        style={{
          backgroundColor: "#f8fafc",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Page Header — fades in on mount ── */}
          <div className="mb-8" style={{ animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
            >
              Katalog
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Produk Kami</h2>
            <p className="text-sm text-gray-400 mt-1">
              Gas industri &amp; medis, peralatan kriogenik, regulator, dan sistem pasokan laser cutting.
            </p>
          </div>

          {/* ── Category Tabs ── */}
          <div
            className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-1 scrollbar-hide"
            style={{ animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 80ms both" }}
          >
            {categories.map((cat) => (
              <CategoryTab
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={() => handleTabChange(cat.id)}
              />
            ))}
          </div>

          {/* ── Category info bar ── */}
          <div
            key={activeCategory + "-label"}
            className="flex items-center justify-between mb-5 tab-label-animate"
          >
            <div>
              <h3 className="text-base font-bold text-gray-800">{current.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{current.subtitle}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {current.products.length} produk
            </span>
          </div>

          {/* ── Product Grid — re-keyed per tab ── */}
          <div key={gridKey}>
            <ProductGrid category={current} onView={(p) => setModalProduct({ product: p, accentColor: current.accentColor })} />
          </div>

        </div>
      </section>

      {/* ── Modal ── */}
      {modalProduct && (
        <ProductModal
          product={modalProduct.product}
          accentColor={modalProduct.accentColor}
          onClose={() => setModalProduct(null)}
        />
      )}
    </>
  );
}

export default Product;
    