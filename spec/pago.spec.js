import { simularPago, generarNumeroIntento, PROBABILIDAD_EXITO } from "../src/utils/pago.js";

describe("pago simulado", () => {
  it("aprueba el pago cuando el azar cae bajo la probabilidad de éxito (mock de Math.random)", () => {
    spyOn(Math, "random").and.returnValue(PROBABILIDAD_EXITO - 0.01);
    expect(simularPago()).toBeTrue();
  });

  it("rechaza el pago cuando el azar cae sobre la probabilidad de éxito", () => {
    spyOn(Math, "random").and.returnValue(PROBABILIDAD_EXITO + 0.01);
    expect(simularPago()).toBeFalse();
  });

  it("genera un número de intento con fecha y 3 dígitos", () => {
    expect(generarNumeroIntento(new Date("2026-10-28T12:00:00Z"), () => 0.5)).toBe("PAY-20261028-500");
  });
});