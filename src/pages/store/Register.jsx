import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import CHILE_GEO from "../../data/chileGeo.js";
import { createUser } from "../../data/db.js";
import { validarRegistro } from "../../utils/validaciones.js";

const INICIAL = { run: "", nombre: "", apellidos: "", correo: "", password: "", password2: "", region: "", comuna: "", direccion: "" };

export default function Register() {
  const [datos, setDatos] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor, ...(campo === "region" ? { comuna: "" } : {}) }));
  const comunas = CHILE_GEO.find((r) => r.region === datos.region)?.comunas ?? [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validarRegistro(datos);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    try {
      // eslint-disable-next-line no-unused-vars
      const { password2, ...usuario } = datos;
      const nuevo = createUser({ ...usuario, rol: "Cliente" });
      Swal.fire({
        title: "¡REGISTRO EXITOSO!",
        text: `Bienvenido/a ${nuevo.nombre}. Ya puedes iniciar sesión.`,
        icon: "success",
        confirmButtonColor: "#1B2A4A",
        confirmButtonText: "INGRESAR",
        customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
      }).then(() => navigate("/login"));
    } catch (err) {
      setErrores({ correo: err.message });
    }
  };

  return (
    <main className="container my-5 flex-grow-1">
      <div className="row justify-content-center">
        <section className="col-md-8 col-lg-6">
          <div className="border p-4 p-md-5 bg-white">
            <h2 className="mb-4 text-center fw-bold">REGISTRO DE USUARIO</h2>
            <form onSubmit={handleSubmit} noValidate>
              <FormField id="reg-run" label="RUN (sin puntos ni guion)" value={datos.run} onChange={set("run")} error={errores.run} placeholder="Ej: 19011022K" />
              <div className="row g-2">
                <div className="col-md-6"><FormField id="reg-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
                <div className="col-md-6"><FormField id="reg-apellidos" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
              </div>
              <FormField id="reg-correo" label="Correo Electrónico" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} placeholder="@duoc.cl / @profesor.duoc.cl / @gmail.com" />
              <div className="row g-2">
                <div className="col-md-6"><FormField id="reg-pass" label="Contraseña (4-10)" type="password" value={datos.password} onChange={set("password")} error={errores.password} /></div>
                <div className="col-md-6"><FormField id="reg-pass2" label="Confirmar Contraseña" type="password" value={datos.password2} onChange={set("password2")} error={errores.password2} /></div>
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <FormField id="reg-region" label="Región" error={errores.region}>
                    <select id="reg-region" className={`form-select rounded-0 ${errores.region ? "is-invalid" : ""}`} value={datos.region} onChange={(e) => set("region")(e.target.value)}>
                      <option value="">-- Seleccione la región --</option>
                      {CHILE_GEO.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
                    </select>
                  </FormField>
                </div>
                <div className="col-md-6">
                  <FormField id="reg-comuna" label="Comuna" error={errores.comuna}>
                    <select id="reg-comuna" className={`form-select rounded-0 ${errores.comuna ? "is-invalid" : ""}`} value={datos.comuna} onChange={(e) => set("comuna")(e.target.value)}>
                      <option value="">-- Seleccione la comuna --</option>
                      {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormField>
                </div>
              </div>
              <FormField id="reg-dir" label="Dirección" value={datos.direccion} onChange={set("direccion")} error={errores.direccion} placeholder="Calle, Número, Depto" />
              <button type="submit" className="btn btn-archive-primary w-100 py-3 mt-2">REGISTRAR CUENTA</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}