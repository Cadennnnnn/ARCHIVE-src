
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

import { AuthProvider } from '../../src/context/AuthContext';
import { CartProvider } from '../../src/context/CartContext';

import { useCart } from '../../src/hooks/useCart';
import { useCheckout } from '../../src/hooks/useCheckout';

import { authenticate } from '../../src/services/authService';
import { initializeUsers } from '../../src/services/userService';
import { getOrders } from '../../src/services/orderService';

import { products } from '../../src/data/products';

import type {
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../../src/types/order';

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

const TEST_SHIPPING: ShippingData = {
  nombre: 'Cliente',
  apellidos: 'Prueba',
  correo: 'cliente@gmail.com',
  telefono: '+56912345678',
  direccion: 'Av. Providencia 1234',
  departamento: '',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Providencia',
  indicaciones: 'Entregar en recepción',
};

const TEST_PAYMENT_METHOD: PaymentMethod = 'Tarjeta de crédito';


function CheckoutTestComponent() {
  const { items, addItem } = useCart();

  const {
    processCheckout,
    error,
    isProcessing,
  } = useCheckout();

  const addProduct = () => {
    const product = products[0];

    if (product) {
      addItem(product, product.tallas[0]);
    }
  };

  const handleCheckout = (status: PaymentStatus) => {
    processCheckout(
      TEST_SHIPPING,
      TEST_PAYMENT_METHOD,
      status,
    );
  };

  return (
    <div>
      <p data-testid="cart-count">{items.length}</p>

      <p data-testid="cart-quantity">
        {items.reduce(
          (total, item) => total + item.quantity,
          0,
        )}
      </p>

      <p data-testid="checkout-error">{error}</p>

      <p data-testid="processing">
        {String(isProcessing)}
      </p>

      <button onClick={addProduct}>
        Agregar producto
      </button>

      <button onClick={() => handleCheckout('Aceptado')}>
        Procesar pago aceptado
      </button>

      <button onClick={() => handleCheckout('Declinado')}>
        Procesar pago declinado
      </button>
    </div>
  );
}

describe('Pruebas de integración de useCheckout', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    initializeUsers();

    container = document.createElement('div');
    document.body.appendChild(container);

    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
    localStorage.clear();
  });

  const renderCheckout = (authenticated = false) => {
    if (authenticated) {
      authenticate('cliente@gmail.com', '1234');
    }

    act(() => {
      root.render(
        <AuthProvider>
          <CartProvider>
            <CheckoutTestComponent />
          </CartProvider>
        </AuthProvider>,
      );
    });
  };

  const getButton = (label: string): HTMLButtonElement => {
    const button = Array.from(
      container.querySelectorAll('button'),
    ).find((item) => item.textContent === label);

    if (!button) {
      throw new Error(`No se encontró el botón: ${label}`);
    }

    return button;
  };

  const getText = (testId: string): string => {
    const element = container.querySelector(
      `[data-testid="${testId}"]`,
    );

    return element?.textContent ?? '';
  };

  const addProductToCart = () => {
    act(() => {
      getButton('Agregar producto').click();
    });
  };

  it('debe rechazar el checkout cuando no existe una sesión', () => {
    renderCheckout();

    addProductToCart();

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    expect(getText('checkout-error')).toBe(
      'Debes iniciar sesión para realizar una compra.',
    );

    expect(getText('cart-count')).toBe('1');
    expect(getOrders()).toHaveSize(0);
  });

  it('debe rechazar el checkout cuando el carrito está vacío', () => {
    renderCheckout(true);

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    expect(getText('checkout-error')).toBe(
      'Tu carrito está vacío.',
    );

    expect(getText('cart-count')).toBe('0');
    expect(getOrders()).toHaveSize(0);
  });

  it('debe crear un pedido cuando el pago es aceptado', () => {
    renderCheckout(true);

    addProductToCart();

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    const orders = getOrders();

    expect(orders).toHaveSize(1);
    expect(orders[0].paymentStatus).toBe('Aceptado');
    expect(orders[0].paymentMethod).toBe(
      TEST_PAYMENT_METHOD,
    );

    expect(orders[0].userId).toBeTruthy();
    expect(orders[0].items).toHaveSize(1);

    expect(getText('cart-count')).toBe('0');
    expect(getText('cart-quantity')).toBe('0');
    expect(getText('checkout-error')).toBe('');
  });

  it('debe conservar el carrito cuando el pago es declinado', () => {
    renderCheckout(true);

    addProductToCart();

    act(() => {
      getButton('Procesar pago declinado').click();
    });

    const orders = getOrders();

    expect(orders).toHaveSize(1);
    expect(orders[0].paymentStatus).toBe('Declinado');

    expect(getText('cart-count')).toBe('1');
    expect(getText('cart-quantity')).toBe('1');
    expect(getText('checkout-error')).toBe('');
  });

  it('debe guardar correctamente los datos de envío del pedido', () => {
    renderCheckout(true);

    addProductToCart();

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    const orders = getOrders();

    expect(orders).toHaveSize(1);

    expect(orders[0].shipping.nombre).toBe(
      TEST_SHIPPING.nombre,
    );

    expect(orders[0].shipping.apellidos).toBe(
      TEST_SHIPPING.apellidos,
    );

    expect(orders[0].shipping.correo).toBe(
      TEST_SHIPPING.correo,
    );

    expect(orders[0].shipping.direccion).toBe(
      TEST_SHIPPING.direccion,
    );

    expect(orders[0].shipping.comuna).toBe(
      TEST_SHIPPING.comuna,
    );
  });

  it('debe guardar el pedido en localStorage', () => {
    renderCheckout(true);

    addProductToCart();

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    const storedOrders = JSON.parse(
      localStorage.getItem('ARCHIVE_ORDERS') ?? '[]',
    );

    expect(storedOrders).toHaveSize(1);
    expect(storedOrders[0].id).toMatch(/^ORD-/);
  });

  it('debe finalizar el procesamiento sin dejar el estado de carga activo', () => {
    renderCheckout(true);

    addProductToCart();

    act(() => {
      getButton('Procesar pago aceptado').click();
    });

    expect(getText('processing')).toBe('false');
  });
});
