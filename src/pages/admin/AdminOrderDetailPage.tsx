import { Link, useParams } from 'react-router-dom';

import { getOrderById } from '../../services/orderService';
import {
  formatOrderCurrency,
  formatOrderDate,
} from '../../hooks/useAdminOrders';

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <section className="admin-page">
        <div className="admin-panel text-center py-5">
          <h1 className="h4 fw-bold mb-3">Orden no encontrada</h1>
          <p className="text-muted">
            No existe una compra registrada con ese identificador.
          </p>
          <Link
            to="/admin/ordenes"
            className="btn btn-archive-primary rounded-0"
          >
            Volver a órdenes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <Link
            to="/admin/ordenes"
            className="text-decoration-none small"
          >
            ← Volver a órdenes
          </Link>

          <h1 className="h3 fw-bold mt-2 mb-2">
            Detalle de compra
          </h1>

          <p className="text-muted mb-0 font-monospace">
            {order.id}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-archive-primary rounded-0"
          onClick={() => window.print()}
        >
          Imprimir boleta
        </button>
      </header>

      <div className="admin-panel mt-4" id="admin-order-receipt">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 border-bottom pb-4 mb-4">
          <div>
            <h2 className="h4 fw-bold mb-1">ARCHIVE[src]</h2>
            <p className="text-muted mb-0">
              Comprobante interno de compra
            </p>
          </div>

          <div className="text-md-end">
            <strong className="d-block">Orden {order.id}</strong>
            <span className="text-muted small">
              {formatOrderDate(order.createdAt)}
            </span>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <h3 className="h6 fw-bold mb-3">Datos del cliente</h3>

            <p className="mb-1">
              <strong>Nombre:</strong>{' '}
              {order.shipping.nombre} {order.shipping.apellidos}
            </p>

            <p className="mb-1">
              <strong>Correo:</strong> {order.shipping.correo}
            </p>

            <p className="mb-0">
              <strong>Teléfono:</strong> {order.shipping.telefono}
            </p>
          </div>

          <div className="col-md-6">
            <h3 className="h6 fw-bold mb-3">Datos de entrega</h3>

            <p className="mb-1">
              <strong>Dirección:</strong> {order.shipping.direccion}
            </p>

            {order.shipping.departamento && (
              <p className="mb-1">
                <strong>Departamento:</strong>{' '}
                {order.shipping.departamento}
              </p>
            )}

            <p className="mb-1">
              <strong>Comuna:</strong> {order.shipping.comuna}
            </p>

            <p className="mb-1">
              <strong>Región:</strong> {order.shipping.region}
            </p>

            {order.shipping.indicaciones && (
              <p className="mb-0">
                <strong>Indicaciones:</strong>{' '}
                {order.shipping.indicaciones}
              </p>
            )}
          </div>
        </div>

        <div className="border-top border-bottom py-3 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <span className="text-muted small d-block">
                Método de pago
              </span>
              <strong>{order.paymentMethod}</strong>
            </div>

            <div className="col-md-6">
              <span className="text-muted small d-block">
                Estado del pago
              </span>
              <span
                className={`badge ${
                  order.paymentStatus === 'Aceptado'
                    ? 'bg-success'
                    : 'bg-danger'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <h3 className="h5 fw-bold mb-3">Productos comprados</h3>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Talla</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.productId}-${item.talla}-${index}`}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        width={64}
                        height={64}
                        style={{ objectFit: 'cover' }}
                      />

                      <div>
                        <strong className="d-block">
                          {item.nombre}
                        </strong>
                        <small className="text-muted">
                          Código: {item.codigo}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>{item.talla}</td>

                  <td>
                    {formatOrderCurrency(item.precioUnitario)}
                  </td>

                  <td>{item.cantidad}</td>

                  <td className="text-end fw-semibold">
                    {formatOrderCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row justify-content-end mt-4">
          <div className="col-md-5 col-lg-4">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <strong>
                {formatOrderCurrency(order.subtotal)}
              </strong>
            </div>

            <div className="d-flex justify-content-between border-top pt-3">
              <span className="fw-bold">Total</span>
              <strong className="fs-5">
                {formatOrderCurrency(order.total)}
              </strong>
            </div>
          </div>
        </div>

        <div className="border-top mt-4 pt-3">
          <p className="small text-muted mb-0">
            Este documento es un comprobante interno de la compra
            registrada en ARCHIVE[src]. No corresponde a una boleta
            tributaria ni reemplaza un documento fiscal oficial.
          </p>
        </div>
      </div>
    </section>
  );
}