import {
  initDB, resetDB, getCategories, createCategory, updateCategory, deleteCategory, getProducts,
} from "../src/data/db.js";

describe("db (categorías)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  afterAll(() => resetDB());

  it("inicia con 3 categorías y crea una nueva con el nombre normalizado", () => {
    expect(getCategories()).toEqual(["Zapatillas", "Ropa", "Accesorios"]);
    expect(createCategory("  gorros ")).toBe("Gorros");
    expect(getCategories().length).toBe(4);
  });

  it("rechaza un nombre vacío o duplicado", () => {
    expect(() => createCategory("")).toThrowError(/obligatorio/);
    expect(() => createCategory("ropa")).toThrowError(/Ya existe/);
  });

  it("al renombrar una categoría actualiza los productos que la usan", () => {
    updateCategory("Ropa", "Vestuario");
    expect(getCategories()).toContain("Vestuario");
    expect(getCategories()).not.toContain("Ropa");
    expect(getProducts().filter((p) => p.categoria === "Vestuario").length).toBe(2);
  });

  it("no elimina una categoría en uso, pero sí una vacía", () => {
    expect(() => deleteCategory("Ropa")).toThrowError(/No se puede eliminar/);
    createCategory("Gorros");
    expect(deleteCategory("Gorros")).toBeTrue();
    expect(getCategories()).not.toContain("Gorros");
  });
});