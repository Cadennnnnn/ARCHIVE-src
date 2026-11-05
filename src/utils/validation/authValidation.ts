

import type { UserRegistrationData } from '../../types/user';

export type ValidationErrors = Partial<
  Record<keyof UserRegistrationData, string>
>;

const ALLOWED_EMAIL_DOMAINS = [
  '@duoc.cl',
  '@profesor.duoc.cl',
  '@gmail.com',
];

export function validateRun(run: string): boolean {
  return /^[0-9]{7,8}[0-9K]$/i.test(run.trim());
}

export function validateEmail(email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();

  const validFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizedEmail,
  );

  const validDomain = ALLOWED_EMAIL_DOMAINS.some((domain) =>
    normalizedEmail.endsWith(domain),
  );

  return normalizedEmail.length <= 100 && validFormat && validDomain;
}

export function validatePassword(password: string): boolean {
  return /^[a-zA-Z0-9]{4,10}$/.test(password);
}

export function normalizeChileanMobilePhone(
  phone: string,
): string | null {
  const cleanedPhone = phone.trim().replace(/[\s()-]/g, '');
  const digits = cleanedPhone.replace(/^\+/, '');

  let nationalNumber: string;

  if (digits.startsWith('569') && digits.length === 11) {
    nationalNumber = digits.slice(2);
  } else if (digits.startsWith('9') && digits.length === 9) {
    nationalNumber = digits;
  } else {
    return null;
  }

  if (!/^9\d{8}$/.test(nationalNumber)) {
    return null;
  }

  return `+56${nationalNumber}`;
}

export function validateChileanMobilePhone(phone: string): boolean {
  return normalizeChileanMobilePhone(phone) !== null;
}

export function validateRegistration(
  data: UserRegistrationData,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.run.trim()) {
    errors.run = 'El RUN es obligatorio.';
  } else if (!validateRun(data.run)) {
    errors.run =
      'RUN inválido. Utiliza entre 7 y 9 caracteres sin puntos ni guion.';
  }

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (data.nombre.trim().length > 50) {
    errors.nombre = 'El nombre no puede superar los 50 caracteres.';
  }

  if (!data.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son obligatorios.';
  } else if (data.apellidos.trim().length > 100) {
    errors.apellidos = 'Los apellidos no pueden superar los 100 caracteres.';
  }

  if (!data.correo.trim()) {
    errors.correo = 'El correo electrónico es obligatorio.';
  } else if (!validateEmail(data.correo)) {
    errors.correo =
      'Solo se autorizan cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }

  if (!data.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (!validatePassword(data.password)) {
    errors.password =
      'La contraseña debe tener entre 4 y 10 caracteres alfanuméricos.';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas ingresadas no coinciden.';
  }

  if (!data.region) {
    errors.region = 'Debes seleccionar una región.';
  }

  if (!data.comuna) {
    errors.comuna = 'Debes seleccionar una comuna.';
  }

  if (!data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria.';
  } else if (data.direccion.trim().length > 300) {
    errors.direccion = 'La dirección no puede superar los 300 caracteres.';
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
