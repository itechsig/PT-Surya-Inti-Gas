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
};
