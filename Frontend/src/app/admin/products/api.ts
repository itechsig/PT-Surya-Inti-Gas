import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AdminProduct, AdminProductCategory, ProductFormValues } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listProducts() {
  return apiRequest<ApiResponse<AdminProduct[]>>(API_ENDPOINTS.ADMIN_PRODUCTS);
}

export function listProductCategories() {
  return apiRequest<ApiResponse<AdminProductCategory[]>>(API_ENDPOINTS.ADMIN_PRODUCT_CATEGORIES);
}

function toFormData(values: Partial<ProductFormValues>): FormData {
  const formData = new FormData();

  const scalarKeys: (keyof ProductFormValues)[] = [
    'product_category_id', 'slug',
    'name_id', 'name_en', 'name_zh',
    'description_id', 'description_en', 'description_zh',
    'full_description_id', 'full_description_en', 'full_description_zh',
  ];
  scalarKeys.forEach((key) => {
    const value = values[key];
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });

  if (values.is_featured !== undefined) formData.append('is_featured', values.is_featured ? '1' : '0');
  if (values.is_published !== undefined) formData.append('is_published', values.is_published ? '1' : '0');
  if (values.specifications !== undefined) {
    formData.append('specifications', JSON.stringify(values.specifications.filter((s) => s.label && s.value)));
  }
  if (values.image) formData.append('image', values.image);
  if (values.newGalleryFiles) {
    values.newGalleryFiles.forEach((file) => formData.append('gallery[]', file));
  }
  if (values.existingGallery !== undefined) {
    formData.append('existing_gallery', JSON.stringify(values.existingGallery));
  }

  return formData;
}

export function createProduct(values: ProductFormValues) {
  return apiRequest<ApiResponse<AdminProduct>>(API_ENDPOINTS.ADMIN_PRODUCTS, {
    method: 'POST',
    body: toFormData(values),
  });
}

export function updateProduct(id: number, values: ProductFormValues) {
  const formData = toFormData(values);
  formData.append('_method', 'PUT');
  return apiRequest<ApiResponse<AdminProduct>>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export function deleteProduct(id: number) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`, { method: 'DELETE' });
}

export function toggleProductFeatured(id: number) {
  return apiRequest<ApiResponse<AdminProduct>>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}/toggle-featured`, { method: 'PATCH' });
}

export function toggleProductPublished(id: number) {
  return apiRequest<ApiResponse<AdminProduct>>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}/toggle-published`, { method: 'PATCH' });
}

export function reorderProducts(order: { id: number; display_order: number }[]) {
  return apiRequest<ApiResponse<null>>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/reorder`, {
    method: 'POST',
    body: { order },
  });
}
