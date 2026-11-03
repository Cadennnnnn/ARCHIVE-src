const COLUMNAS = ["Orden", "Fecha", "Estado", "Cliente", "Correo", "Región", "Comuna", "Dirección", "Código", "Producto", "Cantidad", "Precio unitario", "Subtotal línea", "Total orden"];

function celda(v) {
  const t = String(v ?? "");
  return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

// Una fila por línea de producto de cada pedido, incluidos los anulados (histórico completo). Separador ; para Excel en español.
export function ventasACsv(pedidos) {
  const filas = [COLUMNAS];
  pedidos.forEach((p) => {
    const c = p.cliente ?? {};
    (p.items ?? []).forEach((i) =>
      filas.push([
        p.id,
        String(p.fecha).slice(0, 19).replace("T", " "),
        p.estado,
        `${c.nombre ?? ""} ${c.apellidos ?? ""}`.trim(),
        c.correo,
        c.region,
        c.comuna,
        `${c.direccion ?? ""}${c.departamento ? `, Depto ${c.departamento}` : ""}`,
        i.codigo,
        i.nombre,
        i.cantidad,
        i.precio,
        i.precio * i.cantidad,
        p.total,
      ])
    );
  });
  return filas.map((f) => f.map(celda).join(";")).join("\n");
}

export function descargarCsv(nombre, contenido) {
  const blob = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
