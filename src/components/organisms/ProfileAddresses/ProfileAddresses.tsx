
import { useState, type FormEvent } from 'react';
import type { ShippingAddress } from '../../../types/user';
import { AddressCard } from '../../molecules/AddressCard/AddressCard';

type AddressData = Omit<ShippingAddress, 'id' | 'isDefault'>;

interface ProfileAddressesProps {
  addresses: ShippingAddress[];
  onAdd: (data: AddressData) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const EMPTY_ADDRESS: AddressData = {
  alias: '',
  nombre: '',
  apellidos: '',
  telefono: '',
  direccion: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: '',
};

export function ProfileAddresses({
  addresses,
  onAdd,
  onDelete,
  onSetDefault,
}: ProfileAddressesProps) {
  const [form, setForm] = useState<AddressData>(EMPTY_ADDRESS);
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onAdd(form);
      setForm(EMPTY_ADDRESS);
      setMessage('Dirección agregada correctamente.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'No fue posible guardar la dirección.',
      );
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="profile-section">
      <h2 className="profile-section__title">Mis direcciones</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h3>Agregar dirección</h3>

        <label>
          Alias
          <input name="alias" value={form.alias} onChange={handleChange} required />
        </label>

        <div className="profile-form__grid">
          <label>
            Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>

          <label>
            Apellidos
            <input name="apellidos" value={form.apellidos} onChange={handleChange} required />
          </label>

          <label>
            Teléfono
            <input
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+56912345678"
              required
            />
          </label>

          <label>
            Dirección
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Departamento / Casa
            <input
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
            />
          </label>

          <label>
            Región
            <input name="region" value={form.region} onChange={handleChange} required />
          </label>

          <label>
            Comuna
            <input name="comuna" value={form.comuna} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Indicaciones de entrega
          <textarea
            name="indicaciones"
            value={form.indicaciones}
            onChange={handleChange}
            rows={3}
          />
        </label>

        {message && <p className="profile-form__message">{message}</p>}

        <button className="profile-button profile-button--primary" type="submit">
          Agregar dirección
        </button>
      </form>

      <div className="profile-card-list">
        {addresses.length === 0 ? (
          <p className="profile-empty">Todavía no tienes direcciones guardadas.</p>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
            />
          ))
        )}
      </div>
    </section>
  );
}
