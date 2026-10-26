import { useState } from "react";
import ProductGrid from "../../components/products/ProductGrid.jsx";
import { getOffers } from "../../data/db.js";
import { useCart } from "../../context/CartContext.jsx";
import { toastAgregado } from "../../utils/alerts.js";

export default function Offers() {
  const [ofertas] = useState(getOffers);
  const { addItem } = useCart();

  const handleAdd = (p) => {
    addItem(p);
    toastAgregado(p.nombre);
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4">
        <h1 className="display-5 fw-bolder">OFERTAS</h1>
        <p className="text-muted">Piezas de archivo con precio rebajado por tiempo limitado.</p>
      </section>
      <ProductGrid productos={ofertas} onAdd={handleAdd} mensajeVacio="Por ahora no hay ofertas activas." />
    </main>
  );
}