import { ARCHIVE_PRODUCTS } from "./data.legacy.js";

const KEYS = {
  products: "ARCHIVE_DB_PRODUCTS",
  users: "ARCHIVE_DB_USERS",
  orders: "ARCHIVE_DB_ORDERS",
  categories: "ARCHIVE_DB_CATEGORIES",
};

export const STOCK_CRITICO = 5;
export const ESTADOS_PEDIDO = ["Pagado", "Enviado", "Entregado", "Anulado"];

const CATEGORIAS_SEMILLA = ["Zapatillas", "Ropa", "Accesorios"];

// Precios de oferta de ejemplo (id de producto -> precio con descuento)
const OFERTAS_SEMILLA = { 2: 159990, 5: 169990, 6: 149990 };

const USUARIOS_SEMILLA = [
  { run: "19011022K", nombre: "Admin", apellidos: "General", correo: "admin@duoc.cl", password: "1234", rol: "Administrador", region: "Metropolitana de Santiago", comuna: "Providencia", direccion: "Av. Providencia 1234" },
  { run: "201448995", nombre: "Vendedor", apellidos: "Turno", correo: "vendedor@duoc.cl", password: "1234", rol: "Vendedor", region: "Metropolitana de Santiago", comuna: "Santiago", direccion: "Calle Falsa 123" },
  { run: "212345678", nombre: "Cliente", apellidos: "Demo", correo: "cliente@gmail.com", password: "1234", rol: "Cliente", region: "Valparaíso", comuna: "Viña del Mar", direccion: "Av. Libertad 456" },
];

// ---------- helpers ----------
export function normalizarCategoria(cat = "") {
  const t = String(cat).trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? null;
  } catch {
    return null;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- inicialización ----------
export function initDB() {
  if (!read(KEYS.products)) {
    const productos = ARCHIVE_PRODUCTS.map((p) => ({
      ...p,
      categoria: normalizarCategoria(p.categoria),
      oferta: OFERTAS_SEMILLA[p.id] ?? null,
    }));
    write(KEYS.products, productos);
  }
  if (!read(KEYS.users)) write(KEYS.users, USUARIOS_SEMILLA);
  if (!read(KEYS.orders)) write(KEYS.orders, []);
  if (!read(KEYS.categories)) write(KEYS.categories, CATEGORIAS_SEMILLA);
}

export function resetDB() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  initDB();
}

// ---------- PRODUCTOS (CRUD) ----------
export function getProducts() {
  return read(KEYS.products) ?? [];
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === Number(id)) ?? null;
}

export function getProductsByCategory(categoria) {
  const c = normalizarCategoria(categoria);
  return getProducts().filter((p) => p.categoria === c);
}

export function getOffers() {
  return getProducts().filter((p) => p.oferta !== null && p.oferta > 0);
}

// Productos con stock menor o igual al umbral, del más crítico al menos crítico
export function getCriticalProducts(umbral = STOCK_CRITICO) {
  return getProducts()
    .filter((p) => p.stock <= umbral)
    .sort((a, b) => a.stock - b.stock);
}

export function createProduct(data) {
  const productos = getProducts();
  if (productos.some((p) => p.codigo === data.codigo)) {
    throw new Error("Ya existe un producto con ese código.");
  }
  const nuevo = {
    descripcion: "",
    tallas: ["Única"],
    stock: 0,
    imagen: "",
    oferta: null,
    ...data,
    categoria: normalizarCategoria(data.categoria),
    id: productos.reduce((max, p) => Math.max(max, p.id), 0) + 1,
  };
  write(KEYS.products, [...productos, nuevo]);
  return nuevo;
}

export function updateProduct(id, cambios) {
  const productos = getProducts();
  const idx = productos.findIndex((p) => p.id === Number(id));
  if (idx === -1) throw new Error("Producto no encontrado.");
  const actualizado = { ...productos[idx], ...cambios, id: productos[idx].id };
  if (cambios.categoria) actualizado.categoria = normalizarCategoria(cambios.categoria);
  productos[idx] = actualizado;
  write(KEYS.products, productos);
  return actualizado;
}

export function deleteProduct(id) {
  const productos = getProducts();
  const filtrados = productos.filter((p) => p.id !== Number(id));
  write(KEYS.products, filtrados);
  return filtrados.length < productos.length;
}

// ---------- CATEGORÍAS (CRUD) ----------
function limpiarNombreCategoria(nombre = "") {
  const n = normalizarCategoria(nombre);
  if (!n) throw new Error("El nombre de la categoría es obligatorio.");
  if (n.length > 30) throw new Error("Máximo 30 caracteres.");
  return n;
}

export function getCategories() {
  return read(KEYS.categories) ?? [];
}

