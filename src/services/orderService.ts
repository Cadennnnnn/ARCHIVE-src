/**
 * orderService.ts
 * ----------------------------------------------------------------------
 * Servicio de órdenes de compra. Antes se guardaban en localStorage;
 * ahora se consultan y crean contra el backend Spring Boot
 * (/api/v1/ordenes).
 */

import type { CartItem } from '../types/cart';
import type {
  Order,
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../types/order';
import type { PublicUser } from '../types/user';
import { apiFetch } from './httpClient';

/** Forma de un producto dentro del detalle, tal como la devuelve el backend. */
interface BackendProductoResumen {
  id: number;
  codigo: string;
  nombre: string;
  imagen: string | null;
}

/** Forma de un detalle (línea) de orden tal como la devuelve el backend. */
interface BackendOrdenDetalle {
  id: number;
  producto: BackendProductoResumen;
  cantidad: number;
  precioUnitario: number;
  talla: string | null;
}

/** Forma de un usuario dentro de la orden, tal como la devuelve el backend. */
interface BackendUsuarioResumen {
  id: number;
  nombre: string;
  email: string;
}

/** Forma de una orden tal como la devuelve el backend. */
interface BackendOrden {
  id: number;
  usuario: BackendUsuarioResumen;
  fechaCreacion: string;
  subtotal: number;
  total: number;
  formaPago: 'TARJETA_CREDITO' | 'TARJETA_DEBITO';
  estadoPago: 'ACEPTADO' | 'DECLINADO';
  nombreEnvio: string;
  apellidosEnvio: string;
  correoEnvio: string;
  telefonoEnvio: string;
  direccionEnvio: string;
  departamentoEnvio: string | null;
  regionEnvio: string;
  comunaEnvio: string;
  indicacionesEnvio: string | null;
  detalles: BackendOrdenDetalle[];
}

const FORMA_PAGO_BACKEND_A_FRONTEND: Record<string, PaymentMethod> = {
  TARJETA_CREDITO: 'Tarjeta de crédito',
  TARJETA_DEBITO: 'Tarjeta de débito',
};

const FORMA_PAGO_FRONTEND_A_BACKEND: Record<PaymentMethod, string> = {
  'Tarjeta de crédito': 'TARJETA_CREDITO',
  'Tarjeta de débito': 'TARJETA_DEBITO',
};

const ESTADO_PAGO_BACKEND_A_FRONTEND: Record<string, PaymentStatus> = {
  ACEPTADO: 'Aceptado',
  DECLINADO: 'Declinado',
};

const ESTADO_PAGO_FRONTEND_A_BACKEND: Record<PaymentStatus, string> = {
  Aceptado: 'ACEPTADO',
  Declinado: 'DECLINADO',
};

/** Convierte la orden que manda el backend al formato que usa el frontend. */
function toOrder(data: BackendOrden): Order {
  return {
    id: String(data.id),
    userId: String(data.usuario.id),
    customer: {
      id: String(data.usuario.id),
      nombre: data.usuario.nombre,
      correo: data.usuario.email,
    },
    shipping: {
      nombre: data.nombreEnvio,
      apellidos: data.apellidosEnvio,
      correo: data.correoEnvio,
      telefono: data.telefonoEnvio,
      direccion: data.direccionEnvio,
      departamento: data.departamentoEnvio ?? '',
      region: data.regionEnvio,
      comuna: data.comunaEnvio,
      indicaciones: data.indicacionesEnvio ?? '',
    },
    items: data.detalles.map((detalle) => ({
      productId: detalle.producto.id,
      codigo: detalle.producto.codigo,
      nombre: detalle.producto.nombre,
      imagen: detalle.producto.imagen ?? '',
      precioUnitario: Number(detalle.precioUnitario),
      cantidad: detalle.cantidad,
      talla: detalle.talla ?? '',
      subtotal: Number(detalle.precioUnitario) * detalle.cantidad,
    })),
    subtotal: Number(data.subtotal),
    total: Number(data.total),
    paymentMethod: FORMA_PAGO_BACKEND_A_FRONTEND[data.formaPago],
    paymentStatus: ESTADO_PAGO_BACKEND_A_FRONTEND[data.estadoPago],
    createdAt: data.fechaCreacion,
  };
}

/** Ordena las órdenes de la más reciente a la más antigua. */
function ordenarPorFechaDesc(orders: Order[]): Order[] {
  return [...orders].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export async function getOrders(): Promise<Order[]> {
  const data = await apiFetch<BackendOrden[]>('/ordenes');
  return ordenarPorFechaDesc(data.map(toOrder));
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const data = await apiFetch<BackendOrden[]>(`/ordenes/usuario/${userId}`);
  return ordenarPorFechaDesc(data.map(toOrder));
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  try {
    const data = await apiFetch<BackendOrden>(`/ordenes/${orderId}`);
    return toOrder(data);
  } catch {
    return undefined;
  }
}

interface CreateOrderParams {
  user: PublicUser;
  shipping: ShippingData;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export async function createOrder({
  user,
  shipping,
  items,
  paymentMethod,
  paymentStatus,
}: CreateOrderParams): Promise<Order> {
  if (items.length === 0) {
    throw new Error('No puedes procesar una compra con el carrito vacío.');
  }

  const data = await apiFetch<BackendOrden>('/ordenes', {
    method: 'POST',
    body: JSON.stringify({
      usuarioId: Number(user.id),
      nombreEnvio: shipping.nombre,
      apellidosEnvio: shipping.apellidos,
      correoEnvio: shipping.correo,
      telefonoEnvio: shipping.telefono,
      direccionEnvio: shipping.direccion,
      departamentoEnvio: shipping.departamento,
      regionEnvio: shipping.region,
      comunaEnvio: shipping.comuna,
      indicacionesEnvio: shipping.indicaciones,
      formaPago: FORMA_PAGO_FRONTEND_A_BACKEND[paymentMethod],
      estadoPago: ESTADO_PAGO_FRONTEND_A_BACKEND[paymentStatus],
      items: items.map((item) => ({
        productoId: item.product.id,
        cantidad: item.quantity,
        talla: item.size,
      })),
    }),
  });

  return toOrder(data);
}
