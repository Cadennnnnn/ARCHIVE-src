import { initDB, resetDB, createOrder, getOrdersByEmail, getUsers } from "../src/data/db.js";
import { actualizarPerfil, guardarDirecciones, guardarMetodosPago } from "../src/data/profile.js";

const RUN = "212345678"; // cliente@gmail.com (usuario semilla)
const LINEA = { id: 1, codigo: "SNK-001", nombre: "NIKE", precio: 1000, cantidad: 1, imagen: "" };
const DATOS = { nombre: "Cli", apellidos: "Demo", correo: "nuevo@gmail.com", telefono: "+56 9 1234 5678" };
const usuario = () => getUsers().find((u) => u.run === RUN);

describe("perfil del cliente (datos)", () => {
  beforeEach(() => {
    localStorage.clear();
    initDB();
  });
  afterAll(() => {
    localStorage.clear();
    resetDB();
  });

  it("actualiza los datos y migra el historial al correo nuevo", () => {
    createOrder({ items: [LINEA], total: 1000, cliente: { correo: "cliente@gmail.com" } });
    actualizarPerfil(RUN, DATOS);
    expect(usuario().telefono).toBe("+56 9 1234 5678");
    expect(getOrdersByEmail("nuevo@gmail.com").length).toBe(1);
    expect(getOrdersByEmail("cliente@gmail.com").length).toBe(0);
  });

  it("rechaza un correo que ya usa otra cuenta", () => {
    expect(() => actualizarPerfil(RUN, { ...DATOS, correo: "admin@duoc.cl" })).toThrowError(/en uso/);
  });

  it("guarda direcciones y métodos de pago en el usuario", () => {
    guardarDirecciones(RUN, [{ id: 1, alias: "Casa" }]);
    guardarMetodosPago(RUN, [{ id: 1, marca: "Visa", ultimos4: "4242" }]);
    expect(usuario().direcciones.length).toBe(1);
    expect(usuario().metodosPago[0].ultimos4).toBe("4242");
  });
});
