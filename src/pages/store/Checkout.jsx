import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormField.jsx";
import CHILE_GEO from "../../data/chileGeo.js";
import { createOrder } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";
import { validarCorreo, validarNombre, validarObligatorio } from "../../utils/validaciones.js";

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: user?.nombre ?? "",
    apellidos: user?.apellidos ?? "",
    correo: user?.correo ?? "",
    region: user?.region ?? "",
    comuna: user?.comuna ?? "",
    direccion: user?.direccion ?? "",
    entrega: "Despacho a domicilio",
  });
  const [errores, setErrores] = useState({});

  if (items.length === 0) return <Navigate to="/carrito" replace />;

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor, ...(campo === "region" ? { comuna: "" } : {}) }));
  const comunas = CHILE_GEO.find((r) => r.region === datos.region)?.comunas ?? [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      nombre: validarNombre(datos.nombre, 50),
      apellidos: validarNombre(datos.apellidos, 100),
      correo: validarCorreo(datos.correo),
      region: datos.region ? "" : "Seleccione una región.",
      comuna: datos.comuna ? "" : "Seleccione una comuna.",
      direccion: validarObligatorio(datos.direccion, 300),
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const pagoExitoso = Math.random() < 0.85; // pago simulado
    if (pagoExitoso) {
      const pedido = createOrder({ items, total, cliente: datos });
      clearCart();
      navigate("/compra-exitosa", { state: { pedido } });
    } else {
      navigate("/compra-fallida");
    }
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4"><h1 className="display-5 fw-bolder">CHECKOUT</h1></section>
      <div className="row g-5">
        <section className="col-lg-7">
          <form className="border p-4 bg-white" onSubmit={handleSubmit} noValidate>
            <div className="row g-2">
              <div className="col-md-6"><FormField id="ck-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
              <div className="col-md-6"><FormField id="ck-apellidos" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
            </div>
            <FormField id="ck-correo" label="Correo" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} />
            <div className="row g-2">
              <div className="col-md-6">
                <FormField id="ck-region" label="Región" error={errores.region}>
                  <select id="ck-region" className={`form-select rounded-0 ${errores.region ? "is-invalid" : ""}`} value={datos.region} onChange={(e) => set("region")(e.target.value)}>
                    <option value="">-- Seleccione la región --</option>
                    {CHILE_GEO.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="col-md-6">
                <FormField id="ck-comuna" label="Comuna" error={errores.comuna}>
                  <select id="ck-comuna" className={`form-select rounded-0 ${errores.comuna ? "is-invalid" : ""}`} value={datos.comuna} onChange={(e) => set("comuna")(e.target.value)}>
                    <option value="">-- Seleccione la comuna --</option>
                    {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
            </div>
            <FormField id="ck-dir" label="Dirección de envío" value={datos.direccion} onChange={set("direccion")} error={errores.direccion} />
            <FormField id="ck-entrega" label="Opción de entrega">
              <select id="ck-entrega" className="form-select rounded-0" value={datos.entrega} onChange={(e) => set("entrega")(e.target.value)}>
                <option>Despacho a domicilio</option>
                <option>Retiro en showroom (Providencia)</option>
              </select>
            </FormField>
            <button type="submit" className="btn btn-archive-primary w-100 py-3 mt-2">PAGAR {formatearPrecio(total)}</button>
          </form>
        </section>
        <section className="col-lg-5">
          <div className="border p-4 bg-white">
            <h4 className="fw-bold border-bottom pb-2 mb-3">TU ORDEN</h4>
            {items.map((i) => (
              <div key={i.id} className="d-flex justify-content-between small mb-2">
                <span>{i.nombre} × {i.cantidad}</span>
                <span className="font-monospace">{formatearPrecio(i.precio * i.cantidad)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>TOTAL</span><span className="font-monospace">{formatearPrecio(total)}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}