export function createCategory(nombre) {
  const categorias = getCategories();
  const n = limpiarNombreCategoria(nombre);
  if (categorias.includes(n)) throw new Error("Ya existe una categoría con ese nombre.");
  write(KEYS.categories, [...categorias, n]);
  return n;
}

// Renombra la categoría y actualiza los productos que la usan
export function updateCategory(actual, nuevo) {
  const categorias = getCategories();
  const destino = limpiarNombreCategoria(nuevo);
  if (!categorias.includes(actual)) throw new Error("Categoría no encontrada.");
  if (destino !== actual && categorias.includes(destino)) {
    throw new Error("Ya existe una categoría con ese nombre.");
  }
  write(KEYS.categories, categorias.map((c) => (c === actual ? destino : c)));
  write(
    KEYS.products,
    getProducts().map((p) => (p.categoria === actual ? { ...p, categoria: destino } : p))
  );
  return destino;
}

export function deleteCategory(nombre) {
  const enUso = getProducts().filter((p) => p.categoria === nombre).length;
  if (enUso > 0) {
    throw new Error(`No se puede eliminar: ${enUso} producto(s) usan esta categoría.`);
  }
  write(KEYS.categories, getCategories().filter((c) => c !== nombre));
  return true;
}

// ---------- USUARIOS (CRUD + login) ----------
export function getUsers() {
  return read(KEYS.users) ?? [];
}

export function createUser(data) {
  const usuarios = getUsers();
  const correo = data.correo.trim().toLowerCase();
  const run = data.run.trim().toUpperCase();
  if (usuarios.some((u) => u.correo === correo)) throw new Error("El correo ya está registrado.");
  if (usuarios.some((u) => u.run === run)) throw new Error("El RUN ya está registrado.");
  const nuevo = { rol: "Cliente", ...data, correo, run };
  write(KEYS.users, [...usuarios, nuevo]);
  return nuevo;
}

export function updateUser(run, cambios) {
  const usuarios = getUsers();
  const idx = usuarios.findIndex((u) => u.run === run);
  if (idx === -1) throw new Error("Usuario no encontrado.");
  usuarios[idx] = { ...usuarios[idx], ...cambios, run: usuarios[idx].run };
  write(KEYS.users, usuarios);
  return usuarios[idx];
}

export function deleteUser(run) {
  const usuarios = getUsers();
  const filtrados = usuarios.filter((u) => u.run !== run);
  write(KEYS.users, filtrados);
  return filtrados.length < usuarios.length;
}

// Devuelve el usuario (sin password) o null si las credenciales no coinciden
export function authenticate(correo, password) {
  const c = String(correo).trim().toLowerCase();
  const user = getUsers().find((u) => u.correo === c && u.password === password);
  if (!user) return null;
  const publico = { ...user };
  delete publico.password;
  return publico;
}

// ---------- PEDIDOS ----------
// signo = -1 descuenta stock (compra) y +1 lo repone (anulación)
function ajustarStock(items, signo) {
  const productos = getProducts().map((p) => {
    const linea = items.find((i) => i.id === p.id);
    return linea ? { ...p, stock: Math.max(0, p.stock + signo * linea.cantidad) } : p;
  });
  write(KEYS.products, productos);
}

export function getOrders() {
  return read(KEYS.orders) ?? [];
}

export function getOrderById(id) {
  return getOrders().find((p) => p.id === id) ?? null;
}

export function getOrdersByEmail(correo = "") {
  const c = correo.trim().toLowerCase();
  return getOrders().filter((p) => (p.cliente?.correo ?? "").toLowerCase() === c);
}

export function createOrder({ items, total, cliente }) {
  const pedidos = getOrders();
  const pedido = {
    id: `ORD-${String(pedidos.length + 1).padStart(4, "0")}`,
    fecha: new Date().toISOString(),
    items,
    total,
    cliente,
    estado: "Pagado",
  };
  write(KEYS.orders, [...pedidos, pedido]);
  ajustarStock(items, -1);
  return pedido;
}

export function updateOrderStatus(id, estado) {
  if (!ESTADOS_PEDIDO.includes(estado)) throw new Error("Estado no válido.");
  const pedidos = getOrders();
  const idx = pedidos.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Pedido no encontrado.");
  const anterior = pedidos[idx].estado;
  pedidos[idx] = { ...pedidos[idx], estado };
  write(KEYS.orders, pedidos);
  if (estado === "Anulado" && anterior !== "Anulado") ajustarStock(pedidos[idx].items, +1);
  if (anterior === "Anulado" && estado !== "Anulado") ajustarStock(pedidos[idx].items, -1);
  return pedidos[idx];
}