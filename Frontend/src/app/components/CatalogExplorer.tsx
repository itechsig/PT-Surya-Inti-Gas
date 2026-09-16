import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Layers } from "lucide-react";
import type { CatalogTypeGroup, CatalogStockItem, CatalogLegendEntry } from "../../data/catalogTypes";
import { catalogItemTitle } from "../../data/catalogTypes";
import "../../styles/ProductsAndServices.css";
import "../../styles/CatalogExplorer.css";

export interface CatalogSelection {
  category: CatalogTypeGroup;
  item: CatalogStockItem;
}

interface CatalogExplorerProps {
  categories: CatalogTypeGroup[];
  legend?: CatalogLegendEntry[];
  /** Heading for the jenis picker step, e.g. "Jenis Valve". */
  navLabel: string;
  placeholder: string;
  /** Notified with the picked jenis + item, or null once either is cleared/changed. */
  onSelectionChange?: (selection: CatalogSelection | null) => void;
  /** Opens the WhatsApp order flow for the tipe picked in the detail step. Valve/Regulator/
   *  Instrumen Medis and their jenis are just plain pickers — description + ordering info
   *  only appear on the tipe's own detail page. */
  onContactSales?: () => void;
}

// Breadcrumb trail — click any earlier crumb to jump back to that step. Mirrors the
// one in Product.tsx/ProductsAndServices.tsx so the equipment browser (Valve/Regulator/
// Instrumen Medis) reads the same way as the main product browser.
function CatalogBreadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
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
 * Master-detail browser reused across equipment product detail pages (Valve, Regulator,
 * Instrumen Medis): a 3-step flow that mirrors the main product browser — pick a jenis
 * (picker cards, no description), pick a tipe/model (compact photo cards, no description
 * either), then the tipe's own detail step shows the description + specs + ordering info,
 * just like a gas cylinder's product detail page.
 */
export function CatalogExplorer({ categories, legend, navLabel, placeholder, onSelectionChange, onContactSales }: CatalogExplorerProps) {
  const { t } = useTranslation();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || null;
  const selectedItem = activeCategory?.items.find((i) => i.id === selectedItemId) || null;

  const itemTitle = catalogItemTitle;

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSelectedItemId(null);
    onSelectionChange?.(null);
  };

  const handleSelectItem = (category: CatalogTypeGroup, item: CatalogStockItem) => {
    setSelectedItemId(item.id);
    onSelectionChange?.({ category, item });
  };

  const backToJenis = () => {
    setActiveCategoryId(null);
    setSelectedItemId(null);
    onSelectionChange?.(null);
  };

  const backToTipe = () => {
    setSelectedItemId(null);
    onSelectionChange?.(null);
  };

  const rootCrumb = { label: navLabel, onClick: backToJenis };

  return (
    <div className="catalog-explorer-flow">

      {/* Step 1: pick a jenis — plain category picker, no description. */}
      {!activeCategory && (
        <div>
          <div className="products-flow-heading" style={{ marginBottom: '24px' }}>
            <h2>{navLabel}</h2>
            <p>{placeholder}</p>
          </div>
          <div className="picker-grid picker-grid--sub" role="list" aria-label={navLabel}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="picker-card"
                onClick={() => handleSelectCategory(category.id)}
              >
                <div className="picker-card-icon">
                  <Layers size={32} aria-hidden="true" />
                </div>
                <div className="picker-card-title">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: pick a tipe/model within the chosen jenis — still just a plain
          picker, no description yet (that's the tipe's own page, one step further). */}
      {activeCategory && !selectedItem && (
        <div>
          <CatalogBreadcrumb items={[rootCrumb, { label: activeCategory.name }]} />
          <button type="button" onClick={backToJenis} className="products-tab" style={{ marginBottom: '20px' }}>
            ← Kembali ke {navLabel}
          </button>
          <div className="products-flow-heading" style={{ marginBottom: '24px' }}>
            <h2>{activeCategory.name}</h2>
            <p>Pilih tipe/model yang tersedia di bawah ini.</p>
          </div>
          <div className="products-grid-compact">
            {activeCategory.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="products-card-compact"
                aria-label={itemTitle(item)}
                onClick={() => handleSelectItem(activeCategory, item)}
              >
                {/* No product photos yet for these stock items — the box stays as a
                    plain placeholder until real photos are uploaded, same layout as
                    the photo cards elsewhere so it's a drop-in swap later. */}
                <div className="products-card-compact-image" />
                <div className="products-card-compact-title">{itemTitle(item)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: the tipe's own page — description + specs + ordering info, exactly
          like a gas cylinder's product detail page. */}
      {activeCategory && selectedItem && (
        <div>
          <CatalogBreadcrumb items={[rootCrumb, { label: activeCategory.name, onClick: backToTipe }, { label: itemTitle(selectedItem) }]} />
          <button type="button" onClick={backToTipe} className="products-tab" style={{ marginBottom: '20px' }}>
            ← Kembali ke Tipe
          </button>

          <h2 className="products-detail-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '12px' }}>
            {itemTitle(selectedItem)}
          </h2>
          <p className="products-detail-description" style={{ marginBottom: '24px' }}>
            {activeCategory.description}
          </p>

          <div className="products-detail-info">
            <h3>Spesifikasi</h3>
            <div className="product-specifications">
              {selectedItem.brand && (
                <div className="spec-item">
                  <span className="spec-label">Merek</span>
                  <span className="spec-value">{selectedItem.brand}</span>
                </div>
              )}
              {selectedItem.model && (
                <div className="spec-item">
                  <span className="spec-label">Model</span>
                  <span className="spec-value">{selectedItem.model}</span>
                </div>
              )}
              {selectedItem.connection && (
                <div className="spec-item">
                  <span className="spec-label">Koneksi</span>
                  <span className="spec-value">{selectedItem.connection}</span>
                </div>
              )}
              {selectedItem.pressure && (
                <div className="spec-item">
                  <span className="spec-label">Tekanan Kerja</span>
                  <span className="spec-value">{selectedItem.pressure}</span>
                </div>
              )}
              {selectedItem.material && (
                <div className="spec-item">
                  <span className="spec-label">Material</span>
                  <span className="spec-value">{selectedItem.material}</span>
                </div>
              )}
              {selectedItem.condition && (
                <div className="spec-item">
                  <span className="spec-label">Kondisi</span>
                  <span className="spec-value">{selectedItem.condition}</span>
                </div>
              )}
            </div>
            {legend && legend.length > 0 && (
              <p className="catalog-explorer-legend">
                {legend.map((entry) => `${entry.code}: ${entry.label}`).join(" · ")}
              </p>
            )}
          </div>

          {/* Ordering info lives here — on the tipe's own page — not on the jenis
              grid or the Valve/Regulator/Instrumen Medis category page. */}
          <div className="product-contact">
            <h3>{t('productDetail.contact.title')}</h3>
            <p>{t('productDetail.contact.description')}</p>
            <button className="contact-button" onClick={onContactSales}>
              {t('productDetail.contact.button')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
