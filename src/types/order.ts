
import type { PublicUser } from './user';

export type PaymentStatus = 'Aceptado' | 'Declinado';

export type PaymentMethod = 'Tarjeta de crédito' | 'Tarjeta de débito';

export interface ShippingData {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

export interface OrderItem {
  productId: number;
  codigo: string;
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  talla: string;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  customer: Pick<PublicUser, 'id' | 'nombre' | 'correo'>;
  shipping: ShippingData;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}
