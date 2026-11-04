import { useCriticalStock, getStockStatus } from '../../hooks/useCriticalStock';

export function CriticalStockPage() {
  const {
    criticalProducts,
    outOfStockProducts,
    lowStockProducts,
    totalCritical,
    refresh,
  } = useCriticalStock();

  return (
    <section className="admin-page">
      <header className="admin-page__header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="h3 fw-bold mb-2">Stock crítico</h1>
          <p className="text-muted mb-0">
            Productos con cinco unidades o menos disponibles.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={refresh}
        >
          Actualizar
        </button>
      </header>

      <div className="row g-3 mt-2 mb-4">
        <div className="col-md-4">
          <article className="admin-stat-card">
            <span className="admin-stat-card__label">Productos críticos</span>
            <strong className="admin-stat-card__value">{totalCritical}</strong>
          </article>
        </div>

        <div className="col-md-4">
          <article className="admin-stat-card">
            <span className="admin-stat-card__label">Agotados</span>
            <strong className="admin-stat-card__value">
              {outOfStockProducts.length}
            </strong>
          </article>
        </div>

        <div className="col-md-4">
          <article className="admin-stat-card">
            <span className="admin-stat-card__label">Stock bajo</span>
            <strong className="admin-stat-card__value">
              {lowStockProducts.length}
            </strong>
          </article>
        </div>
      </div>

      <div className="admin-panel">
        <h2 className="h5 fw-bold mb-4">Productos que requieren atención</h2>

        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {criticalProducts.map((product) => {
                const status = getStockStatus(product.stock);

                return (
                  <tr key={product.id}>
                    <td className="font-monospace">{product.codigo}</td>
                    <td className="fw-semibold">{product.nombre}</td>
                    <td>{product.categoria}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={`badge ${
                          status === 'Agotado'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {criticalProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay productos con stock crítico.
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