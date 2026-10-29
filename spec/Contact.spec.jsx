import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Swal from "sweetalert2";
import Contact from "../src/pages/store/Contact.jsx";

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const enviar = () => fireEvent.click(screen.getByText("ENVIAR MENSAJE"));

describe("Contact (estado del formulario)", () => {
  beforeEach(() => {
    spyOn(Swal, "fire").and.returnValue(new Promise(() => {}));
  });
  afterEach(cleanup);

  it("actualiza los tres campos (incluido el textarea) cuando el usuario escribe", () => {
    render(<Contact />);
    escribir("Nombre Completo", "Ana Soto");
    escribir("Correo Electrónico", "ana@gmail.com");
    escribir("Contenido del Mensaje", "Hola");
    expect(screen.getByLabelText("Nombre Completo").value).toBe("Ana Soto");
    expect(screen.getByLabelText("Correo Electrónico").value).toBe("ana@gmail.com");
    expect(screen.getByLabelText("Contenido del Mensaje").value).toBe("Hola");
  });

  it("muestra errores por campo al enviar vacío o con un dominio de correo no permitido", () => {
    render(<Contact />);
    enviar();
    expect(screen.getAllByText("Este campo es obligatorio.").length).toBe(2);
    expect(screen.getByText("El correo es obligatorio.")).toBeTruthy();

    escribir("Nombre Completo", "Ana");
    escribir("Correo Electrónico", "ana@hotmail.com");
    escribir("Contenido del Mensaje", "Hola");
    enviar();
    expect(screen.getByText("Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com.")).toBeTruthy();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it("con datos válidos no muestra errores y confirma el envío con la alerta", () => {
    render(<Contact />);
    escribir("Nombre Completo", "Ana Soto");
    escribir("Correo Electrónico", "ana@duoc.cl");
    escribir("Contenido del Mensaje", "Quiero consultar por un producto");
    enviar();
    expect(document.querySelectorAll(".field-msg").length).toBe(0);
    expect(Swal.fire).toHaveBeenCalledTimes(1);
  });
});