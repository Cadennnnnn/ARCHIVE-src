import {
  validarRun, validarCorreo, validarPassword, validarConfirmacion, validarRegistro,
} from "../src/utils/validaciones.js";

describe("validaciones", () => {
  it("acepta un RUN válido y rechaza uno con guion", () => {
    expect(validarRun("19011022K")).toBe("");
    expect(validarRun("19.011.022-K")).not.toBe("");
  });

  it("solo acepta los dominios permitidos", () => {
    expect(validarCorreo("a@duoc.cl")).toBe("");
    expect(validarCorreo("a@profesor.duoc.cl")).toBe("");
    expect(validarCorreo("a@gmail.com")).toBe("");
    expect(validarCorreo("a@hotmail.com")).not.toBe("");
  });

  it("valida el largo de la contraseña (4 a 10) y su confirmación", () => {
    expect(validarPassword("123")).not.toBe("");
    expect(validarPassword("1234")).toBe("");
    expect(validarPassword("12345678901")).not.toBe("");
    expect(validarConfirmacion("1234", "4321")).not.toBe("");
  });

  it("validarRegistro devuelve errores por campo para un formulario vacío", () => {
    const errores = validarRegistro({});
    expect(Object.keys(errores)).toEqual(
      jasmine.arrayContaining(["run", "nombre", "correo", "password", "region", "direccion"])
    );
  });
});