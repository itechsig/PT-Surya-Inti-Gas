/**
 * Shared shape for the "jenis -> stok item" master-detail catalogs used on equipment
 * product detail pages (Valve, Regulator, ...). Data itself lives in per-product files
 * (valveCatalog.ts, regulatorCatalog.ts) since it's a static reference list, not
 * something managed through the CMS.
 */

export interface CatalogStockItem {
  /** Slug unik untuk key React. */
  id: string;
  /** Dipakai sebagai judul kartu ketika item tidak punya merek (mis. varian generik). */
  label?: string;
  /** Material/kelas badan atau standar acuan, mis. "BR" (Brass), "SS316", "BZ (EN 1626)". */
  material?: string;
  brand?: string;
  model?: string;
  connection?: string;
  /** Rating/rentang tekanan kerja, mis. "INLET 500psi · OUTLET 225-450psi". */
  pressure?: string;
  /** Catatan kondisi, mis. "Refurbished". */
  condition?: string;
}

export interface CatalogTypeGroup {
  /** Slug unik untuk key React & state aktif. */
  id: string;
  /** Nama jenis, ditampilkan di daftar. */
  name: string;
  /** Penjelasan umum tentang fungsi & aplikasi jenis ini. */
  description: string;
  items: CatalogStockItem[];
}

export interface CatalogLegendEntry {
  code: string;
  label: string;
}
