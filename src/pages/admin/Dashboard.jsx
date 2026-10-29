import { Link } from "react-router-dom";
import { getCriticalProducts, getOrders, getProducts, getUsers } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";

const ACCESOS = [
  { to: "/admin", titulo: "Dashboard", texto: "Visión general de las métricas y estadísticas clave del sistema." },
  { to: "/admin/ordenes", titulo: "Órdenes", texto: "Gestión y seguimiento de las órdenes de compra realizadas." },
  { to: "/admin/productos", titulo: "Productos", texto: "Administrar inventario y detalles de los productos disponibles." },
  { to: "/admin/categorias", titulo: "Categorías", texto: "Organizar productos en categorías para facilitar su navegación." },
  { to: "/admin/usuarios", titulo: "Usuarios", texto: "Gestión de cuentas de usuario y sus roles dentro del sistema.", soloAdmin: true },
  { to: "/admin/reportes", titulo: "Reportes", texto: "Generación de informes detallados sobre las operaciones del sistema." },
  { to: "/admin/perfil", titulo: "Perfil", texto: "Administración de la información personal y configuración de cuenta." },
  { to: "/", titulo: "Tienda", texto: "Visualiza tu tienda en tiempo real y revisa el catálogo público." },
];

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const productos = getProducts();
  const pedidos = getOrders();
  const ingresos = pedidos.filter((p) => p.estado !== "Anulado").reduce((acc, p) => acc + p.total, 0);
  const unidades = productos.reduce((acc, p) => acc + p.stock, 0);
  const criticos = getCriticalProducts().length;
  const accesos = ACCESOS.filter((a) => !a.soloAdmin || esAdmin);

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Panel de Resumen</h2>
        <p className="text-muted mb-0">Resumen de las actividades diarias, calculado en tiempo real.</p>
      </section>

      <section className="row g-4 mb-4">
        <article className="col-md-4">
          <div className="p-3 text-white bg-primary h-100">
            <span className="small text-uppercase">Compras</span>
            <h3 data-testid="kpi-compras" className="fw-bold my-1">{pedidos.length}</h3>
            <small>Ingresos: {formatearPrecio(ingresos)}</small>
          </div>
        </article>
        <article className="col-md-4">
          <div className="p-3 text-white bg-success h-100">
            <span className="small text-uppercase">Productos</span>
            <h3 className="fw-bold my-1">{productos.length}</h3>
            <small>Inventario actual: {unidades} unidades</small>
          </div>
        </article>
        <article className="col-md-4">
          {esAdmin ? (
            <div className="p-3 bg-warning h-100">
              <span className="small text-uppercase">Usuarios</span>
              <h3 className="fw-bold my-1">{getUsers().length}</h3>
              <small>Cuentas registradas en el sistema</small>
            </div>
          ) : (
            <div className="p-3 bg-warning h-100">
              <span className="small text-uppercase">Productos críticos</span>
              <h3 className="fw-bold my-1">{criticos}</h3>
              <small>Con stock bajo el umbral</small>
            </div>
          )}
        </article>
      </section>

      {criticos > 0 && (
        <div className="alert alert-warning rounded-0 d-flex justify-content-between align-items-center">
          <span>{criticos} producto(s) con stock crítico.</span>
          <Link to="/admin/criticos" className="fw-bold text-decoration-underline">Ver listado</Link>
        </div>
      )}

      <section className="row g-4">
        {accesos.map((a) => (
          <article className="col-sm-6 col-lg-3" key={a.titulo}>
            <Link to={a.to} data-acceso={a.titulo} className="border bg-white p-3 d-block h-100 text-center">
              <h5 className="fw-bold">{a.titulo}</h5>
              <small className="text-muted">{a.texto}</small>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}