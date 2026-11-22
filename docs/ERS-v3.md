# Especificación de Requisitos de Software (ERS)

**Estándar IEEE 830 · Proyecto ARCHIVE[src] + ARCHIVE[backend] · Revisión 5**

**Asignatura:** Desarrollo Full Stack II (DSY1104)
**Institución:** Duoc UC, Escuela de Informática y Telecomunicaciones
**Fecha de actualización:** 22 de noviembre de 2026
**Estado:** Documentación de la Evaluación 3 — integración con backend Spring Boot

---

## Historial de revisiones

| Fecha | Revisión | Modificación |
|---|---:|---|
| 08-09-2026 | 1 | Propuesta inicial y especificación de requerimientos frontend para la Entrega 1. |
| 15-10-2026 | 2 | Migración a React, nuevas vistas, CRUD con persistencia local y pruebas Jasmine/Karma. |
| 04-11-2026 | 3 | Actualización de arquitectura, funcionalidades administrativas y de cliente, y estrategia de pruebas. |
| 04-11-2026 | 4 | Actualización de resultados de testing: 135 pruebas exitosas. Se elimina RF-18, correspondiente a video en blogs, del alcance del proyecto. Se actualizan los requisitos y las limitaciones según la implementación final. |
| 22-11-2026 | 5 | Evaluación 3: incorporación del backend ARCHIVE[backend] (Spring Boot + MySQL), autenticación JWT, control de acceso por roles a nivel de API, y actualización de arquitectura, requisitos y estrategia de pruebas para reflejar la solución integrada. |

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no funcionales de la solución ARCHIVE para la Evaluación 3. Describe el comportamiento esperado de la aplicación, sus restricciones, la arquitectura cliente-servidor (frontend React + backend Spring Boot) y la estrategia de pruebas de ambos componentes.

Su propósito es establecer el alcance funcional del sistema, documentar sus características y servir como referencia para el desarrollo, validación y evaluación del proyecto.

### 1.2 Ámbito del sistema

**Nombre:** ARCHIVE (frontend: ARCHIVE[src], backend: ARCHIVE[backend]).

ARCHIVE es una aplicación web para explorar y comprar de forma simulada zapatillas, indumentaria y accesorios urbanos.

Incluye catálogo de productos, búsqueda y filtros, categorías, ofertas, detalle de productos, carrito, checkout con resultado de pago simulado, autenticación por roles, perfil de cliente y un panel administrativo para gestionar información de la tienda.

La aplicación se compone de un frontend (React + TypeScript) y un backend (Spring Boot + MySQL) que expone una API REST. Los datos de usuarios, productos, categorías, pedidos, direcciones y métodos de pago se almacenan en la base de datos del backend y se consultan mediante la API. El carrito de compras y la sesión del usuario (token JWT) se mantienen en `localStorage` del navegador.

**Fuera del alcance:**

- Procesamiento de pagos bancarios reales.
- Integración con empresas de despacho o seguimiento logístico.
- Sincronización automática entre el inventario administrado y el catálogo mostrado en la tienda.
- Emisión de documentos tributarios oficiales.
- Incorporación de video embebido en los artículos del blog.

La boleta disponible es un comprobante interno de la compra simulada y no constituye un documento tributario.

### 1.3 Definiciones

- **ERS:** Especificación de Requisitos de Software.
- **SPA:** Single Page Application.
- **API REST:** interfaz de comunicación entre frontend y backend basada en HTTP y recursos.
- **JWT (JSON Web Token):** token firmado que identifica al usuario autenticado y su rol, enviado en cada solicitud a la API.
- **Atomic Design:** organización de interfaz en Atoms, Molecules, Organisms, Templates y Pages.
- **Props:** propiedades recibidas por un componente React.
- **State:** estado que controla la actualización de la interfaz.
- **Context:** mecanismo React para compartir estado entre componentes.
- **Custom Hook:** función que encapsula lógica reutilizable de React.
- **CRUD:** Create, Read, Update y Delete.
- **localStorage:** almacenamiento clave-valor del navegador.
- **ORM:** mapeo objeto-relacional (en el backend, Spring Data JPA/Hibernate).
- **Jasmine:** framework de pruebas del frontend.
- **Karma:** ejecutor de pruebas en navegador del frontend.
- **JUnit / MockMvc:** framework y utilidad de pruebas del backend.
- **Mock/Spy:** sustituto o espía utilizado para simular, observar o controlar comportamientos durante una prueba.

