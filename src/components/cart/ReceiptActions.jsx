export default function ReceiptActions({ onDownload, onEmail }) {
  return (
    <div className="no-print d-flex flex-wrap gap-2 justify-content-center">
      <button className="btn btn-danger rounded-0 fw-bold" onClick={onDownload}>Imprimir boleta en PDF</button>
      <button className="btn btn-success rounded-0 fw-bold" onClick={onEmail}>Enviar boleta por email</button>
    </div>
  );
}
