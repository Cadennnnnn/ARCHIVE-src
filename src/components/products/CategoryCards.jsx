import { Link } from "react-router-dom";

export default function CategoryCards({ categorias }) {
  if (categorias.length === 0) return null;

  return (
    <section className="mb-5 text-center">
      <h2 className="h3 fw-bold border-bottom pb-2 mb-4">Categorías</h2>
      <div className="row g-4 justify-content-center">
        {categorias.map((c) => (
          <div className="col-6 col-md-4 col-lg-3" key={c.nombre}>
            <Link to={`/categorias?cat=${encodeURIComponent(c.nombre)}`} className="product-card d-block p-3 text-center h-100">
              <div className="product-img-box mb-2">
                {c.imagen ? <img src={c.imagen} alt={c.nombre} /> : <span className="text-muted small">Sin imagen</span>}
              </div>
              <strong className="text-uppercase d-block">{c.nombre}</strong>
              <small className="text-muted">{c.cantidad} producto(s)</small>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}