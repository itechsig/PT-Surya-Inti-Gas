export interface AdminJobVacancy {
  id: number;
  title_id: string;
  title_en: string | null;
  title_zh: string | null;
  division_id: string;
  division_en: string | null;
  division_zh: string | null;
  location_id: string;
  location_en: string | null;
  location_zh: string | null;
  type_id: string;
  type_en: string | null;
  type_zh: string | null;
  level_id: string;
  level_en: string | null;
  level_zh: string | null;
  description_id: string;
  description_en: string | null;
  description_zh: string | null;
  full_description_id: string | null;
  full_description_en: string | null;
  full_description_zh: string | null;
  requirements_id: string[];
  requirements_en: string[];
  requirements_zh: string[];
  deadline: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobVacancyFormValues {
  title_id: string; title_en: string; title_zh: string;
  division_id: string; division_en: string; division_zh: string;
  location_id: string; location_en: string; location_zh: string;
  type_id: string; type_en: string; type_zh: string;
  level_id: string; level_en: string; level_zh: string;
  description_id: string; description_en: string; description_zh: string;
  full_description_id: string; full_description_en: string; full_description_zh: string;
  requirements_id: string[]; requirements_en: string[]; requirements_zh: string[];
  deadline: string;
  is_active: boolean;
}

export const JOB_LEVELS = [
  { value: 'Entry-level', label: 'Entry-level' },
  { value: 'Mid-level', label: 'Mid-level' },
  { value: 'Senior-level', label: 'Senior-level' },
] as const;
