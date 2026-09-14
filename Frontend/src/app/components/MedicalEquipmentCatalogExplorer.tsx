import { MEDICAL_EQUIPMENT_CATEGORIES, STANDARD_LEGEND } from "../../data/medicalEquipmentCatalog";
import { CatalogExplorer } from "./CatalogExplorer";

/** Medical Instrumen product page: jenis instrumen on the left, stocked items on the right. */
export function MedicalEquipmentCatalogExplorer() {
  return (
    <CatalogExplorer
      categories={MEDICAL_EQUIPMENT_CATEGORIES}
      legend={STANDARD_LEGEND}
      navLabel="Jenis Instrumen Medis"
      placeholder="Pilih jenis instrumen di sebelah kiri untuk melihat penjelasan dan daftar item yang tersedia."
    />
  );
}
