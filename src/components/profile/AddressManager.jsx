import { useState } from "react";
import FormField from "../forms/FormField.jsx";
import CHILE_GEO from "../../data/chileGeo.js";
import { validarObligatorio } from "../../utils/validaciones.js";

const VACIO = { alias: "", direccion: "", region: "", comuna: "" };

export default function AddressManager({ direcciones, onChange }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const set = (c) => (v) => setDatos((d) => ({ ...d, [c]: v, ...(c === "region" ? { comuna: "" } : {}) }));
  const comunas = CHILE_GEO.find((r) => r.region === datos.region)?.comunas ?? [];

  const agregar = (e) => {
    e.preventDefault();
    const errs = {
      alias: validarObligatorio(datos.alias, 30),
      direccion: validarObligatorio(datos.direccion, 300),
      region: datos.region ? "" : "Seleccione una región.",
      comuna: datos.comuna ? "" : "Seleccione una comuna.",
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    onChange([...direcciones, { id: Date.now(), ...datos, alias: datos.alias.trim(), direccion: datos.direccion.trim() }]);
    setDatos(VACIO);
  };

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <h5 className="fw-bold">Mis direcciones</h5>
        {direcciones.length === 0 ? (
          <p className="text-muted">No tienes direcciones guardadas.</p>
        ) : (
          <ul className="list-group rounded-0">
            {direcciones.map((d) => (
              <li key={d.id} className="list-group-item d-flex justify-content-between align-items-start gap-2">
                <span>
                  <strong>{d.alias}</strong>
                  <small className="d-block text-muted">{`${d.direccion}, ${d.comuna}, ${d.region}`}</small>
                </span>
                <button className="btn btn-sm btn-outline-danger" aria-label={`Eliminar dirección ${d.alias}`} onClick={() => onChange(direcciones.filter((x) => x.id !== d.id))}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-lg-6">
        <h5 className="fw-bold">Agregar dirección</h5>
        <form onSubmit={agregar} noValidate>
          <FormField id="ad-alias" label="Nombre (Casa, Trabajo...)" value={datos.alias} onChange={set("alias")} error={errores.alias} />
          <FormField id="ad-dir" label="Calle y número" value={datos.direccion} onChange={set("direccion")} error={errores.direccion} />
          <FormField id="ad-region" label="Región" error={errores.region}>
            <select id="ad-region" className={`form-select rounded-0 ${errores.region ? "is-invalid" : ""}`} value={datos.region} onChange={(e) => set("region")(e.target.value)}>
              <option value="">-- Seleccione la región --</option>
              {CHILE_GEO.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
            </select>
          </FormField>
          <FormField id="ad-comuna" label="Comuna" error={errores.comuna}>
            <select id="ad-comuna" className={`form-select rounded-0 ${errores.comuna ? "is-invalid" : ""}`} value={datos.comuna} onChange={(e) => set("comuna")(e.target.value)}>
              <option value="">-- Seleccione la comuna --</option>
              {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <button type="submit" className="btn btn-archive-primary">Agregar dirección</button>
        </form>
      </div>
    </div>
  );
}
