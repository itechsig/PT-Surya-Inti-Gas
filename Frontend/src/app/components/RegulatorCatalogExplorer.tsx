import { REGULATOR_CATEGORIES, MATERIAL_LEGEND } from "../../data/regulatorCatalog";
import { CatalogExplorer, type CatalogSelection } from "./CatalogExplorer";

interface RegulatorCatalogExplorerProps {
  onSelectionChange?: (selection: CatalogSelection | null) => void;
  onContactSales?: () => void;
}

/** Regulator product page: jenis regulator -> tipe/model -> detail (specs + ordering info). */
export function RegulatorCatalogExplorer({ onSelectionChange, onContactSales }: RegulatorCatalogExplorerProps) {
  return (
    <CatalogExplorer
      categories={REGULATOR_CATEGORIES}
      legend={MATERIAL_LEGEND}
      navLabel="Jenis Regulator"
      placeholder="Pilih jenis regulator di bawah untuk melihat tipe/model yang tersedia."
      onSelectionChange={onSelectionChange}
      onContactSales={onContactSales}
    />
  );
}
