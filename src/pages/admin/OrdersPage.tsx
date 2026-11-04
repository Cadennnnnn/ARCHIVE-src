import { Link } from 'react-router-dom';

import {
  formatOrderCurrency,
  formatOrderDate,
  useAdminOrders,
} from '../../hooks/useAdminOrders';

export function OrdersPage() {
  const {
    orders,
    filteredOrders,
    filters,
    updateFilter,
    clearFilters,
  } = useAdminOrders();

  const acceptedOrders = orders.filter(
    (order) => order.paymentStatus === 'Aceptado',
  ).length;

  const declinedOrders = orders.filter(
    (order) => order.paymentStatus === 'Declinado',
  ).length;

  const acceptedSales = orders
    .filter((order) => order.paymentStatus === 'Aceptado')
    .reduce((total, order) => total + order.total, 0);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Órdenes de compra</h1>
        <p className="text-muted mb-0">
          Consulta las compras registradas y revisa sus comprobantes.
        </p>
      </header>

      <div className="row g-3 mt-2 mb-4">
        <article className="col-md-4">
          <div className="admin-stat-card h-100">
            <span className="admin-stat-card__label">
              Órdenes registradas
            </span>
            <strong className="admin-stat-card__value">
              {orders.length}
            </strong>
          </div>
        </article>

        <article className="col-md-4">
          <div className="admin-stat-card h-100">
            <span className="admin-stat-card__label">
              Compras aceptadas
            </span>
            <strong className="admin-stat-card__value">
              {acceptedOrders}
            </strong>
          </div>
        </article>

        <article className="col-md-4">
          <div className="admin-stat-card h-100">
            <span className="admin-stat-card__label">
              Ventas confirmadas
            </span>
            <strong className="admin-stat-card__value">
              {formatOrderCurrency(acceptedSales)}
            </strong>
            <span className="admin-stat-card__notice">
              {declinedOrders} pagos declinados
            </span>
          </div>
        </article>
      </div>

      <div className="admin-panel mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="h5 fw-bold mb-0">Buscar y filtrar</h2>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="row g-3">
          <div className="col-lg-4">
            <label htmlFor="order-search" className="form-label">
              Número de orden o cliente
            </label>
            <input
              id="order-search"
              type="search"
              className="form-control rounded-0"
              placeholder="Ej. ORD-123456 o correo"
              value={filters.search}
              onChange={(event) =>
                updateFilter('search', event.target.value)
              }
            />
          </div>

          <div className="col-md-4 col-lg-2">
            <label htmlFor="order-status" className="form-label">
              Estado del pago
            </label>
            <select
              id="order-status"
              className="form-select rounded-0"
              value={filters.paymentStatus}
              onChange={(event) =>
                updateFilter(
                  'paymentStatus',
                  event.target.value as typeof filters.paymentStatus,
                )
              }
            >
              <option value="Todos">Todos</option>
              <option value="Aceptado">Aceptado</option>
              <option value="Declinado">Declinado</option>
            </select>
          </div>

          <div className="col-md-4 col-lg-3">
            <label htmlFor="order-date-from" className="form-label">
              Desde
            </label>
            <input
              id="order-date-from"
              type="date"
              className="form-control rounded-0"
              value={filters.dateFrom}
              max={filters.dateTo || undefined}
              onChange={(event) =>
                updateFilter('dateFrom', event.target.value)
              }
            />
          </div>

          <div className="col-md-4 col-lg-3">
            <label htmlFor="order-date-to" className="form-label">
              Hasta
            </label>
            <input
              id="order-date-to"
              type="date"
              className="form-control rounded-0"
              value={filters.dateTo}
              min={filters.dateFrom || undefined}
              onChange={(event) =>
                updateFilter('dateTo', event.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="h5 fw-bold mb-0">Registro de órdenes</h2>

          <span className="badge bg-dark">
            {filteredOrders.length} resultados
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-monospace fw-semibold">
                    {order.id}
                  </td>

                  <td>
                    <div className="fw-semibold">
                      {order.shipping.nombre} {order.shipping.apellidos}
                    </div>
                    <small className="text-muted">
                      {order.customer.correo}
                    </small>
                  </td>

                  <td>{formatOrderDate(order.createdAt)}</td>

                  <td>{order.items.length}</td>

                  <td className="fw-semibold">
                    {formatOrderCurrency(order.total)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === 'Aceptado'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/admin/ordenes/${encodeURIComponent(order.id)}`}
                      className="btn btn-sm btn-outline-dark rounded-0"
                    >
                      Ver orden
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-muted py-5"
                  >
                    {orders.length === 0
                      ? 'Todavía no hay órdenes registradas.'
                      : 'No se encontraron órdenes con esos filtros.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}