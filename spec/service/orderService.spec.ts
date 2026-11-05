
import {
  createOrder,
  getOrderById,
  getOrders,
  getOrdersByUser,
} from '../../src/services/orderService';

import type { CartItem } from '../../src/types/cart';
import type {
  Order,
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../../src/types/order';
import type { PublicUser } from '../../src/types/user';

const STORAGE_KEY = 'ARCHIVE_ORDERS';

const testUser = {
  id: 'user-test-1',
  nombre: 'Usuario Prueba',
  correo: 'prueba@archive.cl',
} as PublicUser;

const shipping: ShippingData = {
  nombre: 'Usuario',
  apellidos: 'Prueba',
  correo: 'prueba@archive.cl',
  telefono: '+56912345678',
  direccion: 'Av. Principal 123',
  departamento: 'Depto 12',
  region: 'Metropolitana',
  comuna: 'Santiago',
  indicaciones: 'Entregar en recepción',
};

const paymentMethod: PaymentMethod = 'Tarjeta de crédito';

function createCartItem(
  id = 1,
  price = 10000,
  quantity = 2,
  size = 'M',
): CartItem {
  return {
    product: {
      id,
      codigo: `ARC-${id}`,
      nombre: `Producto ${id}`,
      categoria: 'Ropa',
      precio: price,
      imagen: `/images/product-${id}.jpg`,
      descripcion: `Descripción del producto ${id}`,
      tallas: ['S', 'M', 'L'],
      stock: 10,
    } as CartItem['product'],
    quantity,
    size,
  };
}

function createStoredOrder(
  id: string,
  createdAt: string,
  userId = 'user-test-1',
): Order {
  return {
    id,
    userId,
    customer: {
      id: userId,
      nombre: 'Usuario Prueba',
      correo: 'prueba@archive.cl',
    },
    shipping,
    items: [],
    subtotal: 0,
    total: 0,
    paymentMethod,
    paymentStatus: 'Aceptado',
    createdAt,
  };
}

function seedOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

describe('orderService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getOrders', () => {
    it('debe retornar un arreglo vacío cuando no existen pedidos', () => {
      expect(getOrders()).toEqual([]);
    });

    it('debe recuperar los pedidos almacenados', () => {
      const orders = [
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z'),
        createStoredOrder('ORD-2', '2026-01-02T10:00:00.000Z'),
      ];

      seedOrders(orders);

      expect(getOrders().length).toBe(2);
    });

    it('debe ordenar los pedidos desde el más reciente', () => {
      seedOrders([
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z'),
        createStoredOrder('ORD-3', '2026-01-03T10:00:00.000Z'),
        createStoredOrder('ORD-2', '2026-01-02T10:00:00.000Z'),
      ]);

      const result = getOrders();

      expect(result[0].id).toBe('ORD-3');
      expect(result[1].id).toBe('ORD-2');
      expect(result[2].id).toBe('ORD-1');
    });

    it('debe retornar un arreglo vacío cuando el JSON almacenado es inválido', () => {
      localStorage.setItem(STORAGE_KEY, '{json-invalido');

      expect(getOrders()).toEqual([]);
    });

    it('debe retornar un arreglo vacío cuando los datos almacenados no son un arreglo', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'ORD-1' }));

      expect(getOrders()).toEqual([]);
    });
  });

  describe('getOrdersByUser', () => {
    it('debe retornar solamente los pedidos del usuario solicitado', () => {
      seedOrders([
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z', 'user-1'),
        createStoredOrder('ORD-2', '2026-01-02T10:00:00.000Z', 'user-2'),
        createStoredOrder('ORD-3', '2026-01-03T10:00:00.000Z', 'user-1'),
      ]);

      const result = getOrdersByUser('user-1');

      expect(result.length).toBe(2);
      expect(result.every((order) => order.userId === 'user-1')).toBeTrue();
    });

    it('debe retornar un arreglo vacío cuando el usuario no tiene pedidos', () => {
      seedOrders([
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z', 'user-1'),
      ]);

      expect(getOrdersByUser('user-inexistente')).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('debe encontrar un pedido mediante su identificador', () => {
      seedOrders([
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z'),
        createStoredOrder('ORD-2', '2026-01-02T10:00:00.000Z'),
      ]);

      const result = getOrderById('ORD-2');

      expect(result).toBeDefined();
      expect(result?.id).toBe('ORD-2');
    });

    it('debe retornar undefined cuando el pedido no existe', () => {
      seedOrders([
        createStoredOrder('ORD-1', '2026-01-01T10:00:00.000Z'),
      ]);

      expect(getOrderById('ORD-999')).toBeUndefined();
    });
  });

  describe('createOrder', () => {
    it('debe rechazar la creación de un pedido sin productos', () => {
      expect(() => {
        createOrder({
          user: testUser,
          shipping,
          items: [],
          paymentMethod,
          paymentStatus: 'Aceptado',
        });
      }).toThrowError();
    });

    it('debe crear un pedido con los datos del usuario', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(order.userId).toBe(testUser.id);
      expect(order.customer.nombre).toBe(testUser.nombre);
      expect(order.customer.correo).toBe(testUser.correo);
    });

    it('debe generar un identificador y una fecha de creación', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(order.id).toMatch(/^ORD-\d+$/);
      expect(new Date(order.createdAt).toString()).not.toBe('Invalid Date');
    });

    it('debe calcular correctamente el subtotal y el total', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [
          createCartItem(1, 10000, 2),
          createCartItem(2, 5000, 3),
        ],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(order.subtotal).toBe(35000);
      expect(order.total).toBe(35000);
    });

    it('debe guardar correctamente los detalles de los productos comprados', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem(5, 15000, 2, 'L')],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(order.items.length).toBe(1);
      expect(order.items[0].productId).toBe(5);
      expect(order.items[0].codigo).toBe('ARC-5');
      expect(order.items[0].nombre).toBe('Producto 5');
      expect(order.items[0].precioUnitario).toBe(15000);
      expect(order.items[0].cantidad).toBe(2);
      expect(order.items[0].talla).toBe('L');
      expect(order.items[0].subtotal).toBe(30000);
    });

    it('debe conservar el método y el estado de pago recibidos', () => {
      const paymentStatus: PaymentStatus = 'Declinado';
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod: 'Tarjeta de débito',
        paymentStatus,
      });

      expect(order.paymentMethod).toBe('Tarjeta de débito');
      expect(order.paymentStatus).toBe('Declinado');
    });

    it('debe conservar los datos de envío del pedido', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(order.shipping).toEqual(shipping);
    });

    it('debe persistir el pedido en localStorage', () => {
      const order = createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      const storedOrders = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '[]',
      ) as Order[];

      expect(storedOrders.length).toBe(1);
      expect(storedOrders[0].id).toBe(order.id);
    });

    it('debe conservar los pedidos anteriores al crear uno nuevo', () => {
      const previousOrder = createStoredOrder(
        'ORD-ANTERIOR',
        '2026-01-01T10:00:00.000Z',
      );

      seedOrders([previousOrder]);

      createOrder({
        user: testUser,
        shipping,
        items: [createCartItem()],
        paymentMethod,
        paymentStatus: 'Aceptado',
      });

      expect(getOrders().length).toBe(2);
      expect(getOrderById('ORD-ANTERIOR')).toBeDefined();
    });
  });
});
