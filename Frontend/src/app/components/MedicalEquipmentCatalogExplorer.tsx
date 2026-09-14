import { MEDICAL_EQUIPMENT_CATEGORIES, STANDARD_LEGEND } from "../../data/medicalEquipmentCatalog";
import { CatalogExplorer, type CatalogSelection } from "./CatalogExplorer";

interface MedicalEquipmentCatalogExplorerProps {
  onSelectionChange?: (selection: CatalogSelection | null) => void;
}

/** Medical Instrumen product page: jenis instrumen on the left, stocked items on the right. */
export function MedicalEquipmentCatalogExplorer({ onSelectionChange }: MedicalEquipmentCatalogExplorerProps) {
  return (
    <CatalogExplorer
      categories={MEDICAL_EQUIPMENT_CATEGORIES}
      legend={STANDARD_LEGEND}
      navLabel="Jenis Instrumen Medis"
      placeholder="Pilih jenis instrumen di sebelah kiri untuk melihat penjelasan dan daftar item yang tersedia."
      onSelectionChange={onSelectionChange}
    />
  );
}
