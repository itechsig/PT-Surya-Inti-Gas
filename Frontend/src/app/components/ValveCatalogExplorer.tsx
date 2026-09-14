import { useState } from "react";
import { VALVE_CATEGORIES, MATERIAL_LEGEND, type ValveStockItem } from "../../data/valveCatalog";
import "../../styles/ValveCatalogExplorer.css";

/**
 * Master-detail browser for the Valve product page: left-hand list of valve jenis,
 * with actual stocked items (brand/model/connection/pressure) shown as spec cards
 * on selection.
 */
export function ValveCatalogExplorer() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = VALVE_CATEGORIES.find((c) => c.id === activeCategoryId) || null;

  const itemTitle = (item: ValveStockItem) => {
    if (item.brand && item.model) return `${item.brand} — ${item.model}`;
    if (item.brand) return item.brand;
    return item.label || "Item";
  };

  return (
    <div className="valve-explorer">
      <nav className="valve-explorer-sidebar" aria-label="Jenis Valve">
        {VALVE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`valve-explorer-nav-item ${activeCategoryId === category.id ? "active" : ""}`}
            onClick={() => setActiveCategoryId(category.id)}
            aria-current={activeCategoryId === category.id}
          >
            <span className="valve-explorer-nav-icon">›</span>
            <span>{category.name}</span>
          </button>
        ))}
      </nav>

      <div className="valve-explorer-panel">
        {!activeCategory && (
          <p className="valve-explorer-placeholder">
            Pilih jenis valve di sebelah kiri untuk melihat penjelasan dan daftar item yang tersedia.
          </p>
        )}

        {activeCategory && (
          <>
            <h3 className="valve-explorer-detail-title">{activeCategory.name}</h3>
            <p className="valve-explorer-detail-description">{activeCategory.description}</p>
            <h4 className="valve-explorer-models-title">Item Tersedia</h4>
            <div className="valve-explorer-items">
              {activeCategory.items.map((item) => (
                <div key={item.id} className="valve-explorer-item-card">
                  <div className="valve-explorer-item-header">
                    <span className="valve-explorer-item-title">{itemTitle(item)}</span>
                    {item.material && <span className="valve-explorer-item-badge">{item.material}</span>}
                    {item.condition && (
                      <span className="valve-explorer-item-badge valve-explorer-item-badge--condition">
                        {item.condition}
                      </span>
                    )}
                  </div>
                  <dl className="valve-explorer-item-specs">
                    {item.connection && (
                      <div className="valve-explorer-item-spec">
                        <dt>Koneksi</dt>
                        <dd>{item.connection}</dd>
                      </div>
                    )}
                    {item.pressure && (
                      <div className="valve-explorer-item-spec">
                        <dt>Tekanan Kerja</dt>
                        <dd>{item.pressure}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
            <p className="valve-explorer-legend">
              {MATERIAL_LEGEND.map((entry) => `${entry.code}: ${entry.label}`).join(" · ")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
