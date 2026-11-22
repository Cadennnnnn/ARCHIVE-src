/**
 * roleMapper.ts
 * ----------------------------------------------------------------------
 * El backend guarda el rol como un enum de Java en mayúsculas y sin
 * tilde (ADMINISTRADOR, VENDEDOR, CLIENTE). El frontend usa un texto
 * más amigable para mostrar en la interfaz (Administrador, Vendedor,
 * Cliente). Estas dos funciones traducen entre ambos formatos.
 */

import type { UserRole } from '../types/user';

const ROL_BACKEND_A_FRONTEND: Record<string, UserRole> = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente',
};

const ROL_FRONTEND_A_BACKEND: Record<UserRole, string> = {
  Administrador: 'ADMINISTRADOR',
  Vendedor: 'VENDEDOR',
  Cliente: 'CLIENTE',
};

/** Convierte el rol que manda el backend (ej: "CLIENTE") al formato del frontend ("Cliente"). */
export function mapRolBackendAFrontend(rolBackend: string): UserRole {
  const rol = ROL_BACKEND_A_FRONTEND[rolBackend];

  if (!rol) {
    throw new Error(`Rol desconocido recibido del backend: ${rolBackend}`);
  }

  return rol;
}

/** Convierte el rol del frontend (ej: "Cliente") al formato que espera el backend ("CLIENTE"). */
export function mapRolFrontendABackend(rolFrontend: UserRole): string {
  return ROL_FRONTEND_A_BACKEND[rolFrontend];
}
