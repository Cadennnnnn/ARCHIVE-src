import type { FormEvent } from 'react';
import Swal from 'sweetalert2';

import { FormField } from '../../components/molecules/FormField/FormField';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import type { ProductCategory } from '../../services/categoryService';

export function CategoriesAdminPage() {
  const {
    categories,
    formData,
    editingId,
    error,
    updateField,
    resetForm,
    startEditing,
    submitCategory,
    removeCategory,
  } = useAdminCategories();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wasSaved = submitCategory();

    if (!wasSaved) {
      await Swal.fire({
        title: 'No se pudo guardar',
        text: error || 'Revisa los datos de la categoría.',
        icon: 'warning',
        confirmButtonColor: '#1B2A4A',
      });
      return;
    }

    await Swal.fire({
      title: editingId === null ? 'Categoría creada' : 'Categoría actualizada',
      text: 'Los cambios se guardaron correctamente.',
      icon: 'success',
      confirmButtonColor: '#1B2A4A',
    });
  }

  async function handleDelete(category: ProductCategory) {
    const confirmation = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: `Se eliminará la categoría ${category.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b42318',
      cancelButtonColor: '#1B2A4A',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const wasRemoved = removeCategory(category.id);

    if (wasRemoved) {
      await Swal.fire({
        title: 'Categoría eliminada',
        text: 'La categoría se eliminó correctamente.',
        icon: 'success',
        confirmButtonColor: '#1B2A4A',
      });
    } else {
      await Swal.fire({
        title: 'No se pudo eliminar',
        text: error,
        icon: 'warning',
        confirmButtonColor: '#1B2A4A',
      });
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Gestión de categorías</h1>
        <p className="text-muted mb-0">
          Crea, modifica y administra las categorías del catálogo.
        </p>
      </header>

      <div className="row g-4 mt-2">
        <article className="col-lg-4">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">
                {editingId === null ? 'Nueva categoría' : 'Editar categoría'}
              </h2>

              {editingId !== null && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <FormField
                  id="category-name"
                  label="Nombre"
                  required
                >
                  <input
                    id="category-name"
                    type="text"
                    className="form-control rounded-0"
                    maxLength={60}
                    value={formData.nombre}
                    onChange={(event) =>
                      updateField('nombre', event.target.value)
                    }
                    placeholder="Ej: Sneakers"
                    required
                  />
                </FormField>
              </div>

              <div className="mb-4">
                <FormField
                  id="category-description"
                  label="Descripción"
                >
                  <textarea
                    id="category-description"
                    className="form-control rounded-0"
                    rows={4}
                    maxLength={250}
                    value={formData.descripcion}
                    onChange={(event) =>
                      updateField('descripcion', event.target.value)
                    }
                    placeholder="Describe esta categoría..."
                  />
                </FormField>
              </div>

              {error && (
                <p className="alert alert-danger" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-archive-primary w-100"
              >
                {editingId === null ? 'Crear categoría' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </article>

        <article className="col-lg-8">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">Categorías registradas</h2>
              <span className="badge bg-dark">
                {categories.length} categorías
              </span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="fw-semibold">{category.nombre}</td>
                      <td>{category.descripcion || 'Sin descripción'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(category)}
                            aria-label={`Editar ${category.nombre}`}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(category)}
                            aria-label={`Eliminar ${category.nombre}`}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">
                        No hay categorías registradas.
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
