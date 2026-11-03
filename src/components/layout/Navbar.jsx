import { Link, useLocation } from "react-router-dom";
import { getCategories } from "../../data/db.js";
import AuthLinks from "./AuthLinks.jsx";
import CartButton from "./CartButton.jsx";
import NavMenu from "./NavMenu.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navbar() {
  useLocation(); // vuelve a leer las categorías al navegar
  const categorias = getCategories();

  return (
    <header className="archive-navbar bg-white border-bottom">
      <nav className="navbar navbar-expand-lg py-0">
        <div className="container flex-wrap">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 w-100 py-3">
            <Link className="navbar-brand brand-logo m-0" to="/">ARCHIVE[src]</Link>
            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 gap-md-3">
              <AuthLinks />
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
          </div>

          <div className="collapse navbar-collapse w-100 border-top" id="navContent">
            <NavMenu categorias={categorias} />
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
