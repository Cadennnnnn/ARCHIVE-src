import { Link, useLocation } from "react-router-dom";
import OrderSummary from "../../components/cart/OrderSummary.jsx";

export default function PurchaseError() {
  const intento = useLocation().state?.intento;

  if (!intento) {
    return (
      <main className="container my-5 flex-grow-1 text-center">
        <h1 className="display-5 fw-bolder">NO SE PUDO REALIZAR EL PAGO</h1>
        <p className="text-muted my-4">Tu carrito sigue intacto. Revisa tus datos e inténtalo nuevamente.</p>
        <Link to="/checkout" className="btn btn-archive-primary px-4 py-3 me-2">Reintentar pago</Link>
        <Link to="/carrito" className="btn btn-archive-outline px-4 py-3">Volver al carrito</Link>
      </main>
    );
  }

  return (
    <main className="container my-5 flex-grow-1">
      <article className="border bg-white p-4 mx-auto" style={{ maxWidth: 800 }}>
        <h2 className="h4 fw-bold mb-1"><span className="text-danger me-2">&#10007;</span>No se pudo realizar el pago. nro #{intento.numero}</h2>
        <p className="text-muted small mb-3">Detalle de la compra. Tu carrito sigue intacto y no se realizó ningún cobro.</p>
        <div className="text-center mb-4">
          <Link to="/checkout" state={{ datos: intento.cliente }} className="btn btn-success rounded-0 fw-bold px-4 py-2">
            VOLVER A REALIZAR EL PAGO
          </Link>
        </div>
        <OrderSummary cliente={intento.cliente} items={intento.items} total={intento.total} etiquetaTotal="Total a pagar" />
        <div className="text-center mt-4">
          <Link to="/carrito" className="btn btn-archive-outline">Volver al carrito</Link>
        </div>
      </article>
    </main>
  );
}