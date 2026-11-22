/**
 * httpClient.ts
 * ----------------------------------------------------------------------
 * Cliente HTTP simple para hablar con el backend Spring Boot.
 * Centraliza 3 cosas:
 *  1) La URL base de la API.
 *  2) El guardado/lectura del token JWT (en localStorage).
 *  3) Una función `apiFetch` que arma la petición (headers, token,
 *     JSON) y lanza un error legible si el backend responde con error.
 *
 * Los demás servicios (authService, productService, etc.) van a usar
 * `apiFetch` en vez de llamar a `fetch` directamente.
 */

// URL base del backend. Si en el futuro cambia (por ejemplo al desplegar),
// solo se edita esta constante.
export const API_BASE_URL = "http://localhost:8080/api/v1";

// Clave usada para guardar el token JWT en localStorage.
const TOKEN_KEY = "TIENDA_AUTH_TOKEN";

/** Guarda el token JWT recibido en el login/registro. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Obtiene el token JWT guardado, o null si no hay sesión activa. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token guardado (logout). */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Hace una petición HTTP al backend agregando automáticamente:
 * - La URL base.
 * - El header "Content-Type: application/json" (si hay body).
 * - El header "Authorization: Bearer <token>" (si hay sesión activa).
 *
 * Si el backend responde con un código de error (4xx/5xx), lanza un
 * Error con el mensaje que mandó el backend (o uno genérico).
 *
 * Si la respuesta no tiene contenido (ej: un DELETE que responde 204),
 * devuelve undefined en vez de intentar parsear JSON vacío.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const mensaje = await obtenerMensajeError(response);
    throw new Error(mensaje);
  }

  // 204 No Content u otras respuestas sin cuerpo.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Intenta leer un mensaje de error legible desde la respuesta del backend. */
async function obtenerMensajeError(response: Response): Promise<string> {
  try {
    const texto = await response.text();
    if (!texto) {
      return `Error ${response.status}: ${response.statusText}`;
    }
    // El backend a veces responde un string plano (ej: "Ya existe...")
    // y otras veces un JSON (ej: errores de validación de Spring).
    try {
      const data = JSON.parse(texto);
      return data.message ?? data.error ?? texto;
    } catch {
      return texto;
    }
  } catch {
    return `Error ${response.status}: ${response.statusText}`;
  }
}
