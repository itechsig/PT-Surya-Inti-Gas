import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminHeroSlide, HeroSlideFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listHeroSlides() {
  return apiRequest<ApiResponse<AdminHeroSlide[]>>(API_ENDPOINTS.ADMIN_HERO_SLIDES);
}

function toFormData(values: Partial<HeroSlideFormValues>): FormData {
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

export function createHeroSlide(values: HeroSlideFormValues) {
  return apiRequest<ApiResponse<AdminHeroSlide>>(API_ENDPOINTS.ADMIN_HERO_SLIDES, {
    method: 'POST',
    body: toFormData(values),
  });
}

export function updateHeroSlide(id: number, values: Partial<HeroSlideFormValues>) {
  // Laravel doesn't parse multipart bodies on PUT/PATCH, so updates POST with a _method override.
  const formData = toFormData(values);
  formData.append('_method', 'PUT');
  return apiRequest<ApiResponse<AdminHeroSlide>>(`${API_ENDPOINTS.ADMIN_HERO_SLIDES}/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export function deleteHeroSlide(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_HERO_SLIDES}/${id}`, {
    method: 'DELETE',
  });
}

export function toggleHeroSlideActive(id: number) {
  return apiRequest<ApiResponse<AdminHeroSlide>>(`${API_ENDPOINTS.ADMIN_HERO_SLIDES}/${id}/toggle-active`, {
    method: 'PATCH',
  });
}

export function reorderHeroSlides(order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_HERO_SLIDES}/reorder`, {
    method: 'POST',
    body: { order },
  });
}
