import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PurchaseSuccess from "../src/pages/store/PurchaseSuccess.jsx";
import PurchaseError from "../src/pages/store/PurchaseError.jsx";

const CLIENTE = {
  nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", entrega: "Despacho a domicilio",
  direccion: "Los Cisnes 10", departamento: "", indicaciones: "", comuna: "Providencia", region: "Metropolitana de Santiago",
};
const ITEMS = [{ id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 2, imagen: "x.jpg" }];

const montar = (ui, state) => render(<MemoryRouter initialEntries={[{ pathname: "/x", state }]}>{ui}</MemoryRouter>);

describe("estado del pago", () => {
  afterEach(cleanup);

  it("pago aceptado: muestra la insignia y el detalle de la orden", () => {
    const pedido = { id: "ORD-0001", fecha: "2026-10-28T12:00:00.000Z", estado: "Pagado", total: 2000, items: ITEMS, cliente: CLIENTE };
    montar(<PurchaseSuccess />, { pedido });
    expect(screen.getByTestId("estado-pago").textContent).toBe("PAGO ACEPTADO");
    expect(screen.getByText("Detalle de la orden")).toBeTruthy();
  });

  it("pago declinado: muestra la insignia, la referencia y las acciones para reintentar", () => {
    const intento = { numero: "PAY-20261028-001", items: ITEMS, total: 2000, cliente: CLIENTE };
    montar(<PurchaseError />, { intento });
    expect(screen.getByTestId("estado-pago").textContent).toBe("PAGO DECLINADO");
    expect(screen.getByText("Referencia del intento: PAY-20261028-001")).toBeTruthy();
    expect(screen.getByText("VOLVER A REALIZAR EL PAGO")).toBeTruthy();
  });
});
