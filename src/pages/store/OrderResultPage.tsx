
import { Link, useParams } from 'react-router-dom';

import { formatPrice } from '../../data/products';
import { getOrderById } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';

export function OrderResultPage() {
  const { orderId } = useParams();
  const { session } = useAuth();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order || order.userId !== session?.user.id) {
    return (
      <section className="container py-5 text-center">
        <h1>Pedido no encontrado</h1>
        <p>No existe un pedido asociado a tu cuenta con ese identificador.</p>
        <Link to="/" className="archive-button archive-button--primary">
          Volver al inicio
        </Link>
      </section>
    );
  }

  const accepted = order.paymentStatus === 'Aceptado';

  return (
    <section className="container py-5">
      <div className="archive-order-result">
        <span className="archive-eyebrow">
          ARCHIVE[src] · RESULTADO DE COMPRA
        </span>

        <h1>
          {accepted ? '¡Compra realizada!' : 'Pago declinado'}
        </h1>

        <p className={accepted ? 'order-status--accepted' : 'order-status--declined'}>
          Pago {order.paymentStatus.toLowerCase()}
        </p>

        <p>
          {accepted
            ? 'Tu pedido ha sido registrado correctamente.'
            : 'No se pudo completar el pago. Tu carrito se ha conservado para que puedas intentarlo nuevamente.'}
        </p>

        <div className="archive-order-card">
          <div className="archive-order-card__heading">
            <div>
              <span>Número de pedido</span>
              <strong>{order.id}</strong>
            </div>

            <div>
              <span>Fecha</span>
              <strong>
                {new Date(order.createdAt).toLocaleString('es-CL')}
              </strong>
            </div>
          </div>

          <hr />

          <h2>Detalle de productos</h2>

          {order.items.map((item) => (
            <article
              className="archive-order-item"
              key={`${item.productId}-${item.talla}`}
            >
              <img src={item.imagen} alt={item.nombre} />

              <div>
                <strong>{item.nombre}</strong>
                <p>
                  Talla: {item.talla} · Cantidad: {item.cantidad}
                </p>
                <span>
                  {formatPrice(item.precioUnitario)} por unidad
                </span>
              </div>

              <strong>{formatPrice(item.subtotal)}</strong>
            </article>
          ))}

          <hr />

          <div className="archive-order-total">
            <span>Subtotal</span>
            <strong>{formatPrice(order.subtotal)}</strong>
          </div>

          <div className="archive-order-total">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>

          <div className="archive-order-shipping">
            <h2>Datos de envío</h2>
            <p>
              {order.shipping.nombre} {order.shipping.apellidos}
            </p>
            <p>{order.shipping.direccion}</p>

            {order.shipping.departamento && (
              <p>Departamento: {order.shipping.departamento}</p>
            )}

            <p>
              {order.shipping.comuna}, {order.shipping.region}
            </p>
            <p>{order.shipping.correo}</p>
            <p>{order.shipping.telefono}</p>

            {order.shipping.indicaciones && (
              <p>
                <strong>Indicaciones:</strong> {order.shipping.indicaciones}
              </p>
            )}
          </div>

          <div className="archive-order-payment">
            <span>Método de pago</span>
            <strong>{order.paymentMethod}</strong>
            <span>Estado</span>
            <strong>{order.paymentStatus}</strong>
          </div>
        </div>

        <div className="archive-order-actions">
          <Link to="/productos" className="archive-button archive-button--primary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </section>
  );
}
