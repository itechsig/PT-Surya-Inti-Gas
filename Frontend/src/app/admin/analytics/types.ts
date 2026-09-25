export type AnalyticsRange = '7d' | '30d' | '90d' | '180d' | '365d' | 'custom';

export interface AnalyticsRangeParams {
  range: AnalyticsRange;
  /** yyyy-mm-dd — only read when range === 'custom' */
  start?: string;
  end?: string;
}

export interface TrafficTrendPoint {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface TrafficSourceRow {
  channel: string;
  users: number;
  sessions: number;
  percentage: number;
}

export interface CampaignRow {
  source: string;
  campaign: string | null;
  users: number;
  sessions: number;
  conversions: number;
}

export interface TopPageRow {
  page: string;
  views: number;
  users: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface EventCountRow {
  event_type: string;
  label: string;
  count: number;
}

export interface DeviceBreakdownRow {
  label: string;
  count: number;
}

export interface DeviceBreakdown {
  browsers: DeviceBreakdownRow[];
  operating_systems: DeviceBreakdownRow[];
}

export interface SearchConsoleQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export type SearchConsoleSummary =
  | { connected: false }
  | {
      connected: true;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
      queries: SearchConsoleQueryRow[];
    };
