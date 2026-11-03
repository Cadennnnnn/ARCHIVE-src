import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import OrderDataFields from "../../components/cart/OrderDataFields.jsx";
import OrderItemsTable from "../../components/cart/OrderItemsTable.jsx";
import OrderTotals from "../../components/cart/OrderTotals.jsx";
import ReceiptActions from "../../components/cart/ReceiptActions.jsx";
import { getOrderById } from "../../data/db.js";
import { descargarBoletaPdf } from "../../utils/boletaPdf.js";

export default function PurchaseSuccess() {
  const state = useLocation().state;
  // Si se pierde el estado de navegación (por ejemplo al recargar), se recupera el último pedido guardado
  const pedido = state?.pedido ?? getOrderById(sessionStorage.getItem("ARCHIVE_LAST_ORDER"));

  if (!pedido) {
    return (
      <main className="container my-5 flex-grow-1 text-center">
        <h1 className="display-5 fw-bolder">¡COMPRA EXITOSA!</h1>
        <p className="text-muted my-4">Tu pedido fue registrado correctamente.</p>
        <Link to="/productos" className="btn btn-archive-primary px-4 py-3">Seguir comprando</Link>
      </main>
    );
  }

  const subtotal = pedido.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const handleEmail = () =>
    Swal.fire({
      icon: "success",
      title: "Boleta enviada",
      text: `Se envió la boleta ${pedido.id} a ${pedido.cliente.correo} (simulado).`,
      confirmButtonColor: "#1B2A4A",
      customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
    });

  return (
    <main className="container my-5 flex-grow-1">
      <article className="border bg-white p-3 p-md-4 mx-auto shadow-sm" style={{ maxWidth: 820 }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <h1 className="h4 fw-bold mb-0">
            <span className="text-success me-2" aria-hidden="true">&#10003;</span>
            Se ha realizado la compra. nro #<span data-testid="orden-id">{pedido.id}</span>
          </h1>
          <small className="text-muted">Código orden: {pedido.id}</small>
        </div>
        <div className="d-flex align-items-center gap-2 my-2">
          <span className="badge bg-success rounded-0" data-testid="estado-pago">PAGO ACEPTADO</span>
          <small className="text-muted">{new Date(pedido.fecha).toLocaleString("es-CL")}</small>
        </div>
        <h2 className="h6 text-muted mb-3">Detalle de la orden</h2>

        <OrderDataFields cliente={pedido.cliente} prefijo="ok" />
        <OrderItemsTable items={pedido.items} />
        <OrderTotals subtotal={subtotal} total={pedido.total} etiquetaTotal="Total pagado" />

        <div className="mt-4">
          <ReceiptActions onDownload={() => descargarBoletaPdf(pedido)} onEmail={handleEmail} />
          <div className="text-center mt-3 no-print">
            <Link to="/productos" className="btn btn-archive-outline">Seguir comprando</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
