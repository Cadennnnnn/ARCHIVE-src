import { useState } from "react";
import { Link } from "react-router-dom";
import { ESTADOS_PEDIDO, getOrders, updateOrderStatus } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminOrders() {
  const [pedidos, setPedidos] = useState(getOrders);

  const cambiarEstado = (id, estado) => {
    updateOrderStatus(id, estado);
    setPedidos(getOrders());
  };

  const recientes = [...pedidos].reverse();

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Órdenes / Boletas</h2>
        <p className="text-muted">Gestión y seguimiento de las órdenes de compra realizadas.</p>
      </section>
      <div className="border p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light small text-uppercase">
              <tr>
                <th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th className="text-end">Boleta</th>
              </tr>
            </thead>
            <tbody>
              {recientes.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">Aún no hay órdenes registradas.</td></tr>
              ) : (
                recientes.map((p) => (
                  <tr key={p.id}>
                    <td className="font-monospace">{p.id}</td>
                    <td>{new Date(p.fecha).toLocaleString("es-CL")}</td>
                    <td>
                      {p.cliente?.nombre} {p.cliente?.apellidos}
                      <small className="d-block text-muted">{p.cliente?.correo}</small>
                    </td>
                    <td className="font-monospace">{formatearPrecio(p.total)}</td>
                    <td>
                      <select
                        className="form-select form-select-sm rounded-0"
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                        aria-label={`Estado de ${p.id}`}
                      >
                        {ESTADOS_PEDIDO.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </td>
                    <td className="text-end">
                      <Link to={`/admin/ordenes/${p.id}`} className="btn btn-sm btn-outline-dark">Ver boleta</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}