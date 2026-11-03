import Swal from "sweetalert2";
import { getOrders } from "../../data/db.js";
import { descargarCsv, ventasACsv } from "../../utils/exportarVentas.js";

export default function ExportSalesButton() {
  const exportar = () => {
    const pedidos = getOrders();
    if (pedidos.length === 0) {
      Swal.fire({ icon: "info", title: "No hay ventas para exportar", confirmButtonColor: "#1B2A4A" });
      return;
    }
    const fecha = new Date().toISOString().slice(0, 10);
    descargarCsv(`ventas-archive-${fecha}.csv`, ventasACsv(pedidos));
  };

  return (
    <button className="btn btn-success rounded-0 fw-bold" onClick={exportar}>
      Exportar ventas (CSV)
    </button>
  );
}
