import { validarTelefono, validarMetodoPago } from "../src/utils/perfil.js";

const HOY = new Date("2026-10-30T12:00:00");
const VALIDO = { marca: "Visa", ultimos4: "4242", titular: "Ana Soto", vence: "12/30" };

describe("validaciones de perfil", () => {
  it("el teléfono es opcional y acepta el formato chileno", () => {
    expect(validarTelefono("")).toBe("");
    expect(validarTelefono("+56 9 1234 5678")).toBe("");
    expect(validarTelefono("912345678")).toBe("");
  });

  it("rechaza un teléfono con formato inválido", () => {
    expect(validarTelefono("12345")).not.toBe("");
  });

  it("acepta un método de pago válido sin errores", () => {
    expect(validarMetodoPago(VALIDO, HOY)).toEqual({});
  });

  it("detecta marca, dígitos, titular y vencimiento inválidos o vencidos", () => {
    const e = validarMetodoPago({ marca: "", ultimos4: "12", titular: "", vence: "13/99" }, HOY);
    expect(Object.keys(e).sort()).toEqual(["marca", "titular", "ultimos4", "vence"]);
    expect(validarMetodoPago({ ...VALIDO, vence: "01/20" }, HOY).vence).toBe("La tarjeta está vencida.");
  });
});
