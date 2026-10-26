import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/products/ProductGrid.jsx";
import { getProducts } from "../../data/db.js";
import { useCart } from "../../context/CartContext.jsx";
import { filtrarProductos, obtenerCategorias } from "../../utils/filtros.js";
import { toastAgregado } from "../../utils/alerts.js";

export default function Categories() {
  const [productos] = useState(getProducts);
  const [params, setParams] = useSearchParams();
  const categoria = params.get("cat") ?? "";
  const { addItem } = useCart();

  const handleAdd = (p) => {
    addItem(p);
    toastAgregado(p.nombre);
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4">
        <h1 className="display-5 fw-bolder">CATEGORÍAS</h1>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <button className={`btn btn-sm ${!categoria ? "btn-archive-primary" : "btn-archive-outline"}`} onClick={() => setParams({})}>
            Todas
          </button>
          {obtenerCategorias(productos).map((c) => (
            <button
              key={c}
              className={`btn btn-sm ${categoria === c ? "btn-archive-primary" : "btn-archive-outline"}`}
              onClick={() => setParams({ cat: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </section>
      <ProductGrid productos={filtrarProductos(productos, { categoria })} onAdd={handleAdd} />
    </main>
  );
}