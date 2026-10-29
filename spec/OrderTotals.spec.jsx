import { render, screen, cleanup } from "@testing-library/react";
import OrderTotals from "../src/components/cart/OrderTotals.jsx";

describe("OrderTotals", () => {
  afterEach(cleanup);

  it("muestra el subtotal y el total con la etiqueta por defecto", () => {
    render(<OrderTotals subtotal={3000} total={3000} />);
    expect(screen.getByText("SUBTOTAL")).toBeTruthy();
    expect(screen.getByText("TOTAL PAGADO")).toBeTruthy();
    expect(document.body.textContent).toMatch(/3\.?000/);
  });

  it("usa la etiqueta de total recibida por props", () => {
    render(<OrderTotals subtotal={1000} total={1000} etiquetaTotal="Total a pagar" />);
    expect(screen.getByText("TOTAL A PAGAR")).toBeTruthy();
    expect(screen.queryByText("TOTAL PAGADO")).toBeNull();
  });
});