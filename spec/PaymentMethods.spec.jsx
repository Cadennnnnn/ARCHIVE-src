import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import PaymentMethods from "../src/components/profile/PaymentMethods.jsx";

const GUARDADO = { id: 1, marca: "Visa", ultimos4: "4242", titular: "Ana Soto", vence: "12/30" };

describe("PaymentMethods", () => {
  afterEach(cleanup);

  it("muestra los métodos guardados solo con marca y últimos 4 dígitos", () => {
    render(<PaymentMethods metodos={[GUARDADO]} onChange={() => {}} />);
    expect(screen.getByText("Visa •••• 4242")).toBeTruthy();
  });

  it("valida el formulario vacío y no guarda nada", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<PaymentMethods metodos={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText("Agregar método"));
    expect(screen.getByText("Seleccione una marca.")).toBeTruthy();
    expect(screen.getByText("Ingrese los 4 últimos dígitos.")).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("agrega un método válido y permite eliminar uno existente", () => {
    const onChange = jasmine.createSpy("onChange");
    const { unmount } = render(<PaymentMethods metodos={[GUARDADO]} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Marca"), { target: { value: "Mastercard" } });
    fireEvent.change(screen.getByLabelText("Últimos 4 dígitos"), { target: { value: "1111" } });
    fireEvent.change(screen.getByLabelText("Titular"), { target: { value: "Ana Soto" } });
    fireEvent.change(screen.getByLabelText("Vencimiento (MM/AA)"), { target: { value: "12/99" } });
    fireEvent.click(screen.getByText("Agregar método"));
    expect(onChange.calls.mostRecent().args[0].length).toBe(2);
    expect(onChange.calls.mostRecent().args[0][1].ultimos4).toBe("1111");

    unmount();
    const onChange2 = jasmine.createSpy("onChange2");
    render(<PaymentMethods metodos={[GUARDADO]} onChange={onChange2} />);
    fireEvent.click(screen.getByLabelText("Eliminar Visa 4242"));
    expect(onChange2).toHaveBeenCalledWith([]);
  });
});
