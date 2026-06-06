import { useState, useEffect } from 'react';
import { UnmannedAgentDashboard } from './UnmannedAgentDashboard';

// Simple auth check for demo purposes
const checkAuth = (): boolean => {
  // For development/testing purposes - allow access
  // In production, implement proper auth validation
  return true; // Allow access for testing purposes
};

export const AdminDashboardIntegrated = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For testing purposes, always allow access in development
    const isDev = import.meta.env.DEV;
    if (isDev) {
      setLoading(false);
    } else {
      if (checkAuth()) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return <UnmannedAgentDashboard />;
};