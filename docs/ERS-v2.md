# Especificación de Requisitos de Software (ERS)

**Estándar IEEE 830 · Proyecto ARCHIVE[src] · Revisión 4**

**Asignatura:** Desarrollo Full Stack II (DSY1104) · Sección 002D
**Institución:** Duoc UC, Escuela de Informática y Telecomunicaciones
**Fecha de actualización:** 04 de noviembre de 2026
**Estado:** Documentación de la rama `feature/react-rebuild`

---

## Historial de revisiones

| Fecha | Revisión | Modificación |
|---|---:|---|
| 08-09-2026 | 1 | Propuesta inicial y especificación de requerimientos frontend para la Entrega 1. |
| 15-10-2026 | 2 | Migración a React, nuevas vistas, CRUD con persistencia local y pruebas Jasmine/Karma. |
| 04-11-2026 | 3 | Actualización de arquitectura, funcionalidades administrativas y de cliente, y estrategia de pruebas. |
| 04-11-2026 | 4 | Actualización de resultados de testing: 135 pruebas exitosas. Se elimina RF-18, correspondiente a video en blogs, del alcance del proyecto. Se actualizan los requisitos y las limitaciones según la implementación final. |

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no funcionales de ARCHIVE[src] para la Evaluación Parcial 2. Describe el comportamiento esperado de la aplicación, sus restricciones, arquitectura frontend y estrategia de pruebas.

Su propósito es establecer el alcance funcional del sistema, documentar sus características y servir como referencia para el desarrollo, validación y evaluación del proyecto.

### 1.2 Ámbito del sistema

**Nombre:** ARCHIVE[src].

ARCHIVE[src] es una aplicación web SPA para explorar y comprar de forma simulada zapatillas, indumentaria y accesorios urbanos.

Incluye catálogo de productos, búsqueda y filtros, categorías, ofertas, detalle de productos, carrito persistente, checkout con resultado de pago simulado, autenticación por roles, perfil de cliente y un panel administrativo para gestionar información de la tienda.

La aplicación se ejecuta en el frontend. Los datos de usuarios, productos administrables, categorías, pedidos, sesión y carrito se almacenan localmente mediante `localStorage` y servicios frontend.

**Fuera del alcance:**

- Procesamiento de pagos bancarios reales.
- Integración con empresas de despacho o seguimiento logístico.
- API o servidor backend y base de datos remota.
- Seguridad de producción para credenciales o sesiones.
- Emisión de documentos tributarios oficiales.
- Incorporación de video embebido en los artículos del blog.

La boleta disponible es un comprobante interno de la compra simulada y no constituye un documento tributario.

### 1.3 Definiciones

- **ERS:** Especificación de Requisitos de Software.
- **SPA:** Single Page Application.
- **Atomic Design:** organización de interfaz en Atoms, Molecules, Organisms, Templates y Pages.
- **Props:** propiedades recibidas por un componente React.
- **State:** estado que controla la actualización de la interfaz.
- **Context:** mecanismo React para compartir estado entre componentes.
- **Custom Hook:** función que encapsula lógica reutilizable de React.
- **CRUD:** Create, Read, Update y Delete.
- **localStorage:** almacenamiento clave-valor del navegador.
- **Jasmine:** framework de pruebas.
- **Karma:** ejecutor de pruebas en navegador.
- **Mock/Spy:** sustituto o espía utilizado para simular, observar o controlar comportamientos durante una prueba.

### 1.4 Referencias

- Estándar IEEE 830-1998.
- Pauta, rúbrica y Anexo 1 de la Evaluación Parcial 2, DSY1104, Duoc UC.
- Especificación de requisitos de ARCHIVE[src], revisiones anteriores.
- Documento de cobertura de testing: `docs/cobertura-testing.md`.
- Repositorio del proyecto: https://github.com/Cadennnnnn/ARCHIVE-src.

### 1.5 Visión general

La sección 2 describe el producto, sus usuarios y restricciones. La sección 3 especifica interfaces, requisitos funcionales y no funcionales, arquitectura y pruebas.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

ARCHIVE[src] es una aplicación frontend construida con React y Vite. React Router administra la navegación entre la tienda, autenticación, perfil y panel administrativo.

No requiere backend: los servicios frontend gestionan la lectura y escritura de datos en `localStorage`.

La lógica reutilizable se distribuye entre Custom Hooks, servicios, contextos y utilidades. La interfaz se organiza siguiendo Atomic Design, separando los componentes visuales de la lógica de negocio para favorecer la reutilización y mantenibilidad.

