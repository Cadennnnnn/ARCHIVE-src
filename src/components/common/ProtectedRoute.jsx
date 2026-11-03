import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// requiereStaff=false permite el acceso a cualquier usuario con sesión (por ejemplo, el perfil del cliente)
export default function ProtectedRoute({ children, soloAdmin = false, requiereStaff = true }) {
  const { user, esStaff, esAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (requiereStaff && !esStaff) return <Navigate to="/" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/admin" replace />;

  return children;
}
