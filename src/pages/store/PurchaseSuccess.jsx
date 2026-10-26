import { Link, useLocation } from "react-router-dom";
import { formatearPrecio } from "../../utils/formatters.js";

export default function PurchaseSuccess() {
  const pedido = useLocation().state?.pedido;

  return (
    <main className="container my-5 flex-grow-1 text-center">
      <h1 className="display-5 fw-bolder">¡COMPRA EXITOSA!</h1>
      {pedido ? (
        <div className="border bg-white p-4 mx-auto my-4 text-start" style={{ maxWidth: 520 }}>
          <p className="mb-1"><strong>N° de orden:</strong> {pedido.id}</p>
          <p className="mb-1"><strong>Entrega:</strong> {pedido.cliente.entrega}</p>
          <p className="mb-3"><strong>Dirección:</strong> {pedido.cliente.direccion}, {pedido.cliente.comuna}</p>
          {pedido.items.map((i) => (
            <div key={i.id} className="d-flex justify-content-between small">
              <span>{i.nombre} × {i.cantidad}</span>
              <span className="font-monospace">{formatearPrecio(i.precio * i.cantidad)}</span>
            </div>
          ))}
          <hr />
          <p className="fw-bold d-flex justify-content-between"><span>TOTAL</span><span className="font-monospace">{formatearPrecio(pedido.total)}</span></p>
        </div>
      ) : (
        <p className="text-muted">Tu pedido fue registrado correctamente.</p>
      )}
      <Link to="/productos" className="btn btn-archive-primary px-4 py-3">Seguir comprando</Link>
    </main>
  );
}