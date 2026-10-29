import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 7H6" />
    </svg>
  );
}


export default function CartButton() {
  const { totalItems, total } = useCart();
  const monto = formatearPrecio(total);

  return (
    <Link
      to="/carrito"
      className="btn btn-archive-outline d-inline-flex align-items-center gap-2 text-nowrap"
      aria-label={`Carrito: ${totalItems} producto(s), total ${monto}`}
    >
      <CartIcon />
      <span className="font-monospace">{monto}</span>
    </Link>
  );
}