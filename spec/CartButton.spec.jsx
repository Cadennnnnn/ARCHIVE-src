import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../src/context/CartContext.jsx";
import CartButton from "../src/components/layout/CartButton.jsx";

const montar = () => render(<CartProvider><MemoryRouter><CartButton /></MemoryRouter></CartProvider>);

describe("CartButton", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("muestra solo el ícono y el monto, sin el texto Carrito", () => {
    montar();
    expect(document.querySelector("svg")).not.toBeNull();
    expect(document.body.textContent).toBe("$0");
    expect(document.body.textContent).not.toContain("Carrito");
  });

  it("refleja el total y la cantidad de productos del carrito", () => {
    localStorage.setItem(
      "ARCHIVE_CART_ITEMS",
      JSON.stringify([{ id: 1, codigo: "A", nombre: "X", precio: 1000, imagen: "", cantidad: 3 }])
    );
    montar();
    expect(document.body.textContent).toMatch(/3\.?000/);
    expect(screen.getByLabelText(/^Carrito: 3 producto\(s\)/)).toBeTruthy();
  });

  it("enlaza a la página del carrito", () => {
    montar();
    expect(screen.getByLabelText(/^Carrito:/).getAttribute("href")).toBe("/carrito");
  });
});