// Archivo: src/components/organisms/Header/Header.tsx
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contacto', path: '/contacto' },
];

export function Header() {
  const { itemCount } = useCart();

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
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrar usuario</Link>
            <Link className="archive-cart-link" to="/carrito">
              Cart ({itemCount})
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
