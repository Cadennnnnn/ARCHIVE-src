import { Link } from "react-router-dom";
import { formatearPrecio } from "../../utils/formatters.js";

export default function ProductCard({ producto, onAdd }) {
  const { id, nombre, categoria, precio, oferta, imagen } = producto;
  const enOferta = oferta !== null && oferta > 0;

  return (
    <article className="col-12 col-sm-6 col-lg-3">
      <div className="product-card p-3 h-100 d-flex flex-column">
        <div className="product-img-box mb-2 position-relative">
          {enOferta && <span className="badge bg-danger rounded-0 position-absolute top-0 start-0 m-2">OFERTA</span>}
          <Link to={`/productos/${id}`}>
            <img src={imagen} alt={nombre} />
          </Link>
        </div>
        <span className="text-muted small text-uppercase">{categoria}</span>
        <h6 className="fw-bold my-1">
          <Link to={`/productos/${id}`}>{nombre}</Link>
        </h6>
        <div className="mb-3 font-monospace fw-bold">
          {enOferta ? (
            <>
              <span className="text-danger me-2">{formatearPrecio(oferta)}</span>
              <span className="text-muted text-decoration-line-through small">{formatearPrecio(precio)}</span>
            </>
          ) : (
            formatearPrecio(precio)
          )}
        </div>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/productos/${id}`} className="btn btn-sm btn-archive-outline w-50">Detalle</Link>
          <button className="btn btn-sm btn-archive-primary w-50" onClick={() => onAdd(producto)}>Añadir</button>
        </div>
      </div>
    </article>
  );
}