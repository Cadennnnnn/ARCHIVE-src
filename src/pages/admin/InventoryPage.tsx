

import Swal from 'sweetalert2';

import { FormField } from '../../components/molecules/FormField/FormField';
import { formatPrice } from '../../data/products';
import { useAdminInventory } from '../../hooks/useAdminInventory';

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
    updateField,
    submitProduct,
  } = useAdminInventory();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = submitProduct();

    if (!isValid) {
      await Swal.fire({
        title: 'Revisa el formulario',
        text: errors.length > 0
          ? errors.join('\n')
          : 'Existen campos que requieren corrección.',
        icon: 'warning',
        confirmButtonColor: '#1B2A4A',
      });

      return;
    }

    await Swal.fire({
      title: 'Producto registrado correctamente',
      text: 'El formulario se ha validado. Esta operación es una simulación frontend.',
      icon: 'success',
      confirmButtonColor: '#1B2A4A',
    });
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
            <h2 className="h5 fw-bold mb-4">Nuevo Producto</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <FormField
                  id="prod-codigo"
                  label="Código de Producto"
                  required
                >
                  <input
                    id="prod-codigo"
                    type="number"
                    min="0"
                    step="1"
                    className="form-control rounded-0"
                    placeholder="Ej: 101"
                    value={formData.codigo}
                    onChange={(event) =>
                      updateField('codigo', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField
                  id="prod-nombre"
                  label="Nombre"
                  required
                >
                  <input
                    id="prod-nombre"
                    type="text"
                    maxLength={150}
                    className="form-control rounded-0"
                    value={formData.nombre}
                    onChange={(event) =>
                      updateField('nombre', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="mb-3">
                <FormField
                  id="prod-categoria"
                  label="Categoría"
                  required
                >
                  <select
                    id="prod-categoria"
                    className="form-select rounded-0"
                    value={formData.categoria}
                    onChange={(event) =>
                      updateField('categoria', event.target.value)
                    }
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Zapatillas">Zapatillas</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </FormField>
              </div>

              <div className="mb-3">
                <FormField
                  id="prod-precio"
                  label="Precio ($ CLP)"
                  required
                >
                  <input
                    id="prod-precio"
                    type="number"
                    min="1"
                    step="1"
                    className="form-control rounded-0"
                    value={formData.precio}
                    onChange={(event) =>
                      updateField('precio', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <div className="mb-4">
                <FormField
                  id="prod-img"
                  label="URL Imagen (Opcional)"
                >
                  <input
                    id="prod-img"
                    type="url"
                    className="form-control rounded-0"
                    value={formData.imagen}
                    onChange={(event) =>
                      updateField('imagen', event.target.value)
                    }
                  />
                </FormField>
              </div>

              <button
                type="submit"
                className="btn btn-archive-primary w-100"
              >
                Guardar Producto
              </button>
            </form>
          </div>
        </article>

        <article className="col-lg-8">
          <div className="admin-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">
                Listado del Catálogo
              </h2>

              <span className="badge bg-dark">
                {products.length} productos
              </span>
            </div>

            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="font-monospace">
                        {product.codigo}
                      </td>

                      <td className="fw-semibold">
                        {product.nombre}
                      </td>

                      <td>
                        <span className="badge bg-secondary">
                          {CATEGORY_LABELS[product.categoria] ??
                            product.categoria}
                        </span>
                      </td>

                      <td className="font-monospace text-nowrap">
                        {formatPrice(product.precio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}