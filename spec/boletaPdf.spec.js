import { generarBoletaPdf } from "../src/utils/boletaPdf.js";

const CLIENTE = {
  nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "Despacho a domicilio",
  direccion: "Los Cisnes 10", departamento: "603", indicaciones: "Dejar con conserje", comuna: "Providencia", region: "Metropolitana de Santiago",
};
const linea = (n) => ({ id: n, codigo: `SNK-00${n}`, nombre: `PRODUCTO NUMERO ${n}`, precio: 1000 * n, cantidad: 1 });
const pedido = (items, cliente = CLIENTE) => ({
  id: "ORD-0001", fecha: "2026-10-28T12:00:00.000Z", estado: "Pagado",
  total: items.reduce((a, i) => a + i.precio * i.cantidad, 0), items, cliente,
});

describe("boleta en PDF", () => {
  it("genera un archivo PDF válido de una página para un pedido corto", () => {
    const doc = generarBoletaPdf(pedido([linea(1), linea(2)]));
    const bytes = new Uint8Array(doc.output("arraybuffer"));
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF");
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it("agrega páginas cuando hay muchas líneas de producto", () => {
    const items = Array.from({ length: 40 }, (_, i) => linea(i + 1));
    expect(generarBoletaPdf(pedido(items)).getNumberOfPages()).toBeGreaterThan(1);
  });

  it("no falla si faltan datos opcionales del cliente", () => {
    const minimo = { nombre: "Luis", apellidos: "Paz", correo: "luis@gmail.com" };
    const doc = generarBoletaPdf(pedido([linea(1)], minimo));
    expect(doc.output("arraybuffer").byteLength).toBeGreaterThan(500);
  });
});