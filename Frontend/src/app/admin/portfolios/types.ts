export interface AdminIndustry {
  id: number;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
}

export interface AdminServiceType {
  id: number;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
}

export interface AdminPortfolioImage {
  id: number;
  image: string;
  caption: string | null;
  display_order: number;
}

export interface AdminPortfolio {
  id: number;
  industry_id: number;
  industry: { id: number; slug: string; name_id: string } | null;
  service_type_id: number;
  service_type: { id: number; slug: string; name_id: string } | null;
  slug: string;
  title_id: string;
  title_en: string | null;
  title_zh: string | null;
  location_id: string;
  location_en: string | null;
  location_zh: string | null;
  completion_date: string; // ISO date, e.g. "2026-06-01"
  product_solution_id: string;
  product_solution_en: string | null;
  product_solution_zh: string | null;
  summary_id: string;
  summary_en: string | null;
  summary_zh: string | null;
  thumbnail: string;
  gallery: AdminPortfolioImage[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioFormValues {
  industry_id: string;
  service_type_id: string;
  slug: string;
  title_id: string;
  title_en: string;
  title_zh: string;
  location_id: string;
  location_en: string;
  location_zh: string;
  completionMonth: string; // <input type="month"> value, e.g. "2026-06"
  product_solution_id: string;
  product_solution_en: string;
  product_solution_zh: string;
  summary_id: string;
  summary_en: string;
  summary_zh: string;
  is_featured: boolean;
  is_published: boolean;
  thumbnail: File | null;
  newGalleryFiles: File[];
}
