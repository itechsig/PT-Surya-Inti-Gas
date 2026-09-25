import { API_ENDPOINTS } from '../../../config/api';
import { apiRequest } from '../../../utils/apiClient';
import type {
  AnalyticsRangeParams,
  CampaignRow,
  DeviceBreakdown,
  EventCountRow,
  FunnelStage,
  SearchConsoleSummary,
  TopPageRow,
  TrafficSourceRow,
  TrafficTrendPoint,
} from './types';

type ApiResponse<T> = { success: boolean; message?: string; data: T };

function rangeQuery(params: AnalyticsRangeParams): string {
  const query = new URLSearchParams({ range: params.range });
  if (params.range === 'custom') {
    if (params.start) query.set('start', params.start);
    if (params.end) query.set('end', params.end);
  }
  return query.toString();
}

export function getTrafficTrend(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<TrafficTrendPoint[]>>(`${API_ENDPOINTS.ANALYTICS_TRAFFIC_TREND}?${rangeQuery(params)}`);
}

export function getTrafficSource(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<TrafficSourceRow[]>>(
    `${API_ENDPOINTS.ANALYTICS_TRAFFIC_SOURCE}?${rangeQuery(params)}`
  );
}

export function getCampaignPerformance(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<CampaignRow[]>>(`${API_ENDPOINTS.ANALYTICS_CAMPAIGNS}?${rangeQuery(params)}`);
}

export function getTopPages(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<TopPageRow[]>>(`${API_ENDPOINTS.ANALYTICS_TOP_PAGES}?${rangeQuery(params)}`);
}

export function getFunnel(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<FunnelStage[]>>(`${API_ENDPOINTS.ANALYTICS_FUNNEL}?${rangeQuery(params)}`);
}

export function getEventCounts(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<EventCountRow[]>>(`${API_ENDPOINTS.ANALYTICS_EVENTS}?${rangeQuery(params)}`);
}

export function getDeviceBreakdown(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<DeviceBreakdown>>(
    `${API_ENDPOINTS.ANALYTICS_DEVICE_BREAKDOWN}?${rangeQuery(params)}`
  );
}

export function getSearchConsoleSummary(params: AnalyticsRangeParams) {
  return apiRequest<ApiResponse<SearchConsoleSummary>>(
    `${API_ENDPOINTS.ANALYTICS_SEARCH_CONSOLE}?${rangeQuery(params)}`
  );
}