**Limitación de sincronización:** el inventario gestionado desde el panel administrativo utiliza su propia persistencia local y no se encuentra sincronizado automáticamente con el catálogo estático inicial de la tienda. No debe interpretarse como un sistema de inventario conectado a una base de datos central.

### 2.2 Funciones del producto

La aplicación contempla las siguientes funcionalidades:

- Catálogo de productos con búsqueda y filtros.
- Vistas de categorías y ofertas.
- Detalle de producto con tallas, stock y selección de cantidad.
- Carrito con modificación de cantidades, eliminación, cálculo de subtotal y persistencia.
- Checkout con datos de envío y pago simulado.
- Registro, inicio de sesión y control de acceso según rol.
- Perfil de cliente con edición de datos personales.
- Administración de direcciones y métodos de pago guardados.
- Historial de pedidos del cliente.
- Consulta e impresión de comprobantes internos de compra.
- Panel administrativo con dashboard.
- Gestión administrativa de productos, usuarios y categorías.
- Consulta de pedidos y detalle de órdenes.
- Identificación de productos con stock crítico.
- Reportes administrativos con filtros y exportación CSV.
- Páginas Nosotros, Blogs, detalle de blog y Contacto.
- Página 404 para rutas no encontradas.

### 2.3 Tipos de usuario

- **Cliente:** navega por la tienda, administra su perfil, realiza compras simuladas y consulta sus pedidos y comprobantes.
- **Vendedor:** accede a las funciones administrativas autorizadas para su rol, como consulta y gestión operativa de inventario y pedidos. No tiene acceso a la gestión administrativa de usuarios.
- **Administrador:** dispone de las funciones administrativas, incluida la gestión de usuarios.

Las rutas administrativas están protegidas mediante autenticación y autorización por rol.

### 2.4 Restricciones

- Framework frontend: React.
- Lenguaje de aplicación: TypeScript.
- Herramienta de desarrollo y build: Vite.
- Navegación: React Router.
- Estilos y diseño responsivo: Bootstrap 5 y CSS del proyecto.
- Alertas: SweetAlert2.
- Pruebas: Jasmine y Karma.
- Persistencia: `localStorage`.
- No se utiliza backend ni base de datos remota.
- La interfaz debe mantener una organización por Atomic Design.
- La lógica de negocio debe mantenerse separada de la presentación mediante servicios, contextos y Custom Hooks.
- Los componentes deben favorecer la reutilización y mantener responsabilidades acotadas.

### 2.5 Suposiciones y dependencias

- El usuario dispone de un navegador moderno compatible con las APIs utilizadas por React.
- El navegador permite el uso de `localStorage`.
- Las pruebas se ejecutan en un entorno con Node.js y Google Chrome/ChromeHeadless instalados.
- Los recursos externos, como imágenes y fuentes, dependen de su disponibilidad en sus respectivos servidores.

### 2.6 Requisitos futuros y limitaciones conocidas

Las siguientes funcionalidades corresponden a posibles ampliaciones posteriores y no forman parte de los requisitos implementados para esta entrega:

- Incorporar backend y API para centralizar usuarios, productos, inventario y pedidos.
- Incorporar base de datos persistente y almacenamiento seguro de credenciales.
- Integrar una pasarela de pago real.
- Sincronizar el inventario administrativo con el catálogo de la tienda.
- Integrar servicios de despacho.
- Ampliar las pruebas de integración y aceptación de los flujos completos.

La incorporación de video en los artículos del blog queda fuera del alcance definitivo del proyecto.

---

## 3. Requisitos específicos

### 3.1 Interfaces

#### 3.1.1 Interfaz de usuario

La tienda dispone de navegación hacia Inicio, Productos, Categorías, Ofertas, Nosotros, Blogs y Contacto, además de acceso a autenticación, perfil y carrito según el estado de sesión.

El panel administrativo utiliza una estructura de navegación propia. Las opciones visibles y accesibles dependen del rol autenticado.

La interfaz debe presentar mensajes de validación y retroalimentación para las operaciones relevantes.

#### 3.1.2 Hardware y diseño adaptable

La aplicación está diseñada para escritorio, tabletas y dispositivos móviles mediante CSS y grillas responsivas de Bootstrap.

La compatibilidad exacta debe verificarse en los tamaños definidos por la pauta del proyecto.

#### 3.1.3 Interfaces de software

La implementación utiliza React, React DOM, TypeScript, Vite, React Router, Bootstrap, SweetAlert2, Jasmine, Karma, Webpack, Babel, Testing Library e Istanbul, según las dependencias y configuración del proyecto.

#### 3.1.4 Comunicación

No existe comunicación con un backend de datos. Los recursos estáticos pueden obtenerse desde servidores externos; las operaciones de negocio descritas se ejecutan localmente en el navegador.

