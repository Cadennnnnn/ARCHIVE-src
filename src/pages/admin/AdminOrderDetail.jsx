import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getOrderById } from "../../data/db.js";
import { descargarBoletaPdf } from "../../utils/boletaPdf.js";
import { formatearPrecio } from "../../utils/formatters.js";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const pedido = getOrderById(id);

  if (!pedido) {
    return (
      <>
        <h2>Boleta no encontrada</h2>
        <Link to="/admin/ordenes" className="btn btn-archive-outline mt-3">Volver a órdenes</Link>
      </>
    );
  }

  const { cliente, items } = pedido;

  const handleEmail = () =>
    Swal.fire({
      icon: "success",
      title: "Boleta enviada",
      text: `Se envió la boleta ${pedido.id} a ${cliente.correo} (simulado).`,
      confirmButtonColor: "#1B2A4A",
      customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
    });

  return (
    <>
      <div className="no-print d-flex flex-wrap gap-2 mb-4">
        <Link to="/admin/ordenes" className="btn btn-archive-outline">&larr; Volver a órdenes</Link>
        <button className="btn btn-danger rounded-0 fw-bold" onClick={() => descargarBoletaPdf(pedido)}>Descargar boleta en PDF</button>
        <button className="btn btn-outline-dark rounded-0 fw-bold" onClick={() => window.print()}>Imprimir</button>
        <button className="btn btn-success rounded-0 fw-bold" onClick={handleEmail}>Enviar boleta por email</button>
      </div>

      <article className="boleta border bg-white p-4 mx-auto" style={{ maxWidth: 780 }}>
        <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
          <div>
            <span className="brand-logo" style={{ fontSize: "1.8rem" }}>ARCHIVE[src]</span>
            <small className="d-block text-muted">Av. Providencia 1234, Local 10 · +56 9 1234 5678</small>
          </div>
          <div className="text-end">
            <h4 className="mb-1">BOLETA {pedido.id}</h4>
            <small className="d-block text-muted">{new Date(pedido.fecha).toLocaleString("es-CL")}</small>
            <span className="badge bg-dark">{pedido.estado}</span>
          </div>
        </div>

        <div className="row g-3 mb-3 small">
          <div className="col-md-6">
            <strong className="text-uppercase d-block">Cliente</strong>
            {cliente.nombre} {cliente.apellidos}<br />
            {cliente.correo}
          </div>
          <div className="col-md-6">
            <strong className="text-uppercase d-block">Entrega</strong>
            {cliente.entrega}<br />
            {cliente.direccion}{cliente.departamento ? `, Depto ${cliente.departamento}` : ""}<br />
            {cliente.comuna}, {cliente.region}
            {cliente.indicaciones && <em className="d-block text-muted">Indicaciones: {cliente.indicaciones}</em>}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light small text-uppercase">
              <tr><th>Producto</th><th>Precio</th><th>Cant.</th><th className="text-end">Subtotal</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={i.imagen} alt={i.nombre} style={{ width: 45, height: 45, objectFit: "contain" }} />
                      <div>
                        <strong className="d-block">{i.nombre}</strong>
                        <small className="text-muted">{i.codigo}</small>
                      </div>
                    </div>
                  </td>
                  <td className="font-monospace">{formatearPrecio(i.precio)}</td>
                  <td>{i.cantidad}</td>
                  <td className="text-end font-monospace">{formatearPrecio(i.precio * i.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-top pt-3 d-flex justify-content-between fs-5 fw-bold">
          <span>TOTAL PAGADO</span>
          <span className="font-monospace">{formatearPrecio(pedido.total)}</span>
        </div>
      </article>
    </>
  );
}