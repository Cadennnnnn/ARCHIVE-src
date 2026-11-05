import { useCallback, useMemo, useState } from 'react';

import {
  createAdminUser,
  getPublicUsers,
} from '../services/userService';

import { getOrdersByUser } from '../services/orderService';

import type { AdminUserData } from '../services/userService';
import type { PublicUser } from '../types/user';
import type { Order } from '../types/order';

const INITIAL_FORM: AdminUserData = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  rol: 'Administrador',
};

export function useAdminUsers() {
  const [users, setUsers] = useState<PublicUser[]>(() =>
    getPublicUsers(),
  );

  const [formData, setFormData] =
    useState<AdminUserData>(INITIAL_FORM);

  const [error, setError] = useState('');

  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  const selectedUser = useMemo(
    () =>
      users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const userOrders: Order[] = useMemo(
    () =>
      selectedUserId
        ? getOrdersByUser(selectedUserId)
        : [],
    [selectedUserId],
  );

  function updateField(
    field: keyof AdminUserData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError('');
  }

  const refreshUsers = useCallback(() => {
    setUsers(getPublicUsers());
  }, []);

  function submitUser(): boolean {
    try {
      createAdminUser(formData);
      refreshUsers();
      setFormData(INITIAL_FORM);
      setError('');

      return true;
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'No fue posible registrar el usuario.',
      );

      return false;
    }
  }

  function selectUser(userId: string) {
    setSelectedUserId((currentId) =>
      currentId === userId ? null : userId,
    );
  }

  function closeUserHistory() {
    setSelectedUserId(null);
  }

  return {
    users,
    formData,
    error,
    selectedUser,
    userOrders,
    updateField,
    submitUser,
    selectUser,
    closeUserHistory,
  };
}
