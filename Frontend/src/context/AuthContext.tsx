import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { apiRequest, getAuthToken, setAuthToken, clearAuthToken, ApiError } from '../utils/apiClient';

// ─── Types ────────────────────────────────────────────────────
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'hr';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  must_change_password: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
  updateProfile: (values: { name: string; email: string; currentPassword: string }) => Promise<void>;
  updatePassword: (values: { currentPassword: string; password: string; passwordConfirmation: string }) => Promise<void>;
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

  const updateProfile = useCallback(
    async (values: { name: string; email: string; currentPassword: string }) => {
      const res = await apiRequest<{ success: boolean; data: { user: AdminUser } }>(API_ENDPOINTS.AUTH_PROFILE, {
        method: 'PUT',
        body: { name: values.name, email: values.email, current_password: values.currentPassword },
      });
      setUser(res.data.user);
    },
    []
  );

  const updatePassword = useCallback(
    async (values: { currentPassword: string; password: string; passwordConfirmation: string }) => {
      await apiRequest(API_ENDPOINTS.AUTH_PASSWORD, {
        method: 'PUT',
        body: {
          current_password: values.currentPassword,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
        },
      });
      // The backend clears must_change_password on a successful change; mirror that locally so any
      // forced-password-change gate lifts immediately instead of waiting for the next /auth/me refresh.
      setUser((prev) => (prev ? { ...prev, must_change_password: false } : prev));
    },
    []
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
        updateProfile,
        updatePassword,
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
