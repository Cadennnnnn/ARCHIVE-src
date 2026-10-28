import { validarStock } from "../src/utils/stock.js";

const PRODUCTOS = [{ id: 1, stock: 3 }, { id: 2, stock: 0 }];

describe("validarStock", () => {
  it("no devuelve problemas cuando alcanza el stock", () => {
    expect(validarStock([{ id: 1, nombre: "A", cantidad: 3 }], PRODUCTOS)).toEqual([]);
  });

  it("detecta una cantidad mayor al stock disponible", () => {
    const r = validarStock([{ id: 1, nombre: "A", cantidad: 4 }], PRODUCTOS);
    expect(r.length).toBe(1);
    expect(r[0].disponible).toBe(3);
  });

  it("detecta un producto agotado o que ya no existe", () => {
    const r = validarStock([{ id: 2, nombre: "B", cantidad: 1 }, { id: 9, nombre: "C", cantidad: 1 }], PRODUCTOS);
    expect(r.map((p) => p.id)).toEqual([2, 9]);
    expect(r[1].motivo).toMatch(/disponible/);
  });
});