import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { getCategories } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

const LINKS_ANTES = [
  { to: "/", label: "Home" },
  { to: "/productos", label: "Productos" },
];

const LINKS_DESPUES = [
  { to: "/ofertas", label: "Ofertas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contacto", label: "Contacto" },
];

function ItemNav({ to, label }) {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={to} end={to === "/"}>{label}</NavLink>
    </li>
  );
}

export default function Navbar() {
  const { user, logout, esStaff } = useAuth();
  const { totalItems, total } = useCart();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  useLocation(); // vuelve a leer las categorías al navegar
  const categorias = getCategories();

  const buscar = (e) => {
    e.preventDefault();
    const t = q.trim();
    navigate(t ? `/productos?q=${encodeURIComponent(t)}` : "/productos");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-xl archive-navbar py-3">
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
            <ul className="navbar-nav mx-auto mb-2 mb-xl-0 gap-xl-3">
              {LINKS_ANTES.map((l) => <ItemNav key={l.to} {...l} />)}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu rounded-0">
                  <li><Link className="dropdown-item" to="/categorias">Todas</Link></li>
                  {categorias.map((c) => (
                    <li key={c}>
                      <Link className="dropdown-item" to={`/categorias?cat=${encodeURIComponent(c)}`}>{c}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              {LINKS_DESPUES.map((l) => <ItemNav key={l.to} {...l} />)}
            </ul>

            <form role="search" className="d-flex gap-2 me-xl-3 mb-2 mb-xl-0" onSubmit={buscar}>
              <input
                type="search"
                className="form-control form-control-sm rounded-0"
                style={{ minWidth: 150 }}
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-archive-outline">Buscar</button>
            </form>

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
              <Link to="/carrito" className="btn btn-archive-outline text-nowrap" title={`${totalItems} producto(s) en el carrito`}>
                {`Carrito ${formatearPrecio(total)}`}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}