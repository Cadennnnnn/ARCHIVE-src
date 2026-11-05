import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { FormField } from '../../components/molecules/FormField/FormField';
import { useAdminUsers } from '../../hooks/useAdminUsers';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function UsersPage() {
  const {
    users,
    formData,
    error,
    selectedUser,
    userOrders,
    updateField,
    submitUser,
    selectUser,
    closeUserHistory,
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
          Administración de cuentas, roles e historial de compras.
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
                    <th>Compras</th>
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

                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => selectUser(user.id)}
                        >
                          {selectedUser?.id === user.id
                            ? 'Cerrar'
                            : 'Ver compras'}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-muted py-4"
                      >
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

      {selectedUser && (
        <section className="admin-panel mt-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 className="h5 fw-bold mb-1">
                Historial de compras
              </h2>

              <p className="text-muted mb-0">
                {selectedUser.nombre}
                {selectedUser.profile?.apellidos
                  ? ` ${selectedUser.profile.apellidos}`
                  : ''}
                {' · '}
                {selectedUser.correo}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={closeUserHistory}
            >
              Cerrar historial
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-4">
              <div className="border p-3 h-100">
                <span className="text-muted small d-block">
                  Pedidos registrados
                </span>
                <strong className="fs-4">
                  {userOrders.length}
                </strong>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="border p-3 h-100">
                <span className="text-muted small d-block">
                  Compras aceptadas
                </span>
                <strong className="fs-4">
                  {
                    userOrders.filter(
                      (order) => order.paymentStatus === 'Aceptado',
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="border p-3 h-100">
                <span className="text-muted small d-block">
                  Total comprado
                </span>
                <strong className="fs-4">
                  {formatCurrency(
                    userOrders
                      .filter(
                        (order) => order.paymentStatus === 'Aceptado',
                      )
                      .reduce((total, order) => total + order.total, 0),
                  )}
                </strong>
              </div>
            </div>
          </div>

          {userOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Detalle</th>
                  </tr>
                </thead>

                <tbody>
                  {userOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-monospace">
                        {order.id}
                      </td>

                      <td>{formatDate(order.createdAt)}</td>

                      <td>
                        {order.items.reduce(
                          (total, item) => total + item.cantidad,
                          0,
                        )}{' '}
                        unidades
                        <small className="d-block text-muted">
                          {order.items
                            .map((item) => item.nombre)
                            .join(', ')}
                        </small>
                      </td>

                      <td className="fw-semibold">
                        {formatCurrency(order.total)}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            order.paymentStatus === 'Aceptado'
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/admin/ordenes/${encodeURIComponent(order.id)}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          Ver pedido
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-5 border">
              <p className="fw-semibold mb-1">
                Este usuario todavía no tiene pedidos.
              </p>
              <p className="small mb-0">
                Cuando registre una compra, aparecerá en este historial.
              </p>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
