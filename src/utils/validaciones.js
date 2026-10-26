export const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export function validarRun(run = "") {
  const v = run.trim().toUpperCase();
  if (!v) return "El RUN es obligatorio.";
  if (!/^[0-9]{7,8}[0-9K]$/.test(v)) return "RUN inválido: 7 a 9 caracteres, sin puntos ni guion (ej: 19011022K).";
  return "";
}

export function validarNombre(nombre = "", max = 50) {
  const v = nombre.trim();
  if (!v) return "Este campo es obligatorio.";
  if (v.length > max) return `Máximo ${max} caracteres.`;
  return "";
}

export function validarCorreo(correo = "") {
  const v = correo.trim().toLowerCase();
  if (!v) return "El correo es obligatorio.";
  if (v.length > 100) return "Máximo 100 caracteres.";
  if (!DOMINIOS_PERMITIDOS.some((d) => v.endsWith(d))) {
    return "Solo se aceptan @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

export function validarPassword(pass = "") {
  if (!pass) return "La contraseña es obligatoria.";
  if (pass.length < 4 || pass.length > 10) return "Debe tener entre 4 y 10 caracteres.";
  return "";
}

export function validarConfirmacion(pass = "", pass2 = "") {
  if (!pass2) return "Debe confirmar la contraseña.";
  if (pass !== pass2) return "Las contraseñas no coinciden.";
  return "";
}

export function validarObligatorio(valor = "", max = 300) {
  const v = String(valor).trim();
  if (!v) return "Este campo es obligatorio.";
  if (v.length > max) return `Máximo ${max} caracteres.`;
  return "";
}

export function validarCodigoProducto(codigo = "") {
  if (!codigo.trim()) return "El código es obligatorio.";
  if (!/^[A-Z]{3}-\d{3}$/.test(codigo.trim().toUpperCase())) return "Formato esperado: ABC-123.";
  return "";
}

export function validarPrecio(precio) {
  const n = Number(precio);
  if (!Number.isInteger(n) || n <= 0) return "Ingrese un precio entero mayor a 0.";
  return "";
}

// Valida el formulario de registro completo y devuelve { campo: mensaje }
export function validarRegistro(d) {
  const errores = {
    run: validarRun(d.run),
    nombre: validarNombre(d.nombre, 50),
    apellidos: validarNombre(d.apellidos, 100),
    correo: validarCorreo(d.correo),
    password: validarPassword(d.password),
    password2: validarConfirmacion(d.password, d.password2),
    region: d.region ? "" : "Seleccione una región.",
    comuna: d.comuna ? "" : "Seleccione una comuna.",
    direccion: validarObligatorio(d.direccion, 300),
  };
  Object.keys(errores).forEach((k) => errores[k] === "" && delete errores[k]);
  return errores;
}