
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  AuthContextValue,
  AuthCredentials,
  AuthSession,
} from '../types/auth';

import { AuthContext } from './AuthContextDefinition';

import {
  authenticate,
  clearSession,
  getCurrentSession,
} from '../services/authService';

import { initializeUsers } from '../services/userService';

interface AuthProviderProps {
  children: ReactNode;
}

function getInitialSession(): AuthSession | null {
  try {
    initializeUsers();
    return getCurrentSession();
  } catch {
    clearSession();
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(
    getInitialSession,
  );

  const isLoading = false;

  const login = useCallback(
    async (credentials: AuthCredentials): Promise<AuthSession> => {
      const authenticatedSession = authenticate(credentials);

      setSession(authenticatedSession);

      return authenticatedSession;
    },
    [],
  );

  const logout = useCallback((): void => {
    clearSession();
    setSession(null);
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isLoading,
      login,
      logout,
    }),
    [session, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
