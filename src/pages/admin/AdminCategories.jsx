import { useState } from "react";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { createCategory, deleteCategory, getCategories, getProducts, updateCategory } from "../../data/db.js";

export default function AdminCategories() {
  const [categorias, setCategorias] = useState(getCategories);
  const [productos, setProductos] = useState(getProducts);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const refrescar = () => {
    setCategorias(getCategories());
    setProductos(getProducts());
  };

  const limpiar = () => {
    setNombre("");
    setEditando(null);
    setError("");
  };

  const enUso = (c) => productos.filter((p) => p.categoria === c).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editando) updateCategory(editando, nombre);
      else createCategory(nombre);
      refrescar();
      limpiar();
      Swal.fire({ icon: "success", title: "Categoría guardada", timer: 1200, showConfirmButton: false, customClass: { popup: "rounded-0" } });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (c) => {
    setEditando(c);
    setNombre(c);
    setError("");
  };

  const handleDelete = async (c) => {
    const r = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: c,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B2A4A",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-0 border border-dark" },
    });
    if (!r.isConfirmed) return;
    try {
      deleteCategory(c);
      refrescar();
      if (editando === c) limpiar();
    } catch (err) {
      Swal.fire({ icon: "error", title: "No se pudo eliminar", text: err.message, confirmButtonColor: "#1B2A4A", customClass: { popup: "rounded-0 border border-dark" } });
    }
  };

  return (
    <section className="row g-4">
      <article className="col-lg-4">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">{editando ? "Editar Categoría" : "Nueva Categoría"}</h4>
          <form onSubmit={handleSubmit} noValidate>
            <FormField id="cat-nombre" label="Nombre" value={nombre} onChange={setNombre} error={error} placeholder="Ej: Gorros" />
            <button type="submit" className="btn btn-archive-primary w-100">{editando ? "Actualizar" : "Guardar Categoría"}</button>
            {editando && <button type="button" className="btn btn-archive-outline w-100 mt-2" onClick={limpiar}>Cancelar edición</button>}
          </form>
        </div>
      </article>

      <article className="col-lg-8">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">Categorías del catálogo</h4>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light small text-uppercase">
                <tr><th>Categoría</th><th>Productos</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c}>
                    <td><span className="badge bg-secondary">{c}</span></td>
                    <td>{enUso(c)}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  );
}