import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products, formatPrice } from '../../data/products';
import { Button } from '../../components/atoms/Button/Button';
import { useCart } from '../../hooks/useCart';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((item) => item.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(product?.tallas[0] ?? '');

  if (!product) {
    return (
      <div className="container py-5">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </div>
    );
  }

  const isOnSale = product.precioOriginal !== undefined;

  const handleAdd = () => {
    addItem(product, selectedSize);
    navigate('/carrito');
  };

  return (
    <div className="container py-5">
      <Link to="/productos" className="archive-back-link">
        ← Volver al catálogo
      </Link>

      <div className="row g-5 mt-2 align-items-center">
        <div className="col-12 col-lg-6">
          <div className="product-detail__image">
            <img src={product.imagen} alt={product.nombre} />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <span className="archive-eyebrow">{product.categoria}</span>
          <h1 className="product-detail__title">{product.nombre}</h1>
          <p className="product-detail__code">{product.codigo}</p>

          <div className="product-detail__prices">
            {isOnSale && (
              <>
                <span className="product-detail__badge">20% OFF</span>
                <p className="product-detail__original-price">
                  {formatPrice(product.precioOriginal!)}
                </p>
              </>
            )}
            <p className={`product-detail__price${isOnSale ? ' product-detail__price--sale' : ''}`}>
              {formatPrice(product.precio)}
            </p>
          </div>

          <p>{product.descripcion}</p>

          <div className="my-4">
            <label className="form-label fw-bold" htmlFor="product-size">
              Seleccionar talla
            </label>
            <select
              id="product-size"
              className="form-select rounded-0"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
            >
              {product.tallas.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <p className="small text-muted">
            Stock disponible: {product.stock}
          </p>

          <Button
            className="w-100"
            disabled={product.stock === 0}
            onClick={handleAdd}
          >
            {product.stock > 0 ? 'Añadir al carro' : 'Agotado'}
          </Button>
        </div>
      </div>
    </div>
  );
}