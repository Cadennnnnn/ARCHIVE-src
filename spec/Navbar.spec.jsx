import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { CartProvider } from "../src/context/CartContext.jsx";
import Navbar from "../src/components/layout/Navbar.jsx";
import { initDB, resetDB } from "../src/data/db.js";

const montar = () =>
  render(
    <AuthProvider>
      <CartProvider>
        <MemoryRouter><Navbar /></MemoryRouter>
      </CartProvider>
    </AuthProvider>
  );

describe("Navbar (composición)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });
  afterEach(cleanup);
  afterAll(() => resetDB());

  it("sin sesión muestra Iniciar sesión y Crear cuenta", () => {
    montar();
    expect(screen.getByText("Iniciar sesión").getAttribute("href")).toBe("/login");
    expect(screen.getByText("Crear cuenta").getAttribute("href")).toBe("/registro");
    expect(screen.queryByText("Registrar usuario")).toBeNull();
  });

  it("con sesión muestra el saludo y Salir, y oculta los accesos de ingreso", () => {
    localStorage.setItem("ARCHIVE_SESSION", JSON.stringify({ nombre: "Ana", rol: "Cliente" }));
    montar();
    expect(screen.getByText("Hola, Ana")).toBeTruthy();
    expect(screen.getByText("Salir")).toBeTruthy();
    expect(screen.queryByText("Iniciar sesión")).toBeNull();
  });

  it("el menú desplegable lista las categorías de la base con su enlace de filtro", () => {
    montar();
    expect(screen.getByText("Ropa").getAttribute("href")).toBe("/categorias?cat=Ropa");
    expect(screen.getByText("Todas").getAttribute("href")).toBe("/categorias");
  });
});