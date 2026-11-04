import { useCallback, useState } from 'react';

import { getProducts } from '../services/productService';
import type { Product } from '../types/product';

export const CRITICAL_STOCK_THRESHOLD = 5;

export type StockStatus = 'Agotado' | 'Stock crítico' | 'Disponible';

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'Agotado';
  if (stock <= CRITICAL_STOCK_THRESHOLD) return 'Stock crítico';

  return 'Disponible';
}

export function useCriticalStock() {
  const [products, setProducts] = useState<Product[]>(getProducts);

  const refresh = useCallback(() => {
    setProducts(getProducts());
  }, []);

  const criticalProducts = products.filter(
    (product) => product.stock <= CRITICAL_STOCK_THRESHOLD,
  );

  const outOfStockProducts = criticalProducts.filter(
    (product) => product.stock === 0,
  );

  const lowStockProducts = criticalProducts.filter(
    (product) => product.stock > 0,
  );

  return {
    criticalProducts,
    outOfStockProducts,
    lowStockProducts,
    totalCritical: criticalProducts.length,
    refresh,
  };
}