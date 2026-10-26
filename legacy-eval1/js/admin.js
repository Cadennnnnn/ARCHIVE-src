// js/admin.js

// 1. Control de accesos y visualización según el rol autenticado
function verificarAccesoRol() {
  const rolActual = localStorage.getItem("ARCHIVE_AUTH_ROLE") || "Administrador";
  const badgeRol = document.getElementById("rol-actual-indicador");
  const secUsuarios = document.querySelectorAll(".solo-admin");

  if (badgeRol) {
    badgeRol.textContent = rolActual;
  }

  // Si es Vendedor, se ocultan las secciones exclusivas de Administrador
  if (rolActual === "Vendedor") {
    secUsuarios.forEach(el => el.style.display = "none");
  } else {
    secUsuarios.forEach(el => el.style.display = "");
  }
}

// 2. Cambio manual de rol para pruebas evaluativas
function cambiarRolSimulado(nuevoRol) {
  localStorage.setItem("ARCHIVE_AUTH_ROLE", nuevoRol);
  verificarAccesoRol();
  alert(`Rol cambiado a: ${nuevoRol}`);
}

// 3. Actualización automática de métricas en el Dashboard
function actualizarMetricasDashboard() {
  const contadorProd = document.getElementById("total-productos-admin");
  
  if (contadorProd && typeof ARCHIVE_PRODUCTS !== "undefined") {
    const total = ARCHIVE_PRODUCTS.length;
    contadorProd.textContent = `${total} Producto${total === 1 ? '' : 's'}`;
  }
}

// 4. Validación del formulario de nuevo producto
function inicializarFormProductoAdmin() {
  const form = document.getElementById("form-admin-producto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputCodigo = document.getElementById("prod-codigo");
    const inputCategoria = document.getElementById("prod-categoria");
    const inputPrecio = document.getElementById("prod-precio");

    const codigo = parseInt(inputCodigo.value, 10);
    const categoria = inputCategoria.value;
    const precio = parseInt(inputPrecio.value, 10);

    // Validación de código numérico entero mayor o igual a 0
    if (isNaN(codigo) || codigo < 0) {
      alert("El código debe ser un número entero mayor o igual a 0.");
      return;
    }

    // Validación de categoría obligatoria
    if (!categoria) {
      alert("Seleccione una categoría obligatoria.");
      return;
    }

    // Validación de precio válido
    if (isNaN(precio) || precio <= 0) {
      alert("Ingrese un precio válido superior a 0.");
      return;
    }

    alert("Producto registrado correctamente.");
    form.reset();
  });
}

// 5. Inicialización de eventos al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  verificarAccesoRol();
  actualizarMetricasDashboard();
  inicializarFormProductoAdmin();
});