import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductGrid from "../src/components/products/ProductGrid.jsx";

const PRODUCTOS = [1, 2, 3].map((n) => ({
  id: n, nombre: `PRODUCTO ${n}`, categoria: "Ropa", precio: 1000 * n, oferta: null, imagen: "x.jpg", stock: 5,
}));

const montar = (props) => render(<MemoryRouter><ProductGrid onAdd={() => {}} {...props} /></MemoryRouter>);

describe("ProductGrid", () => {
  afterEach(cleanup);

  it("renderiza una tarjeta por cada producto del conjunto de datos", () => {
    montar({ productos: PRODUCTOS });
    expect(document.querySelectorAll("article").length).toBe(3);
    expect(screen.getByText("PRODUCTO 1", { selector: "a" })).toBeTruthy();
    expect(screen.getByText("PRODUCTO 3", { selector: "a" })).toBeTruthy();
  });

  it("muestra el mensaje por defecto cuando no hay productos", () => {
    montar({ productos: [] });
    expect(document.querySelectorAll("article").length).toBe(0);
    expect(screen.getByText("No hay productos para mostrar.")).toBeTruthy();
  });

  it("muestra un mensaje personalizado recibido por props y no lo muestra si hay productos", () => {
    const { unmount } = montar({ productos: [], mensajeVacio: "Sin resultados" });
    expect(screen.getByText("Sin resultados")).toBeTruthy();
    unmount();
    montar({ productos: PRODUCTOS, mensajeVacio: "Sin resultados" });
    expect(screen.queryByText("Sin resultados")).toBeNull();
  });
});