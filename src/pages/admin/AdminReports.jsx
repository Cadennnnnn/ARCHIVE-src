import { getOrders, getProducts } from "../../data/db.js";
import { calcularInventario, calcularReporte } from "../../utils/reportes.js";
import { formatearPrecio } from "../../utils/formatters.js";

function Tarjeta({ titulo, valor }) {
  return (
    <article className="col-sm-6 col-lg-3">
      <div className="border p-3 bg-white h-100">
        <span className="text-muted small text-uppercase">{titulo}</span>
        <h3 className="fw-bold my-2">{valor}</h3>
      </div>
    </article>
  );
}

export default function AdminReports() {
  const productos = getProducts();
  const r = calcularReporte(getOrders(), productos);
  const inv = calcularInventario(productos);

  return (
    <>
      <section className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h2>Reportes</h2>
          <p className="text-muted mb-0">Ventas e inventario. Las órdenes anuladas no se consideran en las ventas.</p>
        </div>
        <button className="btn btn-archive-outline no-print" onClick={() => window.print()}>Imprimir reportes</button>
      </section>

      <h4 className="mb-3">Reporte de ventas</h4>
      <section className="row g-4 mb-4">
        <Tarjeta titulo="Pedidos" valor={r.totalPedidos} />
        <Tarjeta titulo="Ingresos" valor={formatearPrecio(r.ingresos)} />
        <Tarjeta titulo="Unidades vendidas" valor={r.unidades} />
        <Tarjeta titulo="Ticket promedio" valor={formatearPrecio(r.ticketPromedio)} />
      </section>

      <section className="row g-4 mb-5">
        <article className="col-lg-4">
          <div className="border p-4 bg-white h-100">
            <h5 className="mb-3">Ventas por categoría</h5>
            {r.porCategoria.length === 0 ? (
              <p className="text-muted mb-0">Sin ventas registradas.</p>
            ) : (
              <table className="table table-sm mb-0">
                <tbody>
                  {r.porCategoria.map((c) => (
                    <tr key={c.categoria}><td>{c.categoria}</td><td className="text-end font-monospace">{formatearPrecio(c.monto)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
        <article className="col-lg-4">
          <div className="border p-4 bg-white h-100">
            <h5 className="mb-3">Top productos</h5>
            {r.topProductos.length === 0 ? (
              <p className="text-muted mb-0">Sin ventas registradas.</p>
            ) : (
              <table className="table table-sm mb-0">
                <thead className="small text-uppercase"><tr><th>Producto</th><th className="text-end">Unid.</th></tr></thead>
                <tbody>
                  {r.topProductos.map((p) => (
                    <tr key={p.id}><td>{p.nombre}</td><td className="text-end">{p.unidades}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
        <article className="col-lg-4">
          <div className="border p-4 bg-white h-100">
            <h5 className="mb-3">Pedidos por estado</h5>
            {Object.keys(r.porEstado).length === 0 ? (
              <p className="text-muted mb-0">Sin pedidos registrados.</p>
            ) : (
              <table className="table table-sm mb-0">
                <tbody>
                  {Object.entries(r.porEstado).map(([estado, n]) => (
                    <tr key={estado}><td>{estado}</td><td className="text-end">{n}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
      </section>

      <h4 className="mb-3">Reporte de inventario</h4>
      <section className="row g-4 mb-4">
        <Tarjeta titulo="Productos" valor={inv.totalProductos} />
        <Tarjeta titulo="Unidades en stock" valor={inv.unidades} />
        <Tarjeta titulo="Valor del inventario" valor={formatearPrecio(inv.valorStock)} />
        <Tarjeta titulo="Críticos / agotados" valor={`${inv.criticos} / ${inv.agotados}`} />
      </section>
      <div className="border p-4 bg-white">
        <h5 className="mb-3">Inventario por categoría</h5>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr><th>Categoría</th><th>Productos</th><th>Unidades</th><th className="text-end">Valor</th></tr>
            </thead>
            <tbody>
              {inv.porCategoria.map((c) => (
                <tr key={c.categoria}>
                  <td>{c.categoria}</td><td>{c.productos}</td><td>{c.unidades}</td>
                  <td className="text-end font-monospace">{formatearPrecio(c.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}