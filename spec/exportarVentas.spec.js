import { ventasACsv } from "../src/utils/exportarVentas.js";

const CLIENTE = { nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", region: "Biobío", comuna: "Concepción", direccion: "Barros Arana 780", departamento: "" };
const PEDIDOS = [
  {
    id: "ORD-0001", fecha: "2026-10-28T12:00:00.000Z", estado: "Pagado", total: 3000, cliente: CLIENTE,
    items: [
      { codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 2 },
      { codigo: "APP-101", nombre: "HOODIE", precio: 1000, cantidad: 1 },
    ],
  },
];

describe("exportar ventas a CSV", () => {
  it("genera el encabezado y una fila por cada línea de producto", () => {
    const filas = ventasACsv(PEDIDOS).split("\n");
    expect(filas.length).toBe(3);
    expect(filas[0].startsWith("Orden;Fecha;Estado")).toBeTrue();
    expect(filas[1]).toContain("ORD-0001;2026-10-28 12:00:00;Pagado;Ana Soto");
    expect(filas[1]).toContain(";SNK-001;NIKE;2;1000;2000;3000");
  });

  it("escapa comillas y separadores dentro de un valor", () => {
    const p = [{ ...PEDIDOS[0], items: [{ codigo: "X", nombre: 'A;B "C"', precio: 1, cantidad: 1 }] }];
    expect(ventasACsv(p)).toContain('"A;B ""C"""');
  });

  it("sin pedidos devuelve solo el encabezado", () => {
    expect(ventasACsv([]).split("\n").length).toBe(1);
  });
});
