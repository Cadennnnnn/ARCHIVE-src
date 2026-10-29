import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const buscar = (e) => {
    e.preventDefault();
    const texto = q.trim();
    navigate(texto ? `/productos?q=${encodeURIComponent(texto)}` : "/productos");
  };

  return (
    <form role="search" className="input-group" onSubmit={buscar}>
      <input
        type="search"
        className="form-control rounded-0"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="btn btn-archive-primary">Buscar</button>
    </form>
  );
}