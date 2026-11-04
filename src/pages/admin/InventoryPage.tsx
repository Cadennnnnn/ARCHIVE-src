
import type { FormEvent } from 'react';
import Swal from 'sweetalert2';

import { FormField } from '../../components/molecules/FormField/FormField';
import { formatPrice } from '../../data/products';
import { useAdminInventory } from '../../hooks/useAdminInventory';
import type { Product } from '../../types/product';

const CATEGORY_LABELS: Record<string, string> = {
  Sneakers: 'Zapatillas',
  Apparel: 'Ropa',
  Goods: 'Accesorios',
};

export function InventoryPage() {
  const {
    products,
    formData,
    errors,
    editingId,
    updateField,
    submitProduct,
    startEditing,
    removeProduct,
    resetForm,
  } = useAdminInventory();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wasSaved = submitProduct();

    if (!wasSaved) {
      await Swal.fire({
        title: 'Revisa el formulario',
        text: errors.join('\n') || 'Existen campos que requieren corrección.',
        icon: 'warning',
        confirmButtonColor: '#1B2A4A',
      });

      return;
    }

    await Swal.fire({
      title: editingId === null ? 'Producto registrado' : 'Producto actualizado',
      text: 'Los cambios se guardaron correctamente.',
      icon: 'success',
      confirmButtonColor: '#1B2A4A',
    });
  }

  async function handleDelete(product: Product) {
    const confirmation = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `Se eliminará ${product.nombre} del catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#b42318',
      cancelButtonColor: '#1B2A4A',
    });

    if (!confirmation.isConfirmed) return;

    const wasRemoved = removeProduct(product.id);

    if (wasRemoved) {
      await Swal.fire({
        title: 'Producto eliminado',
        text: 'El producto fue eliminado del catálogo.',
        icon: 'success',
        confirmButtonColor: '#1B2A4A',
      });
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1 className="h3 fw-bold mb-2">Gestión de Productos</h1>
        <p className="text-muted mb-0">
          Administración del catálogo de ARCHIVE[src].
        </p>
      </header>

      <div className="row g-4 mt-2">
        <article className="col-lg-4">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">
                {editingId === null ? 'Nuevo Producto' : 'Editar Producto'}
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
                <FormField id="prod-codigo" label="Código (ABC-123)" required>
                  <input
                    id="prod-codigo"
                    type="text"
                    maxLength={7}
                    className="form-control rounded-0"
                    placeholder="Ej: SNK-005"
                    value={formData.codigo}
                    onChange={(event) => updateField('codigo', event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-nombre" label="Nombre" required>
                  <input
                    id="prod-nombre"
                    type="text"
                    maxLength={150}
                    className="form-control rounded-0"
                    value={formData.nombre}
                    onChange={(event) => updateField('nombre', event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-categoria" label="Categoría" required>
                  <select
                    id="prod-categoria"
                    className="form-select rounded-0"
                    value={formData.categoria}
                    onChange={(event) => updateField('categoria', event.target.value)}
                    required
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Sneakers">Zapatillas</option>
                    <option value="Apparel">Ropa</option>
                    <option value="Goods">Accesorios</option>
                  </select>
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-precio" label="Precio normal ($ CLP)" required>
                  <input
                    id="prod-precio"
                    type="number"
                    min="1"
                    step="1"
                    className="form-control rounded-0"
                    value={formData.precio}
                    onChange={(event) => updateField('precio', event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-oferta" label="Precio oferta ($ CLP)">
                  <input
                    id="prod-oferta"
                    type="number"
                    min="1"
                    step="1"
                    className="form-control rounded-0"
                    placeholder="Dejar vacío si no tiene oferta"
                    value={formData.precioOferta}
                    onChange={(event) => updateField('precioOferta', event.target.value)}
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-stock" label="Stock disponible" required>
                  <input
                    id="prod-stock"
                    type="number"
                    min="0"
                    step="1"
                    className="form-control rounded-0"
                    value={formData.stock}
                    onChange={(event) => updateField('stock', event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-tallas" label="Tallas" required>
                  <input
                    id="prod-tallas"
                    type="text"
                    className="form-control rounded-0"
                    placeholder="US 8, US 9, US 10"
                    value={formData.tallas}
                    onChange={(event) => updateField('tallas', event.target.value)}
                    required
                  />
                  <small className="text-muted">
                    Separar cada talla con una coma.
                  </small>
                </FormField>
              </div>

              <div className="mb-3">
                <FormField id="prod-img" label="URL de imagen">
                  <input
                    id="prod-img"
                    type="url"
                    className="form-control rounded-0"
                    value={formData.imagen}
                    onChange={(event) => updateField('imagen', event.target.value)}
                  />
                </FormField>
              </div>

              <div className="mb-4">
                <FormField id="prod-descripcion" label="Descripción" required>
                  <textarea
                    id="prod-descripcion"
                    rows={3}
                    maxLength={1000}
                    className="form-control rounded-0"
                    value={formData.descripcion}
                    onChange={(event) => updateField('descripcion', event.target.value)}
                    required
                  />
                </FormField>
              </div>

              <button
                type="submit"
                className="btn btn-archive-primary w-100"
              >
                {editingId === null ? 'Guardar Producto' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </article>

        <article className="col-lg-8">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">Listado del Catálogo</h2>
              <span className="badge bg-dark">{products.length} productos</span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="font-monospace">{product.codigo}</td>

                      <td className="fw-semibold">{product.nombre}</td>

                      <td>
                        <span className="badge bg-secondary">
                          {CATEGORY_LABELS[product.categoria] ?? product.categoria}
                        </span>
                      </td>

                      <td className="font-monospace text-nowrap">
                        {formatPrice(product.precio)}
                        {product.precioOriginal !== undefined && (
                          <small className="d-block text-muted text-decoration-line-through">
                            {formatPrice(product.precioOriginal)}
                          </small>
                        )}
                      </td>

                      <td>{product.stock}</td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(product)}
                            aria-label={`Editar ${product.nombre}`}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(product)}
                            aria-label={`Eliminar ${product.nombre}`}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        No hay productos registrados.
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
