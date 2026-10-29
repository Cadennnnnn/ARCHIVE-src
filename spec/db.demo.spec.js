import { initDB, resetDB, getOrders, getProducts, getOrdersByEmail } from "../src/data/db.js";
import { sembrarPedidosDemo } from "../src/data/demo.js";

describe("pedidos de demostración", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  afterAll(() => {
    localStorage.clear();
    resetDB();
  });

  it("carga 7 pedidos con ids correlativos y totales coherentes con sus líneas", () => {
    expect(sembrarPedidosDemo()).toBeTrue();
    const pedidos = getOrders();
    expect(pedidos.length).toBe(7);
    expect(pedidos[0].id).toBe("ORD-0001");
    expect(pedidos[6].id).toBe("ORD-0007");
    pedidos.forEach((p) => {
      expect(p.total).toBe(p.items.reduce((a, i) => a + i.precio * i.cantidad, 0));
    });
  });

  it("solo siembra una vez", () => {
    sembrarPedidosDemo();
    expect(sembrarPedidosDemo()).toBeFalse();
    expect(getOrders().length).toBe(7);
  });

  it("no modifica el stock, incluye un pedido anulado y deja historial para cliente@gmail.com", () => {
    const antes = getProducts().map((p) => p.stock);
    sembrarPedidosDemo();
    expect(getProducts().map((p) => p.stock)).toEqual(antes);
    expect(getOrders().some((p) => p.estado === "Anulado")).toBeTrue();
    expect(getOrdersByEmail("cliente@gmail.com").length).toBe(2);
  });
});