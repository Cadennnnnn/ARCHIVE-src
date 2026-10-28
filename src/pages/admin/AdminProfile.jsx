import { useState } from "react";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUser } from "../../data/db.js";
import { validarNombre, validarObligatorio, validarPassword } from "../../utils/validaciones.js";

export default function AdminProfile() {
  const { user, actualizarSesion } = useAuth();
  const [datos, setDatos] = useState({
    nombre: user.nombre,
    apellidos: user.apellidos,
    direccion: user.direccion ?? "",
    password: "",
  });
  const [errores, setErrores] = useState({});

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      nombre: validarNombre(datos.nombre, 50),
      apellidos: validarNombre(datos.apellidos, 100),
      direccion: validarObligatorio(datos.direccion, 300),
      password: datos.password ? validarPassword(datos.password) : "",
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const cambios = { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), direccion: datos.direccion.trim() };
    updateUser(user.run, datos.password ? { ...cambios, password: datos.password } : cambios);
    actualizarSesion(cambios);
    setDatos((d) => ({ ...d, password: "" }));
    Swal.fire({ icon: "success", title: "Perfil actualizado", timer: 1300, showConfirmButton: false, customClass: { popup: "rounded-0" } });
  };

  return (
    <>
      <section className="border-bottom pb-3 mb-4">
        <h2>Mi perfil</h2>
        <p className="text-muted">RUN, correo y rol no se pueden modificar desde aquí.</p>
      </section>
      <div className="border p-4 bg-white" style={{ maxWidth: 560 }}>
        <p className="mb-1"><strong>RUN:</strong> {user.run}</p>
        <p className="mb-1"><strong>Correo:</strong> {user.correo}</p>
        <p className="mb-4"><strong>Rol:</strong> <span className="badge bg-dark">{user.rol}</span></p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-2">
            <div className="col-md-6"><FormField id="pf-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
            <div className="col-md-6"><FormField id="pf-apellidos" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
          </div>
          <FormField id="pf-dir" label="Dirección" value={datos.direccion} onChange={set("direccion")} error={errores.direccion} />
          <FormField id="pf-pass" label="Nueva contraseña (opcional)" type="password" value={datos.password} onChange={set("password")} error={errores.password} />
          <button type="submit" className="btn btn-archive-primary w-100">Guardar cambios</button>
        </form>
      </div>
    </>
  );
}