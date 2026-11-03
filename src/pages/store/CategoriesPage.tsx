
import { useMemo, useState } from 'react';
import { products } from '../../data/products';
import type { ProductCategory } from '../../types/product';
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';

const categories: Exclude<ProductCategory, 'Todos'>[] = [
  'Sneakers',
  'Apparel',
  'Goods',
];

const categoryDescriptions: Record<string, string> = {
  Sneakers: 'Calzado seleccionado de marcas y colaboraciones icónicas.',
  Apparel: 'Prendas y colecciones representativas de la cultura streetwear.',
  Goods: 'Accesorios y piezas especiales de archivo.',
};

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<Exclude<ProductCategory, 'Todos'>>('Sneakers');

  const filteredProducts = useMemo(
    () => products.filter(
      (product) => product.categoria === selectedCategory
    ),
    [selectedCategory],
  );

  return (
    <main className="container py-5">
      <header className="archive-page-heading">
        <span className="archive-eyebrow">Explore the collection</span>
        <h1>Categorías</h1>
        <p>Explora nuestra colección organizada por categorías.</p>
      </header>

      <section
        className="archive-category-selector"
        aria-label="Seleccionar categoría"
      >
        {categories.map((category, index) => (
          <button
            type="button"
            key={category}
            className={`archive-category-option${selectedCategory === category ? ' active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            <span className="archive-category-option__number">
              0{index + 1}
            </span>
            <span className="archive-category-option__name">
              {category}
            </span>
          </button>
        ))}
      </section>

      <section className="archive-category-results">
        <header className="archive-category-results__heading">
          <div>
            <span className="archive-eyebrow">Selected collection</span>
            <h2>{selectedCategory}</h2>
            <p>{categoryDescriptions[selectedCategory]}</p>
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
    </main>
  );
}