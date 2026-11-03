
import { useCallback, useState } from 'react';

import {
  createAdminUser,
  getPublicUsers,
} from '../services/userService';

import type { AdminUserData } from '../services/userService';
import type { PublicUser } from '../types/user';

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

  return {
    users,
    formData,
    error,
    updateField,
    submitUser,
  };
}