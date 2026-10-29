import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../src/components/products/ProductCard.jsx";

const BASE = { id: 1, nombre: "X", categoria: "Ropa", precio: 100, oferta: null, imagen: "x.jpg" };
const montar = (stock) =>
  render(<MemoryRouter><ProductCard producto={{ ...BASE, stock }} onAdd={() => {}} /></MemoryRouter>);

describe("ProductCard (stock oculto al cliente)", () => {
  afterEach(cleanup);

  it("no muestra la cantidad de stock cuando hay disponibilidad", () => {
    montar(15);
    expect(document.body.textContent).not.toContain("Stock");
    expect(screen.getByText("Añadir").disabled).toBeFalse();
  });

  it("tampoco muestra el stock cuando es bajo", () => {
    montar(3);
    expect(document.body.textContent).not.toContain("Stock");
    expect(screen.getByText("Añadir").disabled).toBeFalse();
  });

  it("con stock 0 muestra el botón Agotado deshabilitado", () => {
    montar(0);
    expect(screen.getByText("Agotado").disabled).toBeTrue();
    expect(screen.queryByText("Añadir")).toBeNull();
  });
});