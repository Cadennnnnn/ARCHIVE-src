

import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { getOrderById } from '../../services/orderService';

import '../../styles/components/receipt.css';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ReceiptPage() {
  const { orderId } = useParams();
  const { session } = useAuth();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order || order.userId !== session?.user.id) {
    return (
      <section className="container py-5 text-center">
        <h1>Boleta no encontrada</h1>
        <p>
          No existe una boleta asociada a tu cuenta con ese identificador.
        </p>

        <Link
          to="/perfil"
          className="btn btn-dark"
        >
          Volver a mi perfil
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5 receipt-page">
      <div className="receipt-page__actions">
        <Link to="/perfil" className="btn btn-outline-dark">
          Volver a mis pedidos
        </Link>

        <button
          type="button"
          className="btn btn-dark"
          onClick={() => window.print()}
        >
          Imprimir / Guardar PDF
        </button>
      </div>

      <article className="receipt">
        <header className="receipt__header">
          <div>
            <span className="receipt__eyebrow">COMPROBANTE DE COMPRA</span>
            <h1>ARCHIVE<span>[src]</span></h1>
            <p>Comprobante interno de pedido</p>
          </div>

          <div className="receipt__number">
            <span>Número de pedido</span>
            <strong>{order.id}</strong>
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </header>

        <hr />

        <section className="receipt__section">
          <h2>Datos del cliente</h2>

          <div className="receipt__details">
            <p>
              <span>Nombre</span>
              <strong>
                {order.shipping.nombre} {order.shipping.apellidos}
              </strong>
            </p>

            <p>
              <span>Correo</span>
              <strong>{order.shipping.correo}</strong>
            </p>

            <p>
              <span>Teléfono</span>
              <strong>{order.shipping.telefono}</strong>
            </p>
          </div>
        </section>

        <section className="receipt__section">
          <h2>Dirección de despacho</h2>

          <p>{order.shipping.direccion}</p>

          {order.shipping.departamento && (
            <p>Departamento: {order.shipping.departamento}</p>
          )}

          <p>
            {order.shipping.comuna}, {order.shipping.region}
          </p>

          {order.shipping.indicaciones && (
            <p>
              <strong>Indicaciones:</strong> {order.shipping.indicaciones}
            </p>
          )}
        </section>

        <section className="receipt__section">
          <h2>Detalle de productos</h2>

          <div className="table-responsive">
            <table className="table receipt__table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Talla</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item, index) => (
                  <tr key={`${item.productId}-${item.talla}-${index}`}>
                    <td>
                      <strong>{item.nombre}</strong>
                      <small>{item.codigo}</small>
                    </td>
                    <td>{item.talla}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatPrice(item.precioUnitario)}</td>
                    <td className="text-end">
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="receipt__totals">
          <p>
            <span>Subtotal</span>
            <strong>{formatPrice(order.subtotal)}</strong>
          </p>

          <p className="receipt__grand-total">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </p>
        </section>

        <section className="receipt__payment">
          <h2>Información del pago</h2>

          <p>
            <span>Método de pago</span>
            <strong>{order.paymentMethod}</strong>
          </p>

          <p>
            <span>Estado del pago</span>
            <strong
              className={
                order.paymentStatus === 'Aceptado'
                  ? 'receipt__status--accepted'
                  : 'receipt__status--declined'
              }
            >
              {order.paymentStatus}
            </strong>
          </p>
        </section>

        <footer className="receipt__footer">
          <p>Gracias por comprar en ARCHIVE[src].</p>
          <small>
            Este documento es un comprobante interno de la aplicación.
            No constituye una boleta tributaria electrónica.
          </small>
        </footer>
      </article>
    </section>
  );
}