### 1.4 Referencias

- Estándar IEEE 830-1998.
- Pauta, rúbrica y enunciado de la Evaluación 3, DSY1104, Duoc UC.
- Especificación de requisitos de ARCHIVE[src], revisiones anteriores.
- Documento de cobertura de testing: `docs/cobertura-testing.md`.
- Repositorio del frontend: https://github.com/Cadennnnnn/ARCHIVE-src.
- Repositorio del backend: https://github.com/Cadennnnnn/ARCHIVE-backend.

### 1.5 Visión general

La sección 2 describe el producto, sus usuarios y restricciones. La sección 3 especifica interfaces, requisitos funcionales y no funcionales, arquitectura y pruebas, para el frontend y el backend.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

ARCHIVE sigue una arquitectura cliente-servidor:

- **Frontend:** aplicación React + Vite, con React Router para la navegación entre tienda, autenticación, perfil y panel administrativo.
- **Backend:** API REST construida con Spring Boot, que expone los recursos de productos, categorías, usuarios, direcciones, métodos de pago y órdenes, respaldados por una base de datos MySQL.

El frontend consume la API a través de un cliente HTTP centralizado (`httpClient.ts`), que agrega automáticamente el token JWT en cada solicitud autenticada. La autenticación (login) se realiza contra el backend, que valida las credenciales y responde con un token JWT que identifica al usuario y su rol.

La lógica reutilizable del frontend se distribuye entre Custom Hooks, servicios, contextos y utilidades, organizada mediante Atomic Design. El backend organiza su lógica en controladores, servicios y repositorios, siguiendo una capa de seguridad (Spring Security) que valida el token JWT y restringe el acceso según el rol.

**Limitación de sincronización:** el inventario gestionado desde el panel administrativo no se encuentra sincronizado automáticamente con el catálogo estático inicial de la tienda. No debe interpretarse como un sistema de inventario con sincronización en tiempo real.

### 2.2 Funciones del producto

La aplicación contempla las siguientes funcionalidades:

- Catálogo de productos con búsqueda y filtros.
- Vistas de categorías y ofertas.
- Detalle de producto con tallas, stock y selección de cantidad.
- Carrito con modificación de cantidades, eliminación, cálculo de subtotal y persistencia local.
- Checkout con datos de envío y pago simulado.
- Registro, inicio de sesión mediante la API y control de acceso según rol.
- Perfil de cliente con edición de datos personales.
- Administración de direcciones y métodos de pago guardados, mediante la API.
- Historial de pedidos del cliente, consultado desde la API.
- Consulta e impresión de comprobantes internos de compra.
- Panel administrativo con dashboard.
- Gestión administrativa de productos, usuarios y categorías mediante la API.
- Consulta de pedidos y detalle de órdenes.
- Identificación de productos con stock crítico.
- Reportes administrativos con filtros y exportación CSV.
- Páginas Nosotros, Blogs, detalle de blog y Contacto.
- Página 404 para rutas no encontradas.
- Documentación interactiva de la API mediante Swagger UI.

### 2.3 Tipos de usuario

- **Cliente:** navega por la tienda, administra su perfil, realiza compras simuladas y consulta sus pedidos y comprobantes.
- **Vendedor:** accede a las funciones administrativas autorizadas para su rol, como consulta y gestión operativa de inventario y pedidos. No tiene acceso a la gestión administrativa de usuarios.
- **Administrador:** dispone de las funciones administrativas, incluida la gestión de usuarios.

Las rutas administrativas del frontend están protegidas mediante autenticación y autorización por rol, y los mismos criterios de rol se validan nuevamente en el backend antes de ejecutar cada operación.

### 2.4 Restricciones

