import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import OrderSummary from "../../components/cart/OrderSummary.jsx";
import ReceiptActions from "../../components/cart/ReceiptActions.jsx";
import { descargarBoletaPdf } from "../../utils/boletaPdf.js";

export default function PurchaseSuccess() {
  const pedido = useLocation().state?.pedido;

  if (!pedido) {
    return (
      <main className="container my-5 flex-grow-1 text-center">
        <h1 className="display-5 fw-bolder">¡COMPRA EXITOSA!</h1>
        <p className="text-muted my-4">Tu pedido fue registrado correctamente.</p>
        <Link to="/productos" className="btn btn-archive-primary px-4 py-3">Seguir comprando</Link>
      </main>
    );
  }

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
      <article className="border bg-white p-3 p-md-4 mx-auto" style={{ maxWidth: 800 }}>
        <header className="text-center mb-4">
          <div className="text-success display-4" aria-hidden="true">&#10003;</div>
          <h1 className="h3 fw-bolder">¡Compra realizada con éxito!</h1>
          <p className="text-muted mb-0">Gracias por tu compra. Guarda este comprobante.</p>
        </header>

        <section className="border bg-light p-3 mb-4">
          <h2 className="h5 fw-bold mb-2">Detalle de la orden</h2>
          <p className="mb-1"><strong>ID de orden:</strong> <span data-testid="orden-id">{pedido.id}</span></p>
          <p className="mb-0"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString("es-CL")}</p>
        </section>

        <OrderSummary cliente={pedido.cliente} items={pedido.items} total={pedido.total} etiquetaTotal="Total pagado" />

        <div className="mt-4">
          <ReceiptActions
            onDownload={() => descargarBoletaPdf(pedido)}
            onPrint={() => window.print()}
            onEmail={handleEmail}
          />
          <div className="text-center mt-3 no-print">
            <Link to="/productos" className="btn btn-archive-outline">Seguir comprando</Link>
          </div>
        </div>
      </article>
    </main>
  );
}