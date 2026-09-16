import { VALVE_CATEGORIES, MATERIAL_LEGEND } from "../../data/valveCatalog";
import { CatalogExplorer, type CatalogSelection } from "./CatalogExplorer";

interface ValveCatalogExplorerProps {
  onSelectionChange?: (selection: CatalogSelection | null) => void;
  onContactSales?: () => void;
}

/** Valve product page: jenis valve -> tipe/model -> detail (specs + ordering info). */
export function ValveCatalogExplorer({ onSelectionChange, onContactSales }: ValveCatalogExplorerProps) {
  return (
    <CatalogExplorer
      categories={VALVE_CATEGORIES}
      legend={MATERIAL_LEGEND}
      navLabel="Jenis Valve"
      placeholder="Pilih jenis valve di bawah untuk melihat tipe/model yang tersedia."
      onSelectionChange={onSelectionChange}
      onContactSales={onContactSales}
    />
  );
}
