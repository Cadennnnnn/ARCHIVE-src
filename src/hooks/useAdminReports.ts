
import { useMemo, useState } from 'react';

import {
  calculateSalesSummary,
  getSalesReport,
  type ReportFilters,
} from '../services/reportService';

const INITIAL_FILTERS: ReportFilters = {
  startDate: '',
  endDate: '',
  status: 'Todos',
};

export function useAdminReports() {
  const [filters, setFilters] = useState<ReportFilters>(INITIAL_FILTERS);

  const filteredOrders = useMemo(
    () => getSalesReport(filters),
    [filters],
  );

  const summary = useMemo(
    () => calculateSalesSummary(filteredOrders),
    [filteredOrders],
  );

  function updateFilter<K extends keyof ReportFilters>(
    key: K,
    value: ReportFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  return {
    filters,
    filteredOrders,
    summary,
    updateFilter,
    clearFilters,
  };
}
