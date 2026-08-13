import type { AdminRole } from '../../../context';

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface CreateUserValues {
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  password: string;
  password_confirmation: string;
  force_password_change: boolean;
}

export interface UpdateUserValues {
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
}

export interface ResetPasswordValues {
  password: string;
  password_confirmation: string;
  force_change: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface ListUsersParams {
  search?: string;
  role?: AdminRole | 'all';
  status?: 'active' | 'inactive' | 'all';
  sort_by?: 'name' | 'created_at';
  sort_dir?: 'asc' | 'desc';
  page?: number;
}
