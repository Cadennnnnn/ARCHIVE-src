export const PROBABILIDAD_EXITO = 0.85;

// El generador de azar se recibe por parámetro para poder simularlo en las pruebas
export function simularPago(azar = Math.random) {
  return azar() < PROBABILIDAD_EXITO;
}

export function generarNumeroIntento(fecha = new Date(), azar = Math.random) {
  const f = fecha.toISOString().slice(0, 10).replace(/-/g, "");
  const n = String(Math.floor(azar() * 1000)).padStart(3, "0");
  return `PAY-${f}-${n}`;
}