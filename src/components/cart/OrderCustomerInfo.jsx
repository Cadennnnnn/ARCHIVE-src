export default function OrderCustomerInfo({ cliente }) {
  return (
    <div className="row g-3 mb-3 small">
      <div className="col-md-6">
        <strong className="text-uppercase d-block">Cliente</strong>
        {cliente.nombre} {cliente.apellidos}
        <br />
        {cliente.correo}
      </div>
      <div className="col-md-6">
        <strong className="text-uppercase d-block">Dirección de entrega</strong>
        {cliente.entrega}
        <br />
        {cliente.direccion}
        {cliente.departamento ? `, Depto ${cliente.departamento}` : ""}
        <br />
        {cliente.comuna}, {cliente.region}
        {cliente.indicaciones && <em className="d-block text-muted">Indicaciones: {cliente.indicaciones}</em>}
      </div>
    </div>
  );
}