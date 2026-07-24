export type Product = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery?: string[];
  specifications?: { label: string; value: string }[];
  isFeatured?: boolean;
};

export type SubCategory = {
  title: string;
  products: Product[];
};

export type MainCategory = "gas" | "equipment";

export interface ProductCategories {
  gas: Record<string, SubCategory>;
  equipment: Record<string, SubCategory>;
}

export const mainCategoryIds: MainCategory[] = ["gas", "equipment"];
