export interface AdminHeroSlide {
  id: number;
  title_id: string;
  title_en: string | null;
  title_zh: string | null;
  subtitle_id: string;
  subtitle_en: string | null;
  subtitle_zh: string | null;
  description_id: string;
  description_en: string | null;
  description_zh: string | null;
  image: string;
  cta_path: string | null;
  duration_ms: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSlideFormValues {
  title_id: string;
  title_en: string;
  title_zh: string;
  subtitle_id: string;
  subtitle_en: string;
  subtitle_zh: string;
  description_id: string;
  description_en: string;
  description_zh: string;
  cta_path: string;
  duration_ms: number;
  is_active: boolean;
  image: File | null;
}
