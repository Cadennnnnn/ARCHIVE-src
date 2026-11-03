import { useState } from "react";
import FormField from "../forms/FormField.jsx";
import { MARCAS, validarMetodoPago } from "../../utils/perfil.js";

const VACIO = { marca: "", ultimos4: "", titular: "", vence: "" };

export default function PaymentMethods({ metodos, onChange }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const set = (c) => (v) => setDatos((d) => ({ ...d, [c]: v }));

  const agregar = (e) => {
    e.preventDefault();
    const errs = validarMetodoPago(datos);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    onChange([
      ...metodos,
      { id: Date.now(), marca: datos.marca, ultimos4: datos.ultimos4.trim(), titular: datos.titular.trim(), vence: datos.vence.trim() },
    ]);
    setDatos(VACIO);
  };

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <h5 className="fw-bold">Métodos de pago guardados</h5>
        {metodos.length === 0 ? (
          <p className="text-muted">No tienes métodos de pago guardados.</p>
        ) : (
          <ul className="list-group rounded-0">
            {metodos.map((m) => (
              <li key={m.id} className="list-group-item d-flex justify-content-between align-items-start gap-2">
                <span>
                  <strong>{`${m.marca} •••• ${m.ultimos4}`}</strong>
                  <small className="d-block text-muted">{`${m.titular} · vence ${m.vence}`}</small>
                </span>
                <button className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${m.marca} ${m.ultimos4}`} onClick={() => onChange(metodos.filter((x) => x.id !== m.id))}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <small className="text-muted d-block mt-2">Solo guardamos la marca y los últimos 4 dígitos; nunca el número completo ni el CVV.</small>
      </div>
      <div className="col-lg-6">
        <h5 className="fw-bold">Agregar método de pago</h5>
        <form onSubmit={agregar} noValidate>
          <FormField id="pm-marca" label="Marca" error={errores.marca}>
            <select id="pm-marca" className={`form-select rounded-0 ${errores.marca ? "is-invalid" : ""}`} value={datos.marca} onChange={(e) => set("marca")(e.target.value)}>
              <option value="">-- Seleccione --</option>
              {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormField>
          <FormField id="pm-ultimos" label="Últimos 4 dígitos" value={datos.ultimos4} onChange={set("ultimos4")} error={errores.ultimos4} maxLength={4} />
          <FormField id="pm-titular" label="Titular" value={datos.titular} onChange={set("titular")} error={errores.titular} />
          <FormField id="pm-vence" label="Vencimiento (MM/AA)" value={datos.vence} onChange={set("vence")} error={errores.vence} placeholder="12/28" />
          <button type="submit" className="btn btn-archive-primary">Agregar método</button>
        </form>
      </div>
    </div>
  );
}
