export const MARCAS = ["Visa", "Mastercard", "American Express", "Redcompra"];

// El teléfono es opcional: vacío es válido
export function validarTelefono(t = "") {
  const v = String(t).trim();
  if (!v) return "";
  return /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(v) ? "" : "Formato esperado: +56 9 1234 5678.";
}

// Solo se guardan marca, últimos 4 dígitos, titular y vencimiento (nunca el número completo ni el CVV)
export function validarMetodoPago(d, hoy = new Date()) {
  const e = {};
  if (!MARCAS.includes(d.marca)) e.marca = "Seleccione una marca.";
  if (!/^\d{4}$/.test(String(d.ultimos4 ?? "").trim())) e.ultimos4 = "Ingrese los 4 últimos dígitos.";
  const t = String(d.titular ?? "").trim();
  if (!t) e.titular = "El titular es obligatorio.";
  else if (t.length > 60) e.titular = "Máximo 60 caracteres.";
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(String(d.vence ?? "").trim());
  if (!m) e.vence = "Formato MM/AA.";
  else {
    const anio = 2000 + Number(m[2]);
    const mes = Number(m[1]);
    if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) e.vence = "La tarjeta está vencida.";
  }
  return e;
}
