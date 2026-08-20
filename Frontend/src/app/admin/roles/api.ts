import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminRoleRecord, Permission, RoleFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listRoles() {
  return apiRequest<ApiResponse<AdminRoleRecord[]>>(API_ENDPOINTS.ADMIN_ROLES);
}

export function listPermissions() {
  return apiRequest<ApiResponse<Permission[]>>(API_ENDPOINTS.ADMIN_PERMISSIONS);
}

export function createRole(values: RoleFormValues) {
  return apiRequest<ApiResponse<AdminRoleRecord>>(API_ENDPOINTS.ADMIN_ROLES, {
    method: 'POST',
    body: { name: values.name, permissions: values.permissionIds },
  });
}

export function updateRole(id: number, values: RoleFormValues) {
  return apiRequest<ApiResponse<AdminRoleRecord>>(`${API_ENDPOINTS.ADMIN_ROLES}/${id}`, {
    method: 'PUT',
    body: { name: values.name, permissions: values.permissionIds },
  });
}

export function deleteRole(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_ROLES}/${id}`, { method: 'DELETE' });
}
