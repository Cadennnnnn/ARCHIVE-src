import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "../src/context/CartContext.jsx";
import ProductDetail from "../src/pages/store/ProductDetail.jsx";
import { initDB, resetDB, updateProduct } from "../src/data/db.js";

const montar = (id) =>
  render(
    <CartProvider>
      <MemoryRouter initialEntries={[`/productos/${id}`]}>
        <Routes>
          <Route path="/productos/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

describe("ProductDetail (vista del cliente)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });
  afterEach(cleanup);
  afterAll(() => resetDB());

  it("no muestra el indicador de stock disponible", () => {
    montar(1);
    expect(screen.queryByText(/Stock disponible/)).toBeNull();
    expect(screen.getByText("Añadir al Carrito").disabled).toBeFalse();
  });

  it("con stock 0 deshabilita la compra y muestra Agotado", () => {
    updateProduct(1, { stock: 0 });
    montar(1);
    expect(screen.getByText("Agotado").disabled).toBeTrue();
  });
});