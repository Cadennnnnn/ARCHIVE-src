import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import SearchBar from "../src/components/layout/SearchBar.jsx";

function Ubicacion() {
  const l = useLocation();
  return <p data-testid="ubicacion">{l.pathname + l.search}</p>;
}

const montar = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="*" element={<><SearchBar /><Ubicacion /></>} />
      </Routes>
    </MemoryRouter>
  );

const buscar = (texto) => {
  fireEvent.change(screen.getByLabelText("Buscar productos"), { target: { value: texto } });
  fireEvent.click(screen.getByText("Buscar"));
};

describe("SearchBar", () => {
  afterEach(cleanup);

  it("navega a /productos con el texto codificado como parámetro q", () => {
    montar();
    buscar("nike air");
    expect(screen.getByTestId("ubicacion").textContent).toBe("/productos?q=nike%20air");
  });

  it("con el campo vacío navega a /productos sin parámetros", () => {
    montar();
    buscar("");
    expect(screen.getByTestId("ubicacion").textContent).toBe("/productos");
  });

  it("ignora los espacios al inicio y al final", () => {
    montar();
    buscar("   nike   ");
    expect(screen.getByTestId("ubicacion").textContent).toBe("/productos?q=nike");
  });
});