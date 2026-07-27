export type ApplicationStatus = 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';

export interface CareerApplication {
  id: number;
  nama: string;
  email: string;
  no_hp: string | null;
  alamat: string | null;
  posisi: string;
  pendidikan: string | null;
  pengalaman: string | null;
  cover_letter: string | null;
  cv_path: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: ApplicationStatus;
  ai_summary: string | null;
  ai_score: number | null;
  ai_insights: unknown | null;
  notes: string | null;
  reviewed_by: { id: number; name: string } | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface CareerApplicationStatistics {
  total: number;
  pending: number;
  reviewed: number;
  interview: number;
  rejected: number;
  hired: number;
  high_quality: number;
  by_position: { posisi: string; count: number }[];
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Menunggu',
  reviewed: 'Ditinjau',
  interview: 'Interview',
  rejected: 'Ditolak',
  hired: 'Diterima',
};

export const STATUS_BADGE_VARIANT: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  reviewed: 'outline',
  interview: 'default',
  rejected: 'destructive',
  hired: 'default',
};
