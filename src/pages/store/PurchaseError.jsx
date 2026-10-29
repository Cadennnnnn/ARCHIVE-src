import { Link, useLocation } from "react-router-dom";
import OrderSummary from "../../components/cart/OrderSummary.jsx";

export default function PurchaseError() {
  const intento = useLocation().state?.intento;

  return (
    <main className="container my-5 flex-grow-1">
      <article className="border bg-white p-3 p-md-4 mx-auto" style={{ maxWidth: 800 }}>
        <header className="text-center mb-4">
          <div className="text-danger display-4" aria-hidden="true">&#10007;</div>
          <h1 className="h3 fw-bolder">No pudimos procesar tu pago</h1>
          <p className="text-muted mb-1">Tu pago fue rechazado. No se realizó ningún cobro y tu carrito sigue intacto.</p>
          {intento && <small className="text-muted">Referencia del intento: {intento.numero}</small>}
        </header>

        <div className="border bg-light p-3 small mb-4">
          <strong className="d-block mb-1">¿Qué puedes hacer?</strong>
          Revisa tus datos, verifica que tu medio de pago tenga fondos disponibles e inténtalo nuevamente en unos minutos.
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <Link to="/checkout" state={intento ? { datos: intento.cliente } : undefined} className="btn btn-archive-primary px-4 py-2">
            Reintentar pago
          </Link>
          <Link to="/carrito" className="btn btn-archive-outline px-4 py-2">Volver al carrito</Link>
        </div>

        {intento && (
          <section>
            <h2 className="h5 fw-bold border-bottom pb-2 mb-3">Detalle de tu compra</h2>
            <OrderSummary cliente={intento.cliente} items={intento.items} total={intento.total} etiquetaTotal="Total a pagar" />
          </section>
        )}
      </article>
    </main>
  );
}