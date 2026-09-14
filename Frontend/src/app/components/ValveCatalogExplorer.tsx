import { VALVE_CATEGORIES, MATERIAL_LEGEND } from "../../data/valveCatalog";
import { CatalogExplorer } from "./CatalogExplorer";

/** Valve product page: jenis valve on the left, stocked items (brand/model/connection/pressure) on the right. */
export function ValveCatalogExplorer() {
  return (
    <CatalogExplorer
      categories={VALVE_CATEGORIES}
      legend={MATERIAL_LEGEND}
      navLabel="Jenis Valve"
      placeholder="Pilih jenis valve di sebelah kiri untuk melihat penjelasan dan daftar item yang tersedia."
    />
  );
}
