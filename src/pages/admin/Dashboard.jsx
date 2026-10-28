import { Link } from "react-router-dom";
import { getCriticalProducts, getOrders, getProducts, getUsers } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const productos = getProducts();
  const pedidos = getOrders();
  const ingresos = pedidos.filter((p) => p.estado !== "Anulado").reduce((acc, p) => acc + p.total, 0);
  const criticos = getCriticalProducts().length;

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Panel de Resumen</h2>
        <p className="text-muted">Métricas en tiempo real desde la base de datos local.</p>
      </section>
      <section className="row g-4">
        <article className="col-sm-6 col-lg-4">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Catálogo Activo</span>
            <h3 className="fw-bold my-2">{productos.length} Productos</h3>
            <Link to="/admin/productos" className="small text-decoration-underline">Administrar catálogo &rarr;</Link>
          </div>
        </article>
        <article className="col-sm-6 col-lg-4">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Productos críticos</span>
            <h3 className={`fw-bold my-2 ${criticos > 0 ? "text-danger" : ""}`}>{criticos} con stock bajo</h3>
            <Link to="/admin/criticos" className="small text-decoration-underline">Ver listado &rarr;</Link>
          </div>
        </article>
        <article className="col-sm-6 col-lg-4">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Órdenes de Compra</span>
            <h3 className="fw-bold my-2">{pedidos.length} Pedidos</h3>
            <Link to="/admin/ordenes" className="small text-decoration-underline">Ver órdenes y boletas &rarr;</Link>
          </div>
        </article>
        <article className="col-sm-6 col-lg-4">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Ingresos</span>
            <h3 className="fw-bold my-2">{formatearPrecio(ingresos)}</h3>
            <small className="text-muted">No incluye órdenes anuladas</small>
          </div>
        </article>
        {esAdmin && (
          <article className="col-sm-6 col-lg-4">
            <div className="border p-3 bg-white h-100">
              <span className="text-muted small text-uppercase">Usuarios Registrados</span>
              <h3 className="fw-bold my-2">{getUsers().length} Cuentas</h3>
              <Link to="/admin/usuarios" className="small text-decoration-underline">Gestionar accesos &rarr;</Link>
            </div>
          </article>
        )}
      </section>
    </>
  );
}