### 3.2 Requisitos funcionales

| Código | Requisito | Actor | Descripción |
|---|---|---|---|
| RF-01 | Catálogo | Cliente/Vendedor/Admin | Mostrar productos con imagen, nombre, categoría y precio. |
| RF-02 | Búsqueda y filtros | Cliente | Filtrar productos por texto y categoría y comunicar cuando no existan coincidencias. |
| RF-03 | Categorías | Cliente | Mostrar la vista de categorías y permitir navegar a productos de una categoría. |
| RF-04 | Ofertas | Cliente | Mostrar productos con precio rebajado y precio original cuando corresponda. |
| RF-05 | Detalle de producto | Cliente | Mostrar información del producto y permitir seleccionar talla y cantidad respetando el stock disponible. |
| RF-06 | Carrito persistente | Cliente | Agregar, actualizar y eliminar productos; calcular subtotales y conservar el carrito en `localStorage`. |
| RF-07 | Checkout | Cliente | Recopilar datos de envío, validar la información y procesar un pago simulado. No debe permitir continuar con el carrito vacío. |
| RF-08 | Resultado de compra | Cliente | Registrar el pedido y mostrar resultado aceptado o declinado. Si el pago es declinado, conservar el carrito. |
| RF-09 | Registro | Cliente | Validar los datos requeridos y evitar duplicidad de identificadores y correo según las reglas implementadas. |
| RF-10 | Región y comuna | Cliente/Admin | Permitir seleccionar región y comuna mediante los datos geográficos disponibles en la aplicación. |
| RF-11 | Inicio de sesión | Cliente/Admin/Vendedor | Validar credenciales locales y establecer una sesión con el rol correspondiente. |
| RF-12 | Contacto | Cliente | Presentar un formulario de contacto con validación de campos. |
| RF-13 | Control de acceso | Cliente/Admin/Vendedor | Restringir rutas administrativas según autenticación y rol. La gestión de usuarios corresponde al Administrador. |
| RF-14 | Dashboard | Admin/Vendedor | Mostrar indicadores administrativos derivados de los datos locales disponibles. |
| RF-15 | CRUD de productos | Admin/Vendedor | Crear, consultar, editar y eliminar productos del inventario administrativo con validaciones. El inventario administrativo no está sincronizado automáticamente con el catálogo inicial de la tienda. |
| RF-16 | CRUD de usuarios | Admin | Crear, consultar, editar y eliminar usuarios según las restricciones de la aplicación. Permitir consultar el historial de compras del usuario seleccionado. |
| RF-17 | Contenido editorial | Cliente | Mostrar la página Nosotros, el listado de blogs y el detalle de cada artículo. |
| RF-19 | Página 404 | Todos | Mostrar una página de recurso no encontrado para rutas inexistentes. |
| RF-20 | Gestión de categorías | Admin/Vendedor | Administrar categorías disponibles mediante las funciones del panel y utilizarlas en las vistas de categorías y filtros de la tienda. |
| RF-21 | Stock crítico | Admin/Vendedor | Identificar y mostrar productos cuyo stock cumpla la condición de stock crítico configurada por la aplicación. |
| RF-22 | Gestión de pedidos | Admin/Vendedor | Consultar pedidos registrados y acceder al detalle de una orden. |
| RF-23 | Reportes | Admin/Vendedor | Consultar indicadores de pedidos y ventas, aplicar filtros disponibles y exportar los resultados a CSV. Los cálculos utilizan los pedidos guardados localmente. |
| RF-24 | Perfil del cliente | Cliente | Consultar y actualizar datos personales y administrar direcciones y métodos de pago guardados. |
| RF-25 | Historial y boletas | Cliente | Consultar los pedidos asociados a la cuenta y abrir el comprobante interno de una orden propia. El comprobante no constituye un documento tributario. |

**Nota sobre numeración:** RF-18 se elimina del alcance porque la incorporación de video en blogs fue descartada. Se conserva la numeración original de los requisitos restantes para mantener la trazabilidad documental.

### 3.3 Requisitos no funcionales

#### 3.3.1 Rendimiento

La aplicación debe mantener navegación SPA sin recarga completa entre vistas. No se establece un resultado de rendimiento medido en milisegundos sin una prueba de rendimiento documentada.

#### 3.3.2 Seguridad

- Validar entradas en el frontend.
- Proteger rutas mediante componentes de autorización.
- Evitar exponer contraseñas en el objeto de sesión.
- Restringir el acceso a datos de pedidos y comprobantes según la cuenta autenticada.
- **Limitación:** `localStorage` y la autenticación frontend no proporcionan seguridad equivalente a un backend. Las credenciales y datos locales no deben considerarse protegidos para producción.

