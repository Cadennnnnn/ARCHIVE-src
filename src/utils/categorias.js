export function resumenCategorias(categorias, productos) {
  return categorias.map((nombre) => {
    const delaCategoria = productos.filter((p) => p.categoria === nombre);
    return {
      nombre,
      cantidad: delaCategoria.length,
      imagen: delaCategoria.find((p) => p.imagen)?.imagen ?? "",
    };
  });
}