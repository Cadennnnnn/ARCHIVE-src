
import type { AuthSession } from '../types/auth';
import type { User, UserRole } from '../types/user';
import {
  findUserByEmail,
  getUsers,
} from './userService';

const AUTH_SESSION_KEY = 'ARCHIVE_AUTH_SESSION';
const AUTH_ROLE_KEY = 'ARCHIVE_AUTH_ROLE';
const USER_EMAIL_KEY = 'ARCHIVE_USER_EMAIL';
const USER_NAME_KEY = 'ARCHIVE_USER_NAME';

const VALID_ROLES: readonly UserRole[] = [
  'Administrador',
  'Vendedor',
  'Cliente',
];

function isValidRole(role: unknown): role is UserRole {
  return (
    typeof role === 'string' &&
    VALID_ROLES.includes(role as UserRole)
  );
}

function isValidStoredSession(
  value: unknown,
): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;
  const user = session.user;

  if (typeof user !== 'object' || user === null) {
    return false;
  }

  const storedUser = user as Record<string, unknown>;

  return (
    typeof storedUser.id === 'string' &&
    storedUser.id.length > 0 &&
    typeof storedUser.correo === 'string' &&
    typeof storedUser.nombre === 'string' &&
    isValidRole(session.role) &&
    storedUser.rol === session.role
  );
}


function createSession(user: User): AuthSession {
  const publicUser = Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'password'),
  ) as Omit<User, 'password'>;

  return {
    user: publicUser,
    role: user.rol,
  };
}

function persistSession(session: AuthSession): void {
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify(session),
  );
  localStorage.setItem(AUTH_ROLE_KEY, session.role);
  localStorage.setItem(USER_EMAIL_KEY, session.user.correo);
  localStorage.setItem(USER_NAME_KEY, session.user.nombre);
}

export function authenticate(
  correo: string,
  password: string,
): AuthSession | null {
  const user = findUserByEmail(correo);

  if (
    !user ||
    user.password !== password ||
    !isValidRole(user.rol)
  ) {
    return null;
  }

  const session = createSession(user);
  persistSession(session);

  return session;
}

export function getCurrentSession(): AuthSession | null {
  const storedSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession: unknown = JSON.parse(storedSession);

    if (!isValidStoredSession(parsedSession)) {
      clearSession();
      return null;
    }

    const user = getUsers().find(
      (storedUser) =>
        storedUser.id === parsedSession.user.id &&
        storedUser.correo === parsedSession.user.correo &&
        storedUser.rol === parsedSession.role,
    );

    if (!user || !isValidRole(user.rol)) {
      clearSession();
      return null;
    }

    const refreshedSession = createSession(user);
    persistSession(refreshedSession);

    return refreshedSession;
  } catch {
    clearSession();
    return null;
  }
}

export function refreshSession(user: User): AuthSession {
  const session = createSession(user);
  persistSession(session);

  return session;
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}
