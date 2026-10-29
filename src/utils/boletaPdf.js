import { jsPDF } from "jspdf";
import { formatearPrecio } from "./formatters.js";

const MARGEN = 15;
const DERECHA = 210 - MARGEN;
const s = (v) => String(v ?? "");

export function generarBoletaPdf(pedido) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { cliente = {}, items = [] } = pedido;
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ARCHIVE[src]", MARGEN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Av. Providencia 1234, Local 10 - +56 9 1234 5678", MARGEN, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`BOLETA ${pedido.id}`, DERECHA, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date(pedido.fecha).toLocaleString("es-CL"), DERECHA, y + 6, { align: "right" });
  doc.text(`Estado: ${s(pedido.estado)}`, DERECHA, y + 11, { align: "right" });
  y += 20;
  doc.setDrawColor(150);
  doc.line(MARGEN, y, DERECHA, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE", MARGEN, y);
  doc.text("ENTREGA", 110, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  const clienteLineas = [`${s(cliente.nombre)} ${s(cliente.apellidos)}`, s(cliente.correo)].flatMap((t) => doc.splitTextToSize(t, 85));
  const entregaLineas = [
    s(cliente.entrega),
    `${s(cliente.direccion)}${cliente.departamento ? `, Depto ${cliente.departamento}` : ""}`,
    `${s(cliente.comuna)}, ${s(cliente.region)}`,
    cliente.indicaciones ? `Indicaciones: ${cliente.indicaciones}` : "",
  ]
    .filter(Boolean)
    .flatMap((t) => doc.splitTextToSize(t, 85));
  clienteLineas.forEach((t, i) => doc.text(t, MARGEN, y + i * 5));
  entregaLineas.forEach((t, i) => doc.text(t, 110, y + i * 5));
  y += Math.max(clienteLineas.length, entregaLineas.length) * 5 + 8;

  const col = { precio: 125, cant: 150, sub: DERECHA };
  const encabezado = () => {
    doc.setFillColor(232, 237, 243);
    doc.rect(MARGEN, y - 4.5, DERECHA - MARGEN, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.text("PRODUCTO", MARGEN + 1, y);
    doc.text("PRECIO", col.precio, y, { align: "right" });
    doc.text("CANT.", col.cant, y, { align: "right" });
    doc.text("SUBTOTAL", col.sub, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 8;
  };
  encabezado();

  items.forEach((i) => {
    const lineas = doc.splitTextToSize(`${s(i.nombre)} (${s(i.codigo)})`, 95);
    const alto = lineas.length * 5 + 2;
    if (y + alto > 270) {
      doc.addPage();
      y = 20;
      encabezado();
    }
    doc.text(lineas, MARGEN + 1, y);
    doc.text(formatearPrecio(i.precio), col.precio, y, { align: "right" });
    doc.text(String(i.cantidad), col.cant, y, { align: "right" });
    doc.text(formatearPrecio(i.precio * i.cantidad), col.sub, y, { align: "right" });
    y += alto;
    doc.setDrawColor(220);
    doc.line(MARGEN, y - 3, DERECHA, y - 3);
  });

  if (y > 255) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL PAGADO", MARGEN, y);
  doc.text(formatearPrecio(pedido.total), DERECHA, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Documento de demostración sin validez tributaria. ARCHIVE[src] - Proyecto académico DSY1104.", MARGEN, 285);

  return doc;
}

export function descargarBoletaPdf(pedido) {
  generarBoletaPdf(pedido).save(`boleta-${pedido.id}.pdf`);
}