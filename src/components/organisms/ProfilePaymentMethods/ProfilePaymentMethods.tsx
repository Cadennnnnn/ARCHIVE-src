
import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';

import type { SavedPaymentMethod } from '../../../types/user';

import { PaymentMethodCard } from '../../molecules/PaymentMethodCard/PaymentMethodCard';

type PaymentData = Omit<SavedPaymentMethod, 'id' | 'isDefault'>;

const EMPTY_PAYMENT: PaymentData = {
  tipo: 'Tarjeta de débito',
  marca: '',
  ultimosCuatro: '',
  titular: '',
  mesExpiracion: '',
  anioExpiracion: '',
};

interface ProfilePaymentMethodsProps {
  methods: SavedPaymentMethod[];
  onAdd: (data: PaymentData) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function ProfilePaymentMethods({
  methods,
  onAdd,
  onDelete,
  onSetDefault,
}: ProfilePaymentMethodsProps) {
  const [form, setForm] = useState<PaymentData>(EMPTY_PAYMENT);
  const [message, setMessage] = useState('');

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onAdd(form);
      setForm(EMPTY_PAYMENT);
      setMessage('Método de pago guardado correctamente.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible guardar el método de pago.',
      );
    }
  }

  return (
    <section className="profile-section">
      <h2 className="profile-section__title">Métodos de pago</h2>

      <p className="profile-section__description">
        Guarda únicamente los datos de referencia de tus tarjetas.
        No se almacenan números completos ni códigos de seguridad.
      </p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h3>Agregar método de pago</h3>

        <div className="profile-form__grid">
          <label>
            Tipo de tarjeta
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
            >
              <option value="Tarjeta de débito">
                Tarjeta de débito
              </option>
              <option value="Tarjeta de crédito">
                Tarjeta de crédito
              </option>
            </select>
          </label>

          <label>
            Marca
            <input
              name="marca"
              value={form.marca}
              onChange={handleChange}
              placeholder="Visa, Mastercard..."
              required
            />
          </label>

          <label>
            Últimos cuatro dígitos
            <input
              name="ultimosCuatro"
              value={form.ultimosCuatro}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              minLength={4}
              required
            />
          </label>

          <label>
            Titular
            <input
              name="titular"
              value={form.titular}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Mes de vencimiento
            <select
              name="mesExpiracion"
              value={form.mesExpiracion}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>

              {Array.from({ length: 12 }, (_, index) => {
                const month = String(index + 1).padStart(2, '0');

                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Año de vencimiento
            <input
              name="anioExpiracion"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={form.anioExpiracion}
              onChange={handleChange}
              placeholder="2028"
              required
            />
          </label>
        </div>

        {message && (
          <p className="profile-form__message">{message}</p>
        )}

        <button
          className="profile-button profile-button--primary"
          type="submit"
        >
          Guardar método de pago
        </button>
      </form>

      <div className="profile-card-list">
        {methods.length === 0 ? (
          <p className="profile-empty">
            Todavía no tienes métodos de pago guardados.
          </p>
        ) : (
          methods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
            />
          ))
        )}
      </div>
    </section>
  );
}
