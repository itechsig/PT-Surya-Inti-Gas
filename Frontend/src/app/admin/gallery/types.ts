export interface AdminGalleryItem {
  id: number;
  title_id: string;
  title_en: string | null;
  title_zh: string | null;
  description_id: string;
  description_en: string | null;
  description_zh: string | null;
  detailed_description_id: string | null;
  detailed_description_en: string | null;
  detailed_description_zh: string | null;
  category: string;
  year: number;
  size: string;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItemFormValues {
  title_id: string;
  title_en: string;
  title_zh: string;
  description_id: string;
  description_en: string;
  description_zh: string;
  detailed_description_id: string;
  detailed_description_en: string;
  detailed_description_zh: string;
  category: string;
  year: number;
  size: string;
  is_active: boolean;
  image: File | null;
}

export const GALLERY_CATEGORIES = [
  { value: 'products', label: 'Produk' },
  { value: 'package', label: 'Package' },
  { value: 'facility', label: 'Fasilitas' },
  { value: 'activities', label: 'Kegiatan' },
  { value: 'projects', label: 'Proyek' },
] as const;

export const GALLERY_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'wide', label: 'Wide' },
  { value: 'tall', label: 'Tall' },
] as const;
