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
  // Chatbot endpoints
  CHAT: '/api/chat/stream',
  CHATBOT: '/api/chatbot',
  FEEDBACK: '/api/chatbot/feedback',
  FEEDBACK_STATS: '/api/chatbot/feedback/stats',
  ANALYTICS: '/api/chatbot/analytics',
  
  // Other endpoints
  TEAM: '/api/team',
  PROJECTS: '/api/projects',
  CERTIFICATIONS: '/api/certifications',
  CONTACT: '/api/contact',
  HEALTH: '/health',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
