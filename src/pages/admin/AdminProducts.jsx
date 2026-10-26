import { useState } from "react";
import Swal from "sweetalert2";
import FormField from "../../components/forms/FormField.jsx";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../data/db.js";
import { formatearPrecio } from "../../utils/formatters.js";
import { validarCodigoProducto, validarNombre, validarPrecio } from "../../utils/validaciones.js";

const VACIO = { codigo: "", nombre: "", categoria: "", precio: "", oferta: "", stock: "0", imagen: "" };

export default function AdminProducts() {
  const [productos, setProductos] = useState(getProducts);
  const [datos, setDatos] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});

  const set = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));
  const refrescar = () => setProductos(getProducts());

  const limpiar = () => {
    setDatos(VACIO);
    setEditandoId(null);
    setErrores({});
  };

  const handleEdit = (p) => {
    setEditandoId(p.id);
    setDatos({
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: String(p.precio),
      oferta: p.oferta ? String(p.oferta) : "",
      stock: String(p.stock),
      imagen: p.imagen,
    });
    setErrores({});
  };

  const handleDelete = async (p) => {
    const r = await Swal.fire({
      title: "¿Eliminar producto?",
      text: p.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B2A4A",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-0 border border-dark" },
    });
    if (r.isConfirmed) {
      deleteProduct(p.id);
      refrescar();
      if (editandoId === p.id) limpiar();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {
      codigo: validarCodigoProducto(datos.codigo),
      nombre: validarNombre(datos.nombre, 100),
      categoria: datos.categoria ? "" : "Seleccione una categoría.",
      precio: validarPrecio(datos.precio),
      oferta: datos.oferta && Number(datos.oferta) >= Number(datos.precio) ? "La oferta debe ser menor al precio." : "",
      stock: Number.isInteger(Number(datos.stock)) && Number(datos.stock) >= 0 ? "" : "Stock entero mayor o igual a 0.",
    };
    Object.keys(errs).forEach((k) => errs[k] === "" && delete errs[k]);
    setErrores(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim().toUpperCase(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      oferta: datos.oferta ? Number(datos.oferta) : null,
      stock: Number(datos.stock),
      imagen: datos.imagen.trim(),
    };

    try {
      if (editandoId) updateProduct(editandoId, payload);
      else createProduct(payload);
      refrescar();
      limpiar();
      Swal.fire({ icon: "success", title: "Producto guardado", timer: 1300, showConfirmButton: false, customClass: { popup: "rounded-0" } });
    } catch (err) {
      setErrores({ codigo: err.message });
    }
  };

  return (
    <section className="row g-4">
      <article className="col-lg-4">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h4>
          <form onSubmit={handleSubmit} noValidate>
            <FormField id="prod-codigo" label="Código (ABC-123)" value={datos.codigo} onChange={set("codigo")} error={errores.codigo} placeholder="SNK-005" />
            <FormField id="prod-nombre" label="Nombre" value={datos.nombre} onChange={set("nombre")} error={errores.nombre} />
            <FormField id="prod-categoria" label="Categoría" error={errores.categoria}>
              <select id="prod-categoria" className={`form-select rounded-0 ${errores.categoria ? "is-invalid" : ""}`} value={datos.categoria} onChange={(e) => set("categoria")(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                <option>Zapatillas</option>
                <option>Ropa</option>
                <option>Accesorios</option>
              </select>
            </FormField>
            <FormField id="prod-precio" label="Precio ($ CLP)" type="number" value={datos.precio} onChange={set("precio")} error={errores.precio} />
            <FormField id="prod-oferta" label="Precio oferta (opcional)" type="number" value={datos.oferta} onChange={set("oferta")} error={errores.oferta} />
            <FormField id="prod-stock" label="Stock" type="number" value={datos.stock} onChange={set("stock")} error={errores.stock} />
            <FormField id="prod-img" label="URL Imagen (opcional)" value={datos.imagen} onChange={set("imagen")} />
            <button type="submit" className="btn btn-archive-primary w-100">{editandoId ? "Actualizar" : "Guardar Producto"}</button>
            {editandoId && <button type="button" className="btn btn-archive-outline w-100 mt-2" onClick={limpiar}>Cancelar edición</button>}
          </form>
        </div>
      </article>

      <article className="col-lg-8">
        <div className="border p-4 bg-white">
          <h4 className="mb-3">Listado del Catálogo</h4>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light small text-uppercase">
                <tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td><span className="badge bg-secondary">{p.categoria}</span></td>
                    <td className="font-monospace">
                      {p.oferta ? (<><span className="text-danger">{formatearPrecio(p.oferta)}</span> <s className="text-muted small">{formatearPrecio(p.precio)}</s></>) : formatearPrecio(p.precio)}
                    </td>
                    <td>{p.stock}</td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p)}>Eliminar</button>
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