import { Link, useLocation } from "react-router-dom";
import OrderDataFields from "../../components/cart/OrderDataFields.jsx";
import OrderItemsTable from "../../components/cart/OrderItemsTable.jsx";
import OrderTotals from "../../components/cart/OrderTotals.jsx";

export default function PurchaseError() {
  const intento = useLocation().state?.intento;

  return (
    <main className="container my-5 flex-grow-1">
      <article className="border bg-white p-3 p-md-4 mx-auto shadow-sm" style={{ maxWidth: 820 }}>
        <h1 className="h4 fw-bold mb-1">
          <span className="text-danger me-2" aria-hidden="true">&#10007;</span>
          No se pudo realizar el pago.{intento && <> nro #{intento.numero}</>}
        </h1>
        <div className="d-flex align-items-center gap-2 my-2">
          <span className="badge bg-danger rounded-0" data-testid="estado-pago">PAGO DECLINADO</span>
          <small className="text-muted">No se realizó ningún cobro y tu carrito sigue intacto.</small>
        </div>
        {intento && <p className="small text-muted mb-1">Referencia del intento: {intento.numero}</p>}
        <h2 className="h6 text-muted mb-3">Detalle de compra</h2>

        <div className="text-center mb-4">
          <Link to="/checkout" state={intento ? { datos: intento.cliente } : undefined} className="btn btn-success rounded-0 fw-bold px-4 py-2">
            VOLVER A REALIZAR EL PAGO
          </Link>
          <div className="mt-2">
            <Link to="/carrito" className="small text-muted border-bottom border-secondary">Volver al carrito</Link>
          </div>
        </div>

        {intento && (
          <>
            <OrderDataFields cliente={intento.cliente} prefijo="err" />
            <OrderItemsTable items={intento.items} />
            <OrderTotals
              subtotal={intento.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)}
              total={intento.total}
              etiquetaTotal="Total a pagar"
            />
          </>
        )}
      </article>
    </main>
  );
}
