/**
 * Looks up the jenis -> tipe catalog for each "Related Equipment" product (Valve,
 * Regulator, Instrumen Medis). Keyed by the CMS product id so the grid step and
 * ProductDetail can both resolve a jenis/tipe pair from the same source.
 */
import type { CatalogTypeGroup, CatalogLegendEntry } from "./catalogTypes";
import { VALVE_CATEGORIES, MATERIAL_LEGEND as VALVE_MATERIAL_LEGEND } from "./valveCatalog";
import { REGULATOR_CATEGORIES, MATERIAL_LEGEND as REGULATOR_MATERIAL_LEGEND } from "./regulatorCatalog";
import { MEDICAL_EQUIPMENT_CATEGORIES, STANDARD_LEGEND } from "./medicalEquipmentCatalog";

export interface EquipmentCatalogEntry {
  categories: CatalogTypeGroup[];
  legend?: CatalogLegendEntry[];
  /** Heading for the jenis picker step, e.g. "Jenis Valve". */
  navLabel: string;
}

export const EQUIPMENT_CATALOGS: Record<string, EquipmentCatalogEntry> = {
  valve: { categories: VALVE_CATEGORIES, legend: VALVE_MATERIAL_LEGEND, navLabel: "Jenis Valve" },
  reg: { categories: REGULATOR_CATEGORIES, legend: REGULATOR_MATERIAL_LEGEND, navLabel: "Jenis Regulator" },
  mdc: { categories: MEDICAL_EQUIPMENT_CATEGORIES, legend: STANDARD_LEGEND, navLabel: "Jenis Instrumen Medis" },
};
