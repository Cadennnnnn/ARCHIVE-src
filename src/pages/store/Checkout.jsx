import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import CHILE_GEO from "../../data/chileGeo.js";
import { createOrder, getProducts } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatearPrecio } from "../../utils/formatters.js";
import { generarNumeroIntento, simularPago } from "../../utils/pago.js";
import { validarStock } from "../../utils/stock.js";
import { validarCorreo, validarNombre, validarObligatorio } from "../../utils/validaciones.js";

// Si hay sesión se precargan los datos; si se reintenta un pago fallido, se reutiliza el borrador
function datosIniciales(user, borrador) {
  return {
    nombre: user?.nombre ?? "",
    apellidos: user?.apellidos ?? "",
    correo: user?.correo ?? "",
    region: user?.region ?? "",
    comuna: user?.comuna ?? "",
    direccion: user?.direccion ?? "",
    departamento: "",
    indicaciones: "",
    entrega: "Despacho a domicilio",
    ...(borrador ?? {}),
  };
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const borrador = useLocation().state?.datos;
  const [datos, setDatos] = useState(() => datosIniciales(user, borrador));
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
      departamento: datos.departamento.length > 20 ? "Máximo 20 caracteres." : "",
      indicaciones: datos.indicaciones.length > 300 ? "Máximo 300 caracteres." : "",
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const problemas = validarStock(items, getProducts());
    if (problemas.length) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: problemas.map((p) => `${p.nombre} (${p.motivo})`).join("; "),
        confirmButtonColor: "#1B2A4A",
        customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
      });
      return;
    }

    if (simularPago()) {
      const pedido = createOrder({ items, total, cliente: datos });
      clearCart();
      navigate("/compra-exitosa", { state: { pedido } });
    } else {
      navigate("/compra-fallida", { state: { intento: { numero: generarNumeroIntento(), items, total, cliente: datos } } });
    }
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4"><h1 className="display-5 fw-bolder">CHECKOUT</h1></section>
      <div className="row g-5">
        <section className="col-lg-7">
          <form className="border p-4 bg-white" onSubmit={handleSubmit} noValidate>
            <h5 className="fw-bold mb-3">Información del cliente</h5>
            <div className="row g-2">
              <div className="col-md-6"><FormField id="ck-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
              <div className="col-md-6"><FormField id="ck-apellidos" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
            </div>
            <FormField id="ck-correo" label="Correo" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} />

            <h5 className="fw-bold mt-4 mb-3">Dirección de entrega</h5>
            <div className="row g-2">
              <div className="col-md-8"><FormField id="ck-dir" label="Calle y número" value={datos.direccion} onChange={set("direccion")} error={errores.direccion} /></div>
              <div className="col-md-4"><FormField id="ck-depto" label="Depto (opcional)" value={datos.departamento} onChange={set("departamento")} error={errores.departamento} placeholder="Ej: 603" /></div>
            </div>
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
            <FormField id="ck-indic" label="Indicaciones para la entrega (opcional)" error={errores.indicaciones}>
              <textarea
                id="ck-indic"
                rows="3"
                className={`form-control rounded-0 ${errores.indicaciones ? "is-invalid" : ""}`}
                value={datos.indicaciones}
                onChange={(e) => set("indicaciones")(e.target.value)}
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
              />
            </FormField>
            <FormField id="ck-entrega" label="Opción de entrega">
              <select id="ck-entrega" className="form-select rounded-0" value={datos.entrega} onChange={(e) => set("entrega")(e.target.value)}>
                <option>Despacho a domicilio</option>
                <option>Retiro en showroom (Providencia)</option>
              </select>
            </FormField>
            <button type="submit" className="btn btn-archive-primary w-100 py-3 mt-2">PAGAR AHORA {formatearPrecio(total)}</button>
          </form>
        </section>

        <section className="col-lg-5">
          <div className="border p-4 bg-white">
            <h4 className="fw-bold border-bottom pb-2 mb-3">TU ORDEN</h4>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td style={{ width: 50 }}><img src={i.imagen} alt={i.nombre} style={{ width: 40, height: 40, objectFit: "contain" }} /></td>
                      <td className="small">{i.nombre} × {i.cantidad}</td>
                      <td className="text-end font-monospace small">{formatearPrecio(i.precio * i.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>TOTAL A PAGAR</span><span className="font-monospace">{formatearPrecio(total)}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}