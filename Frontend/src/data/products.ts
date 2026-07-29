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

export type MainCategory = "gas" | "package" | "services";

export interface ProductCategories {
  gas: Record<string, SubCategory>;
  package: Record<string, SubCategory>;
  services: Record<string, SubCategory>;
}

export const mainCategoryIds: MainCategory[] = ["gas", "package", "services"];
