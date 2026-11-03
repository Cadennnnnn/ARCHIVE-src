
import type { FormEvent } from 'react';

import Swal from 'sweetalert2';

import { FormField } from '../../components/molecules/FormField/FormField';
import { useAdminUsers } from '../../hooks/useAdminUsers';

export function UsersPage() {
  const {
    users,
    formData,
    error,
    updateField,
    submitUser,
  } = useAdminUsers();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wasCreated = submitUser();

    if (!wasCreated) {
      await Swal.fire({
        title: 'No se pudo registrar el usuario',
        text: error,
        icon: 'error',
        confirmButtonColor: '#1B2A4A',
      });

      return;
    }

    await Swal.fire({
      title: 'Usuario registrado',
      text: 'La cuenta se guardó correctamente.',
      icon: 'success',
      confirmButtonColor: '#1B2A4A',
    });
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Gestión de Usuarios</h1>
        <p className="text-muted mb-0">
          Administración de cuentas y roles del sistema.
        </p>
      </header>

      <div className="row g-4 mt-2">
        <article className="col-lg-5">
          <div className="admin-panel">
            <h2 className="h5 fw-bold mb-4">Nuevo Usuario</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <FormField id="adm-run" label="RUN" required>
                  <input
                    id="adm-run"
                    type="text"
                    className="form-control rounded-0"
                    placeholder="19011022K"
                    maxLength={9}
                    value={formData.run}
                    onChange={(event) =>
                      updateField('run', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <FormField
                    id="adm-nom"
                    label="Nombre"
                    required
                  >
                    <input
                      id="adm-nom"
                      type="text"
                      maxLength={50}
                      className="form-control rounded-0"
                      value={formData.nombre}
                      onChange={(event) =>
                        updateField('nombre', event.target.value)
                      }
                    />
                  </FormField>
                </div>

                <div className="col-6">
                  <FormField
                    id="adm-ape"
                    label="Apellidos"
                    required
                  >
                    <input
                      id="adm-ape"
                      type="text"
                      maxLength={100}
                      className="form-control rounded-0"
                      value={formData.apellidos}
                      onChange={(event) =>
                        updateField('apellidos', event.target.value)
                      }
                    />
                  </FormField>
                </div>
              </div>

              <div className="mb-3">
                <FormField
                  id="adm-mail"
                  label="Correo Permitido"
                  required
                >
                  <input
                    id="adm-mail"
                    type="email"
                    className="form-control rounded-0"
                    placeholder="@duoc.cl / @gmail.com"
                    value={formData.correo}
                    onChange={(event) =>
                      updateField('correo', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="mb-4">
                <FormField
                  id="adm-rol"
                  label="Tipo de Usuario (Rol)"
                  required
                >
                  <select
                    id="adm-rol"
                    className="form-select rounded-0"
                    value={formData.rol}
                    onChange={(event) =>
                      updateField('rol', event.target.value)
                    }
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </FormField>
              </div>

              <button
                type="submit"
                className="btn btn-archive-primary w-100"
              >
                Registrar Usuario
              </button>
            </form>
          </div>
        </article>

        <article className="col-lg-7">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">
                Usuarios del Sistema
              </h2>

              <span className="badge bg-dark">
                {users.length} cuentas
              </span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>RUN</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="font-monospace">
                        {user.profile?.run || '—'}
                      </td>

                      <td className="fw-semibold">
                        {user.nombre}
                        {user.profile?.apellidos
                          ? ` ${user.profile.apellidos}`
                          : ''}
                      </td>

                      <td>{user.correo}</td>

                      <td>
                        <span
                          className={`badge ${
                            user.rol === 'Administrador'
                              ? 'bg-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {user.rol}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}