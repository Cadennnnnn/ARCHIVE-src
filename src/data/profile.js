import { getUsers, updateUser } from "./db.js";

const ORDERS_KEY = "ARCHIVE_DB_ORDERS";

function leerPedidos() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

// Actualiza los datos personales; si cambia el correo, el historial de pedidos pasa al correo nuevo
export function actualizarPerfil(run, { nombre, apellidos, correo, telefono }) {
  const usuarios = getUsers();
  const actual = usuarios.find((u) => u.run === run);
  if (!actual) throw new Error("Usuario no encontrado.");
  const nuevoCorreo = correo.trim().toLowerCase();
  if (usuarios.some((u) => u.run !== run && u.correo === nuevoCorreo)) throw new Error("Ese correo ya está en uso.");

  updateUser(run, { nombre: nombre.trim(), apellidos: apellidos.trim(), correo: nuevoCorreo, telefono: telefono.trim() });

  if (nuevoCorreo !== actual.correo) {
    const migrados = leerPedidos().map((p) =>
      (p.cliente?.correo ?? "").toLowerCase() === actual.correo ? { ...p, cliente: { ...p.cliente, correo: nuevoCorreo } } : p
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(migrados));
  }
}

export function guardarDirecciones(run, direcciones) {
  updateUser(run, { direcciones });
}

export function guardarMetodosPago(run, metodosPago) {
  updateUser(run, { metodosPago });
}
