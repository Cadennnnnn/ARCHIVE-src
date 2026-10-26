import { createContext, useContext, useState } from "react";
import { authenticate } from "../data/db.js";

const AuthContext = createContext(null);
const SESSION_KEY = "ARCHIVE_SESSION";

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  const login = (correo, password) => {
    const encontrado = authenticate(correo, password);
    if (!encontrado) return null;
    localStorage.setItem(SESSION_KEY, JSON.stringify(encontrado));
    setUser(encontrado);
    return encontrado;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const esStaff = user?.rol === "Administrador" || user?.rol === "Vendedor";
  const esAdmin = user?.rol === "Administrador";

  return (
    <AuthContext.Provider value={{ user, login, logout, esStaff, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}