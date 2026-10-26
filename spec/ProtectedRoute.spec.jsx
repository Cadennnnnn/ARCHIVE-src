import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import ProtectedRoute from "../src/components/common/ProtectedRoute.jsx";

function montar(rol, soloAdmin = false) {
  localStorage.clear();
  if (rol) localStorage.setItem("ARCHIVE_SESSION", JSON.stringify({ nombre: "T", rol }));
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute soloAdmin={soloAdmin}><p>CONTENIDO</p></ProtectedRoute>} />
          <Route path="/login" element={<p>LOGIN</p>} />
          <Route path="/" element={<p>TIENDA</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("redirige a /login si no hay sesión", () => {
    montar(null);
    expect(screen.getByText("LOGIN")).toBeTruthy();
  });

  it("redirige a la tienda si el usuario es Cliente", () => {
    montar("Cliente");
    expect(screen.getByText("TIENDA")).toBeTruthy();
  });

  it("muestra el contenido al Administrador", () => {
    montar("Administrador", true);
    expect(screen.getByText("CONTENIDO")).toBeTruthy();
  });
});