- Framework frontend: React.
- Lenguaje de aplicación (frontend): TypeScript.
- Herramienta de desarrollo y build (frontend): Vite.
- Navegación: React Router.
- Estilos y diseño responsivo: Bootstrap 5 y CSS del proyecto.
- Alertas: SweetAlert2.
- Pruebas frontend: Jasmine y Karma.
- Framework backend: Spring Boot.
- Persistencia backend: MySQL mediante Spring Data JPA/Hibernate.
- Seguridad backend: Spring Security con autenticación JWT.
- Documentación de la API: springdoc-openapi (Swagger UI).
- Pruebas backend: JUnit 5 y MockMvc.
- El carrito de compras y el token de sesión se mantienen en `localStorage` del navegador.
- La interfaz debe mantener una organización por Atomic Design.
- La lógica de negocio del frontend debe mantenerse separada de la presentación mediante servicios, contextos y Custom Hooks.
- Los componentes deben favorecer la reutilización y mantener responsabilidades acotadas.

### 2.5 Suposiciones y dependencias

- El usuario dispone de un navegador moderno compatible con las APIs utilizadas por React.
- El navegador permite el uso de `localStorage`.
- El backend requiere una instancia de MySQL accesible y configurada previamente.
- Las pruebas del frontend se ejecutan en un entorno con Node.js y Google Chrome/ChromeHeadless instalados.
- Las pruebas del backend se ejecutan con Maven (incluido el wrapper `mvnw`) y JDK 21.
- Los recursos externos, como imágenes y fuentes, dependen de su disponibilidad en sus respectivos servidores.

### 2.6 Requisitos futuros y limitaciones conocidas

Las siguientes funcionalidades corresponden a posibles ampliaciones posteriores y no forman parte de los requisitos implementados para esta entrega:

- Migrar la persistencia del carrito de compras al backend (actualmente es una decisión de diseño mantenerlo en `localStorage`, ya que la rúbrica no exige su persistencia en servidor).
- Integrar una pasarela de pago real.
- Sincronizar el inventario administrativo con el catálogo de la tienda en tiempo real.
- Integrar servicios de despacho.
- Ampliar las pruebas de integración y aceptación de los flujos completos.
- Reemplazar la estrategia `ddl-auto=create-drop` por migraciones versionadas (por ejemplo, Flyway o Liquibase) para un entorno distinto al académico.

La incorporación de video en los artículos del blog queda fuera del alcance definitivo del proyecto.

---

## 3. Requisitos específicos

### 3.1 Interfaces

#### 3.1.1 Interfaz de usuario

La tienda dispone de navegación hacia Inicio, Productos, Categorías, Ofertas, Nosotros, Blogs y Contacto, además de acceso a autenticación, perfil y carrito según el estado de sesión.

El panel administrativo utiliza una estructura de navegación propia. Las opciones visibles y accesibles dependen del rol autenticado.

La interfaz debe presentar mensajes de validación y retroalimentación para las operaciones relevantes, incluidos los errores devueltos por la API (por ejemplo, credenciales inválidas o sesión expirada).

#### 3.1.2 Hardware y diseño adaptable

La aplicación está diseñada para escritorio, tabletas y dispositivos móviles mediante CSS y grillas responsivas de Bootstrap.

La compatibilidad exacta debe verificarse en los tamaños definidos por la pauta del proyecto.

#### 3.1.3 Interfaces de software

**Frontend:** React, React DOM, TypeScript, Vite, React Router, Bootstrap, SweetAlert2, Jasmine, Karma, Webpack, Babel, Testing Library e Istanbul.

**Backend:** Spring Boot, Spring Web, Spring Data JPA, Spring Security, MySQL Connector/J, jjwt (JWT), springdoc-openapi, JUnit 5, MockMvc, Mockito, Maven.

#### 3.1.4 Comunicación

El frontend se comunica con el backend mediante solicitudes HTTP a una API REST (`http://localhost:8080/api/v1` en el entorno de desarrollo). Las solicitudes a rutas protegidas incluyen el encabezado `Authorization: Bearer <token>` con el JWT obtenido en el login. Los recursos estáticos (imágenes, fuentes) pueden obtenerse desde servidores externos.

### 3.2 Requisitos funcionales

