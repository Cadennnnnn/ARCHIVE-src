import { formatearPrecio } from "../../utils/formatters.js";

export default function OrderTotals({ subtotal, total, etiquetaTotal = "Total pagado" }) {
  return (
    <div className="border-top pt-3">
      <div className="d-flex justify-content-between text-muted mb-1">
        <span>SUBTOTAL</span>
        <span className="font-monospace">{formatearPrecio(subtotal)}</span>
      </div>
      <div className="d-flex justify-content-between fs-5 fw-bold">
        <span>{etiquetaTotal.toUpperCase()}</span>
        <span className="font-monospace">{formatearPrecio(total)}</span>
      </div>
    </div>
  );
}