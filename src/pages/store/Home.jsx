import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ProductGrid from "../../components/products/ProductGrid.jsx";
import { getProducts } from "../../data/db.js";
import { useCart } from "../../context/CartContext.jsx";
import { toastAgregado } from "../../utils/alerts.js";

const SLIDES = [
  {
    badge: "Lanzamiento",
    titulo: "ARCHIVE[src]",
    texto: "Volver a la fuente de la cultura. Un archivo seleccionado con tranquilidad: zapatillas, prendas y accesorios esenciales directo desde su [source] original.",
    cta: "Ver productos ↓",
    to: "/productos",
    img: "/img/hero.jpg",
  },
  {
    badge: "Indumentaria",
    titulo: "NUEVA ERA",
    texto: "Equipamiento técnico, siluetas utilitarias y cortes pesados diseñados bajo estándares de conservación textil.",
    cta: "Explorar Ropa →",
    to: "/categorias?cat=Ropa",
    img: "https://cdn.shopify.com/s/files/1/0271/9658/8125/files/gorpcore-fashion.jpg?v=1693332721",
  },
  {
    badge: "Accesorios",
    titulo: "ESSENTIAL GOODS",
    texto: "Detalles que marcan la diferencia en tu rotación diaria: gorros, bolsos utilitarios y piezas limitadas.",
    cta: "Ver Accesorios ↓",
    to: "/categorias?cat=Accesorios",
    img: "https://moredrops.cl/medias/desktop-drops.webp?context=bWFzdGVyfGltYWdlc3wzNjc3MjZ8aW1hZ2Uvd2VicHxhR0kzTDJneFppOHhNREUzTWpRME56TTVNVGMzTkM5a1pYTnJkRzl3TFdSeWIzQnpMbmRsWW5BfGZkNGVlYmNmNzVjMTFlNTdiODhlNDUxMGY5YzEyNjJkMWUxNzBlNzY4ZTIxNDMwOGQ5NmFlN2IxMjQzZTFmMzY",
  },
  {
    badge: "Bóveda",
    titulo: "GRAILS DEL ARCHIVO",
    texto: "Siluetas históricas verificadas manualmente una a una. Revisa nuestra selección exclusiva de calzado.",
    cta: "Explorar Zapatillas →",
    to: "/categorias?cat=Zapatillas",
    img: "https://hips.hearstapps.com/hmg-prod/images/travis-scott-jordan-1-low-1670838159.jpg",
  },
];

export default function Home() {
  const [productos] = useState(getProducts);
  const [email, setEmail] = useState("");
  const { addItem } = useCart();

  const handleAdd = (p) => {
    addItem(p);
    toastAgregado(p.nombre);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¡SUSCRITO!",
      text: "Recibirás acceso prioritario a los próximos drops.",
      icon: "success",
      confirmButtonColor: "#1B2A4A",
      customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
    });
    setEmail("");
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="mb-5 border bg-light">
        <div id="archiveCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {SLIDES.map((s, i) => (
              <button
                key={s.titulo}
                type="button"
                data-bs-target="#archiveCarousel"
                data-bs-slide-to={i}
                className={`bg-dark ${i === 0 ? "active" : ""}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner">
            {SLIDES.map((s, i) => (
              <div key={s.titulo} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                <div className="row align-items-center g-4 p-4 p-lg-5">
                  <div className={`col-lg-6 ${i % 2 ? "order-lg-2 text-lg-end" : ""}`}>
                    <span className="badge bg-dark rounded-0 text-uppercase px-2 py-1 mb-2 font-monospace">{s.badge}</span>
                    <h2 className="display-4 fw-bolder" style={{ textTransform: "none" }}>{s.titulo}</h2>
                    <p className="lead text-muted my-3">{s.texto}</p>
                    <Link to={s.to} className={`btn px-4 py-3 ${i % 2 ? "btn-archive-outline" : "btn-archive-primary"}`}>
                      {s.cta}
                    </Link>
                  </div>
                  <div className={`col-lg-6 text-center ${i % 2 ? "order-lg-1" : ""}`}>
                    <img src={s.img} alt={s.titulo} className="img-fluid" style={{ maxHeight: 380, objectFit: "contain" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#archiveCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: "invert(1)" }}></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#archiveCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: "invert(1)" }}></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h2 className="h3 fw-bold">Lanzamientos Recientes</h2>
          <Link to="/productos" className="text-uppercase fw-bold text-muted small">Ver Todo &rarr;</Link>
        </div>
        <ProductGrid productos={productos.slice(0, 8)} onAdd={handleAdd} />
      </section>

      <section className="my-5 p-4 border bg-white">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h4 className="mb-1 fw-bold">Stay In Touch! Join Our Newsletter</h4>
            <p className="text-muted small mb-0">Recibe acceso prioritario a los próximos drops y noticias de la tienda.</p>
          </div>
          <div className="col-md-6">
            <form className="d-flex gap-2 mt-3 mt-md-0" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="form-control rounded-0"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-archive-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}