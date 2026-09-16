import { MEDICAL_EQUIPMENT_CATEGORIES, STANDARD_LEGEND } from "../../data/medicalEquipmentCatalog";
import { CatalogExplorer, type CatalogSelection } from "./CatalogExplorer";

interface MedicalEquipmentCatalogExplorerProps {
  onSelectionChange?: (selection: CatalogSelection | null) => void;
  onContactSales?: () => void;
}

/** Medical Instrumen product page: jenis instrumen -> tipe/model -> detail (specs + ordering info). */
export function MedicalEquipmentCatalogExplorer({ onSelectionChange, onContactSales }: MedicalEquipmentCatalogExplorerProps) {
  return (
    <CatalogExplorer
      categories={MEDICAL_EQUIPMENT_CATEGORIES}
      legend={STANDARD_LEGEND}
      navLabel="Jenis Instrumen Medis"
      placeholder="Pilih jenis instrumen di bawah untuk melihat tipe/model yang tersedia."
      onSelectionChange={onSelectionChange}
      onContactSales={onContactSales}
    />
  );
}
