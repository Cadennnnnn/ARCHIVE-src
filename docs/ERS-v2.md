# Especificación de Requisitos de Software (ERS)
**Estándar IEEE 830 · Proyecto ARCHIVE[src] · Revisión 2**

**Asignatura:** Desarrollo Full Stack II (DSY1104) · Sección 002D
**Profesor:** Cristian Armando Gomez Vega
**Institución:** Duoc UC, Escuela de Informática y Telecomunicaciones

---

## Ficha del documento

| Fecha | Revisión | Autor | Modificación |
|---|---|---|---|
| 08 de Septiembre de 2026 | 1 | Caden Alexander Nieto González | Propuesta inicial y especificación de requerimientos de software frontend para la Entrega 1 |
| 15 de Octubre de 2026 | 2 | Caden Alexander Nieto González | Migración a React, nuevas vistas (categorías, ofertas, checkout), CRUD con persistencia local y pruebas unitarias con Jasmine y Karma (Entrega 2) |

---

## 1. Introducción

### 1.1. Propósito
Este documento establece los requerimientos de software de la segunda etapa del proyecto **ARCHIVE[src]**, correspondiente a la Evaluación Parcial 2. Sirve como guía de construcción para el equipo técnico y como pauta de revisión para el docente de DSY1104.

### 1.2. Ámbito del Sistema
**Nombre del sistema:** ARCHIVE[src]

**Lo que hará:** una aplicación web responsiva construida con React para explorar un catálogo de zapatillas, indumentaria y accesorios urbanos de archivo, con búsqueda y filtros por categoría; ver categorías y ofertas; consultar el detalle de cada producto; gestionar un carrito con persistencia local; completar un proceso de compra (checkout) con resultado exitoso o fallido; registrar usuarios e iniciar sesión validando contra una base de datos local; enviar consultas de contacto; y acceder a un panel administrativo por roles (Administrador y Vendedor) con mantenedores CRUD de productos y usuarios.

**Lo que NO hará:** no ejecuta cobros bancarios reales (el pago del checkout es simulado), no gestiona despachos con empresas de logística y no utiliza bases de datos relacionales ni servidor backend. La seguridad de contraseñas y sesiones es solo demostrativa.

**Beneficios y metas:** una base frontend modular, con componentes reutilizables, estado centralizado en contextos y pruebas unitarias, preparada para integrar un backend en etapas posteriores.

### 1.3. Definiciones, Acrónimos y Abreviaturas
- **ERS:** Especificación de Requisitos de Software.
- **RUN:** Rol Único Nacional (cédula de identidad chilena).
- **SPA:** Single Page Application, aplicación de una sola página.
- **Componente:** unidad reutilizable de interfaz en React.
- **Props:** propiedades que un componente recibe de su padre.
- **State (estado):** datos internos de un componente que, al cambiar, vuelven a renderizarlo.
- **Context:** mecanismo de React para compartir estado global (sesión, carrito).
- **Hook:** función de React (`useState`, `useContext`, `useEffect`) que da acceso a estado y ciclo de vida.
- **CRUD:** Create, Read, Update, Delete.
- **localStorage:** almacenamiento clave-valor del navegador, sin caducidad.
- **Jasmine:** framework de pruebas unitarias. **Karma:** ejecutor de pruebas en navegador.
- **Mock / Spy:** objeto o función simulada para aislar el código bajo prueba.
- **Cobertura:** porcentaje del código ejecutado por las pruebas.
- **Drop:** lanzamiento comercial limitado de productos de colección.

### 1.4. Referencias
- Estándar IEEE 830-1998.
- Pauta y Rúbrica de la Evaluación Parcial 2 y su Anexo 1 de instrucciones, DSY1104, Duoc UC.
- ERS Revisión 1 (Evaluación 1), conservada en `docs/`.
- Repositorio: https://github.com/Cadennnnnn/ARCHIVE-src (rama `feature/migracion-react`; versión anterior en `legacy-eval1/` y tag `v1.0-eval1`).

### 1.5. Visión General del Documento
La Sección 2 describe la perspectiva global del producto, sus usuarios y restricciones. La Sección 3 detalla interfaces, requisitos funcionales, no funcionales, arquitectura y estrategia de pruebas.

