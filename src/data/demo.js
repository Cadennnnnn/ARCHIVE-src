import { getOrders, getProducts } from "./db.js";

const ORDERS_KEY = "ARCHIVE_DB_ORDERS";
const DEMO_KEY = "ARCHIVE_DB_DEMO";
const DIA_MS = 24 * 60 * 60 * 1000;

const CLIENTES = {
  demo: { nombre: "Cliente", apellidos: "Demo", correo: "cliente@gmail.com", region: "Valparaíso", comuna: "Viña del Mar", direccion: "Av. Libertad 456", departamento: "", indicaciones: "", entrega: "Despacho a domicilio" },
  maria: { nombre: "María", apellidos: "González Pérez", correo: "maria.gonzalez@gmail.com", region: "Metropolitana de Santiago", comuna: "Providencia", direccion: "Los Leones 2450", departamento: "603", indicaciones: "Dejar con el conserje", entrega: "Despacho a domicilio" },
  pedro: { nombre: "Pedro", apellidos: "Hacker Rojas", correo: "pedro.hacker@duoc.cl", region: "Metropolitana de Santiago", comuna: "Ñuñoa", direccion: "Los Crisantemos 1234", departamento: "Edificio Norte", indicaciones: "El martes no estaremos, dejar con el conserje", entrega: "Despacho a domicilio" },
  camila: { nombre: "Camila", apellidos: "Soto Vera", correo: "camila.soto@gmail.com", region: "Biobío", comuna: "Concepción", direccion: "Barros Arana 780", departamento: "", indicaciones: "", entrega: "Retiro en showroom (Providencia)" },
};

// dias = antigüedad; lineas = [id de producto, cantidad]
const PEDIDOS_DEMO = [
  { dias: 21, estado: "Entregado", cliente: CLIENTES.maria, lineas: [[2, 1], [3, 2]] },
  { dias: 15, estado: "Entregado", cliente: CLIENTES.demo, lineas: [[1, 1]] },
  { dias: 10, estado: "Entregado", cliente: CLIENTES.pedro, lineas: [[4, 1], [8, 1]] },
  { dias: 6, estado: "Enviado", cliente: CLIENTES.camila, lineas: [[7, 1]] },
  { dias: 3, estado: "Pagado", cliente: CLIENTES.demo, lineas: [[5, 1], [6, 1]] },
  { dias: 2, estado: "Anulado", cliente: CLIENTES.maria, lineas: [[8, 2]] },
  { dias: 1, estado: "Pagado", cliente: CLIENTES.pedro, lineas: [[3, 3]] },
];

// Agrega las órdenes de ejemplo una sola vez (no modifica el stock). Devuelve true si las cargó.
export function sembrarPedidosDemo() {
  if (localStorage.getItem(DEMO_KEY)) return false;
  const productos = getProducts();
  const existentes = getOrders();
  const nuevos = [];

  PEDIDOS_DEMO.forEach((d) => {
    const items = d.lineas
      .map(([id, cantidad]) => {
        const p = productos.find((x) => x.id === id);
        return p && { id: p.id, codigo: p.codigo, nombre: p.nombre, precio: p.oferta ?? p.precio, imagen: p.imagen, cantidad };
      })
      .filter(Boolean);
    if (items.length === 0) return;
    nuevos.push({
      id: `ORD-${String(existentes.length + nuevos.length + 1).padStart(4, "0")}`,
      fecha: new Date(Date.now() - d.dias * DIA_MS).toISOString(),
      items,
      total: items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      cliente: d.cliente,
      estado: d.estado,
    });
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify([...existentes, ...nuevos]));
  localStorage.setItem(DEMO_KEY, "1");
  return true;
}