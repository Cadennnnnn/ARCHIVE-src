import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useAuth } from '../../../hooks/useAuth';

export function AdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión se cerrará en este dispositivo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1B2A4A',
    });

    if (result.isConfirmed) {
      logout();
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="archive-admin">
      <aside className="archive-admin__sidebar">
        <NavLink to="/admin" className="archive-admin__brand">
          ARCHIVE<span>[src]</span>
        </NavLink>

        <p className="archive-admin__section-label">
          ADMINISTRACIÓN
        </p>

        <nav className="archive-admin__navigation">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/ordenes">
            Órdenes y boletas
          </NavLink>

          <NavLink to="/admin/productos">
            Inventario
          </NavLink>

          <NavLink to="/admin/categorias">
            Categorías
          </NavLink>

          <NavLink to="/admin/stock-critico">
            Stock crítico
          </NavLink>

          <NavLink to="/admin/reportes">
            Reportes
          </NavLink>

          {session?.role === 'Administrador' && (
            <NavLink to="/admin/usuarios">
              Usuarios
            </NavLink>
          )}
        </nav>

        <div className="archive-admin__sidebar-footer">
          <NavLink to="/">
            Volver a la tienda
          </NavLink>
        </div>
      </aside>

      <div className="archive-admin__content">
        <header className="archive-admin__topbar">
          <div>
            <strong>{session?.user.nombre}</strong>
            <span>{session?.role}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="archive-admin__logout"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="archive-admin__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
