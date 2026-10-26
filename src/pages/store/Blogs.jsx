import { Link } from "react-router-dom";
import { BLOGS } from "../../data/blogs.js";

export default function Blogs() {
  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-5">
        <h1 className="display-5 fw-bolder">NOTICIAS IMPORTANTES</h1>
        <p className="text-muted">Historias de archivo, preservación técnica de calzado y cultura urbana contemporánea.</p>
      </section>

      {BLOGS.map((b) => (
        <article key={b.id} className="p-4 p-md-5 border bg-white mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-dark rounded-0 text-uppercase px-2 py-1 mb-2 font-monospace">{b.badge}</span>
              <h3 className="fw-bold mb-3">{b.caso.toUpperCase()}</h3>
              <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>{b.resumen}</p>
              <Link to={`/blogs/${b.id}`} className="btn btn-archive-primary px-4 py-2">Ver Caso Completo &rarr;</Link>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-2 border bg-light">
                <img src={b.imagen} alt={b.caso} className="img-fluid w-100 object-fit-cover" style={{ maxHeight: 280 }} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
}