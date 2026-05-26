// API Configuration
const getApiBaseUrl = (): string => {
  // Try to get from Vite environment variable, fallback to localhost
  return (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Chatbot endpoints (public)
  CHAT: '/api/chat/stream',
  CHATBOT: '/api/chatbot',
  FEEDBACK: '/api/chatbot/feedback',

  // Admin endpoints (require authentication)
  FEEDBACK_STATS: '/api/admin/chatbot/feedback/stats',
  ANALYTICS: '/api/admin/chatbot/analytics',

  // Other endpoints (public)
  TEAM: '/api/team',
  PROJECTS: '/api/projects',
  CERTIFICATIONS: '/api/certifications',
  CONTACT: '/api/contact',
  HEALTH: '/api/health',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
