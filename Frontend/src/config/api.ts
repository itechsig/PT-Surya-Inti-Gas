// API Configuration
const getApiBaseUrl = (): string => {
  // Try to get from Vite environment variable
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // Default to localhost for development
  return 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Chatbot endpoints (public)
  CHAT: '/api/v1/chat/stream',
  CHATBOT: '/api/v1/chatbot',
  FEEDBACK: '/api/v1/chatbot/feedback',

  // Admin endpoints (require authentication)
  FEEDBACK_STATS: '/api/v1/admin/chatbot/feedback/stats',
  ANALYTICS: '/api/v1/admin/chatbot/analytics',

  // Dashboard endpoints (admin)
  DASHBOARD_OVERVIEW: '/api/v1/admin/dashboard/overview',
  DASHBOARD_CONTACTS: '/api/v1/admin/dashboard/contacts',
  DASHBOARD_CONTACT_DETAILS: '/api/v1/admin/dashboard/contacts',
  DASHBOARD_ANALYTICS: '/api/v1/admin/dashboard/analytics',

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

  // Other endpoints (public)
  TEAM: '/api/v1/team',
  PROJECTS: '/api/v1/projects',
  CERTIFICATIONS: '/api/v1/certifications',
  CONTACT: '/api/v1/contact',
  CAREER: '/api/v1/career',
  HEALTH: '/api/v1/health',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
