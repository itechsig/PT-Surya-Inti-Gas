import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminIndustry, AdminPortfolio, AdminPortfolioImage, AdminServiceType, PortfolioFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listPortfolios() {
  return apiRequest<ApiResponse<AdminPortfolio[]>>(API_ENDPOINTS.ADMIN_PORTFOLIOS);
}

export function listIndustries() {
  return apiRequest<ApiResponse<AdminIndustry[]>>(API_ENDPOINTS.ADMIN_INDUSTRIES);
}

export function listServiceTypes() {
  return apiRequest<ApiResponse<AdminServiceType[]>>(API_ENDPOINTS.ADMIN_SERVICE_TYPES);
}

function toFormData(values: Partial<PortfolioFormValues>): FormData {
  const formData = new FormData();

  const scalarKeys: (keyof PortfolioFormValues)[] = [
    'industry_id', 'industry_name', 'service_type_id', 'service_type_name', 'slug',
    'title_id', 'title_en', 'title_zh',
    'location_id', 'location_en', 'location_zh',
    'product_solution_id', 'product_solution_en', 'product_solution_zh',
    'summary_id', 'summary_en', 'summary_zh',
  ];
  scalarKeys.forEach((key) => {
    const value = values[key];
    if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
  });

  // <input type="month"> yields "YYYY-MM"; the API stores a full date (always day 1 of that month).
  if (values.completionMonth) formData.append('completion_date', `${values.completionMonth}-01`);

  if (values.is_featured !== undefined) formData.append('is_featured', values.is_featured ? '1' : '0');
  if (values.is_published !== undefined) formData.append('is_published', values.is_published ? '1' : '0');
  if (values.thumbnail) formData.append('thumbnail', values.thumbnail);
  if (values.newGalleryFiles) {
    values.newGalleryFiles.forEach((file) => formData.append('gallery[]', file));
  }

  return formData;
}

export function createPortfolio(values: PortfolioFormValues) {
  return apiRequest<ApiResponse<AdminPortfolio>>(API_ENDPOINTS.ADMIN_PORTFOLIOS, {
    method: 'POST',
    body: toFormData(values),
  });
}

export function updatePortfolio(id: number, values: PortfolioFormValues) {
  const formData = toFormData(values);
  formData.append('_method', 'PUT');
  return apiRequest<ApiResponse<AdminPortfolio>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export function deletePortfolio(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${id}`, { method: 'DELETE' });
}

export function togglePortfolioFeatured(id: number) {
  return apiRequest<ApiResponse<AdminPortfolio>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${id}/toggle-featured`, { method: 'PATCH' });
}

export function togglePortfolioPublished(id: number) {
  return apiRequest<ApiResponse<AdminPortfolio>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${id}/toggle-published`, { method: 'PATCH' });
}

export function reorderPortfolios(order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/reorder`, {
    method: 'POST',
    body: { order },
  });
}

export function uploadPortfolioImages(portfolioId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images[]', file));
  return apiRequest<ApiResponse<AdminPortfolioImage[]>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${portfolioId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export function reorderPortfolioImages(portfolioId: number, order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${portfolioId}/images/reorder`, {
    method: 'POST',
    body: { order },
  });
}

export function deletePortfolioImage(portfolioId: number, imageId: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PORTFOLIOS}/${portfolioId}/images/${imageId}`, {
    method: 'DELETE',
  });
}
