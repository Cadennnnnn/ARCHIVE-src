import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container my-5 flex-grow-1 text-center">
      <h1 className="display-1 fw-bolder">404</h1>
      <p className="text-muted my-4">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-archive-primary px-4 py-3">Volver al inicio</Link>
    </main>
  );
}