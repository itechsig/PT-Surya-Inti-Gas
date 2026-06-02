// API Configuration
const getApiBaseUrl = (): string => {
  // Try to get from Vite environment variable
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  
  // If accessed from external IP, use the same hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Don't use localhost when accessing from external IP
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000`;
    }
    
    // If frontend is on localhost:3000, backend is on localhost:8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }
  
  // Fallback to localhost for development
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
  DASHBOARD_VISITORS: '/api/v1/admin/dashboard/visitors',
  DASHBOARD_VISITOR_DETAILS: '/api/v1/admin/dashboard/visitors',
  DASHBOARD_ANALYTICS: '/api/v1/admin/dashboard/analytics',

  // Visitor tracking endpoints (public)
  VISITOR_TRACK: '/api/v1/visitor/track',
  VISITOR_PAGEVIEW: '/api/v1/visitor/pageview',

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
