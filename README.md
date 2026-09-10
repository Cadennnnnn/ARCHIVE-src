# ARCHIVE[src] — Official Store & Management System

> Plataforma e-commerce y módulo de administración frontend desarrollado para la **Evaluación 1** de la asignatura **Desarrollo Fullstack II (DSY1104)** en **Duoc UC**.

---

## 1. Descripción del Proyecto

**ARCHIVE[src]** es una tienda web de alta gama inspirada en la cultura *streetwear* y el coleccionismo (*archive fashion*). El sistema combina un catálogo público para clientes con un sistema de gestión interna protegido por roles, priorizando una interfaz minimalista, sobria (blanco, negro y azul marino `#1B2A4A`), responsiva y con validaciones estrictas en el cliente.

---

## 2. Tecnologías y Herramientas Utilizadas

* **HTML5:** Estructura y maquetación semántica (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* **CSS3:** Hoja de estilos externa personalizada (`css/styles.css`) con variables tipográficas y de color.
* **Bootstrap 5 (v5.3.3):** Sistema de grillas responsivas (`grid`), contenedores y componente de Carrusel interactivo.
* **JavaScript Nativo (ES6+):** Manipulación dinámica del DOM, inyección de catálogo, manejo de eventos y selectores en cascada.
* **Persistencia Local (`localStorage`):** 
  * `ARCHIVE_CART_ITEMS`: Almacenamiento persistente de productos, cantidades y totales del carrito.
  * `ARCHIVE_USERS`: Registro persistente de clientes en memoria local.
  * `ARCHIVE_AUTH_ROLE` / `ARCHIVE_USER_NAME`: Control de sesiones activas y saludo dinámico.
* **SweetAlert2:** Mensajes emergentes, cuadros de confirmación y notificaciones flotantes (*Toast*).
* **Git & GitHub:** Control de versiones con historial colaborativo bajo el estándar *Conventional Commits*.

---

## 3. Mapa de Vistas del Sitio

### Módulo Público (Tienda)
* **`index.html`:** Página de inicio con carrusel interactivo de novedades (4 diapositivas), catálogo preliminar, suscripción a newsletter y pie de página corporativo unificado.
* **`productos.html`:** Vitrina completa de productos organizados en categorías (*Sneakers*, *Apparel*, *Goods*).
* **`detalle-producto.html`:** Ficha de producto dinámica con descripción, selección de atributos y botón para añadir al carrito.
* **`carrito.html`:** Gestor de compras con cálculo reactivo de subtotales, control de unidades, vaciado y persistencia de orden.
* **`registro.html`:** Formulario de alta de clientes con control de campos vacíos, selectores reactivos y validaciones de formato.
* **`login.html`:** Acceso de usuarios con redirección basada en roles y saludo personalizado en el modal de bienvenida.
* **`nosotros.html`:** Manifiesto de la tienda, pilares de curaduría e información del equipo desarrollador.
* **`blogs.html`:** Portal de artículos sobre preservación textil e historia del calzado urbano.
* **`detalle-blog-1.html` & `detalle-blog-2.html`:** Artículos especializados sobre hidrólisis en poliuretano y la tendencia *Gorpcore*.
* **`contacto.html`:** Formulario de atención al cliente con validaciones en tiempo real.

### Módulo Administrativo (`/admin/`)
* **`admin/index.html`:** Panel de métricas y resumen de operaciones comerciales con menú lateral.
* **Gestión de Inventario y Usuarios:** Vistas de mantenedores protegidas, restringiendo accesos si el rol autenticado corresponde a *Vendedor*.

---

## 4. Reglas de Negocio y Validaciones Implementadas

1. **RUN Chileno:** Campo obligatorio, longitud entre 7 y 9 caracteres, ingresado sin puntos ni guión (ej: `19011022K`).
2. **Nombres y Apellidos:** Campos obligatorios con límites de 50 y 100 caracteres respectivamente.
3. **Correos Electrónicos:** Restricción estricta a dominios autorizados (`@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`).
4. **Contraseñas:** Longitud obligatoria de entre 4 y 10 caracteres alfanuméricos.
5. **División Político-Administrativa:** Carga dinámica de las 16 regiones de Chile y actualización en cascada de sus comunas correspondientes al cambiar la selección.
6. **Manejo de Errores Visuales:** Bloqueo del envío mediante JavaScript, pintando bordes rojos (`.is-invalid`) y textos de advertencia debajo de cada campo no completado o con formato erróneo.

---

## 5. Cuentas de Prueba para Evaluación

Para probar el inicio de sesión y la asignación de roles en `login.html`:

| Perfil | Correo de Prueba | Contraseña | Comportamiento del Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `1234` | Acceso total al panel administrativo (`/admin/index.html`). |
| **Vendedor** | `vendedor@duoc.cl` | `1234` | Acceso al panel administrativo con gestión de usuarios oculta. |
| **Cliente** | `cliente@gmail.com` | `1234` | Redirección a la tienda (`index.html`) con saludo personalizado. |

---

## 6. Documentación Adicional

Junto a este repositorio se adjunta la **Especificación de Requisitos de Software (Documento ERS - Versión 1.0)** cumpliendo con los estándares solicitados en la pauta de evaluación institucional.