---

## 2. Descripción General

### 2.1. Perspectiva del Producto
ARCHIVE[src] es una aplicación web autónoma de una sola página (SPA) centrada en el frontend. No depende de servicios backend: pedidos, usuarios, productos y sesión se persisten en `localStorage` a través de un módulo de datos (`src/data/db.js`) que expone operaciones CRUD. La navegación se divide en dos áreas, gestionadas por React Router: la **tienda** (`/`) y el **panel administrativo** (`/admin`), este último protegido por rol.

### 2.2. Funciones del Producto
- **Exploración y filtrado:** catálogo con tarjetas responsivas, búsqueda por nombre o código y filtro por categoría.
- **Categorías y Ofertas:** vistas dedicadas; las ofertas muestran precio rebajado y precio original tachado.
- **Ficha de producto:** detalle por URL (`/productos/:id`) con selector de talla, cantidad y stock.
- **Carrito:** altas, cambio de cantidad, eliminación, totales y persistencia entre sesiones.
- **Checkout:** formulario de envío (precargado si hay sesión), opción de entrega y pago simulado con resultado exitoso o fallido.
- **Autenticación:** registro y login validados contra la base local, con rol asignado.
- **Panel administrativo:** dashboard con métricas reales, CRUD de productos y CRUD de usuarios (solo Administrador).
- **Contenido:** Nosotros, Blogs con detalle y formulario de Contacto.

### 2.3. Características de los Usuarios
- **Cliente:** usuario general; solo requiere conocimientos básicos de navegación web.
- **Vendedor:** empleado de tienda; revisa inventario y pedidos. No accede a la gestión de usuarios.
- **Administrador:** encargado técnico y comercial; gestiona catálogo y cuentas.

### 2.4. Restricciones
- **Políticas académicas:** cumplimiento de la rúbrica de DSY1104 para la Evaluación 2.
- **Tecnología obligatoria:** framework **React** (con Vite), Bootstrap 5 para diseño responsivo, y Jasmine + Karma para pruebas unitarias.
- **Componentes:** cada componente debe seguir el principio de responsabilidad única, usar props para recibir datos y manejar estado propio solo cuando sea necesario.
- **Diseño e identidad:** estética minimalista monocromática con acento azul marino `#1B2A4A`.
- **Almacenamiento:** limitado a `localStorage`.
- **Repositorio:** se mantiene el mismo repositorio de la Evaluación 1.

### 2.5. Suposiciones y Dependencias
- El usuario accede con un navegador moderno compatible con ECMAScript 2020 y HTML5.
- Bootstrap 5, SweetAlert2 y React Router se instalan vía npm y se empaquetan con Vite. Las fuentes (Google Fonts) y algunas imágenes de productos se cargan desde servidores externos.
- La persistencia depende de que el navegador tenga habilitado `localStorage`.
- Las pruebas requieren Node.js (v18 o superior) y Google Chrome. Karma no admite rutas con corchetes (`[ ]`) en Windows, por lo que deben ejecutarse desde una ruta sin ellos.

### 2.6. Requisitos Futuros
- API RESTful con framework backend (Node.js/Express, Spring Boot o Django).
- Base de datos relacional (PostgreSQL u Oracle) con contraseñas cifradas.
- Pasarela de pago real (Webpay Plus).
- Pruebas de integración de páginas completas (checkout y panel admin).

---

## 3. Requisitos Específicos

### 3.1. Requisitos comunes de las interfaces

#### 3.1.1. Interfaces de usuario
- **Navegación:** barra superior con logo, enlaces (Home, Productos, Categorías, Ofertas, Nosotros, Blogs, Contacto), acceso a sesión/registro, saludo y salida cuando hay sesión activa, enlace al panel para el personal y botón de carrito con contador dinámico.
- **Paleta y tipografía:** fondo blanco `#FFFFFF`, gris suave `#F8F9FA`, bordes `#E5E5E5`, tipografía Inter en pesos altos y acentos en azul marino `#1B2A4A`.
- **Pie de página:** créditos, enlaces por categoría, información y redes.
- **Panel administrativo:** diseño propio con barra lateral, que oculta "Gestión Usuarios" al Vendedor.
- **Retroalimentación:** mensajes de error bajo cada campo y alertas/toasts con SweetAlert2.