#### 3.3.3 Fiabilidad

El carrito y la sesión utilizan persistencia local. La lectura de datos almacenados debe contemplar valores ausentes o inválidos para evitar fallos de la interfaz.

Las operaciones de checkout deben manejar errores de persistencia y entregar retroalimentación al usuario cuando no sea posible procesar una compra.

#### 3.3.4 Disponibilidad

La aplicación puede desplegarse como frontend estático. La persistencia depende del navegador y del dispositivo donde se utiliza.

#### 3.3.5 Mantenibilidad

- Organizar la interfaz mediante Atomic Design.
- Mantener componentes enfocados en una responsabilidad.
- Reutilizar lógica mediante Custom Hooks, servicios y utilidades.
- Mantener el estado compartido en contextos cuando corresponda.
- Separar tipos, datos, presentación y lógica de negocio.
- Mantener pruebas automatizadas para reducir regresiones.
- Aplicar principios SOLID, DRY y Clean Code en la organización y desarrollo del código.

#### 3.3.6 Portabilidad

La aplicación debe funcionar en navegadores modernos compatibles con React y `localStorage`. El comportamiento responsivo debe validarse en dispositivos móviles, tabletas y escritorio.

#### 3.3.7 Testeabilidad

La suite utiliza Jasmine y Karma. La última ejecución validada contiene **135 pruebas exitosas y 0 fallidas**.

Las pruebas verifican validaciones, renderizado, props, estado, eventos, navegación, servicios, contextos, rutas protegidas y procesamiento del checkout.

Se utilizan spies de Jasmine para observar callbacks e interceptar o simular errores. La cobertura registrada es:

| Métrica | Resultado |
|---|---:|
| Statements | 85,74 % |
| Branches | 77,97 % |
| Functions | 94,95 % |
| Lines | 85,90 % |

Los resultados y límites de cobertura se describen en `docs/cobertura-testing.md`.

### 3.4 Arquitectura de la solución

La estructura principal del frontend es:

```text
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── pages/
│   ├── admin/
│   ├── auth/
│   └── store/
├── context/
├── hooks/
├── services/
├── data/
├── routes/
├── types/
├── styles/
└── utils/

spec/
├── components/
├── context/
├── hooks/
├── routes/
├── service/
├── services/
└── validation/
```
**Responsabilidades principales:**

- `components/`: componentes reutilizables organizados mediante Atomic Design.
- `pages/`: vistas completas de la aplicación, separadas por áreas funcionales.
- `context/`: administración y distribución de estados compartidos.
- `hooks/`: Custom Hooks que encapsulan lógica reutilizable y comportamiento de la aplicación.
- `services/`: operaciones de negocio y persistencia de información.
- `data/`: datos iniciales y simulados.
- `routes/`: configuración y protección de rutas.
- `types/`: definición de interfaces y tipos TypeScript.
- `styles/`: estilos globales y específicos de los componentes.
- `utils/`: validaciones y funciones auxiliares.
- `spec/`: pruebas automatizadas organizadas por componentes, contextos, hooks, rutas, servicios y validaciones.

### 3.5 Estrategia de pruebas

La estrategia de pruebas automatizadas utiliza las siguientes herramientas:

- **Framework:** Jasmine.
- **Ejecutor:** Karma.
- **Navegador:** ChromeHeadless.
- **Empaquetado:** Webpack.
- **Transpilación:** Babel.
- **Interacción con componentes:** React DOM y Testing Library.
- **Cobertura:** Istanbul.
- **Comando de ejecución:** `npm run test`.

La suite contiene 135 pruebas exitosas y 0 fallidas en la última ejecución validada.

Las pruebas abarcan componentes, validaciones, contextos, servicios, rutas protegidas y checkout. Se utilizan spies de Jasmine para verificar callbacks y simular errores de persistencia.

No se implementan mocks de API ni de servicios externos. La persistencia se prueba mediante el almacenamiento local del navegador.

Los resultados detallados, porcentajes de cobertura y limitaciones se documentan en `docs/cobertura-testing.md`.

### 3.6 Entregables

Los entregables del proyecto son:

- Repositorio público del proyecto ARCHIVE[src].
- Aplicación frontend migrada a React.
- Código fuente organizado mediante Atomic Design.
- Especificación de Requisitos de Software actualizada.
- Documento de cobertura de testing.
- Suite de pruebas automatizadas Jasmine/Karma.
- Evidencias de ejecución y resultados de pruebas.
- Proyecto comprimido en formato ZIP para su entrega.
- Material de apoyo para la presentación y defensa del desarrollo.
