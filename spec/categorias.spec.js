import { resumenCategorias } from "../src/utils/categorias.js";

const PRODUCTOS = [
  { id: 1, categoria: "Ropa", imagen: "" },
  { id: 2, categoria: "Ropa", imagen: "ropa.jpg" },
  { id: 3, categoria: "Zapatillas", imagen: "zapa.jpg" },
];

describe("resumenCategorias", () => {
  it("cuenta los productos de cada categoría y toma la primera imagen disponible", () => {
    const r = resumenCategorias(["Ropa", "Zapatillas"], PRODUCTOS);
    expect(r[0]).toEqual({ nombre: "Ropa", cantidad: 2, imagen: "ropa.jpg" });
    expect(r[1]).toEqual({ nombre: "Zapatillas", cantidad: 1, imagen: "zapa.jpg" });
  });

  it("una categoría sin productos queda con cantidad 0 e imagen vacía", () => {
    const r = resumenCategorias(["Gorros"], PRODUCTOS);
    expect(r[0]).toEqual({ nombre: "Gorros", cantidad: 0, imagen: "" });
  });
});