#### 3.1.2. Interfaces de hardware
Escritorio (≥ 1024 px) y dispositivos móviles táctiles (desde 320 px), mediante la grilla de Bootstrap.

#### 3.1.3. Interfaces de software
- React 19 y React DOM; React Router (rutas, rutas anidadas y rutas protegidas).
- Vite como herramienta de desarrollo y empaquetado.
- Bootstrap 5.3 y SweetAlert2 vía npm.
- Pruebas: Jasmine, Karma, ChromeHeadless, Webpack, Babel, Testing Library e Istanbul.
- Git y GitHub para control de versiones.

#### 3.1.4. Interfaces de comunicación
Entrega de activos estáticos mediante HTTP/HTTPS. No hay comunicación con servidores de datos.

### 3.2. Requisitos funcionales

| Código | Requisito | Actor | Descripción |
|---|---|---|---|
| RF-01 | Visualización del catálogo | Cliente/Vendedor/Admin | El sistema debe renderizar tarjetas (`ProductCard`) desde la base local, mostrando imagen, nombre, categoría, precio en pesos chilenos y botones de acción. |
| RF-02 | Búsqueda y filtros | Cliente | Debe permitir filtrar por texto (nombre o código) y por categoría, mostrando un mensaje cuando no hay coincidencias. |
| RF-03 | Categorías | Cliente | La vista `/categorias` debe separar los productos por categoría mediante botones y parámetro de URL. |
| RF-04 | Ofertas | Cliente | La vista `/ofertas` debe listar solo productos con precio de oferta, mostrando el precio rebajado y el original tachado. |
| RF-05 | Ficha de detalle | Cliente | La ruta `/productos/:id` debe mostrar descripción, selector de talla, cantidad limitada por stock y botón de compra; si el producto no existe debe mostrar un mensaje. |
| RF-06 | Carrito con persistencia | Cliente | Debe permitir añadir, aumentar, disminuir y eliminar artículos, calcular subtotales y total, aplicar el precio de oferta y persistir en `localStorage`. |
| RF-07 | Checkout | Cliente | Debe solicitar nombre, apellidos, correo, región, comuna, dirección y opción de entrega, con validaciones. Si hay sesión, los datos se precargan. No permite ingresar con el carrito vacío. |
| RF-08 | Resultado de compra | Cliente | Tras el pago simulado debe mostrar una vista de compra exitosa con número de orden y resumen (y registrar el pedido), o una vista de pago fallido que conserva el carrito. |
| RF-09 | Registro de usuario | Cliente | Debe validar: RUN (7 a 9 caracteres, sin puntos ni guion), nombre (máx. 50), apellidos (máx. 100), correo (máx. 100, dominios `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`), contraseña (4 a 10) con confirmación, región, comuna y dirección (máx. 300). Rechaza RUN o correo duplicados. |
| RF-10 | Selectores región/comuna | Cliente/Admin | Al elegir una región, el selector de comunas debe actualizarse con las comunas de esa región. |
| RF-11 | Inicio de sesión | Cliente/Admin/Vendedor | Debe validar formato de correo y contraseña (4 a 10) y autenticar contra los usuarios almacenados. El personal es redirigido al panel y el cliente a la tienda. |
| RF-12 | Formulario de contacto | Cliente | Debe validar nombre (máx. 100), correo autorizado y mensaje obligatorio (máx. 500). |
| RF-13 | Control de acceso por rol | Admin/Vendedor | Las rutas `/admin` deben estar protegidas: sin sesión redirigen a `/login`, un Cliente es enviado a la tienda y la gestión de usuarios solo está disponible para el Administrador. |
| RF-14 | Dashboard | Admin/Vendedor | Debe mostrar en tiempo real la cantidad de productos, usuarios (solo Administrador), pedidos e ingresos acumulados. |
| RF-15 | CRUD de productos | Admin/Vendedor | Debe permitir crear, editar y eliminar productos (con confirmación). Código con formato `ABC-123` y único, categoría obligatoria, precio entero mayor a 0, oferta menor al precio y stock entero ≥ 0. |
| RF-16 | CRUD de usuarios | Admin | Debe permitir crear, editar (RUN inmutable, contraseña opcional) y eliminar usuarios, asignando el rol mediante lista desplegable. No permite eliminar la propia cuenta. El rol no es editable en el registro público. |
| RF-17 | Contenido editorial | Cliente | Debe incluir la página Nosotros y un listado de blogs con vista de detalle por artículo. |
| RF-18 | Contenido multimedia en blogs | Cliente | Los detalles de blog deben incorporar video embebido. **[Pendiente de implementar en esta entrega]** |
| RF-19 | Página no encontrada | Cliente | Toda ruta inexistente debe mostrar una página 404 con enlace al inicio. |

