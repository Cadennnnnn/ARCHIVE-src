
import Swal from 'sweetalert2';

export function showAddedToCartNotification(productName: string): void {
  void Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `${productName} añadido al carrito`,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}