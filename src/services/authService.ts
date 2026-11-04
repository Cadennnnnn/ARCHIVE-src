
import type {
  AuthCredentials,
  AuthSession,
} from '../types/auth';

import type { User, UserRole } from '../types/user';

import { initializeUsers } from './userService';

const SESSION_STORAGE_KEY = 'ARCHIVE_AUTH_SESSION';

const LEGACY_ROLE_KEY = 'ARCHIVE_AUTH_ROLE';
const LEGACY_EMAIL_KEY = 'ARCHIVE_USER_EMAIL';
const LEGACY_NAME_KEY = 'ARCHIVE_USER_NAME';

const VALID_ROLES: UserRole[] = [
  'Administrador',
  'Vendedor',
  'Cliente',
];

function createSession(user: User): AuthSession {
  const publicUser = Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'password'),
  ) as Omit<User, 'password'>;

  return {
    user: publicUser,
    role: user.rol,
  };
}

export function authenticate(
  credentials: AuthCredentials,
): AuthSession {
  const normalizedEmail = credentials.correo.trim().toLowerCase();

  const users = initializeUsers();

  const user = users.find(
    (item) => item.correo.toLowerCase() === normalizedEmail,
  );

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

    const parsedSession: unknown = JSON.parse(storedSession);

    if (
      typeof parsedSession !== 'object' ||
      parsedSession === null ||
      !('user' in parsedSession) ||
      !('role' in parsedSession)
    ) {
      clearSession();
      return null;
    }

    const session = parsedSession as AuthSession;

    if (
      !session.user?.id ||
      !session.user?.correo ||
      !VALID_ROLES.includes(session.role)
    ) {
      clearSession();
      return null;
    }

    const users = initializeUsers();

    const currentUser = users.find(
      (user) =>
        user.id === session.user.id &&
        user.correo.toLowerCase() === session.user.correo.toLowerCase(),
    );

    if (!currentUser || currentUser.rol !== session.role) {
      clearSession();
      return null;
    }

    return createSession(currentUser);
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(LEGACY_ROLE_KEY);
  localStorage.removeItem(LEGACY_EMAIL_KEY);
  localStorage.removeItem(LEGACY_NAME_KEY);
}
