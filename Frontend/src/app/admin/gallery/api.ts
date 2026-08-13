import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminGalleryItem, GalleryItemFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listGalleryItems() {
  return apiRequest<ApiResponse<AdminGalleryItem[]>>(API_ENDPOINTS.ADMIN_GALLERY);
}

function toFormData(values: Partial<GalleryItemFormValues>): FormData {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === 'image') {
      if (value instanceof File) formData.append('image', value);
      return;
    }
    if (key === 'is_active') {
      formData.append('is_active', value ? '1' : '0');
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
}

export function createGalleryItem(values: GalleryItemFormValues) {
  return apiRequest<ApiResponse<AdminGalleryItem>>(API_ENDPOINTS.ADMIN_GALLERY, {
    method: 'POST',
    body: toFormData(values),
  });
}

export function updateGalleryItem(id: number, values: Partial<GalleryItemFormValues>) {
  // Laravel doesn't parse multipart bodies on PUT/PATCH, so updates POST with a _method override.
  const formData = toFormData(values);
  formData.append('_method', 'PUT');
  return apiRequest<ApiResponse<AdminGalleryItem>>(`${API_ENDPOINTS.ADMIN_GALLERY}/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export function deleteGalleryItem(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_GALLERY}/${id}`, {
    method: 'DELETE',
  });
}

export function toggleGalleryItemActive(id: number) {
  return apiRequest<ApiResponse<AdminGalleryItem>>(`${API_ENDPOINTS.ADMIN_GALLERY}/${id}/toggle-active`, {
    method: 'PATCH',
  });
}

export function reorderGalleryItems(order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_GALLERY}/reorder`, {
    method: 'POST',
    body: { order },
  });
}
