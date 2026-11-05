import { offerProducts } from '../../data/products';
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';

export function OffersPage() {
  return (
    <main className="container py-5">
      <header className="archive-page-heading">
        <span className="archive-eyebrow">Special selection</span>
        <h1>Ofertas</h1>
        <p>
          Descubre productos seleccionados con precios especiales.
        </p>
      </header>

      <section aria-label="Productos en oferta">
        <div className="archive-offers-heading">
          <h2>Ofertas disponibles</h2>
          <span className="text-muted small">
            {offerProducts.length} productos
          </span>
        </div>

        <div className="row g-4">
          {offerProducts.map((product) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {offerProducts.length === 0 && (
          <p className="archive-empty">
            No hay ofertas disponibles actualmente.
          </p>
        )}
      </section>
    </main>
  );
}