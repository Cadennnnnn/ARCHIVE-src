export function filtrarProductos(productos, { busqueda = "", categoria = "" } = {}) {
  const q = busqueda.trim().toLowerCase();
  return productos.filter((p) => {
    const coincideTexto = !q || p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q);
    const coincideCat = !categoria || p.categoria === categoria;
    return coincideTexto && coincideCat;
  });
}

export function obtenerCategorias(productos) {
  return [...new Set(productos.map((p) => p.categoria))];
}