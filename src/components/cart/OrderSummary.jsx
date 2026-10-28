import { formatearPrecio } from "../../utils/formatters.js";

export default function OrderSummary({ cliente, items, total, etiquetaTotal = "Total pagado" }) {
  return (
    <>
      <div className="row g-3 mb-3 small">
        <div className="col-md-6">
          <strong className="text-uppercase d-block">Cliente</strong>
          {cliente.nombre} {cliente.apellidos}
          <br />
          {cliente.correo}
        </div>
        <div className="col-md-6">
          <strong className="text-uppercase d-block">Dirección de entrega</strong>
          {cliente.entrega}
          <br />
          {cliente.direccion}
          {cliente.departamento ? `, Depto ${cliente.departamento}` : ""}
          <br />
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
        <span>{etiquetaTotal.toUpperCase()}</span>
        <span className="font-monospace">{formatearPrecio(total)}</span>
      </div>
    </>
  );
}