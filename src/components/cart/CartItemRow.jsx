import { formatearPrecio } from "../../utils/formatters.js";

export default function CartItemRow({ item, onChangeQty, onRemove }) {
  return (
    <tr>
      <td className="align-middle">
        <div className="d-flex align-items-center gap-3">
          <img src={item.imagen} alt={item.nombre} style={{ width: 55, height: 55, objectFit: "contain" }} />
          <div>
            <strong className="d-block text-uppercase">{item.nombre}</strong>
            <small className="text-muted">{item.codigo}</small>
          </div>
        </div>
      </td>
      <td className="align-middle font-monospace">{formatearPrecio(item.precio)}</td>
      <td className="align-middle">
        <div className="btn-group btn-group-sm" role="group">
          <button type="button" className="btn btn-outline-dark" aria-label="Disminuir" onClick={() => onChangeQty(item.id, -1)}>-</button>
          <span className="btn btn-outline-dark disabled px-3">{item.cantidad}</span>
          <button type="button" className="btn btn-outline-dark" aria-label="Aumentar" onClick={() => onChangeQty(item.id, 1)}>+</button>
        </div>
      </td>
      <td className="align-middle font-monospace fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
      <td className="align-middle text-end">
        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>Eliminar</button>
      </td>
    </tr>
  );
}