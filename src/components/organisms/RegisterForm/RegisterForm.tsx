
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { Button } from '../../atoms/Button/Button';
import { FormInput } from '../../atoms/FormInput/FormInput';
import { FormField } from '../../molecules/FormField/FormField';

import { chileRegions } from '../../../data/chileRegions';
import { createUser } from '../../../services/userService';

import type { UserRegistrationData } from '../../../types/user';
import {
  hasValidationErrors,
  validateRegistration,
  type ValidationErrors,
} from '../../../utils/validation/authValidation';

const INITIAL_FORM: UserRegistrationData = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  confirmPassword: '',
  region: '',
  comuna: '',
  direccion: '',
};

export function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRegistrationData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRegion = chileRegions.find(
    (item) => item.region === formData.region,
  );

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    const field = name as keyof UserRegistrationData;

    setFormData((previous) => ({
      ...previous,
      [field]: value,
      ...(field === 'region' ? { comuna: '' } : {}),
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === 'region' ? { comuna: undefined } : {}),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateRegistration(formData);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      createUser(formData);

      await Swal.fire({
        title: '¡REGISTRO EXITOSO!',
        text: `Bienvenido/a ${formData.nombre.trim()}. Tu cuenta ha sido creada.`,
        icon: 'success',
        confirmButtonColor: '#1B2A4A',
        confirmButtonText: 'IR AL LOGIN',
      });

      setFormData(INITIAL_FORM);
      navigate('/login', { replace: true });
    } catch (error) {
      await Swal.fire({
        title: 'No fue posible registrar la cuenta',
        text: error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.',
        icon: 'error',
        confirmButtonColor: '#1B2A4A',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="reg-run" label="RUN (sin puntos ni guion)" error={errors.run} required>
        <FormInput
          id="reg-run"
          name="run"
          value={formData.run}
          onChange={handleChange}
          placeholder="Ej: 19011022K"
          maxLength={9}
          hasError={Boolean(errors.run)}
        />
      </FormField>

      <div className="row g-2">
        <div className="col-md-6">
          <FormField id="reg-nombre" label="Nombre" error={errors.nombre} required>
            <FormInput
              id="reg-nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              maxLength={50}
              placeholder="Nombre"
              hasError={Boolean(errors.nombre)}
            />
          </FormField>
        </div>

        <div className="col-md-6">
          <FormField id="reg-apellidos" label="Apellidos" error={errors.apellidos} required>
            <FormInput
              id="reg-apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              maxLength={100}
              placeholder="Apellidos"
              hasError={Boolean(errors.apellidos)}
            />
          </FormField>
        </div>
      </div>

      <FormField
        id="reg-correo"
        label="Correo electrónico"
        error={errors.correo}
        required
      >
        <FormInput
          id="reg-correo"
          name="correo"
          type="email"
          autoComplete="email"
          value={formData.correo}
          onChange={handleChange}
          placeholder="@duoc.cl / @profesor.duoc.cl / @gmail.com"
          hasError={Boolean(errors.correo)}
        />
      </FormField>

      <div className="row g-2">
        <div className="col-md-6">
          <FormField
            id="reg-password"
            label="Contraseña (4-10 caracteres)"
            error={errors.password}
            required
          >
            <FormInput
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              maxLength={10}
              hasError={Boolean(errors.password)}
            />
          </FormField>
        </div>

        <div className="col-md-6">
          <FormField
            id="reg-confirm-password"
            label="Confirmar contraseña"
            error={errors.confirmPassword}
            required
          >
            <FormInput
              id="reg-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={10}
              hasError={Boolean(errors.confirmPassword)}
            />
          </FormField>
        </div>
      </div>

      <div className="row g-2">
        <div className="col-md-6">
          <FormField id="reg-region" label="Región" error={errors.region} required>
            <select
              id="reg-region"
              name="region"
              className={`form-select rounded-0 py-2 ${errors.region ? 'is-invalid' : ''}`}
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">-- Seleccione la región --</option>
              {chileRegions.map((item) => (
                <option key={item.region} value={item.region}>
                  {item.region}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="col-md-6">
          <FormField id="reg-comuna" label="Comuna" error={errors.comuna} required>
            <select
              id="reg-comuna"
              name="comuna"
              className={`form-select rounded-0 py-2 ${errors.comuna ? 'is-invalid' : ''}`}
              value={formData.comuna}
              onChange={handleChange}
              disabled={!selectedRegion}
            >
              <option value="">-- Seleccione la comuna --</option>
              {selectedRegion?.comunas.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <FormField
        id="reg-direccion"
        label="Dirección"
        error={errors.direccion}
        required
      >
        <FormInput
          id="reg-direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          maxLength={300}
          placeholder="Calle, número, departamento"
          hasError={Boolean(errors.direccion)}
        />
      </FormField>

      <Button
        type="submit"
        className="w-100 py-3 mt-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR CUENTA'}
      </Button>

      <div className="mt-4 text-center small">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-muted text-decoration-underline">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}