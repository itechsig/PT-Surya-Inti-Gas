import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminCategoryPhoto } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listCategoryPhotos() {
  return apiRequest<ApiResponse<AdminCategoryPhoto[]>>(API_ENDPOINTS.ADMIN_CATEGORY_PHOTOS);
}

export function uploadCategoryPhoto(key: string, image: File) {
  const formData = new FormData();
  formData.append('image', image);
  return apiRequest<ApiResponse<AdminCategoryPhoto>>(`${API_ENDPOINTS.ADMIN_CATEGORY_PHOTOS}/${key}`, {
    method: 'POST',
    body: formData,
  });
}

export function clearCategoryPhoto(key: string) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_CATEGORY_PHOTOS}/${key}`, { method: 'DELETE' });
}
