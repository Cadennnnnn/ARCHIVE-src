export default function ProductFilters({ busqueda, categoria, categorias, onBusqueda, onCategoria }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-8">
        <input
          type="search"
          className="form-control rounded-0"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>
      <div className="col-md-4">
        <select
          className="form-select rounded-0"
          value={categoria}
          onChange={(e) => onCategoria(e.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}