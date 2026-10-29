import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import PurchaseSuccess from "../src/pages/store/PurchaseSuccess.jsx";

const PEDIDO = {
  id: "ORD-0001", fecha: "2026-10-28T12:00:00.000Z", estado: "Pagado", total: 2000,
  items: [{ id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 2, imagen: "x.jpg" }],
  cliente: {
    nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "Despacho a domicilio",
    direccion: "Los Cisnes 10", departamento: "", indicaciones: "", comuna: "Providencia", region: "Metropolitana de Santiago",
  },
};

const montar = (state) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/compra-exitosa", state }]}>
      <PurchaseSuccess />
    </MemoryRouter>
  );

describe("PurchaseSuccess (detalle de la orden)", () => {
  afterEach(cleanup);

  it("muestra el ID de orden y el encabezado del detalle", () => {
    montar({ pedido: PEDIDO });
    expect(screen.getByTestId("orden-id").textContent).toBe("ORD-0001");
    expect(screen.getByText("Detalle de la orden")).toBeTruthy();
  });

  it("muestra productos, cantidad, subtotal y total pagado", () => {
    montar({ pedido: PEDIDO });
    expect(screen.getByText("NIKE")).toBeTruthy();
    expect(screen.getByText("SUBTOTAL")).toBeTruthy();
    expect(screen.getByText("TOTAL PAGADO")).toBeTruthy();
    expect(screen.getByText("Descargar boleta en PDF")).toBeTruthy();
  });

  it("al enviar la boleta por email muestra la alerta simulada (mock de SweetAlert2)", () => {
    spyOn(Swal, "fire");
    montar({ pedido: PEDIDO });
    fireEvent.click(screen.getByText("Enviar boleta por email"));
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ title: "Boleta enviada" }));
  });
});