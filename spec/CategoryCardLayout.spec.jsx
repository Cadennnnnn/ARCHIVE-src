import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CategoryCards from "../src/components/products/CategoryCards.jsx";

const CATEGORIAS = ["Zapatillas", "Ropa", "Accesorios"].map((nombre) => ({ nombre, cantidad: 1, imagen: "x.jpg" }));

describe("CategoryCards (diseño)", () => {
  afterEach(cleanup);

  it("centra las tarjetas con la clase justify-content-center de Bootstrap", () => {
    const { container } = render(<MemoryRouter><CategoryCards categorias={CATEGORIAS} /></MemoryRouter>);
    expect(container.querySelector(".row").classList.contains("justify-content-center")).toBeTrue();
    expect(container.querySelectorAll(".col-6").length).toBe(3);
  });
});