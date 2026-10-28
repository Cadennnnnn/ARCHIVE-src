import {
  initDB, resetDB, getProducts, createOrder, getOrderById,
  updateOrderStatus, getCriticalProducts, getOrdersByEmail,
} from "../src/data/db.js";

const stockDe = (id) => getProducts().find((p) => p.id === id).stock;
const LINEA = { id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 2, imagen: "x.jpg" };
const CLIENTE = { nombre: "Ana", apellidos: "Soto", correo: "Cliente@Gmail.com" };

describe("db (pedidos y stock)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  afterAll(() => resetDB());

  it("crea un pedido numerado con estado Pagado y descuenta el stock", () => {
    const antes = stockDe(1);
    const pedido = createOrder({ items: [LINEA], total: 2000, cliente: CLIENTE });
    expect(pedido.id).toBe("ORD-0001");
    expect(getOrderById("ORD-0001").estado).toBe("Pagado");
    expect(stockDe(1)).toBe(antes - 2);
  });

  it("al anular un pedido repone el stock una sola vez", () => {
    const antes = stockDe(1);
    const pedido = createOrder({ items: [LINEA], total: 2000, cliente: CLIENTE });
    updateOrderStatus(pedido.id, "Anulado");
    expect(stockDe(1)).toBe(antes);
    updateOrderStatus(pedido.id, "Anulado");
    expect(stockDe(1)).toBe(antes);
  });

  it("rechaza un estado inválido o un pedido inexistente", () => {
    const pedido = createOrder({ items: [LINEA], total: 2000, cliente: CLIENTE });
    expect(() => updateOrderStatus(pedido.id, "Perdido")).toThrowError(/Estado/);
    expect(() => updateOrderStatus("ORD-9999", "Enviado")).toThrowError(/no encontrado/);
  });

  it("lista los productos críticos ordenados y filtra pedidos por correo sin importar mayúsculas", () => {
    const criticos = getCriticalProducts();
    expect(criticos.length).toBe(3);
    expect(criticos[0].stock).toBe(4);

    createOrder({ items: [LINEA], total: 2000, cliente: CLIENTE });
    expect(getOrdersByEmail("cliente@gmail.com").length).toBe(1);
    expect(getOrdersByEmail("otro@gmail.com").length).toBe(0);
  });
});