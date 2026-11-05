import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { fireEvent } from '@testing-library/react';

import { CartProvider } from '../../src/context/CartContext';
import { useCart } from '../../src/hooks/useCart';
import { products } from '../../src/data/products';

import type { Product } from '../../src/types/product';

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

function getAvailableProduct(): Product {
  const product = products.find((item) => item.stock > 0);

  if (!product) {
    throw new Error(
      'Se necesita al menos un producto con stock para probar el carrito.',
    );
  }

  return product;
}

const availableProduct: Product = getAvailableProduct();

function CartConsumer() {
  const {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <div>
      <p data-testid="item-count">{itemCount}</p>
      <p data-testid="subtotal">{subtotal}</p>

      <p data-testid="items">
        {items.map((item) => (
          <span key={`${item.product.id}-${item.size}`}>
            {item.product.nombre}:{item.quantity}:{item.size}
          </span>
        ))}
      </p>

      <button onClick={() => addItem(availableProduct, '42')}>
        Agregar
      </button>

      <button onClick={() => addItem(availableProduct, '43')}>
        Agregar otra talla
      </button>

      <button onClick={() => removeItem(availableProduct.id, '42')}>
        Eliminar
      </button>

      <button onClick={() => updateQuantity(availableProduct.id, '42', 3)}>
        Actualizar cantidad
      </button>

      <button onClick={() => updateQuantity(availableProduct.id, '42', 0)}>
        Cantidad cero
      </button>

      <button onClick={clearCart}>
        Vaciar
      </button>
    </div>
  );
}

