

import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';

import {
  getUserProfile,
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

interface ProfileData {
  addresses: ShippingAddress[];
  paymentMethods: SavedPaymentMethod[];
  orders: Order[];
}

function getInitialProfile(userId?: string): ProfileData {
  if (!userId) {
    return {
      addresses: [],
      paymentMethods: [],
      orders: [],
    };
  }

  try {
    const user = getUserProfile(userId);

    return {
      addresses: user.profile?.direcciones ?? [],
      paymentMethods: user.profile?.metodosPago ?? [],
      orders: getOrdersByUser(userId),
    };
  } catch {
    return {
      addresses: [],
      paymentMethods: [],
      orders: [],
    };
  }
}

export function useProfile() {
  const { session, updateAccount } = useAuth();

  const userId = session?.user.id;

  const [profile, setProfile] = useState<ProfileData>(
    () => getInitialProfile(userId),
  );

  const [isLoading] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    if (!userId) {
      setProfile({
        addresses: [],
        paymentMethods: [],
        orders: [],
      });
      return;
    }

    try {
      const user = getUserProfile(userId);

      setProfile({
        addresses: user.profile?.direcciones ?? [],
        paymentMethods: user.profile?.metodosPago ?? [],
        orders: getOrdersByUser(userId),
      });

      setError('');
    } catch {
      setError('No fue posible cargar la información del perfil.');
    }
  }, [userId]);

  const savePersonalInfo = useCallback(
    (data: UserProfileUpdateData) => {
      const updatedSession = updateAccount(data);
      setError('');
      return updatedSession;
    },
    [updateAccount],
  );

  const addAddress = useCallback(
    (data: AddressData) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = addShippingAddress(userId, data);

      setProfile((current) => ({
        ...current,
        addresses: user.profile?.direcciones ?? [],
      }));
    },
    [userId],
  );

  const deleteAddress = useCallback(
    (addressId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = removeShippingAddress(userId, addressId);

      setProfile((current) => ({
        ...current,
        addresses: user.profile?.direcciones ?? [],
      }));
    },
    [userId],
  );

  const makeDefaultAddress = useCallback(
    (addressId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = setDefaultShippingAddress(userId, addressId);

      setProfile((current) => ({
        ...current,
        addresses: user.profile?.direcciones ?? [],
      }));
    },
    [userId],
  );

  const addPaymentMethod = useCallback(
    (data: PaymentData) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = addSavedPaymentMethod(userId, data);

      setProfile((current) => ({
        ...current,
        paymentMethods: user.profile?.metodosPago ?? [],
      }));
    },
    [userId],
  );

  const deletePaymentMethod = useCallback(
    (paymentId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = removeSavedPaymentMethod(userId, paymentId);

      setProfile((current) => ({
        ...current,
        paymentMethods: user.profile?.metodosPago ?? [],
      }));
    },
    [userId],
  );

  const makeDefaultPaymentMethod = useCallback(
    (paymentId: string) => {
      if (!userId) throw new Error('Debes iniciar sesión.');

      const user = setDefaultPaymentMethod(userId, paymentId);

      setProfile((current) => ({
        ...current,
        paymentMethods: user.profile?.metodosPago ?? [],
      }));
    },
    [userId],
  );

  return {
    user: session?.user ?? null,
    addresses: profile.addresses,
    paymentMethods: profile.paymentMethods,
    orders: profile.orders,
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
