import { formatearPrecio } from "../../utils/formatters.js";

export default function CartItemRow({ item, stock, onChangeQty, onRemove }) {
  const conStock = typeof stock === "number";
  const enTope = conStock && item.cantidad >= stock;

  return (
    <tr>
      <td className="align-middle">
        <div className="d-flex align-items-center gap-3">
          <img src={item.imagen} alt={item.nombre} style={{ width: 55, height: 55, objectFit: "contain" }} />
          <div>
            <strong className="d-block text-uppercase">{item.nombre}</strong>
            <small className="text-muted d-block">{item.codigo}</small>
            {conStock && <small className={enTope ? "text-danger" : "text-muted"}>Stock disponible: {stock}</small>}
          </div>
        </div>
      </td>
      <td className="align-middle font-monospace">{formatearPrecio(item.precio)}</td>
      <td className="align-middle">
        <div className="btn-group btn-group-sm" role="group">
          <button type="button" className="btn btn-outline-dark" aria-label="Disminuir" onClick={() => onChangeQty(item.id, -1)}>-</button>
          <span className="btn btn-outline-dark disabled px-3">{item.cantidad}</span>
          <button
            type="button"
            className="btn btn-outline-dark"
            aria-label="Aumentar"
            disabled={enTope}
            title={enTope ? "Alcanzaste el stock disponible" : ""}
            onClick={() => onChangeQty(item.id, 1)}
          >
            +
          </button>
        </div>
      </td>
      <td className="align-middle font-monospace fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
      <td className="align-middle text-end">
        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>Eliminar</button>
      </td>
    </tr>
  );
}