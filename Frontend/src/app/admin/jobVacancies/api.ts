import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminJobVacancy, JobVacancyFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listJobVacancies() {
  return apiRequest<ApiResponse<AdminJobVacancy[]>>(API_ENDPOINTS.ADMIN_JOB_VACANCIES);
}

export function createJobVacancy(values: JobVacancyFormValues) {
  return apiRequest<ApiResponse<AdminJobVacancy>>(API_ENDPOINTS.ADMIN_JOB_VACANCIES, {
    method: 'POST',
    body: values,
  });
}

export function updateJobVacancy(id: number, values: Partial<JobVacancyFormValues>) {
  return apiRequest<ApiResponse<AdminJobVacancy>>(`${API_ENDPOINTS.ADMIN_JOB_VACANCIES}/${id}`, {
    method: 'PUT',
    body: values,
  });
}

export function deleteJobVacancy(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_JOB_VACANCIES}/${id}`, {
    method: 'DELETE',
  });
}

export function toggleJobVacancyActive(id: number) {
  return apiRequest<ApiResponse<AdminJobVacancy>>(`${API_ENDPOINTS.ADMIN_JOB_VACANCIES}/${id}/toggle-active`, {
    method: 'PATCH',
  });
}

export function reorderJobVacancies(order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_JOB_VACANCIES}/reorder`, {
    method: 'POST',
    body: { order },
  });
}
