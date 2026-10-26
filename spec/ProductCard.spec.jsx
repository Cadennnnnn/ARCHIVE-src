import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../src/components/products/ProductCard.jsx";

const BASE = { id: 1, nombre: "SALOMON XT-6", categoria: "Zapatillas", precio: 189990, oferta: null, imagen: "x.jpg" };

const montar = (producto, onAdd = () => {}) =>
  render(<MemoryRouter><ProductCard producto={producto} onAdd={onAdd} /></MemoryRouter>);

describe("ProductCard", () => {
  afterEach(cleanup);

  it("muestra nombre, categoría y precio recibidos por props", () => {
    montar(BASE);
    expect(screen.getAllByText("SALOMON XT-6").length).toBeGreaterThan(0);
    expect(screen.getByText("Zapatillas")).toBeTruthy();
    expect(document.body.textContent).toContain("189");
  });

  it("muestra la insignia OFERTA solo cuando el producto está en oferta", () => {
    montar(BASE);
    expect(screen.queryByText("OFERTA")).toBeNull();
    cleanup();
    montar({ ...BASE, oferta: 159990 });
    expect(screen.getByText("OFERTA")).toBeTruthy();
  });

  it("al hacer clic en Añadir invoca onAdd con el producto (mock)", () => {
    const onAdd = jasmine.createSpy("onAdd");
    montar(BASE, onAdd);
    fireEvent.click(screen.getByText("Añadir"));
    expect(onAdd).toHaveBeenCalledOnceWith(BASE);
  });
});