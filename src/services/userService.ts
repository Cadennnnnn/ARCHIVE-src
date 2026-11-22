import type { PublicUser, UserProfileUpdateData, UserRole } from '../types/user';
import { apiFetch } from './httpClient';
import { mapRolBackendAFrontend, mapRolFrontendABackend } from '../utils/roleMapper';
import { validateEmail, validateRun } from '../utils/validation/authValidation';

export interface AdminUserData {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: UserRole;
}

/** Forma de un usuario tal como lo devuelve el backend (sin password: va con @JsonIgnore). */
interface BackendUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  run: string | null;
  apellidos: string | null;
  region: string | null;
  comuna: string | null;
  direccion: string | null;
  telefono: string | null;
}

/** Convierte un usuario del backend al formato que usa el frontend. */
function toPublicUser(data: BackendUsuario): PublicUser {
  return {
    id: String(data.id),
    nombre: data.nombre,
    correo: data.email,
    rol: mapRolBackendAFrontend(data.rol),
    profile: {
      run: data.run ?? '',
      apellidos: data.apellidos ?? '',
      region: data.region ?? '',
      comuna: data.comuna ?? '',
      direccion: data.direccion ?? '',
      telefono: data.telefono ?? undefined,
    },
  };
}

/** Lista todos los usuarios del sistema (sin password). */
export async function getPublicUsers(): Promise<PublicUser[]> {
  const data = await apiFetch<BackendUsuario[]>('/usuarios');
  return data.map(toPublicUser);
}

/** Crea un usuario desde el panel de administración (Administrador, Vendedor o Cliente). */
export async function createAdminUser(data: AdminUserData): Promise<PublicUser> {
  const normalizedRun = data.run.trim().toUpperCase();
  const normalizedEmail = data.correo.trim().toLowerCase();

  if (!validateRun(normalizedRun)) {
    throw new Error('El RUN debe tener entre 7 y 9 caracteres sin puntos ni guion.');
  }

  if (!data.nombre.trim() || data.nombre.trim().length > 50) {
    throw new Error('El nombre es obligatorio y no puede superar los 50 caracteres.');
  }

  if (!data.apellidos.trim() || data.apellidos.trim().length > 100) {
    throw new Error('Los apellidos son obligatorios y no pueden superar los 100 caracteres.');
  }

  if (!validateEmail(normalizedEmail)) {
    throw new Error('Solo se autorizan cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.');
  }

  const existingUsers = await getPublicUsers();

  if (existingUsers.some((user) => user.correo.toLowerCase() === normalizedEmail)) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  if (existingUsers.some((user) => user.profile?.run?.toUpperCase() === normalizedRun)) {
    throw new Error('Ya existe una cuenta registrada con ese RUN.');
  }

  const payload = {
    nombre: data.nombre.trim(),
    email: normalizedEmail,
    password: '1234',
    rol: mapRolFrontendABackend(data.rol),
    run: normalizedRun,
  };

  const created = await apiFetch<BackendUsuario>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return toPublicUser(created);
}

/** Actualiza los datos personales del propio usuario (nombre, apellidos, correo, teléfono). */
export async function updateUser(
  userId: string,
  data: UserProfileUpdateData,
): Promise<PublicUser> {
  const normalizedEmail = data.correo.trim().toLowerCase();
  const normalizedName = data.nombre.trim();
  const normalizedSurnames = data.apellidos.trim();
  const normalizedPhone = data.telefono.trim();

  if (!normalizedName || normalizedName.length > 50) {
    throw new Error('El nombre es obligatorio y no puede superar los 50 caracteres.');
  }

  if (!normalizedSurnames || normalizedSurnames.length > 100) {
    throw new Error('Los apellidos son obligatorios y no pueden superar los 100 caracteres.');
  }

  if (!validateEmail(normalizedEmail)) {
    throw new Error('El correo ingresado no tiene un formato o dominio autorizado.');
  }

  const updated = await apiFetch<BackendUsuario>(`/usuarios/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: normalizedName,
      apellidos: normalizedSurnames,
      email: normalizedEmail,
      telefono: normalizedPhone,
    }),
  });

  return toPublicUser(updated);
}
