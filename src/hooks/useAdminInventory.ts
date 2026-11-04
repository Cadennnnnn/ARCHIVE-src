
import { useCallback, useState } from 'react';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type ProductCategoryValue,
  type ProductInput,
} from '../services/productService';
import type { Product } from '../types/product';

export interface AdminProductFormData {
  codigo: string;
  nombre: string;
  categoria: ProductCategoryValue | '';
  precio: string;
  precioOferta: string;
  imagen: string;
  descripcion: string;
  tallas: string;
  stock: string;
}

const EMPTY_FORM: AdminProductFormData = {
  codigo: '',
  nombre: '',
  categoria: '',
  precio: '',
  precioOferta: '',
  imagen: '',
  descripcion: '',
  tallas: '',
  stock: '0',
};

function productToForm(product: Product): AdminProductFormData {
  return {
    codigo: product.codigo,
    nombre: product.nombre,
    categoria: product.categoria as ProductCategoryValue,
    precio: String(product.precioOriginal ?? product.precio),
    precioOferta: product.precioOriginal ? String(product.precio) : '',
    imagen: product.imagen,
    descripcion: product.descripcion,
    tallas: product.tallas.join(', '),
    stock: String(product.stock),
  };
}

function formToInput(form: AdminProductFormData): ProductInput {
  return {
    codigo: form.codigo,
    nombre: form.nombre,
    categoria: form.categoria as ProductCategoryValue,
    precio: Number(form.precio),
    precioOferta: form.precioOferta.trim()
      ? Number(form.precioOferta)
      : null,
    imagen: form.imagen,
    descripcion: form.descripcion,
    tallas: form.tallas.split(',').map((size) => size.trim()).filter(Boolean),
    stock: Number(form.stock),
  };
}

export function useAdminInventory() {
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [formData, setFormData] = useState<AdminProductFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const refreshProducts = useCallback(() => {
    setProducts(getProducts());
  }, []);

  const updateField = useCallback(
    (field: keyof AdminProductFormData, value: string) => {
      setFormData((current) => ({ ...current, [field]: value }));
      setErrors([]);
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setErrors([]);
  }, []);

  const startEditing = useCallback((product: Product) => {
    setFormData(productToForm(product));
    setEditingId(product.id);
    setErrors([]);
  }, []);

  const submitProduct = useCallback((): boolean => {
    try {
      const input = formToInput(formData);

      if (editingId === null) {
        createProduct(input);
      } else {
        updateProduct(editingId, input);
      }

      refreshProducts();
      resetForm();

      return true;
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : 'No fue posible guardar el producto.',
      ]);

      return false;
    }
  }, [editingId, formData, refreshProducts, resetForm]);

  const removeProduct = useCallback(
    (id: number): boolean => {
      try {
        deleteProduct(id);
        refreshProducts();

        if (editingId === id) {
          resetForm();
        }

        return true;
      } catch (error) {
        setErrors([
          error instanceof Error
            ? error.message
            : 'No fue posible eliminar el producto.',
        ]);

        return false;
      }
    },
    [editingId, refreshProducts, resetForm],
  );

  return {
    products,
    formData,
    errors,
    editingId,
    updateField,
    submitProduct,
    startEditing,
    removeProduct,
    resetForm,
  };
}
