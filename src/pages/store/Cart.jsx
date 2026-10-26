import { useNavigate } from "react-router-dom";
import CartItemRow from "../../components/cart/CartItemRow.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function Cart() {
  const { items, changeQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4">
        <h1 className="display-5 fw-bolder">MI CARRITO DE COMPRAS</h1>
        <p className="text-muted">Revisa tus artículos antes de confirmar la orden.</p>
      </section>
      <div className="row g-5">
        <section className="col-lg-8">
          <div className="table-responsive border p-3 bg-white">
            <table className="table align-middle mb-0">
              <thead className="table-light text-uppercase small font-monospace">
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th className="text-end">Acción</th></tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4">Tu carrito está vacío.</td></tr>
                ) : (
                  items.map((i) => <CartItemRow key={i.id} item={i} onChangeQty={changeQty} onRemove={removeItem} />)
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="col-lg-4">
          <CartSummary total={total} disabled={items.length === 0} onCheckout={() => navigate("/checkout")} />
        </section>
      </div>
    </main>
  );
}