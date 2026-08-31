import type { ProductCategories, Product, SubCategory } from "../data/products";

/** Virtual sub-category id used in the gas tab. */
export const RELATED_EQUIPMENT_ID = "related-equipment";

/**
 * True when a CMS product-category slug should be surfaced under "Related Equipment"
 * in the gas tab — currently "Regulator & Valves" and "Medical Gas Supply Equipment".
 * Matched by keyword so it keeps working if an admin re-creates the category with a
 * slightly different slug.
 */
export function isRelatedEquipmentSlug(slug: string): boolean {
  const s = slug.toLowerCase();
  if (s.includes("regulator") || s.includes("valve")) return true;
  if (s.includes("medical") && /(equipment|instrument|supply|apparatus)/.test(s)) return true;
  if (s.includes("related-equipment") || s.includes("related_equipment")) return true;
  return false;
}

/**
 * Collects the "Related Equipment" products. These live under the `equipment` main
 * category in the CMS (which has no tab of its own), so the gas tab exposes them as a
 * virtual sub-category. Scans every main-category bucket and de-dupes by id.
 */
export function getRelatedEquipmentProducts(categories: ProductCategories): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];

  for (const bucket of Object.values(categories)) {
    if (!bucket) continue;
    for (const [slug, sub] of Object.entries(bucket as Record<string, SubCategory>)) {
      if (!isRelatedEquipmentSlug(slug)) continue;
      for (const product of sub?.products ?? []) {
        if (!seen.has(product.id)) {
          seen.add(product.id);
          out.push(product);
        }
      }
    }
  }

  return out;
}
