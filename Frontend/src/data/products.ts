export type ProductVariant = {
  /** Product slug to open when this variant is chosen. */
  id: string;
  /** Short label shown in the picker, e.g. "2x2". */
  label: string;
  /** Set when the catalog has no dedicated product per size — appended as `?size=` so the
   *  detail page and WhatsApp enquiry know which size the visitor picked. */
  size?: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery?: string[];
  specifications?: { label: string; value: string }[];
  isFeatured?: boolean;
  /** When present, this card represents a group of size variants (e.g. Cradle) and opens a picker instead of navigating. */
  variants?: ProductVariant[];
};

export type SubCategory = {
  title: string;
  products: Product[];
};

export type MainCategory = "gas" | "package" | "services" | "equipment";

export interface ProductCategories {
  gas: Record<string, SubCategory>;
  package: Record<string, SubCategory>;
  services: Record<string, SubCategory>;
  equipment: Record<string, SubCategory>;
}

export const mainCategoryIds: MainCategory[] = ["gas", "package", "services"];
