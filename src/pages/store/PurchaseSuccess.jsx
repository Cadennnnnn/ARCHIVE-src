import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import OrderSummary from "../../components/cart/OrderSummary.jsx";

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
      <article className="border bg-white p-4 mx-auto" style={{ maxWidth: 800 }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <h2 className="h4 fw-bold mb-0"><span className="text-success me-2">&#10003;</span>Se ha realizado la compra. nro #{pedido.id}</h2>
          <small className="text-muted">Código orden: {pedido.id}</small>
        </div>
        <OrderSummary cliente={pedido.cliente} items={pedido.items} total={pedido.total} etiquetaTotal="Total pagado" />
        <div className="no-print d-flex flex-wrap gap-2 justify-content-center mt-4">
          <button className="btn btn-danger rounded-0 fw-bold" onClick={() => window.print()}>Imprimir boleta en PDF</button>
          <button className="btn btn-success rounded-0 fw-bold" onClick={handleEmail}>Enviar boleta por email</button>
          <Link to="/productos" className="btn btn-archive-outline">Seguir comprando</Link>
        </div>
      </article>
    </main>
  );
}