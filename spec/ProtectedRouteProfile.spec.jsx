import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import ProtectedRoute from "../src/components/common/ProtectedRoute.jsx";

function montar(rol) {
  localStorage.clear();
  if (rol) localStorage.setItem("ARCHIVE_SESSION", JSON.stringify({ nombre: "T", rol }));
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/perfil"]}>
        <Routes>
          <Route path="/perfil" element={<ProtectedRoute requiereStaff={false}><p>PERFIL</p></ProtectedRoute>} />
          <Route path="/login" element={<p>LOGIN</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ProtectedRoute (perfil de cliente)", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("permite el acceso a un Cliente con sesión", () => {
    montar("Cliente");
    expect(screen.getByText("PERFIL")).toBeTruthy();
  });

  it("sin sesión redirige al login", () => {
    montar(null);
    expect(screen.getByText("LOGIN")).toBeTruthy();
  });
});
