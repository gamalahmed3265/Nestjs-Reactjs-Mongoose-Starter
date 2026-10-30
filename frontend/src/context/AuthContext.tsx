import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import apiClient, { TOKEN_STORAGE_KEY } from '../api/client';
import {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  User,
} from '../types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/signup',
      payload,
    );
    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.accessToken);
    setUser(response.data.user);
  }, []);

  const signIn = useCallback(async (payload: SignInPayload) => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/signin',
      payload,
    );
    localStorage.setItem(TOKEN_STORAGE_KEY, response.data.accessToken);
    setUser(response.data.user);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signUp,
      signIn,
      logout,
      refreshProfile,
    }),
    [user, isLoading, signUp, signIn, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

