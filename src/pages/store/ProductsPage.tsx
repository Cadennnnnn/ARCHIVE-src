// Archivo: src/pages/store/ProductsPage.tsx
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../../data/products';
import type { ProductCategory } from '../../types/product';
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';

const categories: ProductCategory[] = ['Todos', 'Sneakers', 'Apparel', 'Goods'];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoria') as ProductCategory | null;
  const [category, setCategory] = useState<ProductCategory>(
    categories.includes(initialCategory ?? 'Todos') ? initialCategory ?? 'Todos' : 'Todos',
  );
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.categoria === category;
    const matchesSearch = product.nombre.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const changeCategory = (nextCategory: ProductCategory) => {
    setCategory(nextCategory);
    if (nextCategory === 'Todos') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: nextCategory });
    }
  };

  return (
    <div className="container py-5">
      <header className="archive-page-heading">
        <span className="archive-eyebrow">The collection</span>
        <h1>Catálogo de productos</h1>
        <p>Explora nuestra selección de calzado, indumentaria y accesorios de archivo.</p>
      </header>

      <div className="archive-catalog-tools">
        <div className="archive-filters" aria-label="Filtrar por categoría">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? 'active' : ''}
              aria-pressed={category === item}
              onClick={() => changeCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="archive-search">
          <span className="visually-hidden">Buscar productos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar producto..."
          />
        </label>
      </div>

      <p className="text-muted small mb-4">{filteredProducts.length} productos encontrados</p>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="archive-empty">No encontramos productos con esos criterios.</p>
      )}
    </div>
  );
}
