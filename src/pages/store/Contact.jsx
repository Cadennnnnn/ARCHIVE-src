import { useState } from "react";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { validarCorreo, validarNombre, validarObligatorio } from "../../utils/validaciones.js";

const INICIAL = { nombre: "", correo: "", mensaje: "" };

export default function Contact() {
  const [datos, setDatos] = useState(INICIAL);
  const [errores, setErrores] = useState({});

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      nombre: validarNombre(datos.nombre, 100),
      correo: validarCorreo(datos.correo),
      mensaje: validarObligatorio(datos.mensaje, 500),
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    Swal.fire({
      title: "MENSAJE ENVIADO",
      text: "Tu consulta fue recibida en ARCHIVE[src]. Te responderemos a la brevedad.",
      icon: "success",
      confirmButtonColor: "#1B2A4A",
      confirmButtonText: "ENTENDIDO",
      customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" },
    }).then(() => setDatos(INICIAL));
  };

  return (
    <main className="container my-5 flex-grow-1 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <section className="col-md-8 col-lg-6 text-center">
          <span className="brand-logo fs-2 d-block mb-3">ARCHIVE[src]</span>
          <div className="border p-4 p-md-5 bg-white text-start">
            <h4 className="mb-4 text-center fw-bold">FORMULARIO DE CONTACTO</h4>
            <form onSubmit={handleSubmit} noValidate>
              <FormField id="cont-nombre" label="Nombre Completo" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} placeholder="Nombre completo" />
              <FormField id="cont-correo" label="Correo Electrónico" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} placeholder="@duoc.cl / @profesor.duoc.cl / @gmail.com" />
              <FormField id="cont-mensaje" label="Contenido del Mensaje" error={errores.mensaje}>
                <textarea
                  id="cont-mensaje"
                  rows="5"
                  className={`form-control rounded-0 ${errores.mensaje ? "is-invalid" : ""}`}
                  value={datos.mensaje}
                  onChange={(e) => set("mensaje")(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </FormField>
              <button type="submit" className="btn btn-archive-primary w-100 py-3 mt-2">ENVIAR MENSAJE</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}