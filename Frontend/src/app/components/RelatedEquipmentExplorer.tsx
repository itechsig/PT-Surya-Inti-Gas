import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Layers } from "lucide-react";
import type { Product } from "../../data/products";
import { EQUIPMENT_CATALOGS } from "../../data/equipmentCatalogs";
import { catalogItemTitle } from "../../data/catalogTypes";
import { getImageUrl } from "../../utils/imageUrl";

interface RelatedEquipmentExplorerProps {
  /** The Valve / Regulator / Instrumen Medis "products" shown in the Related Equipment grid. */
  products: Product[];
  lang: string;
}

// Breadcrumb trail — click any earlier crumb to jump back to that step. Mirrors the
// one in Product.tsx/ProductsAndServices.tsx so this drill-down reads the same way.
function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="products-breadcrumb" aria-label="breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="products-breadcrumb-item">
            {item.onClick ? (
              <button type="button" onClick={item.onClick} className="products-breadcrumb-link">{item.label}</button>
            ) : (
              <span className="products-breadcrumb-current">{item.label}</span>
            )}
            {!isLast && <ChevronRight size={13} className="products-breadcrumb-sep" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * Inline jenis -> tipe drill-down for the "Related Equipment" grid (Valve, Regulator,
 * Instrumen Medis). Picking Valve or a jenis never navigates away — it just expands the
 * next grid in place, exactly like picking a gas sub-category. Only picking a tipe
 * navigates, to its own detail page (description + specs + ordering info).
 */
export function RelatedEquipmentExplorer({ products, lang }: RelatedEquipmentExplorerProps) {
  const navigate = useNavigate();
  const [activeEquipmentId, setActiveEquipmentId] = useState<string | null>(null);
  const [activeJenisId, setActiveJenisId] = useState<string | null>(null);

  const activeEquipment = products.find((p) => p.id === activeEquipmentId) || null;
  const catalog = activeEquipmentId ? EQUIPMENT_CATALOGS[activeEquipmentId] : null;
  const activeJenis = catalog?.categories.find((c) => c.id === activeJenisId) || null;

  const backToEquipment = () => {
    setActiveEquipmentId(null);
    setActiveJenisId(null);
  };

  const backToJenis = () => setActiveJenisId(null);

  // Level 1: pick Valve / Regulator / Instrumen Medis — same photo+name cards as any
  // other product grid, but picking one expands the jenis grid instead of navigating.
  if (!activeEquipment || !catalog) {
    return (
      <div className="products-grid-compact">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="products-card-compact"
            aria-label={product.title}
            onClick={() =>
              EQUIPMENT_CATALOGS[product.id]
                ? setActiveEquipmentId(product.id)
                : navigate(`/${lang}/produk/detail?id=${product.id}`)
            }
          >
            <div
              className="products-card-compact-image"
              style={{ backgroundImage: `url(${getImageUrl(product.image)})` }}
            />
            <div className="products-card-compact-title">{product.title}</div>
          </button>
        ))}
      </div>
    );
  }

  // Level 2: pick a jenis within the chosen equipment — plain picker, no description.
  if (!activeJenis) {
    return (
      <div>
        <Breadcrumb items={[{ label: activeEquipment.title, onClick: backToEquipment }, { label: catalog.navLabel }]} />
        <button type="button" onClick={backToEquipment} className="products-tab" style={{ marginBottom: '20px' }}>
          ← Kembali ke {activeEquipment.title}
        </button>
        <div className="products-flow-heading" style={{ marginBottom: '24px' }}>
          <h2>{catalog.navLabel}</h2>
          <p>Pilih jenis di bawah ini untuk melihat tipe/model yang tersedia.</p>
        </div>
        <div className="picker-grid picker-grid--sub" role="list" aria-label={catalog.navLabel}>
          {catalog.categories.map((category) => (
            <button key={category.id} type="button" className="picker-card" onClick={() => setActiveJenisId(category.id)}>
              <div className="picker-card-icon">
                <Layers size={32} aria-hidden="true" />
              </div>
              <div className="picker-card-title">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level 3: pick a tipe/model — this is what finally navigates, to its own detail page.
  return (
    <div>
      <Breadcrumb
        items={[
          { label: activeEquipment.title, onClick: backToEquipment },
          { label: catalog.navLabel, onClick: backToJenis },
          { label: activeJenis.name },
        ]}
      />
      <button type="button" onClick={backToJenis} className="products-tab" style={{ marginBottom: '20px' }}>
        ← Kembali ke {catalog.navLabel}
      </button>
      <div className="products-flow-heading" style={{ marginBottom: '24px' }}>
        <h2>{activeJenis.name}</h2>
        <p>Pilih tipe/model yang tersedia di bawah ini.</p>
      </div>
      <div className="products-grid-compact">
        {activeJenis.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="products-card-compact"
            aria-label={catalogItemTitle(item)}
            onClick={() => navigate(`/${lang}/produk/detail?id=${activeEquipmentId}&jenis=${activeJenisId}&tipe=${item.id}`)}
          >
            {/* No product photos yet for these stock items — the box stays as a plain
                placeholder until real photos are uploaded, same layout so it's a
                drop-in swap later. */}
            <div className="products-card-compact-image" />
            <div className="products-card-compact-title">{catalogItemTitle(item)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
