import { calcularInventario } from "../src/utils/reportes.js";

const PRODUCTOS = [
  { id: 1, categoria: "Ropa", precio: 1000, oferta: null, stock: 3 },
  { id: 2, categoria: "Ropa", precio: 2000, oferta: 1500, stock: 0 },
  { id: 3, categoria: "Zapatillas", precio: 5000, oferta: null, stock: 10 },
];

describe("reporte de inventario", () => {
  it("suma unidades y valor del stock, y cuenta críticos y agotados", () => {
    const r = calcularInventario(PRODUCTOS);
    expect(r.totalProductos).toBe(3);
    expect(r.unidades).toBe(13);
    expect(r.valorStock).toBe(53000);
    expect(r.criticos).toBe(2);
    expect(r.agotados).toBe(1);
  });

  it("agrupa por categoría y ordena por valor", () => {
    const r = calcularInventario(PRODUCTOS);
    expect(r.porCategoria[0]).toEqual({ categoria: "Zapatillas", productos: 1, unidades: 10, valor: 50000 });
    expect(r.porCategoria[1]).toEqual({ categoria: "Ropa", productos: 2, unidades: 3, valor: 3000 });
  });

  it("valora el stock al precio de oferta cuando existe y respeta el umbral", () => {
    const r = calcularInventario([{ id: 9, categoria: "Ropa", precio: 2000, oferta: 1500, stock: 2 }], 1);
    expect(r.valorStock).toBe(3000);
    expect(r.criticos).toBe(0);
  });
});