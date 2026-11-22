import type {
  SavedPaymentMethod,
  SavedPaymentType,
  ShippingAddress,
} from '../types/user';
import { apiFetch } from './httpClient';
import { normalizeChileanMobilePhone } from '../utils/validation/authValidation';

type AddressData = Omit<ShippingAddress, 'id' | 'isDefault'>;
type PaymentData = Omit<SavedPaymentMethod, 'id' | 'isDefault'>;

/** Forma de una dirección tal como la devuelve el backend. */
interface BackendDireccion {
  id: number;
  alias: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  departamento: string | null;
  region: string;
  comuna: string;
  indicaciones: string | null;
  esPredeterminada: boolean;
}

/** Forma de un método de pago tal como lo devuelve el backend. */
interface BackendMetodoPago {
  id: number;
  tipo: 'TARJETA_CREDITO' | 'TARJETA_DEBITO';
  marca: string;
  ultimosCuatro: string;
  titular: string;
  mesExpiracion: string;
  anioExpiracion: string;
  esPredeterminado: boolean;
}

const TIPO_BACKEND_A_FRONTEND: Record<string, SavedPaymentType> = {
  TARJETA_CREDITO: 'Tarjeta de crédito',
  TARJETA_DEBITO: 'Tarjeta de débito',
};

const TIPO_FRONTEND_A_BACKEND: Record<SavedPaymentType, string> = {
  'Tarjeta de crédito': 'TARJETA_CREDITO',
  'Tarjeta de débito': 'TARJETA_DEBITO',
};

function toShippingAddress(data: BackendDireccion): ShippingAddress {
  return {
    id: String(data.id),
    alias: data.alias,
    nombre: data.nombre,
    apellidos: data.apellidos,
    telefono: data.telefono,
    direccion: data.direccion,
    departamento: data.departamento ?? '',
    region: data.region,
    comuna: data.comuna,
    indicaciones: data.indicaciones ?? '',
    isDefault: data.esPredeterminada,
  };
}

function toSavedPaymentMethod(data: BackendMetodoPago): SavedPaymentMethod {
  return {
    id: String(data.id),
    tipo: TIPO_BACKEND_A_FRONTEND[data.tipo],
    marca: data.marca,
    ultimosCuatro: data.ultimosCuatro,
    titular: data.titular,
    mesExpiracion: data.mesExpiracion,
    anioExpiracion: data.anioExpiracion,
    isDefault: data.esPredeterminado,
  };
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

  return normalized;
}

// --- Direcciones --------------------------------------------------------

export async function getAddresses(userId: string): Promise<ShippingAddress[]> {
  const data = await apiFetch<BackendDireccion[]>(`/direcciones/usuario/${userId}`);
  return data.map(toShippingAddress);
}

export async function addShippingAddress(
  userId: string,
  data: AddressData,
): Promise<ShippingAddress[]> {
  const normalized = normalizeAddress(data);
  const current = await getAddresses(userId);

  await apiFetch('/direcciones', {
    method: 'POST',
    body: JSON.stringify({
      usuario: { id: Number(userId) },
      ...normalized,
      esPredeterminada: current.length === 0,
    }),
  });

  return getAddresses(userId);
}

export async function removeShippingAddress(
  userId: string,
  addressId: string,
): Promise<ShippingAddress[]> {
  const current = await getAddresses(userId);
  const target = current.find((address) => address.id === addressId);

  if (!target) {
    throw new Error('No se encontró la dirección seleccionada.');
  }

  await apiFetch(`/direcciones/${addressId}`, { method: 'DELETE' });

  const remaining = current.filter((address) => address.id !== addressId);

  if (target.isDefault && remaining.length > 0) {
    return setDefaultShippingAddress(userId, remaining[0].id);
  }

  return remaining;
}

export async function setDefaultShippingAddress(
  userId: string,
  addressId: string,
): Promise<ShippingAddress[]> {
  const current = await getAddresses(userId);

  if (!current.some((address) => address.id === addressId)) {
    throw new Error('No se encontró la dirección seleccionada.');
  }

  // El backend guarda la entidad completa en cada PUT, así que hay que
  // reenviar cada dirección con su bandera "esPredeterminada" actualizada.
  await Promise.all(
    current
      .filter((address) => address.isDefault !== (address.id === addressId))
      .map((address) =>
        apiFetch(`/direcciones/${address.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            usuario: { id: Number(userId) },
            alias: address.alias,
            nombre: address.nombre,
            apellidos: address.apellidos,
            telefono: address.telefono,
            direccion: address.direccion,
            departamento: address.departamento,
            region: address.region,
            comuna: address.comuna,
            indicaciones: address.indicaciones,
            esPredeterminada: address.id === addressId,
          }),
        }),
      ),
  );

  return getAddresses(userId);
}

// --- Métodos de pago ------------------------------------------------------

export async function getPaymentMethods(
  userId: string,
): Promise<SavedPaymentMethod[]> {
  const data = await apiFetch<BackendMetodoPago[]>(`/metodos-pago/usuario/${userId}`);
  return data.map(toSavedPaymentMethod);
}

export async function addSavedPaymentMethod(
  userId: string,
  data: PaymentData,
): Promise<SavedPaymentMethod[]> {
  const normalized = normalizePayment(data);
  const current = await getPaymentMethods(userId);

  await apiFetch('/metodos-pago', {
    method: 'POST',
    body: JSON.stringify({
      usuario: { id: Number(userId) },
      tipo: TIPO_FRONTEND_A_BACKEND[normalized.tipo],
      marca: normalized.marca,
      ultimosCuatro: normalized.ultimosCuatro,
      titular: normalized.titular,
      mesExpiracion: normalized.mesExpiracion,
      anioExpiracion: normalized.anioExpiracion,
      esPredeterminado: current.length === 0,
    }),
  });

  return getPaymentMethods(userId);
}

export async function removeSavedPaymentMethod(
  userId: string,
  paymentId: string,
): Promise<SavedPaymentMethod[]> {
  const current = await getPaymentMethods(userId);
  const target = current.find((method) => method.id === paymentId);

  if (!target) {
    throw new Error('No se encontró el método de pago seleccionado.');
  }

  await apiFetch(`/metodos-pago/${paymentId}`, { method: 'DELETE' });

  const remaining = current.filter((method) => method.id !== paymentId);

  if (target.isDefault && remaining.length > 0) {
    return setDefaultPaymentMethod(userId, remaining[0].id);
  }

  return remaining;
}

export async function setDefaultPaymentMethod(
  userId: string,
  paymentId: string,
): Promise<SavedPaymentMethod[]> {
  const current = await getPaymentMethods(userId);

  if (!current.some((method) => method.id === paymentId)) {
    throw new Error('No se encontró el método de pago seleccionado.');
  }

  await Promise.all(
    current
      .filter((method) => method.isDefault !== (method.id === paymentId))
      .map((method) =>
        apiFetch(`/metodos-pago/${method.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            usuario: { id: Number(userId) },
            tipo: TIPO_FRONTEND_A_BACKEND[method.tipo],
            marca: method.marca,
            ultimosCuatro: method.ultimosCuatro,
            titular: method.titular,
            mesExpiracion: method.mesExpiracion,
            anioExpiracion: method.anioExpiracion,
            esPredeterminado: method.id === paymentId,
          }),
        }),
      ),
  );

  return getPaymentMethods(userId);
}
