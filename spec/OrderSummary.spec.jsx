import { render, screen, cleanup } from "@testing-library/react";
import OrderSummary from "../src/components/cart/OrderSummary.jsx";

const CLIENTE = {
  nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "Despacho a domicilio",
  direccion: "Los Cisnes 10", departamento: "", indicaciones: "", comuna: "Providencia", region: "Metropolitana",
};
const ITEMS = [{ id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 3, imagen: "x.jpg" }];

describe("OrderSummary", () => {
  afterEach(cleanup);

  it("muestra el cliente, los productos y el total recibidos por props", () => {
    render(<OrderSummary cliente={CLIENTE} items={ITEMS} total={3000} />);
    expect(screen.getByText("NIKE")).toBeTruthy();
    expect(document.body.textContent).toContain("Ana Soto");
    expect(document.body.textContent).toMatch(/3\.?000/);
    expect(screen.getByText("TOTAL PAGADO")).toBeTruthy();
  });

  it("muestra departamento e indicaciones solo cuando existen", () => {
    const { rerender } = render(<OrderSummary cliente={CLIENTE} items={ITEMS} total={3000} />);
    expect(screen.queryByText(/Indicaciones:/)).toBeNull();
    expect(document.body.textContent).not.toContain("Depto");

    rerender(<OrderSummary cliente={{ ...CLIENTE, departamento: "603", indicaciones: "Dejar con conserje" }} items={ITEMS} total={3000} />);
    expect(screen.getByText(/Indicaciones: Dejar con conserje/)).toBeTruthy();
    expect(document.body.textContent).toContain("Depto 603");
  });
});