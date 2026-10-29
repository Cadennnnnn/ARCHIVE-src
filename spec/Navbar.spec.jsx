import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { CartProvider } from "../src/context/CartContext.jsx";
import Navbar from "../src/components/layout/Navbar.jsx";
import { initDB, resetDB } from "../src/data/db.js";

function Ubicacion() {
  const l = useLocation();
  return <p data-testid="ubicacion">{l.pathname + l.search}</p>;
}

const montar = () =>
  render(
    <AuthProvider>
      <CartProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="*" element={<><Navbar /><Ubicacion /></>} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </AuthProvider>
  );

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });
  afterEach(cleanup);
  afterAll(() => resetDB());

  it("muestra el botón del carrito con el monto total (vacío = $0)", () => {
    montar();
    expect(screen.getByText("Carrito $0")).toBeTruthy();
  });

  it("la barra de búsqueda navega a /productos con el texto como parámetro q", () => {
    montar();
    fireEvent.change(screen.getByLabelText("Buscar productos"), { target: { value: "nike air" } });
    fireEvent.click(screen.getByText("Buscar"));
    expect(screen.getByTestId("ubicacion").textContent).toBe("/productos?q=nike%20air");
  });

  it("el menú desplegable lista las categorías de la base con su enlace de filtro", () => {
    montar();
    expect(screen.getByText("Ropa").getAttribute("href")).toBe("/categorias?cat=Ropa");
    expect(screen.getByText("Todas").getAttribute("href")).toBe("/categorias");
  });
});