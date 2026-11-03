

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { Button } from '../../atoms/Button/Button';
import { FormInput } from '../../atoms/FormInput/FormInput';
import { FormField } from '../../molecules/FormField/FormField';

import { useAuth } from '../../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
} from '../../../utils/validation/authValidation';

interface LoginErrors {
  correo?: string;
  password?: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!correo.trim()) {
      nextErrors.correo = 'El correo es obligatorio.';
    } else if (!validateEmail(correo)) {
      nextErrors.correo = 'Ingresa un correo de dominio autorizado.';
    }

    if (!password) {
      nextErrors.password = 'La contraseña es obligatoria.';
    } else if (!validatePassword(password)) {
      nextErrors.password =
        'La contraseña debe tener entre 4 y 10 caracteres alfanuméricos.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticatedSession = await login({
        correo: correo.trim().toLowerCase(),
        password,
      });

      await Swal.fire({
        title: `¡BIENVENIDO, ${authenticatedSession.user.nombre.toUpperCase()}!`,
        text: 'Inicio de sesión correcto.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });

      const destination =
        authenticatedSession.role === 'Cliente' ? '/' : '/admin';

      navigate(destination, { replace: true });
    } catch (error) {
      await Swal.fire({
        title: 'No fue posible iniciar sesión',
        text:
          error instanceof Error
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
      <FormField
        id="login-correo"
        label="Correo"
        error={errors.correo}
        required
      >
        <FormInput
          id="login-correo"
          type="email"
          autoComplete="email"
          placeholder="usuario@duoc.cl"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          hasError={Boolean(errors.correo)}
        />
      </FormField>

      <FormField
        id="login-password"
        label="Contraseña"
        error={errors.password}
        required
      >
        <FormInput
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hasError={Boolean(errors.password)}
        />
      </FormField>

      <Button
        type="submit"
        className="w-100 mt-3 py-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'INGRESANDO...' : 'INGRESAR'}
      </Button>

      <div className="mt-4 text-center small">
        <Link
          to="/registro"
          className="text-muted text-decoration-none border-bottom border-dark pb-1"
        >
          ¿No tienes cuenta? Regístrate aquí
        </Link>
      </div>
    </form>
  );
}
