
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../components/atoms/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCheckout } from '../../hooks/useCheckout';
import { formatPrice } from '../../data/products';
import { chileRegions } from '../../data/chileRegions';

import type {
  PaymentMethod,
  PaymentStatus,
  ShippingData,
} from '../../types/order';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const {
    items,
    isProcessing,
    error,
    processCheckout,
  } = useCheckout();

  const user = session?.user;
  const profile = user?.profile;

  const [shipping, setShipping] = useState<ShippingData>({
    nombre: user?.nombre ?? '',
    apellidos: profile?.apellidos ?? '',
    correo: user?.correo ?? '',
    telefono: '',
    direccion: profile?.direccion ?? '',
    departamento: '',
    region: profile?.region ?? '',
    comuna: profile?.comuna ?? '',
    indicaciones: '',
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('Tarjeta de crédito');

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>('Aceptado');

  const selectedRegion = chileRegions.find(
    (region) => region.region === shipping.region,
  );

  const subtotal = items.reduce(
    (total, item) => total + item.product.precio * item.quantity,
    0,
  );

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setShipping((current) => ({
      ...current,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const order = processCheckout(
      shipping,
      paymentMethod,
      paymentStatus,
    );

    if (order) {
      navigate(`/pedido/${order.id}`);
    }
  }

  if (items.length === 0) {
    return (
      <section className="container py-5 text-center">
        <h1>Tu carrito está vacío</h1>
        <p>No hay productos para procesar.</p>
        <Link
          to="/productos"
          className="archive-button archive-button--primary"
        >
          Explorar productos
        </Link>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="archive-page-heading">
        <span className="archive-eyebrow">ARCHIVE[src]</span>
        <h1>Finalizar compra</h1>
        <p>Completa tus datos para coordinar la entrega de tu pedido.</p>
      </div>

      <div className="row g-4 g-lg-5">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="archive-checkout-form">
            <h2>Información del cliente</h2>

            <div className="row">
              <div className="col-md-6 archive-form-field">
                <label htmlFor="checkout-name">Nombre</label>
                <input
                  id="checkout-name"
                  className="form-control"
                  name="nombre"
                  value={shipping.nombre}
                  onChange={updateField}
                  required
                  maxLength={50}
                />
              </div>

              <div className="col-md-6 archive-form-field">
                <label htmlFor="checkout-lastname">Apellidos</label>
                <input
                  id="checkout-lastname"
                  className="form-control"
                  name="apellidos"
                  value={shipping.apellidos}
                  onChange={updateField}
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div className="archive-form-field">
              <label htmlFor="checkout-email">Correo electrónico</label>
              <input
                id="checkout-email"
                className="form-control"
                type="email"
                name="correo"
                value={shipping.correo}
                onChange={updateField}
                required
              />
            </div>

            <div className="archive-form-field">
              <label htmlFor="checkout-phone">Teléfono</label>
              <input
                id="checkout-phone"
                className="form-control"
                type="tel"
                name="telefono"
                value={shipping.telefono}
                onChange={updateField}
                required
                maxLength={20}
              />
            </div>

            <hr />

            <h2>Dirección de entrega</h2>

            <div className="archive-form-field">
              <label htmlFor="checkout-address">Calle y número</label>
              <input
                id="checkout-address"
                className="form-control"
                name="direccion"
                value={shipping.direccion}
                onChange={updateField}
                required
                maxLength={150}
                placeholder="Ej. Av. Providencia 1234"
              />
            </div>

            <div className="archive-form-field">
              <label htmlFor="checkout-department">
                Departamento (opcional)
              </label>
              <input
                id="checkout-department"
                className="form-control"
                name="departamento"
                value={shipping.departamento}
                onChange={updateField}
                maxLength={50}
                placeholder="Ej. Departamento 402"
              />
            </div>

            <div className="row">
              <div className="col-md-6 archive-form-field">
                <label htmlFor="checkout-region">Región</label>
                <select
                  id="checkout-region"
                  className="form-select"
                  name="region"
                  value={shipping.region}
                  onChange={updateField}
                  required
                >
                  <option value="">Selecciona una región</option>
                  {chileRegions.map((region) => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 archive-form-field">
                <label htmlFor="checkout-commune">Comuna</label>
                <select
                  id="checkout-commune"
                  className="form-select"
                  name="comuna"
                  value={shipping.comuna}
                  onChange={updateField}
                  required
                  disabled={!selectedRegion}
                >
                  <option value="">Selecciona una comuna</option>
                  {selectedRegion?.comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="archive-form-field">
              <label htmlFor="checkout-instructions">
                Indicaciones adicionales
              </label>
              <textarea
                id="checkout-instructions"
                className="form-control"
                name="indicaciones"
                value={shipping.indicaciones}
                onChange={updateField}
                rows={3}
                maxLength={300}
                placeholder="Referencias para encontrar tu domicilio (opcional)"
              />
            </div>

            <hr />

            <h2>Método de pago</h2>

            <div className="archive-form-field">
              <label htmlFor="payment-method">Selecciona un método</label>
              <select
                id="payment-method"
                className="form-select"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as PaymentMethod)
                }
              >
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
              </select>
            </div>

            <div className="archive-form-field">
              <label htmlFor="payment-result">Resultado de simulación</label>
              <select
                id="payment-result"
                className="form-select"
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value as PaymentStatus)
                }
              >
                <option value="Aceptado">Pago aceptado (demostración)</option>
                <option value="Declinado">Pago declinado (demostración)</option>
              </select>
              <small className="text-muted">
                Simulación académica. No se realiza ningún cobro real.
              </small>
            </div>

            {error && (
              <p className="archive-field-error" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-100"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Pagar ahora'}
            </Button>
          </form>
        </div>

        <aside className="col-lg-5">
          <div className="cart-summary archive-checkout-summary">
            <h2>Resumen de compra</h2>

            {items.map((item) => (
              <article
                className="archive-checkout-product"
                key={`${item.product.id}-${item.size}`}
              >
                <img
                  src={item.product.imagen}
                  alt={item.product.nombre}
                />

                <div className="archive-checkout-product__info">
                  <strong>{item.product.nombre}</strong>
                  <span>Talla: {item.size}</span>
                  <span>Cantidad: {item.quantity}</span>
                  <strong>
                    {formatPrice(item.product.precio * item.quantity)}
                  </strong>
                </div>
              </article>
            ))}

            <div className="archive-checkout-total">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="archive-checkout-total archive-checkout-total--final">
              <span>Total a pagar</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <small className="text-muted">
              El total corresponde al valor de los productos. No se aplica
              costo de despacho en esta simulación.
            </small>
          </div>
        </aside>
      </div>
    </section>
  );
}
