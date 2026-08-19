import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest, getAuthToken } from '../../../utils/apiClient';
import { getApiUrl } from '../../../config/api';
import type { CareerApplication, CareerApplicationStatistics, CareerApplicationTimelinePoint, PaginatedResponse } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listCareerApplications(params: { status?: string; search?: string; page?: number } = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  const qs = query.toString();
  return apiRequest<ApiResponse<PaginatedResponse<CareerApplication>>>(
    `${API_ENDPOINTS.CAREER_APPLICATIONS}${qs ? `?${qs}` : ''}`
  );
}

export function getCareerApplicationStatistics() {
  return apiRequest<ApiResponse<CareerApplicationStatistics>>(API_ENDPOINTS.CAREER_APPLICATIONS_STATISTICS);
}

export function getCareerApplicationTimeline() {
  return apiRequest<ApiResponse<CareerApplicationTimelinePoint[]>>(API_ENDPOINTS.CAREER_APPLICATIONS_TIMELINE);
}

export function getCareerApplication(id: number) {
  return apiRequest<ApiResponse<CareerApplication>>(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${id}`);
}

export function updateCareerApplication(id: number, values: { status?: string; notes?: string }) {
  return apiRequest<ApiResponse<CareerApplication>>(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${id}`, {
    method: 'PUT',
    body: values,
  });
}

export function deleteCareerApplication(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${id}`, { method: 'DELETE' });
}

/** Downloads the applicant's CV as a blob and triggers a browser save-as, since the endpoint requires the Bearer token a plain <a href> can't send. */
export async function downloadCareerApplicationCv(id: number, applicantName: string): Promise<void> {
  const token = getAuthToken();
  const response = await fetch(getApiUrl(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${id}/cv`), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error('Gagal mengunduh CV');
  }
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? `CV_${applicantName.replace(/\s+/g, '_')}.pdf`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
