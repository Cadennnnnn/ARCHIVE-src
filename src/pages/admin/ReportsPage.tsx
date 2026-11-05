import { useAdminReports } from '../../hooks/useAdminReports';
import { exportSalesReportToCsv } from '../../services/reportService';
import '../../styles/components/reports.css';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ReportsPage() {
  const {
    filters,
    filteredOrders,
    summary,
    updateFilter,
    clearFilters,
  } = useAdminReports();

  function handleExport() {
    exportSalesReportToCsv(filteredOrders);
  }

  return (
    <section className="admin-page reports-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Reportes de ventas</h1>
        <p className="text-muted mb-0">
          Consulta el historial de pedidos y el rendimiento de las ventas.
        </p>
      </header>

      <div className="row g-3 mt-2">
        <article className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Ventas totales</span>
            <strong className="admin-stat-card__value">
              {formatCurrency(summary.totalSales)}
            </strong>
          </div>
        </article>

        <article className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Pedidos registrados</span>
            <strong className="admin-stat-card__value">
              {summary.totalOrders}
            </strong>
          </div>
        </article>

        <article className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Pedidos aceptados</span>
            <strong className="admin-stat-card__value">
              {summary.acceptedOrders}
            </strong>
          </div>
        </article>

        <article className="col-sm-6 col-xl-3">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">Pedidos declinados</span>
            <strong className="admin-stat-card__value">
              {summary.declinedOrders}
            </strong>
          </div>
        </article>
      </div>

      <section className="admin-panel mt-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 className="h5 fw-bold mb-1">Historial de ventas</h2>
            <p className="text-muted small mb-0">
              Filtra los pedidos y descarga los resultados.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 reports-page__actions">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => window.print()}
            >
              Imprimir / PDF
            </button>

            <button
              type="button"
              className="btn btn-dark"
              onClick={handleExport}
              disabled={filteredOrders.length === 0}
            >
              Descargar CSV
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4 reports-page__filters">
          <div className="col-md-4">
            <label className="form-label" htmlFor="report-start-date">
              Fecha inicial
            </label>
            <input
              id="report-start-date"
              className="form-control"
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              onChange={(event) => updateFilter('startDate', event.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="report-end-date">
              Fecha final
            </label>
            <input
              id="report-end-date"
              className="form-control"
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              onChange={(event) => updateFilter('endDate', event.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label" htmlFor="report-status">
              Estado del pedido
            </label>
            <select
              id="report-status"
              className="form-select"
              value={filters.status}
              onChange={(event) => {
                updateFilter(
                  'status',
                  event.target.value as typeof filters.status,
                );
              }}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Aceptado">Aceptado</option>
              <option value="Declinado">Declinado</option>
            </select>
          </div>

          <div className="col-12">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Pago</th>
                <th>Estado</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No existen pedidos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-semibold">{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div>{order.customer.nombre}</div>
                      <small className="text-muted">
                        {order.customer.correo}
                      </small>
                    </td>
                    <td>
                      {order.items.reduce(
                        (total, item) => total + item.cantidad,
                        0,
                      )}
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentStatus === 'Aceptado'
                            ? 'text-bg-success'
                            : 'text-bg-danger'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="text-end fw-semibold">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="reports-page__footer">
          <span>
            Pedidos mostrados: <strong>{filteredOrders.length}</strong>
          </span>
          <span>
            Promedio por venta aceptada:{' '}
            <strong>{formatCurrency(summary.averageSale)}</strong>
          </span>
        </div>
      </section>
    </section>
  );
}
