import { Link, useParams } from "react-router-dom";
import { getBlogById } from "../../data/blogs.js";

export default function BlogDetail() {
  const { id } = useParams();
  const blog = getBlogById(id);

  if (!blog) {
    return (
      <main className="container my-5 flex-grow-1">
        <h1 className="fw-bolder">ARTÍCULO NO ENCONTRADO</h1>
        <Link to="/blogs" className="btn btn-archive-outline mt-3">Volver a Blogs</Link>
      </main>
    );
  }

  return (
    <main className="container my-5 flex-grow-1">
      <article className="col-lg-8 mx-auto">
        <span className="badge bg-dark rounded-0 text-uppercase px-2 py-1 mb-2 font-monospace">{blog.caso}</span>
        <h1 className="display-5 fw-bolder my-3">{blog.titulo}</h1>
        <div className="p-2 border bg-light my-4">
          <img src={blog.imagen} alt={blog.titulo} className="img-fluid w-100 object-fit-cover" style={{ maxHeight: 420 }} />
        </div>
        <p className="lead text-dark mb-4" style={{ lineHeight: 1.7 }}>{blog.contenido}</p>
        <div className="border-top pt-4 mt-5">
          <Link to="/blogs" className="btn btn-archive-outline px-4 py-2">&larr; Volver a Blogs</Link>
        </div>
      </article>
    </main>
  );
}