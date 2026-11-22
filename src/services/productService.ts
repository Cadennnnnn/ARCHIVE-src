import type { Product } from '../types/product';
import { apiFetch } from './httpClient';
import { getCategories } from './categoryService';

export type ProductCategoryValue = string;

export interface ProductInput {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioOferta: number | null;
  imagen: string;
  descripcion: string;
  tallas: string[];
  stock: number;
}

export interface ProductValidationResult {
  isValid: boolean;
  errors: string[];
}

/** Forma de un producto tal como lo devuelve el backend. */
interface BackendProducto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precioOferta: number | null;
  stock: number;
  imagen: string | null;
  categoria: { id: number; nombre: string; descripcion: string | null } | null;
  tallas: string[] | null;
}

/** Convierte un producto del backend al formato que usa el frontend. */
function toProduct(data: BackendProducto): Product {
  const precioNormal = Math.round(Number(data.precio));
  const precioOferta =
    data.precioOferta !== null ? Math.round(Number(data.precioOferta)) : null;

  return {
    id: data.id,
    codigo: data.codigo,
    nombre: data.nombre,
    categoria: data.categoria?.nombre ?? '',
    precio: precioOferta ?? precioNormal,
    ...(precioOferta !== null ? { precioOriginal: precioNormal } : {}),
    imagen: data.imagen ?? '',
    descripcion: data.descripcion ?? '',
    tallas: data.tallas ?? [],
    stock: data.stock,
  };
}

/** Lista todos los productos del catálogo. */
export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<BackendProducto[]>('/productos');
  return data.map(toProduct);
}

export function validateProduct(
  input: ProductInput,
  existingProducts: Product[],
  editingId?: number,
): ProductValidationResult {
  const errors: string[] = [];
  const normalizedCode = input.codigo.trim().toUpperCase();

  if (!/^[A-Z]{3}-\d{3}$/.test(normalizedCode)) {
    errors.push('El código debe tener el formato ABC-123.');
  } else if (
    existingProducts.some(
      (product) =>
        product.codigo.toUpperCase() === normalizedCode &&
        product.id !== editingId,
    )
  ) {
    errors.push('Ya existe un producto con ese código.');
  }

  if (!input.nombre.trim()) {
    errors.push('El nombre del producto es obligatorio.');
  }

  if (!input.categoria.trim()) {
    errors.push('Seleccione una categoría válida.');
  }

  if (!Number.isInteger(input.precio) || input.precio <= 0) {
    errors.push('El precio debe ser un número entero mayor a 0.');
  }

  if (
    input.precioOferta !== null &&
    (!Number.isInteger(input.precioOferta) ||
      input.precioOferta <= 0 ||
      input.precioOferta >= input.precio)
  ) {
    errors.push(
      'El precio de oferta debe ser entero, mayor a 0 y menor al precio normal.',
    );
  }

  if (!Number.isInteger(input.stock) || input.stock < 0) {
    errors.push('El stock debe ser un número entero igual o superior a 0.');
  }

  if (
    input.tallas.length === 0 ||
    input.tallas.some((size) => !size.trim())
  ) {
    errors.push('Debe ingresar al menos una talla válida.');
  }

  if (
    input.imagen.trim() &&
    !/^https?:\/\/\S+$/i.test(input.imagen.trim())
  ) {
    errors.push('La imagen debe tener una URL HTTP o HTTPS válida.');
  }

  if (!input.descripcion.trim()) {
    errors.push('La descripción del producto es obligatoria.');
  }

  return { isValid: errors.length === 0, errors };
}

/** Busca el id de la categoría a partir de su nombre (el formulario trabaja con el nombre). */
async function resolverCategoriaId(nombreCategoria: string): Promise<number> {
  const categorias = await getCategories();
  const categoria = categorias.find((item) => item.nombre === nombreCategoria);

  if (!categoria) {
    throw new Error('La categoría seleccionada ya no existe.');
  }

  return Number(categoria.id);
}

/** Arma el cuerpo de la petición que espera el backend a partir del formulario. */
async function toBackendPayload(input: ProductInput) {
  const categoriaId = await resolverCategoriaId(input.categoria.trim());

  return {
    codigo: input.codigo.trim().toUpperCase(),
    nombre: input.nombre.trim(),
    descripcion: input.descripcion.trim(),
    precio: input.precio,
    precioOferta: input.precioOferta,
    stock: input.stock,
    imagen: input.imagen.trim(),
    tallas: input.tallas.map((size) => size.trim()).filter(Boolean),
    categoria: { id: categoriaId },
  };
}

/** Crea un producto nuevo. Valida contra el catálogo actual antes de enviarlo. */
export async function createProduct(input: ProductInput): Promise<Product> {
  const currentProducts = await getProducts();
  const validation = validateProduct(input, currentProducts);

  if (!validation.isValid) {
    throw new Error(validation.errors.join('\n'));
  }

  const payload = await toBackendPayload(input);

  const data = await apiFetch<BackendProducto>('/productos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return toProduct(data);
}

/** Actualiza un producto existente. Valida contra el catálogo actual antes de enviarlo. */
export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  const currentProducts = await getProducts();
  const productExists = currentProducts.some((product) => product.id === id);

  if (!productExists) {
    throw new Error('El producto que intentas editar ya no existe.');
  }

  const validation = validateProduct(input, currentProducts, id);

  if (!validation.isValid) {
    throw new Error(validation.errors.join('\n'));
  }

  const payload = await toBackendPayload(input);

  const data = await apiFetch<BackendProducto>(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return toProduct(data);
}

/** Elimina un producto del catálogo. */
export async function deleteProduct(id: number): Promise<void> {
  await apiFetch<void>(`/productos/${id}`, { method: 'DELETE' });
}
