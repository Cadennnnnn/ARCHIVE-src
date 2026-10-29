import { Link, NavLink } from "react-router-dom";

const ANTES = [
  { to: "/", label: "Home" },
  { to: "/productos", label: "Productos" },
];

const DESPUES = [
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

export default function NavMenu({ categorias }) {
  return (
    <ul className="navbar-nav mx-lg-auto mb-2 mb-lg-0 gap-lg-3">
      {ANTES.map((l) => <ItemNav key={l.to} {...l} />)}
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
      {DESPUES.map((l) => <ItemNav key={l.to} {...l} />)}
    </ul>
  );
}