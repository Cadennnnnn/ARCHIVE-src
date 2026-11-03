// Archivo: src/context/CartContext.tsx
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { products } from '../data/products';
import type { CartItem, StoredCartItem } from '../types/cart';
import type { Product } from '../types/product';

const STORAGE_KEY = 'ARCHIVE_CART_ITEMS';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, size?: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: StoredCartItem[] = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      const product = products.find((item) => item.id === entry.productId);

      if (
        !product ||
        !Number.isInteger(entry.quantity) ||
        entry.quantity < 1 ||
        typeof entry.size !== 'string'
      ) {
        return [];
      }

      return [{
        product,
        quantity: Math.min(entry.quantity, product.stock),
        size: entry.size,
      }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const persist = useCallback((nextItems: CartItem[]) => {
    setItems(nextItems);

    const storedItems: StoredCartItem[] = nextItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      size: item.size,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
  }, []);

  const addItem = useCallback((product: Product, size?: string) => {
    if (product.stock < 1) return;

    const selectedSize = size ?? product.tallas[0] ?? 'Única';

    setItems((currentItems) => {
      const existing = currentItems.find(
        (item) => item.product.id === product.id && item.size === selectedSize,
      );

      let nextItems: CartItem[];

      if (existing) {
        nextItems = currentItems.map((item) =>
          item.product.id === product.id && item.size === selectedSize
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      } else {
        nextItems = [
          ...currentItems,
          { product, quantity: 1, size: selectedSize },
        ];
      }

      const storedItems: StoredCartItem[] = nextItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size,
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
      return nextItems;
    });
  }, []);

  const removeItem = useCallback((productId: number, size: string) => {
    setItems((currentItems) => {
      const nextItems = currentItems.filter(
        (item) => !(item.product.id === productId && item.size === size),
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
        }))),
      );

      return nextItems;
    });
  }, []);

  const updateQuantity = useCallback((
    productId: number,
    size: string,
    quantity: number,
  ) => {
    setItems((currentItems) => {
      const nextItems = currentItems.flatMap((item) => {
        if (item.product.id !== productId || item.size !== size) {
          return [item];
        }

        if (quantity <= 0) return [];

        return [{
          ...item,
          quantity: Math.min(Math.floor(quantity), item.product.stock),
        }];
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
        }))),
      );

      return nextItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0,
    ),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }), [items, addItem, removeItem, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
