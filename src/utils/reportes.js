export function calcularReporte(pedidos, productos) {
  const validos = pedidos.filter((p) => p.estado !== "Anulado");
  const ingresos = validos.reduce((acc, p) => acc + p.total, 0);
  const unidades = validos.reduce((acc, p) => acc + p.items.reduce((s, i) => s + i.cantidad, 0), 0);
  const categoriaDe = Object.fromEntries(productos.map((p) => [p.id, p.categoria]));

  const porCategoria = {};
  const porProducto = {};
  validos.forEach((p) =>
    p.items.forEach((i) => {
      const cat = categoriaDe[i.id] ?? "Sin categoría";
      porCategoria[cat] = (porCategoria[cat] ?? 0) + i.precio * i.cantidad;
      const fila = porProducto[i.id] ?? { id: i.id, nombre: i.nombre, unidades: 0, monto: 0 };
      fila.unidades += i.cantidad;
      fila.monto += i.precio * i.cantidad;
      porProducto[i.id] = fila;
    })
  );

  const porEstado = {};
  pedidos.forEach((p) => {
    porEstado[p.estado] = (porEstado[p.estado] ?? 0) + 1;
  });

  return {
    totalPedidos: pedidos.length,
    ingresos,
    unidades,
    ticketPromedio: validos.length ? Math.round(ingresos / validos.length) : 0,
    porCategoria: Object.entries(porCategoria)
      .map(([categoria, monto]) => ({ categoria, monto }))
      .sort((a, b) => b.monto - a.monto),
    topProductos: Object.values(porProducto).sort((a, b) => b.unidades - a.unidades).slice(0, 5),
    porEstado,
  };
}