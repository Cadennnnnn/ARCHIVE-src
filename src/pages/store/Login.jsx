import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { validarCorreo, validarPassword } from "../../utils/validaciones.js";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = { correo: validarCorreo(correo), password: validarPassword(password) };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const user = login(correo, password);
    if (!user) {
      setErrores({ password: "Correo o contraseña incorrectos." });
      return;
    }
    const staff = user.rol === "Administrador" || user.rol === "Vendedor";
    Swal.fire({
      title: `¡BIENVENIDO, ${user.nombre.toUpperCase()}!`,
      text: staff ? `Acceso autorizado como ${user.rol}. Abriendo panel...` : "Estás siendo redirigido a la tienda...",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
      customClass: { popup: "rounded-0 border border-dark" },
    }).then(() => navigate(staff ? "/admin" : "/"));
  };

  return (
    <main className="container my-5 flex-grow-1 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <section className="col-md-6 col-lg-4 text-center">
          <span className="brand-logo fs-1 d-block mb-4">ARCHIVE[src]</span>
          <div className="border p-4 p-md-5 bg-white text-start">
            <h4 className="mb-4 text-center fw-bold">INICIO DE SESIÓN</h4>
            <form onSubmit={handleSubmit} noValidate>
              <FormField id="login-correo" label="Correo" type="email" value={correo} onChange={setCorreo} error={errores.correo} placeholder="usuario@duoc.cl" />
              <FormField id="login-pass" label="Contraseña" type="password" value={password} onChange={setPassword} error={errores.password} />
              <button type="submit" className="btn btn-archive-primary w-100 py-3 mt-2">INGRESAR</button>
            </form>
            <div className="mt-4 text-center small">
              <Link to="/registro" className="text-muted border-bottom border-dark pb-1">¿No tienes cuenta? Regístrate aquí</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}