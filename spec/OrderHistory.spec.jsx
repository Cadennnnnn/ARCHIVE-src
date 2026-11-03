import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import OrderHistory from "../src/components/profile/OrderHistory.jsx";

const PEDIDOS = [
  { id: "ORD-0001", fecha: "2026-10-20T12:00:00.000Z", total: 2000, estado: "Entregado" },
  { id: "ORD-0002", fecha: "2026-10-25T12:00:00.000Z", total: 5000, estado: "Pagado" },
];

describe("OrderHistory", () => {
  afterEach(cleanup);

  it("lista un pedido por fila con su número y estado", () => {
    render(<OrderHistory pedidos={PEDIDOS} onDownload={() => {}} />);
    expect(screen.getByText("ORD-0001")).toBeTruthy();
    expect(screen.getByText("Pagado")).toBeTruthy();
    expect(screen.getAllByText("Descargar boleta").length).toBe(2);
  });

  it("muestra un mensaje cuando no hay pedidos", () => {
    render(<OrderHistory pedidos={[]} onDownload={() => {}} />);
    expect(screen.getByText("Aún no tienes pedidos.")).toBeTruthy();
    expect(screen.queryByText("Descargar boleta")).toBeNull();
  });

  it("al pulsar Descargar boleta llama a onDownload con ese pedido (espía)", () => {
    const onDownload = jasmine.createSpy("onDownload");
    render(<OrderHistory pedidos={PEDIDOS} onDownload={onDownload} />);
    fireEvent.click(screen.getAllByText("Descargar boleta")[1]);
    expect(onDownload).toHaveBeenCalledWith(PEDIDOS[1]);
  });
});
