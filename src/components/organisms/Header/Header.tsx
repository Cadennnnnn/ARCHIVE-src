

import { Link, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Categorías', path: '/categorias' },
  { label: 'Ofertas', path: '/ofertas' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contacto', path: '/contacto' },
];

export function Header() {
  const { itemCount } = useCart();
  const { session, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const canAccessAdmin =
    session?.role === 'Administrador' ||
    session?.role === 'Vendedor';

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
      navigate('/', { replace: true });
    }
  }

  return (
    <header className="archive-header">
      <nav className="container navbar navbar-expand-lg">
        <Link className="archive-brand" to="/">
          ARCHIVE<span>[src]</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#archiveNavigation"
          aria-label="Abrir navegación"
          aria-controls="archiveNavigation"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="archiveNavigation">
          <div className="navbar-nav mx-auto gap-lg-3">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `archive-nav-link${isActive ? ' active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="archive-header__actions">
            {isAuthenticated && session ? (
              <>
                <span className="archive-header__user">
                  {session.user.nombre}
                </span>

                {canAccessAdmin && (
                  <Link to="/admin">
                    Panel administrativo
                  </Link>
                )}

                <button
                  type="button"
                  className="archive-header__logout"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/registro">Registrar usuario</Link>
              </>
            )}

            <Link className="archive-cart-link" to="/carrito">
              Cart ({itemCount})
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
