
import { useMemo } from 'react';

import { products } from '../data/products';
import { getUsers } from '../services/userService';

export function useAdminDashboard() {
  return useMemo(() => {
    const users = getUsers();

    return {
      totalProducts: products.length,
      totalUsers: users.length,
    };
  }, []);
}