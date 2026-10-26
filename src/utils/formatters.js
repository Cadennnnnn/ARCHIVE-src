export function formatearPrecio(n) {
  return `$${Number(n).toLocaleString("es-CL")}`;
}