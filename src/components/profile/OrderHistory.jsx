import { formatearPrecio } from "../../utils/formatters.js";

export default function OrderHistory({ pedidos, onDownload }) {
  if (pedidos.length === 0) {
    return <p className="text-muted text-center py-4 mb-0">Aún no tienes pedidos.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light small text-uppercase">
          <tr><th>N° orden</th><th>Fecha</th><th>Total</th><th>Estado</th><th className="text-end">Boleta</th></tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td className="font-monospace">{p.id}</td>
              <td>{new Date(p.fecha).toLocaleDateString("es-CL")}</td>
              <td className="font-monospace">{formatearPrecio(p.total)}</td>
              <td><span className="badge bg-dark">{p.estado}</span></td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-dark" onClick={() => onDownload(p)}>Descargar boleta</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
