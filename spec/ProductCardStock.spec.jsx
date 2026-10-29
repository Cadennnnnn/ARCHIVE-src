import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../src/components/products/ProductCard.jsx";

const BASE = { id: 1, nombre: "X", categoria: "Ropa", precio: 100, oferta: null, imagen: "x.jpg" };
const montar = (stock) =>
  render(<MemoryRouter><ProductCard producto={{ ...BASE, stock }} onAdd={() => {}} /></MemoryRouter>);

describe("ProductCard (stock disponible)", () => {
  afterEach(cleanup);

  it("muestra el stock disponible en gris cuando hay suficiente", () => {
    montar(15);
    const texto = screen.getByText("Stock disponible: 15");
    expect(texto.classList.contains("text-danger")).toBeFalse();
  });

  it("resalta en rojo el stock bajo (5 o menos)", () => {
    montar(3);
    expect(screen.getByText("Stock disponible: 3").classList.contains("text-danger")).toBeTrue();
  });

  it("muestra Sin stock disponible cuando el stock es 0", () => {
    montar(0);
    expect(screen.getByText("Sin stock disponible")).toBeTruthy();
    expect(screen.queryByText(/Stock disponible:/)).toBeNull();
  });
});