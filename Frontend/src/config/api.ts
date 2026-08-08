// API Configuration
//
// Base URL always comes from VITE_API_URL (set per-environment: Vercel project settings for
// production, Frontend/.env for local dev). It must never be hardcoded here, so this file can
// point at any backend without a code change. The two fallbacks below only guard against a
// misconfigured environment and must stay in sync with the real deployments:
//   - dev fallback:  local Laravel `php artisan serve` default
//   - prod fallback: current Railway backend
const PROD_FALLBACK_API_URL = 'https://ptsuryaintigas-production.up.railway.app';
const DEV_FALLBACK_API_URL = 'http://localhost:8000';

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;

  if (import.meta.env.PROD) {
    // A production build must never talk to localhost. If VITE_API_URL wasn't set at
    // build time (e.g. missing in Vercel project settings), fall back to the known
    // production backend instead of leaking a dev-only URL into the deployed bundle.
    console.error(
      '[api] VITE_API_URL is not set for this production build. ' +
      'Set it in the Vercel project environment variables. Falling back to the default production API URL.'
    );
    return PROD_FALLBACK_API_URL;
  }

  return DEV_FALLBACK_API_URL;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_ME: '/api/v1/auth/me',
  AUTH_PROFILE: '/api/v1/auth/profile',
  AUTH_PASSWORD: '/api/v1/auth/password',

  // User management endpoints (Super Admin only)
  ADMIN_USERS: '/api/v1/admin/users', // append /{id} for update/delete

  // Chatbot endpoints (public)
  CHAT: '/api/v1/chat/stream',
  CHATBOT: '/api/v1/chatbot',
  FEEDBACK: '/api/v1/chatbot/feedback',

  // Admin endpoints (require authentication)
  FEEDBACK_STATS: '/api/v1/admin/chatbot/analytics/feedback',
  ANALYTICS: '/api/v1/admin/chatbot/analytics',

  // Dashboard endpoints (admin)
  DASHBOARD_OVERVIEW: '/api/v1/admin/dashboard/overview',
  DASHBOARD_CONTACTS: '/api/v1/admin/dashboard/contacts',
  DASHBOARD_CONTACT_DETAILS: '/api/v1/admin/dashboard/contacts',

  // AI Agent endpoints (admin)
  AI_AGENT_STATUS: '/api/v1/admin/ai-agent/status',
  AI_MONITORING: '/api/v1/admin/ai-agent/monitor',
  AI_MONITOR_CONTACTS: '/api/v1/admin/ai-agent/monitor/contacts',
  AI_MONITOR_APPLICATIONS: '/api/v1/admin/ai-agent/monitor/applications',

  // AI Recommendations endpoints (admin)
  AI_RECOMMENDATIONS: '/api/v1/admin/ai-recommendations',
  AI_RECOMMENDATIONS_STATISTICS: '/api/v1/admin/ai-recommendations/statistics',
  AI_RECOMMENDATION_APPROVE: '/api/v1/admin/ai-recommendations', // append /{id}/approve
  AI_RECOMMENDATION_REJECT: '/api/v1/admin/ai-recommendations', // append /{id}/reject

  // Blocked Users endpoints (admin)
  BLOCKED_USERS: '/api/v1/admin/blocked-users',
  BLOCKED_USERS_STATISTICS: '/api/v1/admin/blocked-users/statistics',
  BLOCKED_USER_UNBLOCK: '/api/v1/admin/blocked-users', // append /{id}/unblock
  BLOCKED_USER_CHECK: '/api/v1/admin/blocked-users/check',

  // Career Applications endpoints (admin)
  CAREER_APPLICATIONS: '/api/v1/admin/career-applications',
  CAREER_APPLICATIONS_STATISTICS: '/api/v1/admin/career-applications/statistics',

  // Notifications endpoints (admin)
  NOTIFICATIONS: '/api/v1/admin/notifications',
  NOTIFICATIONS_UNREAD: '/api/v1/admin/notifications/unread',
  NOTIFICATIONS_UNREAD_COUNT: '/api/v1/admin/notifications/unread-count',
  NOTIFICATIONS_STATISTICS: '/api/v1/admin/notifications/statistics',
  NOTIFICATION_MARK_READ: '/api/v1/admin/notifications', // append /{id}/mark-read
  NOTIFICATIONS_MARK_ALL_READ: '/api/v1/admin/notifications/mark-all-read',

  // Audit Logs endpoints (admin)
  AUDIT_LOGS: '/api/v1/admin/audit-logs',
  AUDIT_LOGS_RECENT: '/api/v1/admin/audit-logs/recent',
  AUDIT_LOGS_STATISTICS: '/api/v1/admin/audit-logs/statistics',

  // Unmanned Agent endpoints (admin)
  UNMANNED_OVERVIEW: '/api/v1/admin/unmanned/overview',
  UNMANNED_AGENTS: '/api/v1/admin/unmanned/agents',
  UNMANNED_MISSIONS: '/api/v1/admin/unmanned/missions',
  UNMANNED_ALERTS: '/api/v1/admin/unmanned/alerts',
  UNMANNED_AGENT_HEALTH: '/api/v1/admin/unmanned/agent-health',
  UNMANNED_SYSTEM_ACTIVITY: '/api/v1/admin/unmanned/system-activity',
  UNMANNED_OPERATIONAL_STATS: '/api/v1/admin/unmanned/operational-stats',
  UNMANNED_MAP_DATA: '/api/v1/admin/unmanned/map-data',

  // Hero Slides endpoints
  HERO_SLIDES: '/api/v1/hero-slides', // public (GET, ?lang=id|en|zh)
  ADMIN_HERO_SLIDES: '/api/v1/admin/hero-slides', // admin CRUD; append /{id}, /{id}/toggle-active, /reorder

  // Products endpoints
  PRODUCTS_CATALOG: '/api/v1/products', // public (GET, ?lang=id|en|zh) - grouped by category
  PRODUCT_DETAIL: '/api/v1/products', // public (GET); append /{slug}?lang=
  ADMIN_PRODUCTS: '/api/v1/admin/products', // admin CRUD; append /{id}, /{id}/toggle-featured, /{id}/toggle-published, /reorder
  ADMIN_PRODUCT_CATEGORIES: '/api/v1/admin/product-categories', // admin (read-only list for the category picker)

  // Gallery endpoints
  GALLERY: '/api/v1/gallery', // public (GET, ?lang=id|en|zh)
  ADMIN_GALLERY: '/api/v1/admin/gallery', // admin CRUD; append /{id}, /{id}/toggle-active, /reorder

  // Job Vacancies endpoints
  JOB_VACANCIES: '/api/v1/job-vacancies', // public (GET, ?lang=id|en|zh)
  ADMIN_JOB_VACANCIES: '/api/v1/admin/job-vacancies', // admin CRUD; append /{id}, /{id}/toggle-active, /reorder

  // Portfolio endpoints
  PORTFOLIOS: '/api/v1/portfolios', // public (GET, ?lang=id|en|zh&industry=&service=&status=&search=&page=)
  PORTFOLIO_DETAIL: '/api/v1/portfolios', // public (GET); append /{slug}?lang=
  INDUSTRIES: '/api/v1/industries', // public (read-only list for the filter UI)
  SERVICE_TYPES: '/api/v1/service-types', // public (read-only list for the filter UI)
  ADMIN_PORTFOLIOS: '/api/v1/admin/portfolios', // admin CRUD; append /{id}, /{id}/toggle-featured, /{id}/toggle-published, /reorder, /{id}/images
  ADMIN_INDUSTRIES: '/api/v1/admin/industries', // admin (read-only list for the industry picker)
  ADMIN_SERVICE_TYPES: '/api/v1/admin/service-types', // admin (read-only list for the service type picker)

  // Other endpoints (public)
  TEAM: '/api/v1/team',
  PROJECTS: '/api/v1/projects',
  CERTIFICATIONS: '/api/v1/certifications',
  CONTACT: '/api/v1/contact',
  CAREER: '/api/v1/career',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
