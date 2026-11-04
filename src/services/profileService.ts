

import type {
  SavedPaymentMethod,
  ShippingAddress,
  User,
} from '../types/user';


import { getUsers } from './userService';

import {
  normalizeChileanMobilePhone,
} from '../utils/validation/authValidation';

const USERS_STORAGE_KEY = 'ARCHIVE_USERS';

type AddressData = Omit<ShippingAddress, 'id' | 'isDefault'>;
type PaymentData = Omit<SavedPaymentMethod, 'id' | 'isDefault'>;

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function saveUser(updatedUser: User): User {
  const users = getUsers();
  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user,
  );

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

  return updatedUser;
}

function findUser(userId: string): User {
  const user = getUsers().find((item) => item.id === userId);

  if (!user) {
    throw new Error('No se encontró el usuario.');
  }

  return user;
}

function normalizeAddress(address: AddressData): AddressData {
  const normalizedPhone = normalizeChileanMobilePhone(address.telefono);

  if (!normalizedPhone) {
    throw new Error(
      'Ingresa un teléfono móvil chileno válido. Ejemplo: +56912345678.',
    );
  }

  const normalized = {
    alias: address.alias.trim(),
    nombre: address.nombre.trim(),
    apellidos: address.apellidos.trim(),
    telefono: normalizedPhone,
    direccion: address.direccion.trim(),
    departamento: address.departamento.trim(),
    region: address.region.trim(),
    comuna: address.comuna.trim(),
    indicaciones: address.indicaciones.trim(),
  };

  if (
    !normalized.alias ||
    !normalized.nombre ||
    !normalized.apellidos ||
    !normalized.direccion ||
    !normalized.region ||
    !normalized.comuna
  ) {
    throw new Error('Completa los campos obligatorios de la dirección.');
  }

  return normalized;
}

function normalizePayment(payment: PaymentData): PaymentData {
  const normalized = {
    tipo: payment.tipo,
    marca: payment.marca.trim(),
    ultimosCuatro: payment.ultimosCuatro.trim(),
    titular: payment.titular.trim(),
    mesExpiracion: payment.mesExpiracion.trim(),
    anioExpiracion: payment.anioExpiracion.trim(),
  };

  if (
    !normalized.marca ||
    !/^\d{4}$/.test(normalized.ultimosCuatro) ||
    !normalized.titular ||
    !/^(0[1-9]|1[0-2])$/.test(normalized.mesExpiracion) ||
    !/^\d{4}$/.test(normalized.anioExpiracion)
  ) {
    throw new Error('Los datos del método de pago no son válidos.');
  }

  if (
    payment.tipo !== 'Tarjeta de crédito' &&
    payment.tipo !== 'Tarjeta de débito'
  ) {
    throw new Error('El tipo de tarjeta no es válido.');
  }

  return normalized;
}

export function getUserProfile(userId: string): User {
  return findUser(userId);
}

export function addShippingAddress(
  userId: string,
  data: AddressData,
): User {
  const user = findUser(userId);
  const addressData = normalizeAddress(data);
  const addresses = user.profile?.direcciones ?? [];

  const newAddress: ShippingAddress = {
    ...addressData,
    id: createId('address'),
    isDefault: addresses.length === 0,
  };

  return saveUser({
    ...user,
    profile: {
      ...user.profile,
      run: user.profile?.run ?? '',
      apellidos: user.profile?.apellidos ?? '',
      region: user.profile?.region ?? '',
      comuna: user.profile?.comuna ?? '',
      direccion: user.profile?.direccion ?? '',
      direcciones: [...addresses, newAddress],
    },
  });
}

export function removeShippingAddress(
  userId: string,
  addressId: string,
): User {
  const user = findUser(userId);
  const addresses = user.profile?.direcciones ?? [];
  const remaining = addresses.filter(
    (address) => address.id !== addressId,
  );

  if (remaining.length === addresses.length) {
    throw new Error('No se encontró la dirección seleccionada.');
  }

  const removedDefault = addresses.some(
    (address) => address.id === addressId && address.isDefault,
  );

  if (removedDefault && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isDefault: true };
  }

  return saveUser({
    ...user,
    profile: {
      ...user.profile!,
      direcciones: remaining,
    },
  });
}

export function setDefaultShippingAddress(
  userId: string,
  addressId: string,
): User {
  const user = findUser(userId);
  const addresses = user.profile?.direcciones ?? [];

  if (!addresses.some((address) => address.id === addressId)) {
    throw new Error('No se encontró la dirección seleccionada.');
  }

  return saveUser({
    ...user,
    profile: {
      ...user.profile!,
      direcciones: addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    },
  });
}

export function addSavedPaymentMethod(
  userId: string,
  data: PaymentData,
): User {
  const user = findUser(userId);
  const paymentData = normalizePayment(data);
  const methods = user.profile?.metodosPago ?? [];

  const newMethod: SavedPaymentMethod = {
    ...paymentData,
    id: createId('payment'),
    isDefault: methods.length === 0,
  };

  return saveUser({
    ...user,
    profile: {
      ...user.profile,
      run: user.profile?.run ?? '',
      apellidos: user.profile?.apellidos ?? '',
      region: user.profile?.region ?? '',
      comuna: user.profile?.comuna ?? '',
      direccion: user.profile?.direccion ?? '',
      metodosPago: [...methods, newMethod],
    },
  });
}

export function removeSavedPaymentMethod(
  userId: string,
  paymentId: string,
): User {
  const user = findUser(userId);
  const methods = user.profile?.metodosPago ?? [];
  const remaining = methods.filter(
    (method) => method.id !== paymentId,
  );

  if (remaining.length === methods.length) {
    throw new Error('No se encontró el método de pago seleccionado.');
  }

  const removedDefault = methods.some(
    (method) => method.id === paymentId && method.isDefault,
  );

  if (removedDefault && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isDefault: true };
  }

  return saveUser({
    ...user,
    profile: {
      ...user.profile!,
      metodosPago: remaining,
    },
  });
}

export function setDefaultPaymentMethod(
  userId: string,
  paymentId: string,
): User {
  const user = findUser(userId);
  const methods = user.profile?.metodosPago ?? [];

  if (!methods.some((method) => method.id === paymentId)) {
    throw new Error('No se encontró el método de pago seleccionado.');
  }

  return saveUser({
    ...user,
    profile: {
      ...user.profile!,
      metodosPago: methods.map((method) => ({
        ...method,
        isDefault: method.id === paymentId,
      })),
    },
  });
}
