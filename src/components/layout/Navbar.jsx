import { Link, useLocation } from "react-router-dom";
import { getCategories } from "../../data/db.js";
import AuthLinks from "./AuthLinks.jsx";
import CartButton from "./CartButton.jsx";
import NavMenu from "./NavMenu.jsx";
import SearchBar from "./SearchBar.jsx";

function ItemNav({ to, label }) {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={to} end={to === "/"}>{label}</NavLink>
    </li>
  );
}

export default function Navbar() {
  useLocation(); // vuelve a leer las categorías al navegar
  const categorias = getCategories();

  return (
    <header className="archive-navbar">
      <nav className="navbar navbar-expand-lg py-2">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">ARCHIVE[src]</Link>

          <div className="d-flex align-items-center gap-2 ms-auto ms-lg-0 order-lg-last">
            <CartButton />
            <button
              className="navbar-toggler rounded-0 border-dark"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navContent"
              aria-controls="navContent"
              aria-label="Abrir menú"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navContent">
            <NavMenu categorias={categorias} />
            <div className="ms-lg-3 py-2 py-lg-0">
              <AuthLinks />
            </div>
          </div>
        </div>
      </nav>

      <div className="border-top bg-light">
        <div className="container py-2">
          <div className="mx-auto" style={{ maxWidth: 560 }}>
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}