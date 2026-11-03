import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AuthLinks() {
  const { user, logout, esStaff } = useAuth();

  if (user) {
    return (
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <span className="small fw-bold text-nowrap">Hola, {user.nombre}</span>
        <Link to="/perfil" className="small fw-bold text-uppercase text-nowrap">Mi perfil</Link>
        {esStaff && <Link to="/admin" className="small fw-bold text-uppercase text-nowrap">Panel</Link>}
        <button className="btn btn-link p-0 small fw-bold text-uppercase text-dark text-nowrap" onClick={logout}>Salir</button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Link to="/login" className="btn btn-sm btn-archive-outline text-nowrap py-1 px-3">Iniciar sesión</Link>
      <Link to="/registro" className="btn btn-sm btn-archive-primary text-nowrap py-1 px-3">Crear cuenta</Link>
    </div>
  );
}
