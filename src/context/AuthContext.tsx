

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

import type { UserProfileUpdateData } from '../types/user';

import { AuthContext } from './AuthContextDefinition';

import {
  authenticate,
  clearSession,
  getCurrentSession,
  refreshSession,
} from '../services/authService';

import {
  initializeUsers,
  updateUser,
} from '../services/userService';

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
      const authenticatedSession = authenticate(
        credentials.correo,
        credentials.password,
      );

      if (!authenticatedSession) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      setSession(authenticatedSession);

      return authenticatedSession;
    },
    [],
  );

  const logout = useCallback((): void => {
    clearSession();
    setSession(null);
  }, []);

  const updateAccount = useCallback(
    (data: UserProfileUpdateData): AuthSession => {
      if (!session) {
        throw new Error('Debes iniciar sesión para actualizar tu perfil.');
      }

      const updatedUser = updateUser(session.user.id, data);
      const updatedSession = refreshSession(updatedUser);

      setSession(updatedSession);

      return updatedSession;
    },
    [session],
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isLoading,
      login,
      logout,
      updateAccount,
    }),
    [session, isLoading, login, logout, updateAccount],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
