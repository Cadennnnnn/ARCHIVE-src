import { Link } from "react-router-dom";
import { formatearPrecio } from "../../utils/formatters.js";

export default function CartSummary({ total, onCheckout, onClear, disabled }) {
  return (
    <div className="p-4 border bg-white">
      <h4 className="fw-bold mb-3 border-bottom pb-2">RESUMEN DE ORDEN</h4>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-uppercase fw-bold">Total:</span>
        <span className="font-monospace fw-bold fs-3" data-testid="cart-total">{formatearPrecio(total)}</span>
      </div>
      <button className="btn btn-archive-primary w-100 py-3" onClick={onCheckout} disabled={disabled}>PROCEDER AL PAGO</button>
      <button className="btn btn-archive-outline w-100 py-2 mt-2" onClick={onClear} disabled={disabled}>LIMPIAR CARRITO</button>
      <div className="mt-3 text-center">
        <Link to="/productos" className="small text-muted border-bottom border-secondary pb-1">&larr; Continuar explorando el catálogo</Link>
      </div>
    </div>
  );
}