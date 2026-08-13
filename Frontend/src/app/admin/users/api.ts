import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type {
  AdminUserRecord,
  CreateUserValues,
  UpdateUserValues,
  ResetPasswordValues,
  PaginatedResponse,
  ListUsersParams,
} from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listUsers(params: ListUsersParams = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.role && params.role !== 'all') query.set('role', params.role);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.sort_dir) query.set('sort_dir', params.sort_dir);
  if (params.page) query.set('page', String(params.page));
  const qs = query.toString();
  return apiRequest<ApiResponse<PaginatedResponse<AdminUserRecord>>>(
    `${API_ENDPOINTS.ADMIN_USERS}${qs ? `?${qs}` : ''}`
  );
}

export function createUser(values: CreateUserValues) {
  return apiRequest<ApiResponse<AdminUserRecord>>(API_ENDPOINTS.ADMIN_USERS, {
    method: 'POST',
    body: values,
  });
}

export function updateUser(id: number, values: UpdateUserValues) {
  return apiRequest<ApiResponse<AdminUserRecord>>(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, {
    method: 'PUT',
    body: values,
  });
}

export function resetUserPassword(id: number, values: ResetPasswordValues) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_USERS}/${id}/reset-password`, {
    method: 'PATCH',
    body: values,
  });
}

export function toggleUserStatus(id: number) {
  return apiRequest<ApiResponse<AdminUserRecord>>(`${API_ENDPOINTS.ADMIN_USERS}/${id}/toggle-status`, {
    method: 'PATCH',
  });
}

export function deleteUser(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_USERS}/${id}`, { method: 'DELETE' });
}
