import { Link, useParams } from "react-router-dom";
import { getOrdersByEmail, getUsers } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminUserDetail() {
  const { run } = useParams();
  const u = getUsers().find((x) => x.run === run);

  if (!u) {
    return (
      <>
        <h2>Usuario no encontrado</h2>
        <Link to="/admin/usuarios" className="btn btn-archive-outline mt-3">Volver a usuarios</Link>
      </>
    );
  }

  const pedidos = getOrdersByEmail(u.correo);
  const gastado = pedidos.filter((p) => p.estado !== "Anulado").reduce((acc, p) => acc + p.total, 0);

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Mostrar usuario</h2>
        <p className="text-muted mb-0">{u.correo}</p>
      </section>
      <div className="border p-4 bg-white" style={{ maxWidth: 640 }}>
        <h4 className="fw-bold">{u.nombre} {u.apellidos}</h4>
        <p className="mb-1"><strong>RUN:</strong> {u.run}</p>
        <p className="mb-1"><strong>Rol:</strong> <span className="badge bg-dark">{u.rol}</span></p>
        <p className="mb-1"><strong>Ubicación:</strong> {[u.comuna, u.region].filter(Boolean).join(", ") || "-"}</p>
        <p className="mb-3"><strong>Dirección:</strong> {u.direccion || "-"}</p>
        <p className="mb-4 text-muted">{pedidos.length} compra(s) · Total gastado (sin anulados): <span className="font-monospace">{formatearPrecio(gastado)}</span></p>
        <div className="d-flex flex-wrap gap-2">
          <Link to={`/admin/usuarios?editar=${u.run}`} className="btn btn-archive-primary">Editar usuario</Link>
          <Link to={`/admin/usuarios/${u.run}/compras`} className="btn btn-archive-outline">Historial de compras</Link>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary rounded-0">&larr; Volver</Link>
        </div>
      </div>
    </>
  );
}