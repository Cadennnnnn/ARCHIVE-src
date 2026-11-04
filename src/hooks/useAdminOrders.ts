import { useMemo, useState } from 'react';

import { getOrders } from '../services/orderService';
import type { Order, PaymentStatus } from '../types/order';

export interface AdminOrderFilters {
  search: string;
  paymentStatus: 'Todos' | PaymentStatus;
  dateFrom: string;
  dateTo: string;
}

const INITIAL_FILTERS: AdminOrderFilters = {
  search: '',
  paymentStatus: 'Todos',
  dateFrom: '',
  dateTo: '',
};

export function formatOrderCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOrderDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

export function useAdminOrders() {
  const [orders] = useState<Order[]>(() => getOrders());
  const [filters, setFilters] =
    useState<AdminOrderFilters>(INITIAL_FILTERS);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = [
        order.customer.nombre,
        order.shipping.nombre,
        order.shipping.apellidos,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const searchableValues = [
        order.id,
        order.customer.nombre,
        order.customer.correo,
        customerName,
        order.shipping.correo,
      ];

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus =
        filters.paymentStatus === 'Todos' ||
        order.paymentStatus === filters.paymentStatus;

      const orderDate = order.createdAt.slice(0, 10);

      const matchesDateFrom =
        !filters.dateFrom || orderDate >= filters.dateFrom;

      const matchesDateTo =
        !filters.dateTo || orderDate <= filters.dateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [orders, filters]);

  function updateFilter<K extends keyof AdminOrderFilters>(
    field: K,
    value: AdminOrderFilters[K],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  return {
    orders,
    filteredOrders,
    filters,
    updateFilter,
    clearFilters,
  };
}