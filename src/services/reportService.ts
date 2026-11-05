
import type { Order, PaymentStatus } from '../types/order';
import { getOrders } from './orderService';

export interface ReportFilters {
  startDate: string;
  endDate: string;
  status: 'Todos' | PaymentStatus;
}

export interface SalesSummary {
  totalOrders: number;
  acceptedOrders: number;
  declinedOrders: number;
  totalSales: number;
  averageSale: number;
}

export function getSalesReport(filters: ReportFilters): Order[] {
  return getOrders().filter((order) => {
    const orderDate = new Date(order.createdAt);

    if (Number.isNaN(orderDate.getTime())) {
      return false;
    }

    if (filters.startDate) {
      const startDate = new Date(`${filters.startDate}T00:00:00`);

      if (orderDate < startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      const endDate = new Date(`${filters.endDate}T23:59:59.999`);

      if (orderDate > endDate) {
        return false;
      }
    }

    return filters.status === 'Todos'
      || order.paymentStatus === filters.status;
  });
}

export function calculateSalesSummary(orders: Order[]): SalesSummary {
  const acceptedOrders = orders.filter(
    (order) => order.paymentStatus === 'Aceptado',
  );

  const declinedOrders = orders.filter(
    (order) => order.paymentStatus === 'Declinado',
  );

  const totalSales = acceptedOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  return {
    totalOrders: orders.length,
    acceptedOrders: acceptedOrders.length,
    declinedOrders: declinedOrders.length,
    totalSales,
    averageSale: acceptedOrders.length > 0
      ? totalSales / acceptedOrders.length
      : 0,
  };
}

function escapeCsvValue(value: string | number): string {
  const normalized = String(value).replace(/"/g, '""');

  return `"${normalized}"`;
}

export function exportSalesReportToCsv(orders: Order[]): void {
  const headers = [
    'Número de pedido',
    'Fecha',
    'Cliente',
    'Correo',
    'Productos',
    'Método de pago',
    'Estado',
    'Total',
  ];

  const rows = orders.map((order) => {
    const products = order.items
      .map((item) => (
        `${item.nombre} - Talla ${item.talla} - Cantidad ${item.cantidad}`
      ))
      .join('; ');

    return [
      order.id,
      new Date(order.createdAt).toLocaleString('es-CL'),
      order.customer.nombre,
      order.customer.correo,
      products,
      order.paymentMethod,
      order.paymentStatus,
      order.total,
    ];
  });

  const csvContent = [
    headers.map(escapeCsvValue).join(';'),
    ...rows.map((row) => row.map(escapeCsvValue).join(';')),
  ].join('\r\n');

  const blob = new Blob(
    ['\uFEFF', csvContent],
    { type: 'text/csv;charset=utf-8;' },
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `archive-reporte-ventas-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