### 3.3. Requisitos no funcionales

#### 3.3.1. Rendimiento
- El renderizado de las vistas principales debe completarse en menos de 300 ms en condiciones normales de hardware.
- El cambio entre vistas no debe recargar la página (SPA).

#### 3.3.2. Seguridad
- Validación de entradas en cliente mediante funciones puras reutilizables (`src/utils/validaciones.js`).
- Control de acceso por rol mediante `ProtectedRoute`.
- La autenticación no expone la contraseña en el objeto de sesión.
- **Limitación conocida:** las contraseñas se almacenan sin cifrar en `localStorage`; es aceptable solo por tratarse de una simulación sin backend.

#### 3.3.3. Fiabilidad
El carrito y la sesión deben tolerar recargas del navegador sin pérdida de datos. La lectura de `localStorage` debe manejar datos corruptos sin romper la aplicación.

#### 3.3.4. Disponibilidad
Al ser una aplicación de archivos estáticos, puede alojarse en cualquier servidor web o servicio de hosting estático.

#### 3.3.5. Mantenibilidad
- Componentes de responsabilidad única, organizados en `components/`, `pages/`, `context/`, `data/` y `utils/`.
- Lógica de negocio en funciones puras, fáciles de probar.
- Estilos centralizados en `src/styles/styles.css`.
- Control de versiones con Conventional Commits en una rama de trabajo.
- Pruebas automatizadas que permiten refactorizar con seguridad.

#### 3.3.6. Portabilidad
Funciona en Windows, macOS y Linux con un navegador moderno. El diseño responsivo cubre móviles (320 a 768 px), tabletas (768 a 1024 px) y escritorio (> 1024 px).

#### 3.3.7. Testeabilidad
El código debe poder verificarse mediante pruebas unitarias con Jasmine y Karma, con un mínimo de 10 pruebas que validen lógica, renderizado, propiedades, estado y eventos.

### 3.4. Arquitectura de la solución

```
src/
├── components/   layout (Navbar, Footer, AdminLayout) · products · cart · forms · common
├── pages/        store/ (tienda) · admin/ (panel)
├── context/      AuthContext (sesión y roles) · CartContext (carrito)
├── data/         db.js (CRUD en localStorage) · chileGeo.js · blogs.js
└── utils/        validaciones · filtros · formatters · precios · alerts
spec/             pruebas Jasmine
```

- **Estado global:** `AuthContext` (usuario, login, logout, roles) y `CartContext` (ítems, totales).
- **Estado local:** formularios, filtros y selección de talla con `useState`.
- **Persistencia:** `db.js` expone CRUD de productos, usuarios y pedidos sobre `localStorage`.

### 3.5. Estrategia de pruebas
- **Herramientas:** Jasmine, Karma, ChromeHeadless, Webpack, Babel, Testing Library e Istanbul.
- **Alcance:** 22 pruebas que cubren renderizado, renderizado condicional, props, estado y eventos.
- **Mocks:** spies de Jasmine, `localStorage` simulado y `MemoryRouter`.
- **Cobertura obtenida:** sentencias 72 %, ramas 65 %, funciones 79,48 % y líneas 74,7 %.
- **Detalle:** ver `docs/cobertura-testing.md`.

### 3.6. Otros Requisitos
- **Repositorio público:** el código se mantiene en https://github.com/Cadennnnnn/ARCHIVE-src, en el mismo repositorio de la Evaluación 1.
- **Entregables:** enlace a GitHub, proyecto comprimido, este documento ERS (v2) y el documento de cobertura de testing.