export interface AuditLogRecord {
  id: number;
  user_id: number | null;
  action_type: string;
  entity_type: string | null;
  entity_id: number | null;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
  reverted_at: string | null;
  reverted_by: number | null;
  reverted_by_user: { id: number; name: string; email: string } | null;
}

// Entity types that AuditLogController::restore() can act on — mirrors the backend's
// RESTORABLE_ENTITIES map. 'user' is deliberately absent (see backend comment).
export const RESTORABLE_ENTITY_TYPES = new Set([
  'role', 'hero_slide', 'product', 'gallery_item', 'portfolio', 'job_vacancy', 'career_application', 'blocked_user',
]);

export function isRestorable(log: AuditLogRecord): boolean {
  return (
    log.action_type !== 'restore' &&
    log.reverted_at === null &&
    log.entity_type !== null &&
    RESTORABLE_ENTITY_TYPES.has(log.entity_type) &&
    (log.old_values !== null || log.new_values !== null)
  );
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuditLogStatistics {
  total: number;
  recent_24h: number;
  recent_7d: number;
  recent_30d: number;
  by_action: { action_type: string; count: number }[];
  by_entity: { entity_type: string; count: number }[];
}

export interface AuditLogTimelinePoint {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export const ACTION_TYPE_LABELS: Record<string, string> = {
  create_user: 'Buat User',
  update_user: 'Perbarui User',
  change_role: 'Ubah Peran',
  reset_password: 'Reset Kata Sandi',
  activate_user: 'Aktifkan User',
  deactivate_user: 'Nonaktifkan User',
  delete_user: 'Hapus User',

  create_role: 'Buat Role',
  update_role: 'Perbarui Role',
  delete_role: 'Hapus Role',

  create_hero_slide: 'Buat Hero Slide',
  update_hero_slide: 'Perbarui Hero Slide',
  delete_hero_slide: 'Hapus Hero Slide',

  create_product: 'Buat Produk',
  update_product: 'Perbarui Produk',
  delete_product: 'Hapus Produk',

  create_gallery_item: 'Buat Item Galeri',
  update_gallery_item: 'Perbarui Item Galeri',
  delete_gallery_item: 'Hapus Item Galeri',

  create_portfolio: 'Buat Portofolio',
  update_portfolio: 'Perbarui Portofolio',
  delete_portfolio: 'Hapus Portofolio',

  create_job_vacancy: 'Buat Lowongan Kerja',
  update_job_vacancy: 'Perbarui Lowongan Kerja',
  delete_job_vacancy: 'Hapus Lowongan Kerja',

  update_career_application: 'Perbarui Lamaran Kerja',
  delete_career_application: 'Hapus Lamaran Kerja',

  create_blocked_user: 'Blokir Pengguna',
  update_blocked_user: 'Buka Blokir Pengguna',
  delete_blocked_user: 'Hapus Catatan Blokir',

  restore: 'Pulihkan Aktivitas',
};

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  user: 'User',
  role: 'Role',
  hero_slide: 'Hero Slide',
  product: 'Produk',
  gallery_item: 'Galeri',
  portfolio: 'Portofolio',
  job_vacancy: 'Lowongan Kerja',
  career_application: 'Lamaran Kerja',
  blocked_user: 'Blokir Pengguna',
};
