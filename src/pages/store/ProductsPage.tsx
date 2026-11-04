import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';
import { useCart } from '../../hooks/useCart';
import { getCategories } from '../../services/categoryService';
import { getProducts } from '../../services/productService';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [categories] = useState(getCategories);
  const [products] = useState(getProducts);
  const [search, setSearch] = useState('');

  const requestedCategory = searchParams.get('categoria');

  const category = categories.some(
    (item) => item.nombre === requestedCategory,
  )
    ? requestedCategory!
    : 'Todos';

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === 'Todos' || product.categoria === category;

        const normalizedSearch = search.trim().toLocaleLowerCase('es');

        const matchesSearch =
          product.nombre.toLocaleLowerCase('es').includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      }),
    [category, products, search],
  );

  function changeCategory(nextCategory: string) {
    if (nextCategory === 'Todos') {
      setSearchParams({});
      return;
    }

    setSearchParams({ categoria: nextCategory });
  }

  return (
    <div className="container py-5">
      <header className="archive-page-heading">
        <span className="archive-eyebrow">The collection</span>
        <h1>Catálogo de productos</h1>
        <p>
          Explora nuestra selección de calzado, indumentaria y accesorios
          de archivo.
        </p>
      </header>

      <div className="archive-catalog-tools">
        <div className="archive-filters" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={category === 'Todos' ? 'active' : ''}
            aria-pressed={category === 'Todos'}
            onClick={() => changeCategory('Todos')}
          >
            Todos
          </button>

          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.nombre ? 'active' : ''}
              aria-pressed={category === item.nombre}
              onClick={() => changeCategory(item.nombre)}
            >
              {item.nombre}
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

      <p className="text-muted small mb-4">
        {filteredProducts.length} productos encontrados
      </p>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={addItem}
            />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="archive-empty">
          No encontramos productos con esos criterios.
        </p>
      )}
    </div>
  );
}
