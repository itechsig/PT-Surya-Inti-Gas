import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { apiRequest, getAuthToken, setAuthToken, clearAuthToken, ApiError } from '../utils/apiClient';

// ─── Types ────────────────────────────────────────────────────
export type AdminRole = 'administrator' | 'editor' | 'content_manager';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
}

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiRequest<{ success: boolean; data: { user: AdminUser } }>(API_ENDPOINTS.AUTH_ME)
      .then((res) => setUser(res.data.user))
      .catch(() => clearAuthToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest<{ success: boolean; data: { user: AdminUser; token: string } }>(
      API_ENDPOINTS.AUTH_LOGIN,
      { method: 'POST', body: { email, password }, auth: false }
    );
    setAuthToken(res.data.token);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest(API_ENDPOINTS.AUTH_LOGOUT, { method: 'POST' });
    } catch (error) {
      // Even if the server call fails (e.g. token already expired), proceed to clear locally
      if (!(error instanceof ApiError)) {
        throw error;
      }
    } finally {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  const hasRole = useCallback(
    (role: AdminRole | AdminRole[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
