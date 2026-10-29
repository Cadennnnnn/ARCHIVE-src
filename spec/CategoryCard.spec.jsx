import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryCards from "../src/components/products/CategoryCards.jsx";

const CATEGORIAS = [
  { nombre: "Ropa", cantidad: 2, imagen: "ropa.jpg" },
  { nombre: "Gorros", cantidad: 0, imagen: "" },
];

describe("CategoryCards", () => {
  afterEach(cleanup);

  it("muestra una tarjeta por categoría con su cantidad y un enlace con el parámetro de la URL", () => {
    render(<MemoryRouter><CategoryCards categorias={CATEGORIAS} /></MemoryRouter>);
    expect(screen.getByText("2 producto(s)")).toBeTruthy();
    expect(screen.getByText("Ropa").closest("a").getAttribute("href")).toBe("/categorias?cat=Ropa");
    expect(screen.getByText("Sin imagen")).toBeTruthy();
  });

  it("no renderiza nada cuando no hay categorías", () => {
    const { container } = render(<MemoryRouter><CategoryCards categorias={[]} /></MemoryRouter>);
    expect(container.innerHTML).toBe("");
  });
});