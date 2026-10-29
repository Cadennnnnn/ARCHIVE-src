export default function ReceiptActions({ onDownload, onPrint, onEmail }) {
  return (
    <div className="no-print d-flex flex-wrap gap-2 justify-content-center">
      <button className="btn btn-danger rounded-0 fw-bold" onClick={onDownload}>Descargar boleta en PDF</button>
      <button className="btn btn-outline-dark rounded-0 fw-bold" onClick={onPrint}>Imprimir</button>
      <button className="btn btn-success rounded-0 fw-bold" onClick={onEmail}>Enviar boleta por email</button>
    </div>
  );
}