const CART_STORAGE_KEY = "ARCHIVE_CART_ITEMS";

function obtenerCarrito() {
  const items = localStorage.getItem(CART_STORAGE_KEY);
  return items ? JSON.parse(items) : [];
}

function guardarCarrito(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.querySelectorAll(".cart-counter-display").forEach(badge => {
    badge.textContent = `Cart (${totalItems})`;
  });
}

function agregarAlCarrito(productoId, cantidad = 1) {
  const carrito = obtenerCarrito();
  const producto = ARCHIVE_PRODUCTS.find(p => p.id === productoId);
  if (!producto) return;

  const existente = carrito.find(item => item.id === productoId);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad
    });
  }
  guardarCarrito(carrito);

  // Notificación momentánea en esquina superior derecha (Toast)
  if (typeof Swal !== "undefined") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      background: '#111111',
      color: '#FFFFFF',
      iconColor: '#FFFFFF',
      customClass: {
        popup: 'rounded-0'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: `${producto.nombre.toUpperCase()} AÑADIDO AL CARRO`
    });
  } else {
    alert(`Agregado al carro: ${producto.nombre}`);
  }
}

function modificarCantidad(productoId, delta) {
  let carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === productoId);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.id !== productoId);
  }
  guardarCarrito(carrito);
  renderizarVistaCarrito();
}

function eliminarDelCarrito(productoId) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(i => i.id !== productoId);
  guardarCarrito(carrito);
  renderizarVistaCarrito();
}

function renderizarVistaCarrito() {
  const contenedor = document.getElementById("carrito-items-tabla");
  const totalLabel = document.getElementById("carrito-total-monto");
  if (!contenedor || !totalLabel) return;

  const carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `<tr><td colspan="5" class="text-center py-4">Tu carrito está vacío.</td></tr>`;
    totalLabel.textContent = "$0";
    return;
  }

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="align-middle">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.imagen}" alt="${item.nombre}" style="width: 55px; height: 55px; object-fit: contain;">
          <div>
            <strong class="d-block text-uppercase">${item.nombre}</strong>
            <small class="text-muted">${item.codigo}</small>
          </div>
        </div>
      </td>
      <td class="align-middle font-monospace">$${item.precio.toLocaleString("es-CL")}</td>
      <td class="align-middle">
        <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-outline-dark" onclick="modificarCantidad(${item.id}, -1)">-</button>
          <span class="btn btn-outline-dark disabled px-3">${item.cantidad}</span>
          <button type="button" class="btn btn-outline-dark" onclick="modificarCantidad(${item.id}, 1)">+</button>
        </div>
      </td>
      <td class="align-middle font-monospace fw-bold">$${subtotal.toLocaleString("es-CL")}</td>
      <td class="align-middle text-end">
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </td>
    `;
    contenedor.appendChild(row);
  });

  totalLabel.textContent = `$${total.toLocaleString("es-CL")}`;
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  renderizarVistaCarrito();
});