import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import Login from "../src/pages/store/Login.jsx";
import { initDB, resetDB } from "../src/data/db.js";

const montar = () =>
  render(
    <AuthProvider>
      <MemoryRouter><Login /></MemoryRouter>
    </AuthProvider>
  );

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
const enviar = () => fireEvent.click(screen.getByText("INGRESAR"));

describe("Login (estado del formulario)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
    // Mock de SweetAlert2: promesa que nunca se resuelve, así no se navega durante la prueba
    spyOn(Swal, "fire").and.returnValue(new Promise(() => {}));
  });
  afterEach(cleanup);
  afterAll(() => resetDB());

  it("actualiza el estado de los campos cuando el usuario escribe", () => {
    montar();
    escribir("Correo", "admin@duoc.cl");
    escribir("Contraseña", "1234");
    expect(screen.getByLabelText("Correo").value).toBe("admin@duoc.cl");
    expect(screen.getByLabelText("Contraseña").value).toBe("1234");
  });

  it("muestra los errores de validación solo al enviar el formulario vacío", () => {
    montar();
    expect(screen.queryByText("El correo es obligatorio.")).toBeNull();
    enviar();
    expect(screen.getByText("El correo es obligatorio.")).toBeTruthy();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeTruthy();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it("muestra un error cuando las credenciales no coinciden y no inicia sesión", () => {
    montar();
    escribir("Correo", "admin@duoc.cl");
    escribir("Contraseña", "mala1");
    enviar();
    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeTruthy();
    expect(localStorage.getItem("ARCHIVE_SESSION")).toBeNull();
  });

  it("con credenciales válidas guarda la sesión y avisa con la alerta de bienvenida", () => {
    montar();
    escribir("Correo", "cliente@gmail.com");
    escribir("Contraseña", "1234");
    enviar();
    expect(JSON.parse(localStorage.getItem("ARCHIVE_SESSION")).rol).toBe("Cliente");
    expect(Swal.fire).toHaveBeenCalledTimes(1);
  });
});