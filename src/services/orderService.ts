

import type { CartItem } from '../types/cart';
import type {
  Order,
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../types/order';
import type { PublicUser } from '../types/user';

const STORAGE_KEY = 'ARCHIVE_ORDERS';

function getStoredOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed as Order[] : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOrders(): Order[] {
  return getStoredOrders().sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter((order) => order.userId === userId);
}

export function getOrderById(orderId: string): Order | undefined {
  return getOrders().find((order) => order.id === orderId);
}

interface CreateOrderParams {
  user: PublicUser;
  shipping: ShippingData;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export function createOrder({
  user,
  shipping,
  items,
  paymentMethod,
  paymentStatus,
}: CreateOrderParams): Order {
  if (items.length === 0) {
    throw new Error('No puedes procesar una compra con el carrito vacío.');
  }

  const orderItems = items.map((item) => ({
    productId: item.product.id,
    codigo: item.product.codigo,
    nombre: item.product.nombre,
    imagen: item.product.imagen,
    precioUnitario: item.product.precio,
    cantidad: item.quantity,
    talla: item.size,
    subtotal: item.product.precio * item.quantity,
  }));

  const subtotal = orderItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId: user.id,
    customer: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
    },
    shipping: { ...shipping },
    items: orderItems,
    subtotal,
    total: subtotal,
    paymentMethod,
    paymentStatus,
    createdAt: new Date().toISOString(),
  };

  const orders = getStoredOrders();

  saveOrders([...orders, order]);

  return order;
}
