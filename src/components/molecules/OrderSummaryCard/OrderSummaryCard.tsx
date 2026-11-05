
import { Link } from 'react-router-dom';
import type { Order } from '../../../types/order';

interface OrderSummaryCardProps {
  order: Order;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const isAccepted = order.paymentStatus === 'Aceptado';

  return (
    <article className="profile-card profile-order">
      <div className="profile-card__header">
        <div>
          <h3 className="profile-card__title">{order.id}</h3>
          <p className="profile-card__muted">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`profile-badge ${
            isAccepted
              ? 'profile-badge--success'
              : 'profile-badge--danger'
          }`}
        >
          {order.paymentStatus}
        </span>
      </div>

      <ul className="profile-order__items">
        {order.items.map((item, index) => (
          <li key={`${item.productId}-${item.talla}-${index}`}>
            <span>
              {item.nombre} · Talla {item.talla} · Cantidad {item.cantidad}
            </span>

            <strong>{formatPrice(item.subtotal)}</strong>
          </li>
        ))}
      </ul>

      <div className="profile-order__footer">
        <span>{order.paymentMethod}</span>
        <strong>{formatPrice(order.total)}</strong>
      </div>

      <div className="profile-order__actions">
        <Link
          to={`/pedido/${encodeURIComponent(order.id)}/boleta`}
          className="btn btn-outline-dark btn-sm"
        >
          Ver boleta
        </Link>
      </div>
    </article>
  );
}
