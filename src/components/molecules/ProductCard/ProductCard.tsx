// Archivo: src/components/molecules/ProductCard/ProductCard.tsx
import { Link } from 'react-router-dom';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../data/products';
import { Button } from '../../atoms/Button/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOnSale = product.precioOriginal !== undefined;

  return (
    <article className="product-card">
      <Link
        to={`/productos/${product.id}`}
        className="product-card__image"
        aria-label={`Ver ${product.nombre}`}
      >
        {isOnSale && (
          <span className="product-card__badge">-20%</span>
        )}
        <img src={product.imagen} alt={product.nombre} loading="lazy" />
      </Link>

      <div className="product-card__content">
        <span className="product-card__category">{product.categoria}</span>

        <h3>
          <Link to={`/productos/${product.id}`}>{product.nombre}</Link>
        </h3>

        <div className="product-card__prices">
          {isOnSale && (
            <span className="product-card__original-price">
              {formatPrice(product.precioOriginal!)}
            </span>
          )}
          <p className={`product-card__price${isOnSale ? ' product-card__price--sale' : ''}`}>
            {formatPrice(product.precio)}
          </p>
        </div>

        <Button
          className="w-100"
          disabled={product.stock === 0}
          onClick={() => onAddToCart?.(product)}
        >
          {product.stock > 0 ? 'Añadir al carro' : 'Agotado'}
        </Button>
      </div>
    </article>
  );
}