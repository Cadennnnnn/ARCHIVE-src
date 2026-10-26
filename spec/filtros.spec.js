import { filtrarProductos, obtenerCategorias } from "../src/utils/filtros.js";

const PRODUCTOS = [
  { id: 1, nombre: "NIKE AIR MAX", codigo: "SNK-001", categoria: "Zapatillas" },
  { id: 2, nombre: "FOG HOODIE", codigo: "APP-101", categoria: "Ropa" },
  { id: 3, nombre: "SALOMON XT-6", codigo: "SNK-002", categoria: "Zapatillas" },
];

describe("filtros de productos", () => {
  it("filtra por texto (nombre o código) y por categoría", () => {
    expect(filtrarProductos(PRODUCTOS, { busqueda: "nike" }).length).toBe(1);
    expect(filtrarProductos(PRODUCTOS, { busqueda: "snk" }).length).toBe(2);
    expect(filtrarProductos(PRODUCTOS, { categoria: "Ropa" })[0].id).toBe(2);
  });

  it("obtiene categorías sin repetir", () => {
    expect(obtenerCategorias(PRODUCTOS)).toEqual(["Zapatillas", "Ropa"]);
  });
});