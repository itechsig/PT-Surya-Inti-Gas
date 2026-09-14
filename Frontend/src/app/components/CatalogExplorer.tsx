import { useState } from "react";
import type { CatalogTypeGroup, CatalogStockItem, CatalogLegendEntry } from "../../data/catalogTypes";
import { catalogItemTitle } from "../../data/catalogTypes";
import "../../styles/CatalogExplorer.css";

export interface CatalogSelection {
  category: CatalogTypeGroup;
  item: CatalogStockItem;
}

interface CatalogExplorerProps {
  categories: CatalogTypeGroup[];
  legend?: CatalogLegendEntry[];
  /** aria-label for the left-hand nav, e.g. "Jenis Valve". */
  navLabel: string;
  placeholder: string;
  /** Notified with the picked jenis + item, or null once either is cleared/changed. */
  onSelectionChange?: (selection: CatalogSelection | null) => void;
}

/**
 * Master-detail browser reused across equipment product detail pages (Valve,
 * Regulator, ...): left-hand list of jenis, with actual stocked items
 * (brand/model/connection/pressure) shown as spec cards on selection. Picking an
 * item card is required before the surrounding page will enable its WhatsApp CTA.
 */
export function CatalogExplorer({ categories, legend, navLabel, placeholder, onSelectionChange }: CatalogExplorerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || null;

  // When an item has a `label` (e.g. "Front Part Medical Gas Outlet Oxygen"), that's the
  // meaningful title — brand/model become spec rows instead of being folded into the title,
  // since for those items the brand alone (often "LOKAL") isn't what tells items apart.
  const itemTitle = catalogItemTitle;

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSelectedItemId(null);
    onSelectionChange?.(null);
  };

  const handleSelectItem = (category: CatalogTypeGroup, item: CatalogStockItem) => {
    const nextId = selectedItemId === item.id ? null : item.id;
    setSelectedItemId(nextId);
    onSelectionChange?.(nextId ? { category, item } : null);
  };

  return (
    <div className="catalog-explorer">
      <nav className="catalog-explorer-sidebar" aria-label={navLabel}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`catalog-explorer-nav-item ${activeCategoryId === category.id ? "active" : ""}`}
            onClick={() => handleSelectCategory(category.id)}
            aria-current={activeCategoryId === category.id}
          >
            <span className="catalog-explorer-nav-icon">›</span>
            <span>{category.name}</span>
          </button>
        ))}
      </nav>

      <div className="catalog-explorer-panel">
        {!activeCategory && <p className="catalog-explorer-placeholder">{placeholder}</p>}

        {activeCategory && (
          <>
            <h3 className="catalog-explorer-detail-title">{activeCategory.name}</h3>
            <p className="catalog-explorer-detail-description">{activeCategory.description}</p>
            <h4 className="catalog-explorer-models-title">Item Tersedia</h4>
            <p className="catalog-explorer-item-hint">Pilih salah satu item di bawah untuk menanyakan ketersediaannya via WhatsApp.</p>
            <div className="catalog-explorer-items">
              {activeCategory.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`catalog-explorer-item-card ${selectedItemId === item.id ? "selected" : ""}`}
                  onClick={() => handleSelectItem(activeCategory, item)}
                  aria-pressed={selectedItemId === item.id}
                >
                  <div className="catalog-explorer-item-header">
                    <span className="catalog-explorer-item-title">{itemTitle(item)}</span>
                    {item.material && <span className="catalog-explorer-item-badge">{item.material}</span>}
                    {item.condition && (
                      <span className="catalog-explorer-item-badge catalog-explorer-item-badge--condition">
                        {item.condition}
                      </span>
                    )}
                  </div>
                  <dl className="catalog-explorer-item-specs">
                    {item.label && item.brand && (
                      <div className="catalog-explorer-item-spec">
                        <dt>Merek</dt>
                        <dd>{item.brand}</dd>
                      </div>
                    )}
                    {item.label && item.model && (
                      <div className="catalog-explorer-item-spec">
                        <dt>Model</dt>
                        <dd>{item.model}</dd>
                      </div>
                    )}
                    {item.connection && (
                      <div className="catalog-explorer-item-spec">
                        <dt>Koneksi</dt>
                        <dd>{item.connection}</dd>
                      </div>
                    )}
                    {item.pressure && (
                      <div className="catalog-explorer-item-spec">
                        <dt>Tekanan Kerja</dt>
                        <dd>{item.pressure}</dd>
                      </div>
                    )}
                  </dl>
                </button>
              ))}
            </div>
            {legend && legend.length > 0 && (
              <p className="catalog-explorer-legend">
                {legend.map((entry) => `${entry.code}: ${entry.label}`).join(" · ")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
