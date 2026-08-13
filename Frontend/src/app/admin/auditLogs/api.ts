import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type { AuditLogRecord, PaginatedResponse } from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export function listAuditLogs(params: { action_type?: string; page?: number } = {}) {
  const query = new URLSearchParams();
  if (params.action_type && params.action_type !== 'all') query.set('action_type', params.action_type);
  if (params.page) query.set('page', String(params.page));
  const qs = query.toString();
  return apiRequest<ApiResponse<PaginatedResponse<AuditLogRecord>>>(
    `${API_ENDPOINTS.AUDIT_LOGS}${qs ? `?${qs}` : ''}`
  );
}
