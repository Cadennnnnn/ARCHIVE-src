

import type {
  AuthCredentials,
  AuthSession,
} from '../types/auth';

import type { User } from '../types/user';

import { findUserByEmail } from './userService';

const SESSION_STORAGE_KEY = 'ARCHIVE_AUTH_SESSION';

const LEGACY_ROLE_KEY = 'ARCHIVE_AUTH_ROLE';
const LEGACY_EMAIL_KEY = 'ARCHIVE_USER_EMAIL';
const LEGACY_NAME_KEY = 'ARCHIVE_USER_NAME';

function createSession(user: User): AuthSession {
  const { password: _password, ...publicUser } = user;

  return {
    user: publicUser,
    role: user.rol,
  };
}

export function authenticate(
  credentials: AuthCredentials,
): AuthSession {
  const user = findUserByEmail(credentials.correo);

  if (!user || user.password !== credentials.password) {
    throw new Error('Correo electrónico o contraseña incorrectos.');
  }

  const session = createSession(user);

  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );

  localStorage.setItem(LEGACY_ROLE_KEY, user.rol);
  localStorage.setItem(LEGACY_EMAIL_KEY, user.correo);
  localStorage.setItem(LEGACY_NAME_KEY, user.nombre);

  return session;
}

export function getCurrentSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      return null;
    }

    const session: AuthSession = JSON.parse(storedSession);

    if (!session.user?.id || !session.user?.correo || !session.role) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(LEGACY_ROLE_KEY);
  localStorage.removeItem(LEGACY_EMAIL_KEY);
  localStorage.removeItem(LEGACY_NAME_KEY);
}