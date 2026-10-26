import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CartProvider, useCart } from "../src/context/CartContext.jsx";

const PRODUCTO = { id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, oferta: null, imagen: "x.jpg" };
const EN_OFERTA = { ...PRODUCTO, id: 2, oferta: 800 };

function Probe() {
  const { items, addItem, changeQty, removeItem, totalItems, total } = useCart();
  return (
    <div>
      <span data-testid="items">{totalItems}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="lineas">{items.length}</span>
      <button onClick={() => addItem(PRODUCTO)}>add</button>
      <button onClick={() => addItem(EN_OFERTA)}>add-oferta</button>
      <button onClick={() => changeQty(1, -1)}>menos</button>
      <button onClick={() => removeItem(1)}>quitar</button>
    </div>
  );
}

const montar = () => render(<CartProvider><Probe /></CartProvider>);
const texto = (id) => screen.getByTestId(id).textContent;

describe("CartContext (estado)", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("agrega productos, acumula la cantidad del mismo y calcula el total", () => {
    montar();
    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("add"));
    expect(texto("items")).toBe("2");
    expect(texto("lineas")).toBe("1");
    expect(texto("total")).toBe("2000");
  });

  it("usa el precio de oferta cuando existe", () => {
    montar();
    fireEvent.click(screen.getByText("add-oferta"));
    expect(texto("total")).toBe("800");
  });

  it("disminuye, elimina la línea al llegar a 0 y persiste en localStorage", () => {
    montar();
    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("menos"));
    expect(texto("lineas")).toBe("0");

    fireEvent.click(screen.getByText("add"));
    expect(JSON.parse(localStorage.getItem("ARCHIVE_CART_ITEMS")).length).toBe(1);
    fireEvent.click(screen.getByText("quitar"));
    expect(texto("items")).toBe("0");
  });
});