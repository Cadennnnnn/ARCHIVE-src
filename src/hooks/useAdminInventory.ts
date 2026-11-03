
import { useState } from 'react';

import type { Product } from '../types/product';

import { products } from '../data/products';

export interface AdminProductFormData {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
}

const INITIAL_FORM: AdminProductFormData = {
  codigo: '',
  nombre: '',
  categoria: '',
  precio: '',
  imagen: '',
};

export function useAdminInventory() {
  const [formData, setFormData] =
    useState<AdminProductFormData>(INITIAL_FORM);

  const [errors, setErrors] = useState<string[]>([]);

  function updateField(
    field: keyof AdminProductFormData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const validationErrors: string[] = [];
    const code = Number(formData.codigo);
    const price = Number(formData.precio);

    if (
      !formData.codigo.trim() ||
      !Number.isInteger(code) ||
      code < 0
    ) {
      validationErrors.push(
        'El código debe ser un número entero mayor o igual a 0.',
      );
    }

    if (!formData.nombre.trim()) {
      validationErrors.push('El nombre del producto es obligatorio.');
    }

    if (!['Zapatillas', 'Ropa', 'Accesorios'].includes(formData.categoria)) {
      validationErrors.push('Seleccione una categoría obligatoria.');
    }

    if (
      !formData.precio.trim() ||
      !Number.isInteger(price) ||
      price <= 0
    ) {
      validationErrors.push('Ingrese un precio entero superior a 0.');
    }

    if (
      formData.imagen.trim() &&
      !/^https?:\/\/.+/i.test(formData.imagen.trim())
    ) {
      validationErrors.push('Ingrese una URL de imagen válida.');
    }

    return validationErrors;
  }

  function submitProduct(): boolean {
    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return false;
    }

    setFormData(INITIAL_FORM);
    return true;
  }

  const inventoryProducts: Product[] = products;

  return {
    products: inventoryProducts,
    formData,
    errors,
    updateField,
    submitProduct,
  };
}