import {
  initDB, resetDB, getProducts, createProduct, updateProduct, deleteProduct,
  getOffers, authenticate, createUser,
} from "../src/data/db.js";

describe("db (CRUD sobre localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  afterAll(() => resetDB());

  it("inicializa el catálogo con categorías normalizadas", () => {
    const productos = getProducts();
    expect(productos.length).toBe(8);
    expect(productos.every((p) => ["Zapatillas", "Ropa", "Accesorios"].includes(p.categoria))).toBeTrue();
  });

  it("crea, actualiza y elimina un producto", () => {
    const nuevo = createProduct({ codigo: "TST-001", nombre: "TEST", categoria: "ROPA", precio: 1000 });
    expect(nuevo.categoria).toBe("Ropa");
    expect(getProducts().length).toBe(9);

    updateProduct(nuevo.id, { precio: 2000 });
    expect(getProducts().find((p) => p.id === nuevo.id).precio).toBe(2000);

    expect(deleteProduct(nuevo.id)).toBeTrue();
    expect(getProducts().length).toBe(8);
  });

  it("rechaza un código de producto duplicado y expone las ofertas", () => {
    expect(() => createProduct({ codigo: "SNK-001", nombre: "X", categoria: "Ropa", precio: 1 })).toThrowError(/código/);
    expect(getOffers().length).toBe(3);
  });

  it("autentica con credenciales válidas, sin exponer la contraseña, y rechaza correos duplicados", () => {
    const user = authenticate("admin@duoc.cl", "1234");
    expect(user.rol).toBe("Administrador");
    expect(user.password).toBeUndefined();
    expect(authenticate("admin@duoc.cl", "mala")).toBeNull();
    expect(() => createUser({ run: "11111111K", correo: "admin@duoc.cl" })).toThrowError(/correo/);
  });
});