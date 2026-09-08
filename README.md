# ARCHIVE[src] — Official Store

Plataforma de comercio electrónico frontend desarrollada para la **Evaluación 1** de la asignatura **Desarrollo Fullstack II (DSY1104)** en **Duoc UC**.

El proyecto consiste en una tienda minimalista y utilitaria enfocada en calzado, vestuario y accesorios urbanos de archivo y colecciones limitadas, diseñada bajo una estética inspirada en *More Drops* con una paleta neutra y acentos en azul marino (`#1B2A4A`).

---

## 🚀 Tecnologías Implementadas

En estricto cumplimiento con las restricciones técnicas de la evaluación:

* **HTML5 Semántico:** Estructuración limpia mediante elementos nativos (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) e hipervínculos coherentes entre todas las vistas públicas y administrativas.
* **CSS3 Personalizado (Externo):** Centralizado en `css/styles.css` para un mantenimiento modular, utilizando tipografías contundentes (*Montserrat*, *Inter* y variantes *bold/black*) y diseño responsivo sin estilos en línea.
* **Bootstrap 5:** Implementado para el sistema de grillas, contenedores adaptables y maquetación de componentes estructurales.
* **JavaScript Nativo (ES6+):** Manipulación dinámica del DOM, gestión de catálogo y persistencia del estado en el navegador:
  * **Catálogo y Renderizado:** Inyección dinámica de productos a partir de arreglos de objetos (`js/data.js`).
  * **Carrito de Compras:** Persistencia completa de órdenes, cálculo de totales y almacenamiento local en `localStorage` (`js/carrito.js`).
  * **Reglas de Negocio y Validaciones:** Control de formularios en tiempo real con mensajes de error contextuales (`js/validaciones.js`):
    * Formato de RUN chileno (7 a 9 caracteres alfanuméricos, sin puntos ni guion).
    * Dominios de correo autorizados (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`).
    * Contraseñas con restricciones de extensión (4 a 10 caracteres).
    * Selectores anidados dinámicos de Regiones y Comunas de Chile.
  * **Panel Administrativo:** Control de vistas según roles autenticados (`Administrador` y `Vendedor`) y mantenedores de catálogo interactivos (`js/admin.js`).

---

## 📁 Estructura del Proyecto

```text
ARCHIVE[src]/
├── index.html              # Vista principal (Home con hero y lanzamientos)
├── productos.html          # Catálogo completo con grilla interactiva
├── detalle-producto.html   # Ficha técnica individual de productos
├── carrito.html            # Carrito de compras persistente con localStorage
├── nosotros.html           # Información corporativa y de desarrolladores
├── blogs.html              # Listado de casos de estudio y noticias
├── detalle-blog-1.html     # Caso de estudio #1
├── detalle-blog-2.html     # Caso de estudio #2
├── contacto.html           # Formulario de soporte validado por JS
├── login.html              # Inicio de sesión con validación de credenciales
├── registro.html           # Registro de usuarios y selector de región/comuna
├── admin/
│   ├── index.html          # Dashboard principal con métricas dinámicas
│   ├── productos.html      # Mantenedor y listado del catálogo
│   └── usuarios.html       # Mantenedor de cuentas y roles
├── css/
│   └── styles.css          # Hoja de estilos externa y centralizada
├── js/
│   ├── data.js             # Fuente de datos centralizada del catálogo
│   ├── carrito.js          # Lógica y almacenamiento de compras
│   ├── validaciones.js     # Validaciones de formularios y RUN
│   └── admin.js            # Lógica de métricas, roles y mantenedores
└── README.md               # Documentación general del repositorio