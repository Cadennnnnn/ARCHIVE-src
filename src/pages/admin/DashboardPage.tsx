import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';

export function DashboardPage() {
  const { session } = useAuth();
  const { totalProducts, totalUsers } = useAdminDashboard();
  const isAdmin = session?.role === 'Administrador';

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Panel de Resumen</h1>
        <p className="text-muted mb-0">
          Control de operaciones frontend de ARCHIVE[src].
        </p>
      </header>

      <div className="row g-4 mt-2">
        <article className="col-md-6 col-xl-4">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">
              Catálogo activo
            </span>

            <strong className="admin-stat-card__value">
              {totalProducts} Productos
            </strong>

            <Link to="/admin/productos">
              Administrar catálogo →
            </Link>
          </div>
        </article>

        {isAdmin && (
          <article className="col-md-6 col-xl-4">
            <div className="admin-stat-card">
              <span className="admin-stat-card__label">
                Usuarios registrados
              </span>

              <strong className="admin-stat-card__value">
                {totalUsers} Cuentas
              </strong>

              <Link to="/admin/usuarios">
                Gestionar accesos →
              </Link>
            </div>
          </article>
        )}

        <article className="col-md-6 col-xl-4">
          <div className="admin-stat-card">
            <span className="admin-stat-card__label">
              Órdenes de compra
            </span>

            <strong className="admin-stat-card__value">
              Pendientes
            </strong>

            <span className="admin-stat-card__notice">
              Simulación Frontend
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}