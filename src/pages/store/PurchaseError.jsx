import { Link } from "react-router-dom";

export default function PurchaseError() {
  return (
    <main className="container my-5 flex-grow-1 text-center">
      <h1 className="display-5 fw-bolder">NO SE PUDO REALIZAR EL PAGO</h1>
      <p className="text-muted my-4">Tu carrito sigue intacto. Revisa tus datos e inténtalo nuevamente.</p>
      <Link to="/checkout" className="btn btn-archive-primary px-4 py-3 me-2">Reintentar pago</Link>
      <Link to="/carrito" className="btn btn-archive-outline px-4 py-3">Volver al carrito</Link>
    </main>
  );
}