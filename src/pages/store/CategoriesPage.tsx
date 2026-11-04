import { useMemo, useState } from 'react';

import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';
import { getCategories } from '../../services/categoryService';
import { getProducts } from '../../services/productService';

export function CategoriesPage() {
  const [categories] = useState(getCategories);
  const [products] = useState(getProducts);
  const [selectedCategory, setSelectedCategory] = useState(
    () => getCategories()[0]?.nombre ?? '',
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) => product.categoria === selectedCategory,
      ),
    [products, selectedCategory],
  );

  return (
    <main className="container py-5">
      <header className="archive-page-heading">
        <span className="archive-eyebrow">Explore the collection</span>
        <h1>Categorías</h1>
        <p>Explora nuestra colección organizada por categorías.</p>
      </header>

      {categories.length > 0 ? (
        <>
          <section
            className="archive-category-selector"
            aria-label="Seleccionar categoría"
          >
            {categories.map((category, index) => (
              <button
                type="button"
                key={category.id}
                className={`archive-category-option${
                  selectedCategory === category.nombre ? ' active' : ''
                }`}
                onClick={() => setSelectedCategory(category.nombre)}
                aria-pressed={selectedCategory === category.nombre}
              >
                <span className="archive-category-option__number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="archive-category-option__name">
                  {category.nombre}
                </span>
              </button>
            ))}
          </section>

          <section className="archive-category-results">
            <header className="archive-category-results__heading">
              <div>
                <span className="archive-eyebrow">Selected collection</span>
                <h2>{selectedCategory}</h2>
                <p>
                  {categories.find(
                    (category) => category.nombre === selectedCategory,
                  )?.descripcion}
                </p>
              </div>

              <span className="text-muted small">
                {filteredProducts.length} productos
              </span>
            </header>

            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="archive-empty">
                No hay productos disponibles en esta categoría.
              </p>
            )}
          </section>
        </>
      ) : (
        <p className="archive-empty">
          No hay categorías disponibles actualmente.
        </p>
      )}
    </main>
  );
}
