import type { PublicUser, UserRole } from './user';

export interface AuthCredentials {
  correo: string;
  password: string;
}

export interface AuthSession {
  user: PublicUser;
  role: UserRole;
}

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthSession>;
  logout: () => void;
}
