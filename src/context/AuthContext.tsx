
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  AuthContextValue,
  AuthCredentials,
  AuthSession,
} from '../types/auth';

import {
  authenticate,
  clearSession,
  getCurrentSession,
} from '../services/authService';

import { initializeUsers } from '../services/userService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    initializeUsers();
    setSession(getCurrentSession());
  }, []);

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
      login,
      logout,
    }),
    [session, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}