

export type UserRole = 'Administrador' | 'Vendedor' | 'Cliente';

export interface ShippingAddress {
  id: string;
  alias: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
  isDefault: boolean;
}

export type SavedPaymentType =
  | 'Tarjeta de crédito'
  | 'Tarjeta de débito';

export interface SavedPaymentMethod {
  id: string;
  tipo: SavedPaymentType;
  marca: string;
  ultimosCuatro: string;
  titular: string;
  mesExpiracion: string;
  anioExpiracion: string;
  isDefault: boolean;
}

export interface UserProfile {
  run: string;
  apellidos: string;
  region: string;
  comuna: string;
  direccion: string;
  telefono?: string;
  direcciones?: ShippingAddress[];
  metodosPago?: SavedPaymentMethod[];
}

export interface User {
  id: string;
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
  profile?: UserProfile;
}

export type PublicUser = Omit<User, 'password'>;

export interface UserRegistrationData {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  confirmPassword: string;
  region: string;
  comuna: string;
  direccion: string;
}

export interface UserProfileUpdateData {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
}
