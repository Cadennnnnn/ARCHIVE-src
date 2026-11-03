
export type UserRole = 'Administrador' | 'Vendedor' | 'Cliente';

export interface UserProfile {
  run: string;
  apellidos: string;
  region: string;
  comuna: string;
  direccion: string;
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