
import { useEffect, useState } from 'react';

import { getProducts } from '../services/productService';
import { getPublicUsers } from '../services/userService';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    Promise.all([getProducts(), getPublicUsers()])
      .then(([products, users]) => {
        setStats({
          totalProducts: products.length,
          totalUsers: users.length,
        });
      })
      .catch(() => {
        setStats({ totalProducts: 0, totalUsers: 0 });
      });
  }, []);

  return stats;
}
