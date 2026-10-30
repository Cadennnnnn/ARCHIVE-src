import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider, useCart } from "../src/context/CartContext.jsx";
import FormField from "../src/components/forms/FormField.jsx";
import ProductCard from "../src/components/products/ProductCard.jsx";

const PRODUCTO = { id: 1, nombre: "SALOMON XT-6", categoria: "Zapatillas", precio: 189990, oferta: null, imagen: "x.jpg", stock: 5 };

// 1) RENDER: ¿el componente se dibuja con los datos que recibe?
describe("ProductCard - render", () => {
  afterEach(cleanup);

  it("dibuja el nombre y la categoría del producto", () => {
    render(<MemoryRouter><ProductCard producto={PRODUCTO} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.getAllByText("SALOMON XT-6").length).toBeGreaterThan(0);
    expect(screen.getByText("Zapatillas")).toBeTruthy();
  });
});

// 2) PROPS: ¿cómo reacciona al recibir datos distintos?
describe("ProductCard - props", () => {
  afterEach(cleanup);

  it("muestra la insignia OFERTA solo si la prop oferta tiene valor", () => {
    const { rerender } = render(<MemoryRouter><ProductCard producto={PRODUCTO} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.queryByText("OFERTA")).toBeNull();

    rerender(<MemoryRouter><ProductCard producto={{ ...PRODUCTO, oferta: 159990 }} onAdd={() => {}} /></MemoryRouter>);
    expect(screen.getByText("OFERTA")).toBeTruthy();
  });
});

// 3) STATE: ¿cambia correctamente el estado interno?
function Contador() {
  const { totalItems, addItem } = useCart();
  return (
    <div>
      <span data-testid="total">{totalItems}</span>
      <button onClick={() => addItem({ id: 1, codigo: "A", nombre: "X", precio: 1000, oferta: null, imagen: "" })}>agregar</button>
    </div>
  );
}

describe("CartContext - state", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("el estado totalItems sube de 0 a 2 al agregar dos veces", () => {
    render(<CartProvider><Contador /></CartProvider>);
    expect(screen.getByTestId("total").textContent).toBe("0");
    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("agregar"));
    expect(screen.getByTestId("total").textContent).toBe("2");
  });
});

// 4) EVENTO: simulamos lo que haría el usuario
describe("FormField - evento", () => {
  afterEach(cleanup);

  it("al escribir en el input llama a onChange con el texto (espía)", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<FormField id="n" label="Nombre" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Luis" } });
    expect(onChange).toHaveBeenCalledWith("Luis");
  });
});