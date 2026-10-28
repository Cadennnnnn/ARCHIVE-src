import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { createUser, deleteUser, getUsers, updateUser } from "../../data/db.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { validarCorreo, validarNombre, validarPassword, validarRun } from "../../utils/validaciones.js";

const VACIO = { run: "", nombre: "", apellidos: "", correo: "", password: "", rol: "Cliente" };

export default function AdminUsers() {
  const { user: actual } = useAuth();
  const [usuarios, setUsuarios] = useState(getUsers);
  const [datos, setDatos] = useState(VACIO);
  const [editandoRun, setEditandoRun] = useState(null);
  const [errores, setErrores] = useState({});

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));
  const refrescar = () => setUsuarios(getUsers());

  const limpiar = () => {
    setDatos(VACIO);
    setEditandoRun(null);
    setErrores({});
  };

  const handleEdit = (u) => {
    setEditandoRun(u.run);
    setDatos({ run: u.run, nombre: u.nombre, apellidos: u.apellidos, correo: u.correo, password: "", rol: u.rol });
    setErrores({});
  };

  const handleDelete = async (u) => {
    if (u.run === actual.run) {
      Swal.fire({ icon: "info", title: "No puedes eliminar tu propia cuenta", customClass: { popup: "rounded-0" } });
      return;
    }
    const r = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: u.correo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B2A4A",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-0 border border-dark" },
    });
    if (r.isConfirmed) {
      deleteUser(u.run);
      refrescar();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      run: editandoRun ? "" : validarRun(datos.run),
      nombre: validarNombre(datos.nombre, 50),
      apellidos: validarNombre(datos.apellidos, 100),
      correo: validarCorreo(datos.correo),
      password: editandoRun && !datos.password ? "" : validarPassword(datos.password),
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    try {
      if (editandoRun) {
        const cambios = {
          nombre: datos.nombre.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo.trim().toLowerCase(),
          rol: datos.rol,
        };
        if (datos.password) cambios.password = datos.password;
        updateUser(editandoRun, cambios);
      } else {
        createUser({
          run: datos.run,
          nombre: datos.nombre.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo,
          password: datos.password,
          rol: datos.rol,
        });
      }
      refrescar();
      limpiar();
      Swal.fire({ icon: "success", title: "Usuario guardado", timer: 1300, showConfirmButton: false, customClass: { popup: "rounded-0" } });
    } catch (err) {
      setErrores({ correo: err.message });
    }
  };

  return (
    <section className="row g-4">
      <article className="col-lg-5">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">{editandoRun ? "Editar Usuario" : "Nuevo Usuario"}</h4>
          <form onSubmit={handleSubmit} noValidate>
            <FormField id="adm-run" label="RUN (sin formato)" value={datos.run} onChange={set("run")} error={errores.run} placeholder="19011022K" disabled={!!editandoRun} />
            <div className="row g-2">
              <div className="col-6"><FormField id="adm-nom" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} /></div>
              <div className="col-6"><FormField id="adm-ape" label="Apellidos" value={datos.apellidos} onChange={set("apellidos")} error={errores.apellidos} /></div>
            </div>
            <FormField id="adm-mail" label="Correo" type="email" value={datos.correo} onChange={set("correo")} error={errores.correo} placeholder="@duoc.cl / @gmail.com" />
            <FormField id="adm-pass" label={editandoRun ? "Nueva contraseña (opcional)" : "Contraseña (4-10)"} type="password" value={datos.password} onChange={set("password")} error={errores.password} />
            <FormField id="adm-rol" label="Rol">
              <select id="adm-rol" className="form-select rounded-0" value={datos.rol} onChange={(e) => set("rol")(e.target.value)}>
                <option>Administrador</option>
                <option>Vendedor</option>
                <option>Cliente</option>
              </select>
            </FormField>
            <button type="submit" className="btn btn-archive-primary w-100">{editandoRun ? "Actualizar" : "Registrar Usuario"}</button>
            {editandoRun && <button type="button" className="btn btn-archive-outline w-100 mt-2" onClick={limpiar}>Cancelar edición</button>}
          </form>
        </div>
      </article>

      <article className="col-lg-7">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">Usuarios del Sistema</h4>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light small text-uppercase">
                <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.run}>
                    <td>{u.run}</td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td><span className={`badge ${u.rol === "Administrador" ? "bg-dark" : "bg-secondary"}`}>{u.rol}</span></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/usuarios/${u.run}/compras`} className="btn btn-sm btn-outline-secondary me-1">Historial</Link>
                      <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleEdit(u)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  );
}