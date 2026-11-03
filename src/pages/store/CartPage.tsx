// Archivo: src/pages/store/CartPage.tsx
import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/products';
import { Button } from '../../components/atoms/Button/Button';
import { useCart } from '../../hooks/useCart';

export function CartPage() {
  const {
    items,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="container py-5 archive-empty-cart">
        <span className="archive-eyebrow">ARCHIVE[src]</span>
        <h1>Tu carro está vacío.</h1>
        <p>Explora nuestra selección y encuentra tu próxima pieza.</p>
        <Link className="archive-button archive-button--primary" to="/productos">
          Explorar productos
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="archive-page-heading">
        <span className="archive-eyebrow">Tu selección</span>
        <h1>Carrito de compras</h1>
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <article
              className="cart-item"
              key={`${item.product.id}-${item.size}`}
            >
              <img src={item.product.imagen} alt={item.product.nombre} />

              <div className="cart-item__info">
                <span className="archive-eyebrow">{item.product.categoria}</span>
                <h2>{item.product.nombre}</h2>
                <p>Talla: {item.size}</p>
                <strong>{formatPrice(item.product.precio)}</strong>

                <div className="cart-item__actions">
                  <label>
                    Cantidad
                    <select
                      value={item.quantity}
                      onChange={(event) => updateQuantity(
                        item.product.id,
                        item.size,
                        Number(event.target.value),
                      )}
                    >
                      {Array.from(
                        { length: item.product.stock },
                        (_, index) => index + 1,
                      ).map((quantity) => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() => removeItem(item.product.id, item.size)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}

          <button type="button" className="cart-clear" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="cart-summary">
            <h2>Resumen del pedido</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p>Los costos de envío se calcularán durante el proceso de compra.</p>
            <Button className="w-100" onClick={() => window.alert(
              'El proceso de pago estará disponible en una siguiente etapa.',
            )}>
              Continuar compra
            </Button>
            <Link to="/productos" className="cart-continue">
              Seguir explorando
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
