import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { user, esStaff, esAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!esStaff) return <Navigate to="/" replace />;
  if (soloAdmin && !esAdmin) return <Navigate to="/admin" replace />;

  return children;
}