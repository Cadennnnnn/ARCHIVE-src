import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-top py-5 bg-light mt-auto">
      <div className="container pb-4">
        <div className="row g-5">
          <div className="col-12 col-lg-4 d-flex flex-column justify-content-center">
            <div style={{ fontFamily: "var(--font-hero)", fontWeight: 900 }}>
              <div style={{ fontSize: "11rem", lineHeight: 0.75, color: "var(--color-dark)", letterSpacing: "-0.05em" }}>A</div>
              <div style={{ fontSize: "3.5rem", lineHeight: 0.8, color: "var(--color-navy)", paddingLeft: "0.3rem", marginTop: "0.5rem" }}>[src]</div>
            </div>
          </div>

          <div className="col-12 col-md-4 col-lg-2 mt-lg-5">
            <h6 className="fw-bold text-uppercase mb-2">Categorías</h6>
            <div className="mb-4" style={{ width: 30, borderTop: "3px solid var(--color-navy)" }}></div>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/categorias?cat=Zapatillas" className="text-dark">Sneakers</Link></li>
              <li><Link to="/categorias?cat=Ropa" className="text-dark">Apparel</Link></li>
              <li><Link to="/categorias?cat=Accesorios" className="text-dark">Goods</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-3 mt-lg-5">
            <h6 className="fw-bold text-uppercase mb-2">Información</h6>
            <div className="mb-4" style={{ width: 30, borderTop: "3px solid var(--color-navy)" }}></div>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/nosotros" className="text-dark">Sobre nosotros</Link></li>
              <li><Link to="/contacto" className="text-dark">Contacto y Ayuda</Link></li>
              <li><Link to="/admin" className="text-dark">Panel Administrativo</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-3 mt-lg-5">
            <h6 className="fw-bold text-uppercase mb-2">Síguenos</h6>
            <div className="mb-4" style={{ width: 30, borderTop: "3px solid var(--color-navy)" }}></div>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><a href="#" className="text-dark">Instagram</a></li>
              <li><a href="#" className="text-dark">TikTok</a></li>
              <li><a href="#" className="text-dark">X (Twitter)</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-4 text-dark border-top text-center">
          <p className="mb-2">
            <strong>Dirección:</strong> Av. Providencia 1234, Local 10 &nbsp;|&nbsp; <strong>Teléfono:</strong> +56 9 1234 5678
          </p>
          <span className="small text-muted">&copy; 2026 ARCHIVE[src] - Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}