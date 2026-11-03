export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioOriginal?: number;
  imagen: string;
  descripcion: string;
  tallas: string[];
  stock: number;
}

export type ProductCategory = 'Todos' | 'Sneakers' | 'Apparel' | 'Goods';