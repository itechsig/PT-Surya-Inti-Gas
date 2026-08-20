export type MainCategory = 'gas' | 'package' | 'services';

export interface AdminProductCategory {
  id: number;
  main_category: MainCategory;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
}

export const MAIN_CATEGORY_LABELS: Record<MainCategory, string> = {
  gas: 'Gas',
  package: 'Package',
  services: 'Services',
};

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface AdminProduct {
  id: number;
  product_category_id: number;
  category: { id: number; main_category: MainCategory; slug: string; name_id: string } | null;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
  description_id: string;
  description_en: string | null;
  description_zh: string | null;
  full_description_id: string | null;
  full_description_en: string | null;
  full_description_zh: string | null;
  image: string;
  gallery: string[];
  specifications: ProductSpecification[];
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductInteractionRow {
  product_slug: string;
  count: number;
}

export interface ProductInteractionStatistics {
  views: ProductInteractionRow[];
  whatsapp_clicks: ProductInteractionRow[];
}

export interface ProductFormValues {
  product_category_id: string;
  slug: string;
  name_id: string;
  name_en: string;
  name_zh: string;
  description_id: string;
  description_en: string;
  description_zh: string;
  full_description_id: string;
  full_description_en: string;
  full_description_zh: string;
  is_featured: boolean;
  is_published: boolean;
  image: File | null;
  newGalleryFiles: File[];
  existingGallery: string[];
  specifications: ProductSpecification[];
}
