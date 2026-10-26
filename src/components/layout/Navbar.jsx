import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/productos", label: "Productos" },
  { to: "/categorias", label: "Categorías" },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const { user, logout, esStaff } = useAuth();
  const { totalItems } = useCart();

  return (
    <header>
      <nav className="navbar navbar-expand-lg archive-navbar py-3">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">ARCHIVE[src]</Link>
          <button
            className="navbar-toggler rounded-0 border-dark"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
              {LINKS.map((l) => (
                <li className="nav-item" key={l.to}>
                  <NavLink className="nav-link" to={l.to} end={l.to === "/"}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
            <div className="d-flex align-items-center gap-3">
              {user ? (
                <>
                  <span className="small fw-bold">Hola, {user.nombre}</span>
                  {esStaff && <Link to="/admin" className="nav-link">Panel</Link>}
                  <button className="btn btn-link nav-link p-0" onClick={logout}>Salir</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Iniciar sesión</Link>
                  <span className="text-muted">|</span>
                  <Link to="/registro" className="nav-link">Registrar usuario</Link>
                </>
              )}
              <Link to="/carrito" className="btn btn-archive-outline">Cart ({totalItems})</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}