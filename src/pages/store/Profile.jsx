import { useState } from "react";
import Swal from "sweetalert2";
import AddressManager from "../../components/profile/AddressManager.jsx";
import OrderHistory from "../../components/profile/OrderHistory.jsx";
import PaymentMethods from "../../components/profile/PaymentMethods.jsx";
import PersonalDataForm from "../../components/profile/PersonalDataForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getOrdersByEmail } from "../../data/db.js";
import { actualizarPerfil, guardarDirecciones, guardarMetodosPago } from "../../data/profile.js";
import { descargarBoletaPdf } from "../../utils/boletaPdf.js";

const TABS = [
  ["pedidos", "Mis pedidos"],
  ["datos", "Mis datos"],
  ["direcciones", "Direcciones"],
  ["pagos", "Métodos de pago"],
];

const aviso = (titulo) =>
  Swal.fire({ toast: true, position: "top-end", icon: "success", title: titulo, showConfirmButton: false, timer: 1400 });

export default function Profile() {
  const { user, actualizarSesion } = useAuth();
  const [tab, setTab] = useState("pedidos");
  const pedidos = [...getOrdersByEmail(user.correo)].reverse();

  const guardarDatos = (d) => {
    try {
      actualizarPerfil(user.run, d);
      actualizarSesion({
        nombre: d.nombre.trim(),
        apellidos: d.apellidos.trim(),
        correo: d.correo.trim().toLowerCase(),
        telefono: d.telefono.trim(),
      });
      aviso("Datos actualizados");
      return "";
    } catch (err) {
      return err.message;
    }
  };

  const cambiarDirecciones = (lista) => {
    guardarDirecciones(user.run, lista);
    actualizarSesion({ direcciones: lista });
    aviso("Direcciones actualizadas");
  };

  const cambiarMetodos = (lista) => {
    guardarMetodosPago(user.run, lista);
    actualizarSesion({ metodosPago: lista });
    aviso("Métodos de pago actualizados");
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-3 mb-4">
        <h1 className="display-6 fw-bolder">MI PERFIL</h1>
        <p className="text-muted mb-0">{user.nombre} {user.apellidos} · {user.correo}</p>
      </section>

      <ul className="nav nav-tabs flex-wrap mb-4" role="tablist">
        {TABS.map(([id, label]) => (
          <li className="nav-item" key={id}>
            <button type="button" role="tab" className={`nav-link text-nowrap ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="border bg-white p-3 p-md-4">
        {tab === "pedidos" && <OrderHistory pedidos={pedidos} onDownload={descargarBoletaPdf} />}
        {tab === "datos" && <PersonalDataForm user={user} onSave={guardarDatos} />}
        {tab === "direcciones" && <AddressManager direcciones={user.direcciones ?? []} onChange={cambiarDirecciones} />}
        {tab === "pagos" && <PaymentMethods metodos={user.metodosPago ?? []} onChange={cambiarMetodos} />}
      </div>
    </main>
  );
}
