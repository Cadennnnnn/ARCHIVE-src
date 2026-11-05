import { products as initialProducts } from '../../src/data/products';
import {
  getProducts,
  validateProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  replaceProductCategory,
} from '../../src/services/productService';

import type { ProductInput } from '../../src/services/productService';

describe('productService', () => {
  const STORAGE_KEY = 'ARCHIVE_PRODUCTS';

  const validProduct: ProductInput = {
    codigo: 'ARC-999',
    nombre: 'Producto de prueba',
    categoria: 'Sneakers',
    precio: 100000,
    precioOferta: null,
    imagen: 'https://example.com/product.jpg',
    descripcion: 'Descripción del producto de prueba.',
    tallas: ['40', '41', '42'],
    stock: 5,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getProducts', () => {
    it('debe inicializar el catálogo cuando no existe información guardada', () => {
      const result = getProducts();

      expect(result.length).toBe(initialProducts.length);
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    });

    it('debe recuperar los productos almacenados', () => {
      const storedProducts = [
        { ...initialProducts[0], nombre: 'Producto almacenado' },
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedProducts));

      const result = getProducts();

      expect(result).toEqual(storedProducts);
    });

    it('debe recuperar el catálogo inicial si el JSON almacenado es inválido', () => {
      localStorage.setItem(STORAGE_KEY, '{json-invalido');

      const result = getProducts();

      expect(result.length).toBe(initialProducts.length);
    });
  });

  describe('validateProduct', () => {
    it('debe aceptar un producto con datos válidos', () => {
      const result = validateProduct(validProduct, []);

      expect(result.isValid).toBeTrue();
      expect(result.errors.length).toBe(0);
    });

    it('debe rechazar un código con formato incorrecto', () => {
      const result = validateProduct(
        { ...validProduct, codigo: 'INVALIDO' },
        [],
      );

      expect(result.isValid).toBeFalse();
      expect(result.errors).toContain(
        'El código debe tener el formato ABC-123.',
      );
    });

    it('debe rechazar códigos duplicados', () => {
      const result = validateProduct(
        validProduct,
        [
          {
            ...initialProducts[0],
            codigo: validProduct.codigo,
          },
        ],
      );

      expect(result.isValid).toBeFalse();
      expect(result.errors).toContain(
        'Ya existe un producto con ese código.',
      );
    });

    it('debe permitir mantener el código del producto que se está editando', () => {
      const existingProduct = {
        ...initialProducts[0],
        codigo: validProduct.codigo,
        id: 99,
      };

      const result = validateProduct(
        validProduct,
        [existingProduct],
        99,
      );

      expect(result.isValid).toBeTrue();
    });

    it('debe rechazar precios y stock inválidos', () => {
      const result = validateProduct(
        {
          ...validProduct,
          precio: 0,
          precioOferta: 120000,
          stock: -1,
        },
        [],
      );

      expect(result.isValid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('createProduct', () => {
    it('debe crear un producto y asignarle un identificador', () => {
      const created = createProduct(validProduct);

      expect(created.id).toBeGreaterThan(0);
      expect(created.codigo).toBe('ARC-999');
      expect(created.nombre).toBe(validProduct.nombre);

      const storedProducts = getProducts();

      expect(storedProducts.some((product) => product.id === created.id))
        .toBeTrue();
    });

    it('debe guardar el precio de oferta como precio actual', () => {
      const created = createProduct({
        ...validProduct,
        precioOferta: 80000,
      });

      expect(created.precio).toBe(80000);
      expect(created.precioOriginal).toBe(100000);
    });

    it('debe rechazar la creación de un producto inválido', () => {
      expect(() =>
        createProduct({
          ...validProduct,
          codigo: 'ERROR',
        }),
      ).toThrowError();
    });
  });

  describe('updateProduct', () => {
    it('debe actualizar los datos de un producto existente', () => {
      const created = createProduct(validProduct);

      const updated = updateProduct(created.id, {
        ...validProduct,
        nombre: 'Producto actualizado',
      });

      expect(updated.nombre).toBe('Producto actualizado');
      expect(
        getProducts().find((product) => product.id === created.id)?.nombre,
      ).toBe('Producto actualizado');
    });

    it('debe rechazar la actualización de un producto inexistente', () => {
      expect(() => updateProduct(999999, validProduct)).toThrowError(
        'El producto que intentas editar ya no existe.',
      );
    });
  });

  describe('deleteProduct', () => {
    it('debe eliminar un producto existente', () => {
      const created = createProduct(validProduct);

      deleteProduct(created.id);

      expect(
        getProducts().some((product) => product.id === created.id),
      ).toBeFalse();
    });

    it('debe rechazar la eliminación de un producto inexistente', () => {
      expect(() => deleteProduct(999999)).toThrowError(
        'El producto que intentas eliminar ya no existe.',
      );
    });
  });

  describe('replaceProductCategory', () => {
    it('debe reemplazar la categoría de los productos correspondientes', () => {
      const product = {
        ...initialProducts[0],
        categoria: 'Categoría anterior',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([product]));

      replaceProductCategory('Categoría anterior', 'Nueva categoría');

      expect(getProducts()[0].categoria).toBe('Nueva categoría');
    });
  });
});
