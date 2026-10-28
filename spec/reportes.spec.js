import { calcularReporte } from "../src/utils/reportes.js";

const PRODUCTOS = [
  { id: 1, categoria: "Zapatillas" },
  { id: 2, categoria: "Ropa" },
];

const PEDIDOS = [
  { id: "A", estado: "Pagado", total: 3000, items: [
    { id: 1, nombre: "NIKE", precio: 1000, cantidad: 2 },
    { id: 2, nombre: "HOODIE", precio: 1000, cantidad: 1 },
  ] },
  { id: "B", estado: "Anulado", total: 5000, items: [{ id: 1, nombre: "NIKE", precio: 1000, cantidad: 5 }] },
  { id: "C", estado: "Entregado", total: 1000, items: [{ id: 1, nombre: "NIKE", precio: 1000, cantidad: 1 }] },
];

describe("reportes de ventas", () => {
  it("excluye los pedidos anulados de ingresos, unidades y ticket promedio", () => {
    const r = calcularReporte(PEDIDOS, PRODUCTOS);
    expect(r.totalPedidos).toBe(3);
    expect(r.ingresos).toBe(4000);
    expect(r.unidades).toBe(4);
    expect(r.ticketPromedio).toBe(2000);
  });

  it("agrupa ventas por categoría, ordena el top de productos y cuenta por estado", () => {
    const r = calcularReporte(PEDIDOS, PRODUCTOS);
    expect(r.porCategoria[0]).toEqual({ categoria: "Zapatillas", monto: 3000 });
    expect(r.porCategoria[1]).toEqual({ categoria: "Ropa", monto: 1000 });
    expect(r.topProductos[0].id).toBe(1);
    expect(r.topProductos[0].unidades).toBe(3);
    expect(r.porEstado).toEqual({ Pagado: 1, Anulado: 1, Entregado: 1 });
  });

  it("sin pedidos devuelve todo en cero", () => {
    const r = calcularReporte([], PRODUCTOS);
    expect(r.ingresos).toBe(0);
    expect(r.ticketPromedio).toBe(0);
    expect(r.topProductos).toEqual([]);
  });
});