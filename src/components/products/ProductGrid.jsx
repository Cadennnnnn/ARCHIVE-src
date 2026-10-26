import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ productos, onAdd, mensajeVacio = "No hay productos para mostrar." }) {
  if (productos.length === 0) {
    return <p className="text-muted text-center py-5">{mensajeVacio}</p>;
  }
  return (
    <section className="row g-4">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} onAdd={onAdd} />
      ))}
    </section>
  );
}