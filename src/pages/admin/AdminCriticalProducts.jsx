import { useState } from "react";
import { Link } from "react-router-dom";
import { STOCK_CRITICO, getCriticalProducts, updateProduct } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminCriticalProducts() {
  const [umbral, setUmbral] = useState(STOCK_CRITICO);
  const [criticos, setCriticos] = useState(() => getCriticalProducts(STOCK_CRITICO));

  const cambiarUmbral = (valor) => {
    const n = Math.max(0, Number(valor) || 0);
    setUmbral(n);
    setCriticos(getCriticalProducts(n));
  };

  const reponer = (p) => {
    updateProduct(p.id, { stock: p.stock + 10 });
    setCriticos(getCriticalProducts(umbral));
  };

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Productos críticos</h2>
        <p className="text-muted">Productos con stock igual o menor al umbral indicado.</p>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="umbral" className="small text-uppercase fw-bold mb-0">Umbral de stock</label>
          <input
            id="umbral"
            type="number"
            min="0"
            className="form-control form-control-sm rounded-0"
            style={{ width: 90 }}
            value={umbral}
            onChange={(e) => cambiarUmbral(e.target.value)}
          />
        </div>
      </section>

      <div className="border p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light small text-uppercase">
              <tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th className="text-end">Acción</th></tr>
            </thead>
            <tbody>
              {criticos.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">Ningún producto está bajo el umbral.</td></tr>
              ) : (
                criticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td><span className="badge bg-secondary">{p.categoria}</span></td>
                    <td className="font-monospace">{formatearPrecio(p.precio)}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? "bg-danger" : "bg-warning text-dark"}`}>
                        {p.stock === 0 ? "Agotado" : p.stock}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-dark" onClick={() => reponer(p)}>Reponer +10</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link to="/admin/productos" className="small text-decoration-underline">Ir a gestión de productos &rarr;</Link>
      </div>
    </>
  );
}