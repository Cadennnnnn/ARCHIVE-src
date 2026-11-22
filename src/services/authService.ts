
import type { AuthSession } from '../types/auth';
import type { PublicUser, UserRegistrationData } from '../types/user';
import { apiFetch, clearToken, getToken, setToken } from './httpClient';
import { mapRolBackendAFrontend } from '../utils/roleMapper';

const AUTH_SESSION_KEY = 'ARCHIVE_AUTH_SESSION';

/** Forma de la respuesta que manda el backend al hacer login o registro. */
interface BackendAuthResponse {
  token: string;
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: string;
  run: string;
  region: string;
  comuna: string;
  direccion: string;
  telefono: string | null;
}

/** Arma la sesión del frontend a partir de la respuesta del backend. */
function construirSesion(data: BackendAuthResponse): AuthSession {
  const rol = mapRolBackendAFrontend(data.rol);

  return {
    user: {
      id: String(data.id),
      nombre: data.nombre,
      correo: data.correo,
      rol,
      profile: {
        run: data.run,
        apellidos: data.apellidos,
        region: data.region,
        comuna: data.comuna,
        direccion: data.direccion,
        telefono: data.telefono ?? undefined,
      },
    },
    role: rol,
  };
}

function persistSession(session: AuthSession): void {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

/** Inicia sesión contra el backend. Guarda el token JWT y la sesión. */
export async function authenticate(
  correo: string,
  password: string,
): Promise<AuthSession> {
  const data = await apiFetch<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: correo, password }),
  });

  setToken(data.token);
  const session = construirSesion(data);
  persistSession(session);

  return session;
}

/** Registra un cliente nuevo contra el backend. Guarda el token JWT y la sesión. */
export async function register(
  datos: UserRegistrationData,
): Promise<AuthSession> {
  const data = await apiFetch<BackendAuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      run: datos.run,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      password: datos.password,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion,
    }),
  });

  setToken(data.token);
  const session = construirSesion(data);
  persistSession(session);

  return session;
}

/**
 * Devuelve la sesión guardada localmente, siempre que exista un token
 * JWT activo. No vuelve a consultar el backend: confía en lo guardado
 * al momento del login/registro.
 */
export function getCurrentSession(): AuthSession | null {
  if (!getToken()) {
    return null;
  }

  const storedSession = localStorage.getItem(AUTH_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Reconstruye y guarda la sesión a partir de un usuario actualizado
 * (usado al editar el perfil). No llama al backend: solo refresca lo
 * que ya está guardado localmente con los datos ya actualizados.
 */
export function updateSessionUser(user: PublicUser): AuthSession {
  const session: AuthSession = { user, role: user.rol };

  persistSession(session);

  return session;
}

/** Cierra la sesión: borra el token JWT y los datos guardados. */
export function clearSession(): void {
  clearToken();
  localStorage.removeItem(AUTH_SESSION_KEY);
}
