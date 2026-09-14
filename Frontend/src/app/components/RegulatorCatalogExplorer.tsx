import { REGULATOR_CATEGORIES, MATERIAL_LEGEND } from "../../data/regulatorCatalog";
import { CatalogExplorer, type CatalogSelection } from "./CatalogExplorer";

interface RegulatorCatalogExplorerProps {
  onSelectionChange?: (selection: CatalogSelection | null) => void;
}

/** Regulator product page: jenis regulator on the left, stocked items (brand/model/connection/pressure) on the right. */
export function RegulatorCatalogExplorer({ onSelectionChange }: RegulatorCatalogExplorerProps) {
  return (
    <CatalogExplorer
      categories={REGULATOR_CATEGORIES}
      legend={MATERIAL_LEGEND}
      navLabel="Jenis Regulator"
      placeholder="Pilih jenis regulator di sebelah kiri untuk melihat penjelasan dan daftar item yang tersedia."
      onSelectionChange={onSelectionChange}
    />
  );
}
