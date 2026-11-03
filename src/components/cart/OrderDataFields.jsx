function Campo({ id, label, value }) {
  return (
    <>
      <label htmlFor={id} className="form-label small mb-1">{label}</label>
      <input id={id} className="form-control form-control-sm rounded-0 bg-light" value={value ?? ""} readOnly />
    </>
  );
}

export default function OrderDataFields({ cliente, prefijo = "od" }) {
  return (
    <div className="mb-3">
      <div className="row g-2 mb-2">
        <div className="col-md-4"><Campo id={`${prefijo}-nombre`} label="Nombre" value={cliente.nombre} /></div>
        <div className="col-md-4"><Campo id={`${prefijo}-apellidos`} label="Apellidos" value={cliente.apellidos} /></div>
        <div className="col-md-4"><Campo id={`${prefijo}-correo`} label="Correo" value={cliente.correo} /></div>
      </div>

      <h3 className="h6 fw-bold mt-3">Dirección de entrega de los productos</h3>
      <div className="row g-2 mb-2">
        <div className="col-md-6"><Campo id={`${prefijo}-calle`} label="Calle" value={cliente.direccion} /></div>
        <div className="col-md-6"><Campo id={`${prefijo}-depto`} label="Departamento (opcional)" value={cliente.departamento} /></div>
      </div>
      <div className="row g-2 mb-2">
        <div className="col-md-6"><Campo id={`${prefijo}-region`} label="Región" value={cliente.region} /></div>
        <div className="col-md-6"><Campo id={`${prefijo}-comuna`} label="Comuna" value={cliente.comuna} /></div>
      </div>
      <div className="row g-2">
        <div className="col-md-4"><Campo id={`${prefijo}-entrega`} label="Opción de entrega" value={cliente.entrega} /></div>
        <div className="col-md-8">
          <label htmlFor={`${prefijo}-indic`} className="form-label small mb-1">Indicaciones para la entrega (opcional)</label>
          <textarea id={`${prefijo}-indic`} rows="2" className="form-control form-control-sm rounded-0 bg-light" value={cliente.indicaciones ?? ""} readOnly />
        </div>
      </div>
    </div>
  );
}
