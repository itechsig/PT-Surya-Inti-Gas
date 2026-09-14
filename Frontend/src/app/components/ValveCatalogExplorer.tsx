import { useState } from "react";
import {
  VALVE_CATEGORIES,
  OTHER_VALVE_CATEGORIES,
  OTHER_VALVES_ID,
  OTHER_VALVES_LABEL,
  type ValveEntry,
} from "../../data/valveCatalog";
import "../../styles/ValveCatalogExplorer.css";

/**
 * Master-detail browser for the Valve product page: left-hand list of valve jenis,
 * with type codes shown on selection. "Other Valves" drills one level deeper into
 * its own sub-jenis before showing type codes.
 */
export function ValveCatalogExplorer() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | null>(null);

  const activeCategory = VALVE_CATEGORIES.find((c) => c.id === activeCategoryId) || null;
  const isOtherValves = activeCategoryId === OTHER_VALVES_ID;
  const activeSubCategory = isOtherValves
    ? OTHER_VALVE_CATEGORIES.find((c) => c.id === activeSubCategoryId) || null
    : null;

  const selectCategory = (id: string) => {
    setActiveCategoryId(id);
    setActiveSubCategoryId(null);
  };

  const renderDetail = (entry: ValveEntry) => (
    <>
      <h3 className="valve-explorer-detail-title">{entry.name}</h3>
      <p className="valve-explorer-detail-description">{entry.description}</p>
      <h4 className="valve-explorer-models-title">Tipe / Model</h4>
      <ul className="valve-explorer-models">
        {entry.models.map((model) => (
          <li key={model} className="valve-explorer-model-item">
            {model}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="valve-explorer">
      <nav className="valve-explorer-sidebar" aria-label="Jenis Valve">
        {VALVE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`valve-explorer-nav-item ${activeCategoryId === category.id ? "active" : ""}`}
            onClick={() => selectCategory(category.id)}
            aria-current={activeCategoryId === category.id}
          >
            <span className="valve-explorer-nav-icon">›</span>
            <span>{category.name}</span>
          </button>
        ))}
        <button
          type="button"
          className={`valve-explorer-nav-item ${isOtherValves ? "active" : ""}`}
          onClick={() => selectCategory(OTHER_VALVES_ID)}
          aria-current={isOtherValves}
        >
          <span className="valve-explorer-nav-icon">›</span>
          <span>{OTHER_VALVES_LABEL}</span>
        </button>
      </nav>

      <div className="valve-explorer-panel">
        {!activeCategoryId && (
          <p className="valve-explorer-placeholder">
            Pilih jenis valve di sebelah kiri untuk melihat penjelasan dan daftar tipenya.
          </p>
        )}

        {activeCategory && renderDetail(activeCategory)}

        {isOtherValves && !activeSubCategory && (
          <nav className="valve-explorer-subsidebar" aria-label="Jenis Other Valves">
            {OTHER_VALVE_CATEGORIES.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className="valve-explorer-nav-item"
                onClick={() => setActiveSubCategoryId(sub.id)}
              >
                <span className="valve-explorer-nav-icon">›</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </nav>
        )}

        {activeSubCategory && (
          <div className="valve-explorer-subdetail">
            <button
              type="button"
              className="valve-explorer-back"
              onClick={() => setActiveSubCategoryId(null)}
            >
              ‹ {OTHER_VALVES_LABEL}
            </button>
            {renderDetail(activeSubCategory)}
          </div>
        )}
      </div>
    </div>
  );
}
