

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

import type {
  UserProfileUpdateData,
  UserRegistrationData,
} from '../types/user';

import { AuthContext } from './AuthContextDefinition';

import {
  authenticate,
  clearSession,
  getCurrentSession,
  updateSessionUser,
  register as registerRequest,
} from '../services/authService';

import { updateUser } from '../services/userService';

interface AuthProviderProps {
  children: ReactNode;
}

function getInitialSession(): AuthSession | null {
  try {
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
      const authenticatedSession = await authenticate(
        credentials.correo,
        credentials.password,
      );

      setSession(authenticatedSession);

      return authenticatedSession;
    },
    [],
  );

  const register = useCallback(
    async (data: UserRegistrationData): Promise<AuthSession> => {
      const newSession = await registerRequest(data);

      setSession(newSession);

      return newSession;
    },
    [],
  );

  const logout = useCallback((): void => {
    clearSession();
    setSession(null);
  }, []);

  const updateAccount = useCallback(
    async (data: UserProfileUpdateData): Promise<AuthSession> => {
      if (!session) {
        throw new Error('Debes iniciar sesión para actualizar tu perfil.');
      }

      const updatedUser = await updateUser(session.user.id, data);
      const updatedSession = updateSessionUser(updatedUser);

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
      register,
      logout,
      updateAccount,
    }),
    [session, isLoading, login, register, logout, updateAccount],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
