
import { Link } from 'react-router-dom';

import { products, formatPrice } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';

export function CartPage() {
  const {
    items,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <section className="container py-5">
      <div className="archive-page-heading">
        <span className="archive-eyebrow">ARCHIVE[src]</span>
        <h1>Carrito de compras</h1>
        <p>Explora nuestros productos y administra tu selección.</p>
      </div>

      <div className="cart-information">
        <strong>Vista de carrito de compra</strong>
        <p>
          Agrega productos, modifica sus cantidades o elimina artículos.
          Tu selección se conserva automáticamente en este dispositivo
          mediante localStorage.
        </p>
      </div>

      <div className="row g-4">
        <section className="col-12 col-xl-5" aria-labelledby="cart-products-title">
          <div className="cart-section-heading">
            <h2 id="cart-products-title">Lista de productos</h2>
            <span>{products.length} productos disponibles</span>
          </div>

          <div className="cart-product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>
        </section>

        <section className="col-12 col-xl-7" aria-labelledby="cart-items-title">
          <div className="cart-section-heading">
            <h2 id="cart-items-title">Carrito de compras</h2>
            <span>
              {items.reduce((total, item) => total + item.quantity, 0)} artículos
            </span>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty-message">
              <h3>Tu carrito está vacío</h3>
              <p>
                Selecciona un producto de la lista para comenzar tu compra.
              </p>
              <Link to="/productos" className="cart-continue">
                Ver catálogo completo
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th scope="col">Imagen</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.product.id}-${item.size}`}>
                        <td>
                          <img
                            className="cart-table__image"
                            src={item.product.imagen}
                            alt={item.product.nombre}
                          />
                        </td>

                        <td>
                          <div className="cart-table__product-name">
                            <strong>{item.product.nombre}</strong>
                            <span>{item.product.categoria}</span>
                            <small>Talla: {item.size}</small>
                          </div>
                        </td>

                        <td>{formatPrice(item.product.precio)}</td>

                        <td>
                          <select
                            className="cart-table__quantity"
                            aria-label={`Cantidad de ${item.product.nombre}`}
                            value={item.quantity}
                            onChange={(event) =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                Number(event.target.value),
                              )
                            }
                          >
                            {Array.from(
                              { length: item.product.stock },
                              (_, index) => index + 1,
                            ).map((quantity) => (
                              <option key={quantity} value={quantity}>
                                {quantity}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <strong>
                            {formatPrice(item.product.precio * item.quantity)}
                          </strong>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="cart-table__remove"
                            aria-label={`Eliminar ${item.product.nombre}`}
                            onClick={() =>
                              removeItem(item.product.id, item.size)
                            }
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="cart-actions">
                <button
                  type="button"
                  className="cart-clear"
                  onClick={clearCart}
                >
                  Limpiar
                </button>

                <Link
                  to="/checkout"
                  className="archive-button archive-button--primary"
                >
                  Comprar ahora
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
