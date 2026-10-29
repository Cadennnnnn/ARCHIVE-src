import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import Dashboard from "../src/pages/admin/Dashboard.jsx";
import { initDB, resetDB } from "../src/data/db.js";
import { sembrarPedidosDemo } from "../src/data/demo.js";

function montar(rol) {
  localStorage.clear();
  initDB();
  sembrarPedidosDemo();
  localStorage.setItem("ARCHIVE_SESSION", JSON.stringify({ run: "1", nombre: "T", apellidos: "X", rol }));
  return render(
    <AuthProvider>
      <MemoryRouter><Dashboard /></MemoryRouter>
    </AuthProvider>
  );
}

describe("Dashboard", () => {
  afterEach(cleanup);
  afterAll(() => {
    localStorage.clear();
    resetDB();
  });

  it("el Administrador ve los 8 accesos", () => {
    montar("Administrador");
    expect(document.querySelectorAll("[data-acceso]").length).toBe(8);
  });

  it("el Vendedor ve 7 accesos y no el de Usuarios", () => {
    montar("Vendedor");
    expect(document.querySelectorAll("[data-acceso]").length).toBe(7);
    expect(document.querySelector('[data-acceso="Usuarios"]')).toBeNull();
  });

  it("la tarjeta Compras refleja los pedidos de la base", () => {
    montar("Administrador");
    expect(screen.getByTestId("kpi-compras").textContent).toBe("7");
  });
});