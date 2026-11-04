
import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';

import type { UserProfileUpdateData } from '../../../types/user';

interface ProfilePersonalInfoProps {
  initialData: UserProfileUpdateData;
  onSave: (data: UserProfileUpdateData) => void;
}

export function ProfilePersonalInfo({
  initialData,
  onSave,
}: ProfilePersonalInfoProps) {
  const [form, setForm] = useState(initialData);
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onSave(form);
      setMessage('Los datos personales se actualizaron correctamente.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible actualizar los datos.',
      );
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="profile-section">
      <h2 className="profile-section__title">Datos personales</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            maxLength={80}
          />
        </label>

        <label>
          Apellidos
          <input
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          Correo electrónico
          <input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            required
            maxLength={120}
          />
        </label>

        <label>
          Teléfono móvil chileno
          <input
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+56912345678"
            required
          />
        </label>

        {message && (
          <p className="profile-form__message">{message}</p>
        )}

        <button
          className="profile-button profile-button--primary"
          type="submit"
        >
          Guardar cambios
        </button>
      </form>
    </section>
  );
}
