import { Link } from "react-router-dom";
import { getOrders, getProducts, getUsers } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";

export default function Dashboard() {
  const { esAdmin } = useAuth();
  const productos = getProducts();
  const pedidos = getOrders();
  const ingresos = pedidos.reduce((acc, p) => acc + p.total, 0);

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Panel de Resumen</h2>
        <p className="text-muted">Métricas en tiempo real desde la base de datos local.</p>
      </section>
      <section className="row g-4">
        <article className="col-md-3">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Catálogo Activo</span>
            <h3 className="fw-bold my-2">{productos.length} Productos</h3>
            <Link to="/admin/productos" className="small text-decoration-underline">Administrar catálogo &rarr;</Link>
          </div>
        </article>
        {esAdmin && (
          <article className="col-md-3">
            <div className="border p-3 bg-white h-100">
              <span className="text-muted small text-uppercase">Usuarios Registrados</span>
              <h3 className="fw-bold my-2">{getUsers().length} Cuentas</h3>
              <Link to="/admin/usuarios" className="small text-decoration-underline">Gestionar accesos &rarr;</Link>
            </div>
          </article>
        )}
        <article className="col-md-3">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Órdenes de Compra</span>
            <h3 className="fw-bold my-2">{pedidos.length} Pedidos</h3>
          </div>
        </article>
        <article className="col-md-3">
          <div className="border p-3 bg-white h-100">
            <span className="text-muted small text-uppercase">Ingresos</span>
            <h3 className="fw-bold my-2">{formatearPrecio(ingresos)}</h3>
          </div>
        </article>
      </section>
    </>
  );
}