| Código | Requisito | Actor | Descripción |
|---|---|---|---|
| RF-01 | Catálogo | Cliente/Vendedor/Admin | Mostrar productos con imagen, nombre, categoría y precio. |
| RF-02 | Búsqueda y filtros | Cliente | Filtrar productos por texto y categoría y comunicar cuando no existan coincidencias. |
| RF-03 | Categorías | Cliente | Mostrar la vista de categorías y permitir navegar a productos de una categoría. |
| RF-04 | Ofertas | Cliente | Mostrar productos con precio rebajado y precio original cuando corresponda. |
| RF-05 | Detalle de producto | Cliente | Mostrar información del producto y permitir seleccionar talla y cantidad respetando el stock disponible. |
| RF-06 | Carrito | Cliente | Agregar, actualizar y eliminar productos; calcular subtotales y conservar el carrito en `localStorage`. |
| RF-07 | Checkout | Cliente | Recopilar datos de envío, validar la información y procesar un pago simulado. No debe permitir continuar con el carrito vacío. |
| RF-08 | Resultado de compra | Cliente | Registrar el pedido en el backend y mostrar resultado aceptado o declinado. Si el pago es declinado, conservar el carrito. |
| RF-09 | Registro | Cliente | Validar los datos requeridos y registrar el usuario mediante la API, evitando duplicidad de identificadores y correo. |
| RF-10 | Región y comuna | Cliente/Admin | Permitir seleccionar región y comuna mediante los datos geográficos disponibles en la aplicación. |
| RF-11 | Inicio de sesión | Cliente/Admin/Vendedor | Autenticar credenciales contra el backend y recibir un token JWT que establece la sesión y el rol correspondiente. |
| RF-12 | Contacto | Cliente | Presentar un formulario de contacto con validación de campos. |
| RF-13 | Control de acceso | Cliente/Admin/Vendedor | Restringir rutas administrativas del frontend según autenticación y rol, y validar nuevamente el rol en cada endpoint protegido del backend. La gestión de usuarios corresponde al Administrador. |
| RF-14 | Dashboard | Admin/Vendedor | Mostrar indicadores administrativos derivados de los datos obtenidos desde la API. |
| RF-15 | CRUD de productos | Admin/Vendedor | Crear, consultar, editar y eliminar productos mediante la API, con validaciones. El inventario no está sincronizado automáticamente con el catálogo inicial de la tienda. |
| RF-16 | CRUD de usuarios | Admin | Crear, consultar, editar y eliminar usuarios mediante la API, según las restricciones de la aplicación. Permitir consultar el historial de compras del usuario seleccionado. |
| RF-17 | Contenido editorial | Cliente | Mostrar la página Nosotros, el listado de blogs y el detalle de cada artículo. |
| RF-19 | Página 404 | Todos | Mostrar una página de recurso no encontrado para rutas inexistentes. |
| RF-20 | Gestión de categorías | Admin/Vendedor | Administrar categorías disponibles mediante la API y utilizarlas en las vistas de categorías y filtros de la tienda. |
| RF-21 | Stock crítico | Admin/Vendedor | Identificar y mostrar productos cuyo stock cumpla la condición de stock crítico configurada por la aplicación. |
| RF-22 | Gestión de pedidos | Admin/Vendedor | Consultar pedidos registrados en el backend y acceder al detalle de una orden. |
| RF-23 | Reportes | Admin/Vendedor | Consultar indicadores de pedidos y ventas, aplicar filtros disponibles y exportar los resultados a CSV. Los cálculos utilizan los pedidos obtenidos desde la API. |
| RF-24 | Perfil del cliente | Cliente | Consultar y actualizar datos personales y administrar direcciones y métodos de pago guardados mediante la API. |
| RF-25 | Historial y boletas | Cliente | Consultar los pedidos asociados a la cuenta y abrir el comprobante interno de una orden propia. El comprobante no constituye un documento tributario. |
| RF-26 | Autenticación mediante API | Cliente/Admin/Vendedor | El backend expone endpoints de registro y login que validan credenciales, generan el token JWT y determinan el rol del usuario. |
| RF-27 | Documentación de la API | Admin/Vendedor | Exponer una documentación interactiva de los endpoints de la API mediante Swagger UI. |

**Nota sobre numeración:** RF-18 se eliminó del alcance porque la incorporación de video en blogs fue descartada. Se conserva la numeración original de los requisitos restantes para mantener la trazabilidad documental.

