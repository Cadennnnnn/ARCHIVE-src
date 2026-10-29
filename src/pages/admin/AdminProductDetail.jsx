import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminProductDetail() {
  const { id } = useParams();
  const p = getProductById(id);

  if (!p) {
    return (
      <>
        <h2>Producto no encontrado</h2>
        <Link to="/admin/productos" className="btn btn-archive-outline mt-3">Volver a productos</Link>
      </>
    );
  }

  const enOferta = p.oferta !== null && p.oferta > 0;

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Mostrar producto</h2>
        <p className="text-muted mb-0">{p.codigo} · {p.categoria}</p>
      </section>
      <div className="border p-4 bg-white">
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="border bg-light p-3">
              <img src={p.imagen} alt={p.nombre} className="img-fluid" style={{ maxHeight: 260, objectFit: "contain" }} />
            </div>
          </div>
          <div className="col-md-8">
            <h3 className="fw-bold">{p.nombre}</h3>
            <p className="font-monospace fs-5 mb-2">
              {enOferta ? (
                <>
                  <span className="text-danger me-2">{formatearPrecio(p.oferta)}</span>
                  <s className="text-muted fs-6">{formatearPrecio(p.precio)}</s>
                </>
              ) : (
                formatearPrecio(p.precio)
              )}
            </p>
            <p className="mb-1">
              <strong>Stock:</strong>{" "}
              <span className={`badge ${p.stock === 0 ? "bg-danger" : p.stock <= 5 ? "bg-warning text-dark" : "bg-success"}`}>
                {p.stock === 0 ? "Agotado" : p.stock}
              </span>
            </p>
            <p className="mb-1"><strong>Tallas:</strong> {(p.tallas ?? []).join(", ") || "-"}</p>
            <p className="text-muted mt-3">{p.descripcion || "Sin descripción."}</p>
            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link to={`/admin/productos?editar=${p.id}`} className="btn btn-archive-primary">Editar producto</Link>
              <Link to={`/productos/${p.id}`} className="btn btn-archive-outline">Ver en la tienda</Link>
              <Link to="/admin/productos" className="btn btn-outline-secondary rounded-0">&larr; Volver</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}