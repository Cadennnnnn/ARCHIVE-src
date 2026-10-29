import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const { user, esAdmin, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="border-bottom bg-white py-2 no-print">
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          <span className="brand-logo" style={{ fontSize: "1.8rem" }}>
            ARCHIVE[src] <small className="text-muted fs-6 fw-normal">| Management Portal</small>
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="small fw-bold">{user.nombre} {user.apellidos}</span>
            <span className="badge bg-dark">Rol: {user.rol}</span>
          </div>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <nav className="col-md-3 col-lg-2 sidebar p-0 no-print d-flex flex-column">
            <ul className="nav flex-column">
              <li className="nav-item"><NavLink className="nav-link" to="/admin" end>Dashboard</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/ordenes">Órdenes / Boletas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/productos">Gestión Productos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/criticos">Productos críticos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/categorias">Categorías</NavLink></li>
              {esAdmin && (
                <li className="nav-item"><NavLink className="nav-link" to="/admin/usuarios">Gestión Usuarios</NavLink></li>
              )}
              <li className="nav-item"><NavLink className="nav-link" to="/admin/reportes">Reportes</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/admin/perfil">Mi perfil</NavLink></li>
            </ul>
            <div className="p-3 d-grid gap-2 border-top mt-auto">
              <Link to="/" className="btn btn-dark rounded-0 fw-bold">Tienda</Link>
              <button className="btn btn-danger rounded-0 fw-bold" onClick={logout}>Cerrar sesión</button>
            </div>
          </nav>
          <main className="col-md-9 col-lg-10 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}