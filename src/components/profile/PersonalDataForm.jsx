import { useState } from "react";
import FormField from "../forms/FormField.jsx";
import { validarCorreo, validarNombre } from "../../utils/validaciones.js";
import { validarTelefono } from "../../utils/perfil.js";

// onSave recibe los datos y devuelve un mensaje de error ("" si todo salió bien)
export default function PersonalDataForm({ user, onSave }) {
  const [datos, setDatos] = useState({
    nombre: user.nombre ?? "",
    apellidos: user.apellidos ?? "",
    correo: user.correo ?? "",
    telefono: user.telefono ?? "",
  });
  const [errores, setErrores] = useState({});
  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      nombre: validarNombre(datos.nombre, 50),
      apellidos: validarNombre(datos.apellidos, 100),
      correo: validarCorreo(datos.correo),
      telefono: validarTelefono(datos.telefono),
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;
    const mensaje = onSave(datos);
    if (mensaje) setErrores({ correo: mensaje });
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 560 }}>
      <p className="small text-muted">RUN: {user.run}</p>
      <div className="row g-2">
        <div className="col-md-6"><FormField id="pd-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
        <div className="col-md-6"><FormField id="pd-apellidos" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
      </div>
      <FormField id="pd-correo" label="Correo" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} />
      <FormField id="pd-telefono" label="Teléfono (opcional)" value={datos.telefono} onChange={set("telefono")} error={errores.telefono} placeholder="+56 9 1234 5678" />
      <button type="submit" className="btn btn-archive-primary">Guardar cambios</button>
    </form>
  );
}