### 3.3 Requisitos no funcionales

#### 3.3.1 Rendimiento

La aplicación debe mantener navegación SPA sin recarga completa entre vistas. No se establece un resultado de rendimiento medido en milisegundos sin una prueba de rendimiento documentada.

#### 3.3.2 Seguridad

- Validar entradas tanto en el frontend como en el backend.
- Proteger rutas del frontend mediante componentes de autorización, y los endpoints del backend mediante Spring Security.
- Autenticar mediante JWT: el token identifica al usuario y su rol, y se valida en cada solicitud a un endpoint protegido.
- Las contraseñas se almacenan en el backend de forma encriptada, no en texto plano.
- Evitar exponer contraseñas en las respuestas de la API o en el objeto de sesión del frontend.
- Restringir el acceso a datos de pedidos y comprobantes según la cuenta autenticada.
- **Limitación:** el entorno académico utiliza `ddl-auto=create-drop` y una configuración de desarrollo; no corresponde a una configuración de seguridad de producción.

#### 3.3.3 Fiabilidad

El carrito y la sesión utilizan persistencia local en el navegador. La lectura de datos almacenados debe contemplar valores ausentes o inválidos para evitar fallos de la interfaz.

Las operaciones de checkout y las llamadas a la API deben manejar errores de red o de persistencia y entregar retroalimentación al usuario cuando no sea posible completar una operación.

#### 3.3.4 Disponibilidad

El frontend puede desplegarse como aplicación estática. El backend requiere un servidor Java en ejecución y una instancia de MySQL disponible. La persistencia de catálogo, usuarios y pedidos depende de la base de datos del backend; la del carrito y la sesión depende del navegador.

#### 3.3.5 Mantenibilidad

- Organizar la interfaz mediante Atomic Design.
- Mantener componentes enfocados en una responsabilidad.
- Reutilizar lógica mediante Custom Hooks, servicios y utilidades.
- Mantener el estado compartido en contextos cuando corresponda.
- Separar tipos, datos, presentación y lógica de negocio.
- En el backend, separar controladores, servicios, repositorios y entidades.
- Mantener pruebas automatizadas para reducir regresiones, tanto en frontend como en backend.
- Aplicar principios SOLID, DRY y Clean Code en la organización y desarrollo del código.

#### 3.3.6 Portabilidad

La aplicación debe funcionar en navegadores modernos compatibles con React y `localStorage`. El backend debe ejecutarse en cualquier entorno con JDK 21 y acceso a MySQL. El comportamiento responsivo del frontend debe validarse en dispositivos móviles, tabletas y escritorio.

#### 3.3.7 Testeabilidad

**Frontend:** la suite utiliza Jasmine y Karma. La última ejecución validada contiene **135 pruebas exitosas y 0 fallidas**.

**Backend:** la suite utiliza JUnit 5 y MockMvc. La última ejecución validada contiene **9 pruebas exitosas y 0 fallidas** (`Tests run: 9, Failures: 0, Errors: 0`), cubriendo login, control de acceso por rol en los endpoints protegidos y la carga del contexto de la aplicación.

Las pruebas del frontend verifican validaciones, renderizado, props, estado, eventos, navegación, servicios, contextos, rutas protegidas y procesamiento del checkout. Se utilizan spies de Jasmine para observar callbacks e interceptar o simular errores.

Las pruebas del backend verifican, mediante MockMvc, que el login retorna un token válido y que los endpoints administrativos rechazan solicitudes sin el rol adecuado.

La cobertura registrada del frontend es:

| Métrica | Resultado |
|---|---:|
| Statements | 85,74 % |
| Branches | 77,97 % |
| Functions | 94,95 % |
| Lines | 85,90 % |

Los resultados y límites de cobertura de ambos componentes se describen en `docs/cobertura-testing.md`.

### 3.4 Arquitectura de la solución

**Frontend** (`ARCHIVE-src-main`):

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

**Responsabilidades principales (frontend):**

