import { useCallback, useState } from 'react';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type ProductCategory,
} from '../services/categoryService';

interface CategoryFormData {
  nombre: string;
  descripcion: string;
}

const EMPTY_FORM: CategoryFormData = {
  nombre: '',
  descripcion: '',
};

export function useAdminCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>(getCategories);
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const refreshCategories = useCallback(() => {
    setCategories(getCategories());
  }, []);

  const updateField = useCallback(
    (field: keyof CategoryFormData, value: string) => {
      setFormData((current) => ({
        ...current,
        [field]: value,
      }));
      setError('');
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError('');
  }, []);

  const startEditing = useCallback((category: ProductCategory) => {
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion,
    });
    setEditingId(category.id);
    setError('');
  }, []);

  const submitCategory = useCallback((): boolean => {
    try {
      if (editingId === null) {
        createCategory(formData.nombre, formData.descripcion);
      } else {
        updateCategory(
          editingId,
          formData.nombre,
          formData.descripcion,
        );
      }

      refreshCategories();
      resetForm();

      return true;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No fue posible guardar la categoría.',
      );

      return false;
    }
  }, [editingId, formData, refreshCategories, resetForm]);

  const removeCategory = useCallback(
    (id: string): boolean => {
      try {
        deleteCategory(id);
        refreshCategories();

        if (editingId === id) {
          resetForm();
        }

        return true;
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'No fue posible eliminar la categoría.',
        );

        return false;
      }
    },
    [editingId, refreshCategories, resetForm],
  );

  return {
    categories,
    formData,
    editingId,
    error,
    updateField,
    resetForm,
    startEditing,
    submitCategory,
    removeCategory,
  };
}
