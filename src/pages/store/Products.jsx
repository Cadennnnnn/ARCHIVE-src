import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/products/ProductGrid.jsx";
import ProductFilters from "../../components/products/ProductFilters.jsx";
import { getProducts } from "../../data/db.js";
import { useCart } from "../../context/CartContext.jsx";
import { filtrarProductos, obtenerCategorias } from "../../utils/filtros.js";
import { toastAgregado } from "../../utils/alerts.js";

export default function Products() {
  const [productos] = useState(getProducts);
  const [params, setParams] = useSearchParams();
  const [categoria, setCategoria] = useState("");
  const { addItem } = useCart();

  // La búsqueda vive en la URL (?q=...) para poder usarla desde la barra de la navbar
  const busqueda = params.get("q") ?? "";
  const setBusqueda = (v) => setParams(v ? { q: v } : {}, { replace: true });

  const handleAdd = (p) => {
    addItem(p);
    toastAgregado(p.nombre);
  };

  const visibles = filtrarProductos(productos, { busqueda, categoria });

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4">
        <h1 className="display-5 fw-bolder">CATÁLOGO DE PRODUCTOS</h1>
        <p className="text-muted">Explora todo el stock disponible en calzado, indumentaria y accesorios de archivo.</p>
      </section>
      <ProductFilters
        busqueda={busqueda}
        categoria={categoria}
        categorias={obtenerCategorias(productos)}
        onBusqueda={setBusqueda}
        onCategoria={setCategoria}
      />
      <ProductGrid productos={visibles} onAdd={handleAdd} mensajeVacio="Ningún producto coincide con tu búsqueda." />
    </main>
  );
}