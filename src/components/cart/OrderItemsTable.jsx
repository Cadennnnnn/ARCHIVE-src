import { formatearPrecio } from "../../utils/formatters.js";

export default function OrderItemsTable({ items }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead className="table-light small text-uppercase">
          <tr><th>Producto</th><th>Precio</th><th>Cant.</th><th className="text-end">Subtotal</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img src={i.imagen} alt={i.nombre} style={{ width: 45, height: 45, objectFit: "contain" }} />
                  <div>
                    <strong className="d-block">{i.nombre}</strong>
                    <small className="text-muted">{i.codigo}</small>
                  </div>
                </div>
              </td>
              <td className="font-monospace">{formatearPrecio(i.precio)}</td>
              <td>{i.cantidad}</td>
              <td className="text-end font-monospace">{formatearPrecio(i.precio * i.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}