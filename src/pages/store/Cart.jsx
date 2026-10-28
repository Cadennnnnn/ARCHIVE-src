import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CartItemRow from "../../components/cart/CartItemRow.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { getProductById } from "../../data/db.js";

export default function Cart() {
  const { items, changeQty, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();

  const handleClear = async () => {
    const r = await Swal.fire({
      title: "¿Vaciar el carrito?",
      text: "Se quitarán todos los productos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B2A4A",
      confirmButtonText: "Vaciar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-0 border border-dark" },
    });
    if (r.isConfirmed) clearCart();
  };

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
                  items.map((i) => (
                    <CartItemRow
                      key={i.id}
                      item={i}
                      stock={getProductById(i.id)?.stock}
                      onChangeQty={changeQty}
                      onRemove={removeItem}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="col-lg-4">
          <CartSummary
            total={total}
            disabled={items.length === 0}
            onCheckout={() => navigate("/checkout")}
            onClear={handleClear}
          />
        </section>
      </div>
    </main>
  );
}