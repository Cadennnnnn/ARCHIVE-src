import type { Order } from '../../../types/order';

import {
  OrderSummaryCard,
} from '../../molecules/OrderSummaryCard/OrderSummaryCard';

interface ProfileOrderHistoryProps {
  orders: Order[];
}

export function ProfileOrderHistory({
  orders,
}: ProfileOrderHistoryProps) {
  return (
    <section className="profile-section">
      <h2 className="profile-section__title">
        Historial de pedidos
      </h2>

      {orders.length === 0 ? (
        <p className="profile-empty">
          Todavía no tienes pedidos registrados.
        </p>
      ) : (
        <div className="profile-card-list">
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </section>
  );
}