describe('CartContext y useCart', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();

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

  function renderCart() {
    act(() => {
      root.render(
        <CartProvider>
          <CartConsumer />
        </CartProvider>,
      );
    });
  }

  function clickButton(label: string) {
    const button = Array.from(container.querySelectorAll('button'))
      .find((element) => element.textContent === label);

    if (!button) {
      throw new Error(`No se encontró el botón: ${label}`);
    }

    act(() => {
      fireEvent.click(button);
    });
  }

  describe('Inicialización y persistencia', () => {
    it('debe iniciar con el carrito vacío cuando no hay datos guardados', () => {
      renderCart();

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('0');

      expect(container.querySelector('[data-testid="subtotal"]')?.textContent)
        .toBe('0');
    });

    it('debe recuperar los productos guardados en localStorage', () => {
      localStorage.setItem(
        'ARCHIVE_CART_ITEMS',
        JSON.stringify([
          {
            productId: availableProduct.id,
            quantity: 2,
            size: '42',
          },
        ]),
      );

      renderCart();

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('2');

      expect(container.querySelector('[data-testid="items"]')?.textContent)
        .toContain(`${availableProduct.nombre}:2:42`);
    });

    it('debe ignorar datos JSON inválidos', () => {
      localStorage.setItem('ARCHIVE_CART_ITEMS', '{json-invalido');

      renderCart();

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('0');
    });

    it('debe ignorar productos inexistentes y cantidades inválidas', () => {
      localStorage.setItem(
        'ARCHIVE_CART_ITEMS',
        JSON.stringify([
          {
            productId: -1,
            quantity: 1,
            size: '42',
          },
          {
            productId: availableProduct.id,
            quantity: 0,
            size: '42',
          },
          {
            productId: availableProduct.id,
            quantity: 1.5,
            size: '42',
          },
        ]),
      );

      renderCart();

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('0');
    });

    it('debe limitar al stock la cantidad recuperada', () => {
      localStorage.setItem(
        'ARCHIVE_CART_ITEMS',
        JSON.stringify([
          {
            productId: availableProduct.id,
            quantity: availableProduct.stock + 10,
            size: '42',
          },
        ]),
      );

      renderCart();

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe(String(availableProduct.stock));
    });
  });

  describe('Agregar productos', () => {
    it('debe agregar un producto con la talla seleccionada', () => {
      renderCart();
      clickButton('Agregar');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('1');

      expect(container.querySelector('[data-testid="items"]')?.textContent)
        .toContain(`${availableProduct.nombre}:1:42`);
    });

    it('debe incrementar la cantidad al agregar el mismo producto y talla', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Agregar');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('2');
    });

    it('debe mantener separadas las tallas de un mismo producto', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Agregar otra talla');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('2');

      const items = container.querySelector('[data-testid="items"]')?.textContent;

      expect(items).toContain(`${availableProduct.nombre}:1:42`);
      expect(items).toContain(`${availableProduct.nombre}:1:43`);
    });

    it('no debe superar el stock disponible al agregar unidades', () => {
      renderCart();

      for (let index = 0; index < availableProduct.stock + 2; index += 1) {
        clickButton('Agregar');
      }

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe(String(availableProduct.stock));
    });

    it('no debe agregar productos sin stock', () => {
      const outOfStockProduct: Product = {
        ...availableProduct,
        id: availableProduct.id + 100000,
        stock: 0,
      };

      function OutOfStockConsumer() {
        const { items, addItem } = useCart();

        return (
          <button onClick={() => addItem(outOfStockProduct, '42')}>
            Agregar sin stock: {items.length}
          </button>
        );
      }

      act(() => {
        root.render(
          <CartProvider>
            <OutOfStockConsumer />
          </CartProvider>,
        );
      });

      const button = container.querySelector('button');

      if (!button) {
        throw new Error('No se encontró el botón de producto sin stock.');
      }

      act(() => {
        fireEvent.click(button);
      });

      expect(container.textContent).toContain('Agregar sin stock: 0');
    });
  });

  describe('Actualizar y eliminar productos', () => {
    it('debe actualizar la cantidad de un producto', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Actualizar cantidad');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('3');
    });

    it('debe limitar la cantidad actualizada al stock disponible', () => {
      function QuantityConsumer() {
        const { items, addItem, updateQuantity } = useCart();

        return (
          <div>
            <button onClick={() => addItem(availableProduct, '42')}>
              Agregar
            </button>

            <button
              onClick={() =>
                updateQuantity(
                  availableProduct.id,
                  '42',
                  availableProduct.stock + 10,
                )
              }
            >
              Superar stock
            </button>

            <p data-testid="quantity">{items[0]?.quantity ?? 0}</p>
          </div>
        );
      }

      act(() => {
        root.render(
          <CartProvider>
            <QuantityConsumer />
          </CartProvider>,
        );
      });

      const buttons = container.querySelectorAll('button');

      if (buttons.length !== 2) {
        throw new Error('No se encontraron los botones esperados.');
      }

      act(() => {
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);
      });

      expect(container.querySelector('[data-testid="quantity"]')?.textContent)
        .toBe(String(availableProduct.stock));
    });

    it('debe eliminar el producto cuando la cantidad actualizada es cero', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Cantidad cero');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('0');
    });

    it('debe eliminar únicamente el producto y talla indicados', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Agregar otra talla');
      clickButton('Eliminar');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('1');

      expect(container.querySelector('[data-testid="items"]')?.textContent)
        .toContain(`${availableProduct.nombre}:1:43`);
    });

    it('debe vaciar el carrito', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Vaciar');

      expect(container.querySelector('[data-testid="item-count"]')?.textContent)
        .toBe('0');

      expect(localStorage.getItem('ARCHIVE_CART_ITEMS')).toBe('[]');
    });
  });

  describe('Cálculos y almacenamiento', () => {
    it('debe calcular correctamente el subtotal', () => {
      renderCart();

      clickButton('Agregar');
      clickButton('Actualizar cantidad');

      const expectedSubtotal = availableProduct.precio * 3;

      expect(container.querySelector('[data-testid="subtotal"]')?.textContent)
        .toBe(String(expectedSubtotal));
    });

    it('debe persistir las operaciones realizadas en localStorage', () => {
      renderCart();
      clickButton('Agregar');

      const storedItems = JSON.parse(
        localStorage.getItem('ARCHIVE_CART_ITEMS') ?? '[]',
      );

      expect(storedItems).toEqual([
        {
          productId: availableProduct.id,
          quantity: 1,
          size: '42',
        },
      ]);
    });
  });

  describe('useCart', () => {
    it('debe lanzar un error cuando se utiliza fuera de CartProvider', () => {
      function InvalidConsumer() {
        useCart();
        return null;
      }

      const consoleError = spyOn(console, 'error');

      expect(() => {
        act(() => {
          root.render(<InvalidConsumer />);
        });
      }).toThrowError(
        'useCart debe utilizarse dentro de CartProvider.',
      );

      consoleError.and.stub();
    });
  });
});
