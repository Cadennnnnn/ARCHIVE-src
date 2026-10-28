import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider, useCart } from "../src/context/CartContext.jsx";
import ProductCard from "../src/components/products/ProductCard.jsx";
import { initDB, resetDB, updateProduct, getProductById } from "../src/data/db.js";

function Probe({ id }) {
  const { addItem, totalItems } = useCart();
  return (
    <div>
      <span data-testid="total">{totalItems}</span>
      <button onClick={() => addItem(getProductById(id))}>add</button>
    </div>
  );
}

const montar = (id) => render(<CartProvider><Probe id={id} /></CartProvider>);

describe("carrito y stock", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });
  afterEach(cleanup);
  afterAll(() => resetDB());

  it("no permite agregar más unidades que el stock disponible", () => {
    montar(5); // ASICS GEL-NYC: stock 4
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByText("add"));
    expect(screen.getByTestId("total").textContent).toBe("4");
  });

  it("no agrega al carrito un producto agotado", () => {
    updateProduct(5, { stock: 0 });
    montar(5);
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByTestId("total").textContent).toBe("0");
  });

  it("ProductCard deshabilita el botón y muestra Agotado si no hay stock", () => {
    const onAdd = jasmine.createSpy("onAdd");
    const p = { id: 1, nombre: "X", categoria: "Ropa", precio: 100, oferta: null, imagen: "x.jpg", stock: 0 };
    render(<MemoryRouter><ProductCard producto={p} onAdd={onAdd} /></MemoryRouter>);
    const boton = screen.getByText("Agotado");
    expect(boton.disabled).toBeTrue();
    fireEvent.click(boton);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("ProductCard mantiene el botón Añadir cuando hay stock", () => {
    const p = { id: 1, nombre: "X", categoria: "Ropa", precio: 100, oferta: null, imagen: "x.jpg", stock: 3 };
    render(<MemoryRouter><ProductCard producto={p} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.getByText("Añadir").disabled).toBeFalse();
    expect(screen.queryByText("Agotado")).toBeNull();
  });
});