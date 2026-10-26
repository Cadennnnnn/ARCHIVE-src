import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import FormField from "../src/components/forms/FormField.jsx";

describe("FormField", () => {
  afterEach(cleanup);

  it("renderiza la etiqueta y el valor recibidos por props", () => {
    render(<FormField id="n" label="Nombre" value="Ana" onChange={() => {}} />);
    expect(screen.getByLabelText("Nombre").value).toBe("Ana");
  });

  it("muestra el mensaje y la clase is-invalid solo cuando hay error (renderizado condicional)", () => {
    const { rerender } = render(<FormField id="n" label="Nombre" value="" onChange={() => {}} />);
    expect(screen.queryByText("Obligatorio")).toBeNull();

    rerender(<FormField id="n" label="Nombre" value="" onChange={() => {}} error="Obligatorio" />);
    expect(screen.getByText("Obligatorio")).toBeTruthy();
    expect(screen.getByLabelText("Nombre").classList.contains("is-invalid")).toBeTrue();
  });

  it("llama a onChange con el texto escrito (simulación de evento)", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<FormField id="n" label="Nombre" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Luis" } });
    expect(onChange).toHaveBeenCalledWith("Luis");
  });
});