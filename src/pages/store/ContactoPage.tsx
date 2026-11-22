
import { useState, type FormEvent } from 'react';
import Swal from 'sweetalert2';

import { Button } from '../../components/atoms/Button/Button';
import { FormInput } from '../../components/atoms/FormInput/FormInput';
import { FormField } from '../../components/molecules/FormField/FormField';
import { validateEmail } from '../../utils/validation/authValidation';

interface ContactFormData {
  nombre: string;
  correo: string;
  mensaje: string;
}

interface ContactErrors {
  nombre?: string;
  correo?: string;
  mensaje?: string;
}

const INITIAL_FORM: ContactFormData = {
  nombre: '',
  correo: '',
  mensaje: '',
};

export function ContactoPage() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});

  function updateField(field: keyof ContactFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ContactErrors = {};

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length > 100) {
      nextErrors.nombre = 'Máximo 100 caracteres permitidos.';
    }

    if (!formData.correo.trim()) {
      nextErrors.correo = 'El correo es obligatorio.';
    } else if (!validateEmail(formData.correo)) {
      nextErrors.correo =
        'Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    if (!formData.mensaje.trim()) {
      nextErrors.mensaje = 'El comentario es obligatorio.';
    } else if (formData.mensaje.trim().length > 500) {
      nextErrors.mensaje = 'Máximo 500 caracteres permitidos.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await Swal.fire({
      title: 'MENSAJE ENVIADO',
      text: 'Tu consulta fue recibida en ARCHIVE[src]. Te responderemos a la brevedad.',
      icon: 'success',
      confirmButtonColor: '#1B2A4A',
      confirmButtonText: 'ENTENDIDO',
    });

    setFormData(INITIAL_FORM);
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="row w-100 justify-content-center">
        <section className="col-md-8 col-lg-6 text-center">
          <span className="archive-eyebrow d-block mb-3">ARCHIVE[src]</span>

          <div className="border p-4 p-md-5 bg-white text-start">
            <h1 className="h4 mb-4 text-center fw-bold">
              FORMULARIO DE CONTACTO
            </h1>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <FormField
                  id="cont-nombre"
                  label="Nombre completo"
                  error={errors.nombre}
                  required
                >
                  <FormInput
                    id="cont-nombre"
                    value={formData.nombre}
                    onChange={(event) =>
                      updateField('nombre', event.target.value)
                    }
                    placeholder="Nombre completo"
                    maxLength={100}
                    hasError={Boolean(errors.nombre)}
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField
                  id="cont-correo"
                  label="Correo electrónico"
                  error={errors.correo}
                  required
                >
                  <FormInput
                    id="cont-correo"
                    type="email"
                    autoComplete="email"
                    value={formData.correo}
                    onChange={(event) =>
                      updateField('correo', event.target.value)
                    }
                    placeholder="@duoc.cl / @profesor.duoc.cl / @gmail.com"
                    hasError={Boolean(errors.correo)}
                  />
                </FormField>
              </div>

              <div className="mb-4">
                <FormField
                  id="cont-mensaje"
                  label="Contenido del mensaje"
                  error={errors.mensaje}
                  required
                >
                  <textarea
                    id="cont-mensaje"
                    className={`form-control rounded-0 py-2 ${errors.mensaje ? 'is-invalid' : ''}`}
                    rows={5}
                    maxLength={500}
                    value={formData.mensaje}
                    onChange={(event) =>
                      updateField('mensaje', event.target.value)
                    }
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </FormField>
              </div>

              <Button type="submit" className="w-100 py-3">
                ENVIAR MENSAJE
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
