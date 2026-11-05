

import { useState } from 'react';

import { useAuth } from './useAuth';
import { useCart } from './useCart';

import { createOrder } from '../services/orderService';

import type {
  Order,
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../types/order';

export function useCheckout() {
  const { session } = useAuth();
  const { items, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  function processCheckout(
    shipping: ShippingData,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
  ): Order | null {
    if (!session) {
      setError('Debes iniciar sesión para realizar una compra.');
      return null;
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      return null;
    }

    setIsProcessing(true);
    setError('');

    try {
      const order = createOrder({
        user: session.user,
        shipping,
        items,
        paymentMethod,
        paymentStatus,
      });

      if (paymentStatus === 'Aceptado') {
        clearCart();
      }

      return order;
    } catch {
      setError('No fue posible procesar la compra. Inténtalo nuevamente.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    items,
    isProcessing,
    error,
    processCheckout,
  };
}