- `components/`: componentes reutilizables organizados mediante Atomic Design.
- `pages/`: vistas completas de la aplicación, separadas por áreas funcionales.
- `context/`: administración y distribución de estados compartidos.
- `hooks/`: Custom Hooks que encapsulan lógica reutilizable y comportamiento de la aplicación.
- `services/`: operaciones de negocio y comunicación con la API (`httpClient.ts`, `authService.ts`, etc.).
- `data/`: datos iniciales y simulados (por ejemplo, regiones y comunas).
- `routes/`: configuración y protección de rutas.
- `types/`: definición de interfaces y tipos TypeScript.
- `styles/`: estilos globales y específicos de los componentes.
- `utils/`: validaciones y funciones auxiliares.
- `spec/`: pruebas automatizadas organizadas por componentes, contextos, hooks, rutas, servicios y validaciones.

**Backend** (`ARCHIVE-backend`):

```text
src/main/java/cl/duoc/tienda_backend/
├── security/        (autenticación, JWT, configuración de Spring Security)
├── controller/       (endpoints REST)
├── service/          (lógica de negocio)
├── repository/       (acceso a datos vía Spring Data JPA)
└── model/             (entidades JPA)

src/test/java/cl/duoc/tienda_backend/
└── (pruebas de integración con MockMvc)
```

**Responsabilidades principales (backend):**

- `security/`: configuración de Spring Security, generación y validación del JWT, y el controlador de autenticación (login/registro).
- `controller/`: expone los endpoints REST consumidos por el frontend.
- `service/`: contiene la lógica de negocio y las validaciones.
- `repository/`: interfaces de Spring Data JPA para el acceso a la base de datos MySQL.
- `model/`: entidades que representan las tablas de la base de datos (productos, usuarios, categorías, pedidos, direcciones, métodos de pago).

El frontend y el backend se comunican exclusivamente mediante HTTP/JSON a través de la API REST; no comparten código ni base de datos directamente.

### 3.5 Estrategia de pruebas

**Frontend:**

- **Framework:** Jasmine.
- **Ejecutor:** Karma.
- **Navegador:** ChromeHeadless.
- **Empaquetado:** Webpack.
- **Transpilación:** Babel.
- **Interacción con componentes:** React DOM y Testing Library.
- **Cobertura:** Istanbul.
- **Comando de ejecución:** `npm run test`.

La suite contiene 135 pruebas exitosas y 0 fallidas en la última ejecución validada. Abarca componentes, validaciones, contextos, servicios, rutas protegidas y checkout. Se utilizan spies de Jasmine para verificar callbacks y simular errores de persistencia. No se implementan mocks de API: las pruebas de los servicios que consumen el backend se centran en la lógica propia del frontend (por ejemplo, el manejo del token en `localStorage`).

**Backend:**

- **Framework:** JUnit 5.
- **Utilidad de pruebas HTTP:** MockMvc.
- **Mocks:** Mockito.
- **Base de datos de prueba:** la configurada en `application.properties` (MySQL en el entorno académico).
- **Comando de ejecución:** `./mvnw clean test` (o `.\mvnw clean test` en Windows).

La suite contiene 9 pruebas exitosas y 0 fallidas en la última ejecución validada (`RolesYAutenticacionIntegrationTest`: 8 pruebas sobre login y control de acceso por rol; `TiendaBackendApplicationTests`: 1 prueba de carga de contexto).

Los resultados detallados, porcentajes de cobertura y limitaciones de ambos componentes se documentan en `docs/cobertura-testing.md`.

### 3.6 Entregables

Los entregables del proyecto son:

- Repositorio público del frontend ARCHIVE[src].
- Repositorio público del backend ARCHIVE[backend].
- Aplicación frontend integrada con la API del backend.
- API REST documentada mediante Swagger UI.
- Código fuente organizado mediante Atomic Design (frontend) y por capas (backend).
- Especificación de Requisitos de Software actualizada.
- Documento de cobertura de testing (frontend y backend).
- Documentación de las APIs y de la integración frontend-backend.
- Suite de pruebas automatizadas Jasmine/Karma (frontend) y JUnit/MockMvc (backend).
- Evidencias de ejecución y resultados de pruebas.
- Manual de usuario.
- Proyectos comprimidos en formato ZIP (frontend y backend) para su entrega.
- Material de apoyo para la presentación y defensa del desarrollo.
