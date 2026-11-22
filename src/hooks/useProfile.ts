
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

import {
  getAddresses,
  getPaymentMethods,
  addShippingAddress,
  removeShippingAddress,
  setDefaultShippingAddress,
  addSavedPaymentMethod,
  removeSavedPaymentMethod,
  setDefaultPaymentMethod,
} from '../services/profileService';

import { getOrdersByUser } from '../services/orderService';

import type {
  SavedPaymentMethod,
  ShippingAddress,
  UserProfileUpdateData,
} from '../types/user';

import type { Order } from '../types/order';

type AddressData = Omit<ShippingAddress, 'id' | 'isDefault'>;
type PaymentData = Omit<SavedPaymentMethod, 'id' | 'isDefault'>;

export function useProfile() {
  const { session, updateAccount } = useAuth();

  const userId = session?.user.id;

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!userId) {
      setAddresses([]);
      setPaymentMethods([]);
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [addressList, paymentList, orderList] = await Promise.all([
        getAddresses(userId),
        getPaymentMethods(userId),
        getOrdersByUser(userId),
      ]);

      setAddresses(addressList);
      setPaymentMethods(paymentList);
      setOrders(orderList);
      setError('');
    } catch {
      setError('No fue posible cargar la información del perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const savePersonalInfo = useCallback(
    async (data: UserProfileUpdateData) => {
      const updatedSession = await updateAccount(data);
      setError('');
      return updatedSession;
    },
    [updateAccount],
  );

  const addAddress = useCallback(
    async (data: AddressData) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setAddresses(await addShippingAddress(userId, data));
    },
    [userId],
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setAddresses(await removeShippingAddress(userId, addressId));
    },
    [userId],
  );

  const makeDefaultAddress = useCallback(
    async (addressId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setAddresses(await setDefaultShippingAddress(userId, addressId));
    },
    [userId],
  );

  const addPaymentMethod = useCallback(
    async (data: PaymentData) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setPaymentMethods(await addSavedPaymentMethod(userId, data));
    },
    [userId],
  );

  const deletePaymentMethod = useCallback(
    async (paymentId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setPaymentMethods(await removeSavedPaymentMethod(userId, paymentId));
    },
    [userId],
  );

  const makeDefaultPaymentMethod = useCallback(
    async (paymentId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      setPaymentMethods(await setDefaultPaymentMethod(userId, paymentId));
    },
    [userId],
  );

  return {
    user: session?.user ?? null,
    addresses,
    paymentMethods,
    orders,
    isLoading,
    error,
    reload,
    savePersonalInfo,
    addAddress,
    deleteAddress,
    makeDefaultAddress,
    addPaymentMethod,
    deletePaymentMethod,
    makeDefaultPaymentMethod,
  };
}
