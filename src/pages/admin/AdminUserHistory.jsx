import { Link, useParams } from "react-router-dom";
import { getOrdersByEmail, getUsers } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminUserHistory() {
  const { run } = useParams();
  const usuario = getUsers().find((u) => u.run === run);

  if (!usuario) {
    return (
      <>
        <h2>Usuario no encontrado</h2>
        <Link to="/admin/usuarios" className="btn btn-archive-outline mt-3">Volver a usuarios</Link>
      </>
    );
  }

  const pedidos = [...getOrdersByEmail(usuario.correo)].reverse();
  const gastado = pedidos.filter((p) => p.estado !== "Anulado").reduce((acc, p) => acc + p.total, 0);

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Historial de compras</h2>
        <p className="mb-1"><strong>{usuario.nombre} {usuario.apellidos}</strong> · {usuario.correo} · <span className="badge bg-secondary">{usuario.rol}</span></p>
        <p className="text-muted mb-0">{pedidos.length} pedido(s) · Total gastado (sin anulados): <span className="font-monospace">{formatearPrecio(gastado)}</span></p>
      </section>

      <div className="border p-4 bg-white">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light small text-uppercase">
              <tr><th>N° orden</th><th>Fecha</th><th>Total</th><th>Estado</th><th className="text-end">Boleta</th></tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-muted">Este usuario aún no tiene compras.</td></tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id}>
                    <td className="font-monospace">{p.id}</td>
                    <td>{new Date(p.fecha).toLocaleString("es-CL")}</td>
                    <td className="font-monospace">{formatearPrecio(p.total)}</td>
                    <td><span className="badge bg-dark">{p.estado}</span></td>
                    <td className="text-end"><Link to={`/admin/ordenes/${p.id}`} className="btn btn-sm btn-outline-dark">Ver boleta</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link to="/admin/usuarios" className="small text-decoration-underline">&larr; Volver a usuarios</Link>
      </div>
    </>
  );
}