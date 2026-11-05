import { products as initialProducts } from '../data/products';
import type { Product } from '../types/product';

const PRODUCTS_STORAGE_KEY = 'ARCHIVE_PRODUCTS';

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

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const product = value as Product;

  return (
    Number.isInteger(product.id) &&
    typeof product.codigo === 'string' &&
    typeof product.nombre === 'string' &&
    typeof product.categoria === 'string' &&
    product.categoria.trim().length > 0 &&
    Number.isInteger(product.precio) &&
    Array.isArray(product.tallas) &&
    product.tallas.every((size) => typeof size === 'string') &&
    typeof product.imagen === 'string' &&
    typeof product.descripcion === 'string' &&
    Number.isInteger(product.stock)
  );
}

function saveProducts(items: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(items));
}

export function getProducts(): Product[] {
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (storedProducts === null) {
      const initialData = initialProducts.map((product) => ({ ...product }));
      saveProducts(initialData);
      return initialData;
    }

    const parsed: unknown = JSON.parse(storedProducts);

    if (!Array.isArray(parsed) || !parsed.every(isProduct)) {
      saveProducts(initialProducts);
      return initialProducts.map((product) => ({ ...product }));
    }

    return parsed;
  } catch {
    return initialProducts.map((product) => ({ ...product }));
  }
}

export function replaceProductCategory(
  previousName: string,
  nextName: string,
): void {
  const currentProducts = getProducts();

  const updatedProducts = currentProducts.map((product) =>
    product.categoria === previousName
      ? { ...product, categoria: nextName }
      : product,
  );

  saveProducts(updatedProducts);
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

function toProduct(input: ProductInput, id: number): Product {
  const hasOffer = input.precioOferta !== null;

  return {
    id,
    codigo: input.codigo.trim().toUpperCase(),
    nombre: input.nombre.trim(),
    categoria: input.categoria.trim(),
    precio: hasOffer ? input.precioOferta! : input.precio,
    ...(hasOffer ? { precioOriginal: input.precio } : {}),
    imagen: input.imagen.trim(),
    descripcion: input.descripcion.trim(),
    tallas: input.tallas.map((size) => size.trim()).filter(Boolean),
    stock: input.stock,
  };
}

export function createProduct(input: ProductInput): Product {
  const currentProducts = getProducts();
  const validation = validateProduct(input, currentProducts);

  if (!validation.isValid) {
    throw new Error(validation.errors.join('\n'));
  }

  const nextId =
    currentProducts.reduce(
      (maximum, product) => Math.max(maximum, product.id),
      0,
    ) + 1;

  const newProduct = toProduct(input, nextId);

  saveProducts([...currentProducts, newProduct]);

  return newProduct;
}

export function updateProduct(
  id: number,
  input: ProductInput,
): Product {
  const currentProducts = getProducts();
  const productExists = currentProducts.some((product) => product.id === id);

  if (!productExists) {
    throw new Error('El producto que intentas editar ya no existe.');
  }

  const validation = validateProduct(input, currentProducts, id);

  if (!validation.isValid) {
    throw new Error(validation.errors.join('\n'));
  }

  const updatedProduct = toProduct(input, id);

  const nextProducts = currentProducts.map((product) =>
    product.id === id ? updatedProduct : product,
  );

  saveProducts(nextProducts);

  return updatedProduct;
}

export function deleteProduct(id: number): void {
  const currentProducts = getProducts();

  const nextProducts = currentProducts.filter(
    (product) => product.id !== id,
  );

  if (nextProducts.length === currentProducts.length) {
    throw new Error('El producto que intentas eliminar ya no existe.');
  }

  saveProducts(nextProducts);
}
