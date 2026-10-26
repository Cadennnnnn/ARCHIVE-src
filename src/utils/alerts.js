import Swal from "sweetalert2";

export function toastAgregado(nombre) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${nombre.toUpperCase()} AÑADIDO AL CARRO`,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
    background: "#111111",
    color: "#FFFFFF",
    iconColor: "#FFFFFF",
    customClass: { popup: "rounded-0" },
  });
}