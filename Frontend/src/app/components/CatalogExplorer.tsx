import { useState } from "react";
import type { CatalogTypeGroup, CatalogStockItem, CatalogLegendEntry } from "../../data/catalogTypes";
import "../../styles/CatalogExplorer.css";

interface CatalogExplorerProps {
  categories: CatalogTypeGroup[];
  legend?: CatalogLegendEntry[];
  /** aria-label for the left-hand nav, e.g. "Jenis Valve". */
  navLabel: string;
  placeholder: string;
}

/**
 * Master-detail browser reused across equipment product detail pages (Valve,
 * Regulator, ...): left-hand list of jenis, with actual stocked items
 * (brand/model/connection/pressure) shown as spec cards on selection.
 */
export function CatalogExplorer({ categories, legend, navLabel, placeholder }: CatalogExplorerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || null;

  // When an item has a `label` (e.g. "Front Part Medical Gas Outlet Oxygen"), that's the
  // meaningful title — brand/model become spec rows instead of being folded into the title,
  // since for those items the brand alone (often "LOKAL") isn't what tells items apart.
  const itemTitle = (item: CatalogStockItem) => {
    if (item.label) return item.label;
    if (item.brand && item.model) return `${item.brand} — ${item.model}`;
    return item.brand || "Item";
  };

  return (
    <div className="catalog-explorer">
      <nav className="catalog-explorer-sidebar" aria-label={navLabel}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`catalog-explorer-nav-item ${activeCategoryId === category.id ? "active" : ""}`}
            onClick={() => setActiveCategoryId(category.id)}
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
            <div className="catalog-explorer-items">
              {activeCategory.items.map((item) => (
                <div key={item.id} className="catalog-explorer-item-card">
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
                </div>
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
