export function validarStock(items, productos) {
  const problemas = [];
  items.forEach((i) => {
    const p = productos.find((x) => x.id === i.id);
    if (!p) {
      problemas.push({ id: i.id, nombre: i.nombre, disponible: 0, motivo: "ya no está disponible" });
    } else if (p.stock < i.cantidad) {
      problemas.push({ id: i.id, nombre: i.nombre, disponible: p.stock, motivo: `stock disponible: ${p.stock}` });
    }
  });
  return problemas;
}