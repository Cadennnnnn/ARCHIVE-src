import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../data/db.js";
import { useCart } from "../../context/CartContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";
import { toastAgregado } from "../../utils/alerts.js";

export default function ProductDetail() {
  const { id } = useParams();
  const producto = getProductById(id);
  const [talla, setTalla] = useState(producto?.tallas?.[0] ?? "");
  const [cantidad, setCantidad] = useState(1);
  const { addItem } = useCart();

  if (!producto) {
    return (
      <main className="container my-5 flex-grow-1">
        <h1 className="fw-bolder">PRODUCTO NO ENCONTRADO</h1>
        <Link to="/productos" className="btn btn-archive-outline mt-3">Volver al catálogo</Link>
      </main>
    );
  }

  const enOferta = producto.oferta !== null && producto.oferta > 0;
  const agotado = producto.stock <= 0;

  const handleAdd = () => {
    addItem(producto, cantidad);
    toastAgregado(producto.nombre);
  };

  return (
    <main className="container my-5 flex-grow-1">
      <article className="row g-5 align-items-center">
        <div className="col-lg-6">
          <div className="p-4 border bg-light text-center">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: 400, objectFit: "contain" }} />
          </div>
        </div>
        <div className="col-lg-6">
          <span className="text-muted text-uppercase fw-bold">{producto.categoria} | SKU: {producto.codigo}</span>
          <h1 className="mt-2 mb-3 fw-bolder">{producto.nombre}</h1>
          <h3 className="font-monospace fw-bold mb-4">
            {enOferta ? (
              <>
                <span className="text-danger me-3">{formatearPrecio(producto.oferta)}</span>
                <span className="text-muted text-decoration-line-through fs-5">{formatearPrecio(producto.precio)}</span>
              </>
            ) : (
              formatearPrecio(producto.precio)
            )}
          </h3>
          <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>{producto.descripcion}</p>

          <div className="row g-3 mb-4" style={{ maxWidth: 420 }}>
            <div className="col-7">
              <label className="form-label fw-bold small text-uppercase">Talla</label>
              <select className="form-select rounded-0" value={talla} onChange={(e) => setTalla(e.target.value)}>
                {producto.tallas.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-5">
              <label className="form-label fw-bold small text-uppercase">Cantidad</label>
              <input
                type="number"
                min="1"
                max={producto.stock}
                disabled={agotado}
                className="form-control rounded-0"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, Number(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-archive-primary px-4 py-3" onClick={handleAdd} disabled={agotado}>
              {agotado ? "Agotado" : "Añadir al Carrito"}
            </button>
            <Link to="/productos" className="btn btn-archive-outline px-4 py-3">Volver al catálogo</Link>
          </div>
        </div>
      </article>
    </main>
  );
}