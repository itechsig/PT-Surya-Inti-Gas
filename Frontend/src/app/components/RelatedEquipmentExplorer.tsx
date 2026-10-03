import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Product } from "../../data/products";
import { getImageUrl } from "../../utils/imageUrl";

type Crumb = { label: string; onClick?: () => void };

interface RelatedEquipmentExplorerProps {
  /** The Valve / Regulator / Instrumen Medis "products" shown in the Related Equipment grid. */
  products: Product[];
  lang: string;
  /** Breadcrumb crumbs before this step, e.g. [Produk & Layanan, Kemasan & Peralatan]. */
  parentCrumbs: Crumb[];
  /** Label for this whole sub-category, e.g. "Peralatan Pendukung Gas Industri". */
  parentLabel: string;
  /** Goes back out of Related Equipment, to the Kemasan & Peralatan overview. */
  onBack: () => void;
  backLabel: string;
}

// Breadcrumb trail — click any earlier crumb to jump back to that step. Mirrors the
// one in Product.tsx/ProductsAndServices.tsx so this page reads as ONE continuous path.
function Breadcrumb({ items }: { items: Crumb[] }) {
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
 * The "Related Equipment" grid (Valve, Regulator, Instrumen Medis). Picking one goes
 * straight to its detail page, where the jenis + tipe are picked as text checkboxes.
 */
export function RelatedEquipmentExplorer({ products, lang, parentCrumbs, parentLabel, onBack, backLabel }: RelatedEquipmentExplorerProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Old links still carry the former in-grid jenis/tipe drill-down (`equipment`,
  // `jenis`) — forward them to the detail page, which now hosts that selection.
  const legacyEquipmentId = searchParams.get('equipment');
  const legacyJenisId = searchParams.get('jenis');
  useEffect(() => {
    if (!legacyEquipmentId) return;
    const base = `/${lang}/produk/detail?id=${encodeURIComponent(legacyEquipmentId)}`;
    navigate(legacyJenisId ? `${base}&jenis=${encodeURIComponent(legacyJenisId)}` : base, { replace: true });
  }, [legacyEquipmentId, legacyJenisId, lang, navigate]);

  return (
    <div>
      <Breadcrumb items={[...parentCrumbs, { label: parentLabel }]} />
      <button type="button" onClick={onBack} className="products-tab" style={{ marginBottom: '20px' }}>
        ← {backLabel}
      </button>
      <div className="products-flow-heading" style={{ marginBottom: '24px' }}>
        <h2>{parentLabel}</h2>
      </div>
      <div className="products-grid-compact">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="products-card-compact"
            aria-label={product.title}
            onClick={() => navigate(`/${lang}/produk/detail?id=${product.id}`)}
          >
            <div
              className="products-card-compact-image"
              style={{ backgroundImage: `url(${getImageUrl(product.image)})` }}
            />
            <div className="products-card-compact-title">{product.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
