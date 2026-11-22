
import { apiFetch } from './httpClient';

export interface ProductCategory {
  id: string;
  nombre: string;
  descripcion: string;
}

/** Forma de una categoría tal como la devuelve el backend. */
interface BackendCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

function toProductCategory(data: BackendCategoria): ProductCategory {
  return {
    id: String(data.id),
    nombre: data.nombre,
    descripcion: data.descripcion ?? '',
  };
}

/** Lista todas las categorías del catálogo. */
export async function getCategories(): Promise<ProductCategory[]> {
  const data = await apiFetch<BackendCategoria[]>('/categorias');
  return data.map(toProductCategory);
}

function validarCategoria(nombre: string, descripcion: string): void {
  if (!nombre.trim()) {
    throw new Error('El nombre de la categoría es obligatorio.');
  }

  if (nombre.trim().length > 60) {
    throw new Error('El nombre no puede superar los 60 caracteres.');
  }

  if (descripcion.trim().length > 250) {
    throw new Error('La descripción no puede superar los 250 caracteres.');
  }
}

/** Crea una categoría nueva. */
export async function createCategory(
  nombre: string,
  descripcion: string,
): Promise<ProductCategory> {
  validarCategoria(nombre, descripcion);

  const data = await apiFetch<BackendCategoria>('/categorias', {
    method: 'POST',
    body: JSON.stringify({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    }),
  });

  return toProductCategory(data);
}

/** Actualiza el nombre y la descripción de una categoría existente. */
export async function updateCategory(
  id: string,
  nombre: string,
  descripcion: string,
): Promise<ProductCategory> {
  validarCategoria(nombre, descripcion);

  const data = await apiFetch<BackendCategoria>(`/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    }),
  });

  return toProductCategory(data);
}

/**
 * Elimina una categoría. Si tiene productos asociados, el backend
 * rechaza el borrado (restricción de llave foránea) y acá se traduce
 * a un mensaje más claro para el usuario.
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiFetch<void>(`/categorias/${id}`, { method: 'DELETE' });
  } catch {
    throw new Error(
      'No puedes eliminar esta categoría porque tiene productos asociados. Reasigna o elimina esos productos primero.',
    );
  }
}
