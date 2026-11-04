
import { getProducts, replaceProductCategory } from './productService';

const CATEGORIES_STORAGE_KEY = 'ARCHIVE_CATEGORIES';

export interface ProductCategory {
  id: string;
  nombre: string;
  descripcion: string;
}

const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'sneakers',
    nombre: 'Sneakers',
    descripcion: 'Calzado seleccionado de marcas y colaboraciones icónicas.',
  },
  {
    id: 'apparel',
    nombre: 'Apparel',
    descripcion: 'Prendas y colecciones representativas de la cultura streetwear.',
  },
  {
    id: 'goods',
    nombre: 'Goods',
    descripcion: 'Accesorios y piezas especiales de archivo.',
  },
];

function isCategory(value: unknown): value is ProductCategory {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const category = value as ProductCategory;

  return (
    typeof category.id === 'string' &&
    typeof category.nombre === 'string' &&
    typeof category.descripcion === 'string'
  );
}

function saveCategories(categories: ProductCategory[]): void {
  localStorage.setItem(
    CATEGORIES_STORAGE_KEY,
    JSON.stringify(categories),
  );
}

export function getCategories(): ProductCategory[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);

    if (stored === null) {
      saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES.map((category) => ({ ...category }));
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed) || !parsed.every(isCategory)) {
      saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES.map((category) => ({ ...category }));
    }

    return parsed;
  } catch {
    return INITIAL_CATEGORIES.map((category) => ({ ...category }));
  }
}

function createCategoryId(name: string): string {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${normalized}-${Date.now().toString(36)}`;
}

function validateCategory(
  nombre: string,
  descripcion: string,
  categories: ProductCategory[],
  editingId?: string,
): void {
  const normalizedName = nombre.trim().toLocaleLowerCase('es');

  if (!normalizedName) {
    throw new Error('El nombre de la categoría es obligatorio.');
  }

  if (nombre.trim().length > 60) {
    throw new Error('El nombre no puede superar los 60 caracteres.');
  }

  if (descripcion.trim().length > 250) {
    throw new Error('La descripción no puede superar los 250 caracteres.');
  }

  const alreadyExists = categories.some(
    (category) =>
      category.id !== editingId &&
      category.nombre.trim().toLocaleLowerCase('es') === normalizedName,
  );

  if (alreadyExists) {
    throw new Error('Ya existe una categoría con ese nombre.');
  }
}

export function createCategory(
  nombre: string,
  descripcion: string,
): ProductCategory {
  const categories = getCategories();

  validateCategory(nombre, descripcion, categories);

  const newCategory: ProductCategory = {
    id: createCategoryId(nombre),
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
  };

  saveCategories([...categories, newCategory]);

  return newCategory;
}

export function updateCategory(
  id: string,
  nombre: string,
  descripcion: string,
): ProductCategory {
  const categories = getCategories();
  const currentCategory = categories.find(
    (category) => category.id === id,
  );

  if (!currentCategory) {
    throw new Error('La categoría que intentas editar ya no existe.');
  }

  validateCategory(nombre, descripcion, categories, id);

  const updatedCategory: ProductCategory = {
    ...currentCategory,
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
  };

  if (currentCategory.nombre !== updatedCategory.nombre) {
    replaceProductCategory(
      currentCategory.nombre,
      updatedCategory.nombre,
    );
  }

  const nextCategories = categories.map((category) =>
    category.id === id ? updatedCategory : category,
  );

  saveCategories(nextCategories);

  return updatedCategory;
}

export function deleteCategory(id: string): void {
  const categories = getCategories();
  const category = categories.find((item) => item.id === id);

  if (!category) {
    throw new Error('La categoría que intentas eliminar ya no existe.');
  }

  const hasProducts = getProducts().some(
    (product) => product.categoria === category.nombre,
  );

  if (hasProducts) {
    throw new Error(
      'No puedes eliminar esta categoría porque tiene productos asociados. Reasigna o elimina esos productos primero.',
    );
  }

  saveCategories(categories.filter((item) => item.id !== id));
}
