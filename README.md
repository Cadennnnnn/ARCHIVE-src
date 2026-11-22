# ARCHIVE[src] — E-commerce & Management System

Plataforma e-commerce y sistema de administración desarrollados con **React y TypeScript** en el frontend y **Spring Boot** en el backend, para la asignatura **Desarrollo Full Stack II (DSY1104), Duoc UC**.

El proyecto corresponde a la migración de una aplicación web legacy hacia una arquitectura frontend moderna, modular y reutilizable, aplicando **Atomic Design** y separación de responsabilidades. A partir de la Evaluación 3, el frontend se integró con un backend propio en **Spring Boot**, con base de datos MySQL y autenticación mediante **JWT**, reemplazando a `localStorage` como fuente de los datos de la tienda (catálogo, usuarios, pedidos, perfil).

## 1. Descripción del proyecto

**ARCHIVE[src]** es una tienda online inspirada en la cultura streetwear y el coleccionismo de moda (*archive fashion*).

La aplicación contempla dos áreas principales:

- **Tienda:** catálogo, categorías, ofertas, detalle de productos, carrito, checkout, pedidos, perfil de cliente y contenido editorial.
- **Administración:** dashboard, inventario, categorías, usuarios, pedidos, control de stock crítico y reportes.

La aplicación implementa autenticación y control de acceso por roles, validaciones de formularios y persistencia local.

## 2. Tecnologías utilizadas

### 2.1 Frontend

| Tecnología | Uso |
|---|---|
| React 19 | Construcción de interfaces y componentes. |
| TypeScript 6 | Tipado estático y contratos de datos. |
| Vite 8 | Entorno de desarrollo y compilación. |
| React Router DOM 7 | Navegación y rutas protegidas. |
| Bootstrap 5.3 | Diseño responsivo y utilidades de interfaz. |
| SweetAlert2 | Alertas, confirmaciones y notificaciones. |
| Jasmine | Framework de pruebas unitarias. |
| Karma | Ejecución de pruebas en navegador. |
| ChromeHeadless | Navegador utilizado en la ejecución automatizada. |
| Istanbul | Medición de cobertura de pruebas. |
| Git y GitHub | Control de versiones. |

### 2.2 Backend

| Tecnología | Uso |
|---|---|
| Spring Boot 4 | Framework principal del backend y servidor embebido. |
| Spring Data JPA / Hibernate | Acceso a datos y mapeo objeto-relacional. |
| MySQL | Base de datos relacional. |
| Spring Security | Autenticación y control de acceso por roles. |
| JWT (jjwt) | Generación y validación de tokens de sesión. |
| springdoc-openapi (Swagger UI) | Documentación interactiva de los endpoints REST. |
| JUnit 5, MockMvc, Mockito | Pruebas de integración del backend. |
| H2 | Base de datos en memoria utilizada solo durante las pruebas. |
| Maven | Gestión de dependencias y build. |

## 3. Arquitectura del proyecto

La interfaz está organizada mediante **Atomic Design**, separando los componentes según su responsabilidad y nivel de composición.

```text
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── context/
├── data/
├── hooks/
├── pages/
│   ├── admin/
│   ├── auth/
│   └── store/
├── routes/
├── services/
├── styles/
├── types/
└── utils/
```

### Responsabilidad de cada nivel

- **Atoms:** componentes básicos reutilizables, como Button y FormInput.
- **Molecules:** agrupaciones funcionales, como ProductCard, BlogCard y OrderSummaryCard.
- **Organisms:** secciones completas de interfaz, como Header, Footer, formularios y secciones del perfil.
- **Templates:** estructuras generales de páginas, como StoreLayout, AdminLayout y ProfileLayout.
- **Pages:** vistas completas de la aplicación, separadas por área funcional.

### Separación de responsabilidades

- `components/`: presentación e interacción de la interfaz.
- `hooks/`: lógica reutilizable y coordinación del estado.
- `context/`: estado compartido mediante Context API.
- `services/`: operaciones de negocio, acceso y persistencia de datos.
- `data/`: datos iniciales y simulados.
- `types/`: contratos e interfaces TypeScript.
- `utils/`: funciones auxiliares y validaciones.
- `routes/`: control de navegación y protección de rutas.

## 4. Funcionalidades implementadas

### 4.1 Tienda

- Página de inicio con carrusel de cuatro diapositivas.
- Catálogo de productos.
- Búsqueda y filtros por categorías.
- Visualización de categorías dinámicas.
- Sección de ofertas y precios rebajados.
- Detalle de productos con selección de talla y cantidad.
- Control de stock disponible.
- Carrito de compras con persistencia local.
- Cálculo de cantidades, subtotales y total.
- Checkout con datos de envío.
- Simulación de pago aceptado o declinado.
- Registro y visualización de pedidos.
- Resultado de compra.
- Perfil de cliente.
- Historial de compras.
- Visualización e impresión de boletas internas.
- Página Nosotros y sección de blogs.
- Página de contacto.
- Página para rutas no encontradas.

### 4.2 Administración

- Dashboard con indicadores comerciales.
- Gestión de inventario mediante operaciones CRUD.
- Gestión de categorías.
- Administración de usuarios.
- Consulta del historial de compras de usuarios.
- Gestión y consulta de pedidos.
- Detalle de pedidos.
- Identificación de stock crítico.
- Reportes de ventas y pedidos.
- Filtros por fecha y estado.
- Exportación de reportes a CSV.
- Impresión y generación de reportes mediante el navegador.

### 4.3 Autenticación y control de acceso

La aplicación contempla tres roles:

- **Administrador:** acceso a las funciones administrativas.
- **Vendedor:** acceso a las funciones administrativas permitidas.
- **Cliente:** acceso a la tienda y a las funcionalidades de su cuenta.

Las rutas protegidas utilizan componentes de control de acceso y validación de roles.

### 4.4 Backend y API REST

El backend (`tienda-backend/`) expone una API REST construida con Spring Boot, documentada en Swagger UI, y es la fuente de datos real del catálogo, usuarios, categorías y pedidos.

- **Autenticación:** `POST /api/v1/auth/login` y `/auth/register` devuelven un token JWT.
- **Catálogo:** `GET/POST/PUT/DELETE /api/v1/productos` y `/api/v1/categorias`. La lectura es pública; crear, editar y eliminar requiere rol `ADMINISTRADOR` o `VENDEDOR`.
- **Usuarios:** `GET/POST/PUT/DELETE /api/v1/usuarios`. Cada usuario puede actualizar su propio perfil; listar, crear y eliminar cuentas es exclusivo de `ADMINISTRADOR`.
- **Documentación interactiva:** disponible en `http://localhost:8080/swagger-ui.html` mientras el backend está corriendo.

El frontend consume esta API mediante `src/services/httpClient.ts`, que agrega automáticamente el token JWT a cada petición.

## 5. Persistencia y datos

Desde la integración con el backend, los datos de la tienda ya no se generan ni se guardan en `localStorage`: viven en la base de datos MySQL del backend y se consultan mediante la API REST.

| Dato | Dónde vive |
|---|---|
| Catálogo (productos, categorías) | Backend (MySQL), vía API REST. |
| Usuarios y perfiles | Backend (MySQL), vía API REST. |
| Pedidos | Backend (MySQL), vía API REST. |
| Token JWT y sesión del usuario | `localStorage` del navegador, para mantener la sesión activa ante recargas de página (ver `src/services/httpClient.ts` y `authService.ts`). |
| Carrito de compras | `localStorage` del navegador (estado del cliente, no es un recurso del backend). |

Los pedidos conservan en el backend la información de productos y precios registrados al momento de la compra, permitiendo consultar el historial y generar comprobantes internos.

El checkout implementa una simulación de pago. No existe integración con una pasarela de pago real ni procesamiento financiero externo.

## 6. Validaciones y reglas de negocio

La aplicación incorpora validaciones para:

- RUN chileno.
- Formato y restricciones de correo electrónico.
- Contraseñas.
- Teléfonos móviles chilenos.
- Campos obligatorios de formularios.
- Disponibilidad y límites de stock.
- Cantidades de productos en el carrito.
- Datos de envío.
- Duplicidad de usuarios y correos.
- Control de acceso según rol.
- Propiedad de los pedidos al consultar las boletas de clientes.

Las validaciones se implementan mediante funciones reutilizables y lógica de negocio separada de los componentes de presentación.

## 7. Pruebas

### 7.1 Frontend (Jasmine / Karma)

El proyecto utiliza Jasmine y Karma para ejecutar pruebas en ChromeHeadless, con medición de cobertura mediante Istanbul.

La suite validada contiene **43 pruebas unitarias exitosas**.

| Grupo de pruebas | Cantidad |
|---|---:|
| ProductCard | 1 |
| Button | 2 |
| FormInput | 1 |
| BlogCard | 2 |
| BlogsPage | 1 |
| BlogDetailPage | 2 |
| AboutPage | 2 |
| CartContext / useCart | 18 |
| authValidation | 14 |
| **Total** | **43** |

### Resultados de cobertura registrados

| Métrica | Resultado |
|---|---:|
| Statements | 70,86 % (107/151) |
| Branches | 54,08 % (53/98) |
| Functions | 89,36 % (42/47) |
| Lines | 70,83 % (102/144) |

Las pruebas cubren renderizado de componentes, propiedades, estado, eventos, navegación, persistencia del carrito y validaciones.

Estos resultados corresponden a la suite ejecutada; no representan cobertura integral de todas las funcionalidades de la aplicación.

Para mayor detalle, consultar:

- `docs/cobertura-testing.md`

### 7.2 Backend (JUnit / MockMvc)

El backend utiliza JUnit 5 y MockMvc con `@SpringBootTest`, contra el contexto real de Spring Security, usando una base de datos H2 en memoria (ver `src/test/resources/application.properties`).

| Suite | Cantidad | Qué valida |
|---|---:|---|
| `RolesYAutenticacionIntegrationTest` | 8 | Login/registro JWT, y que las restricciones por rol de `SecurityConfig` funcionen (catálogo público vs. escritura solo Admin/Vendedor, gestión de usuarios solo Admin). |
| `TiendaBackendApplicationTests` | 1 | Que el contexto de Spring levante correctamente. |
| **Total** | **9** | `Tests run: 9, Failures: 0, Errors: 0` — BUILD SUCCESS. |

Para correrlas:

```bash
cd tienda-backend
.\mvnw clean test
```

## 8. Instalación y ejecución

### 8.1 Frontend

#### Requisitos previos

- Node.js y npm.
- Git.
- Google Chrome para ejecutar las pruebas con ChromeHeadless.

#### Clonar el repositorio

```bash
git clone https://github.com/Cadennnnnn/ARCHIVE-src.git
cd ARCHIVE-src
```

#### Instalar dependencias

```bash
npm install
```

#### Iniciar el entorno de desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación. Por defecto, el frontend espera el backend corriendo en `http://localhost:8080` (ver `API_BASE_URL` en `src/services/httpClient.ts`).

#### Ejecutar validaciones

```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run typecheck` | Comprueba los tipos TypeScript. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Ejecuta la comprobación de tipos y genera la compilación de producción. |
| `npm run test` | Ejecuta las pruebas Jasmine/Karma en ChromeHeadless. |

### 8.2 Backend

#### Requisitos previos

- JDK 21.
- MySQL (servidor corriendo localmente).
- Maven Wrapper incluido en el proyecto (`mvnw` / `mvnw.cmd`), no requiere instalar Maven aparte.

#### Crear la base de datos y el usuario

Con el cliente de MySQL (los valores vienen de `src/main/resources/application.properties`):

```sql
CREATE DATABASE tienda_db;
CREATE USER 'tienda_user'@'localhost' IDENTIFIED BY 'tienda123';
GRANT ALL PRIVILEGES ON tienda_db.* TO 'tienda_user'@'localhost';
FLUSH PRIVILEGES;
```

Las tablas se crean solas al iniciar la aplicación (`spring.jpa.hibernate.ddl-auto=create-drop`), y `DataInitializer` crea una cuenta administradora por defecto (`admin@duoc.cl` / `admin123`).

#### Clonar y ejecutar

```bash
git clone <URL del repositorio backend>
cd tienda-backend
.\mvnw spring-boot:run
```

El backend queda disponible en `http://localhost:8080`. La documentación interactiva de la API está en `http://localhost:8080/swagger-ui.html`.

## 9. Documentación adicional

La documentación técnica se encuentra en la carpeta `docs/`:

- `docs/ERS-v3.md`: Especificación de Requisitos de Software (incluye el backend, roles y JWT).
- `docs/cobertura-testing.md`: documentación de pruebas, herramientas, resultados y cobertura (frontend y backend).

## 10. Estado y limitaciones conocidas

- El frontend está integrado con el backend Spring Boot: catálogo, usuarios y pedidos ya no se generan en `localStorage`, sino que vienen de la API REST.
- El carrito de compras sigue siendo estado del cliente en `localStorage`; no es un recurso del backend ni lo pide la rúbrica de esta evaluación.
- El pago es simulado y no utiliza una pasarela real.
- El inventario administrativo no está sincronizado automáticamente con el catálogo inicial de la tienda.
- La integración de video en los artículos del blog (RF-18) permanece pendiente de una URL válida.
- El backend usa `ddl-auto=create-drop`: cada reinicio de la aplicación recrea las tablas desde cero (válido para la evaluación; no para producción).
- La boleta generada es un comprobante interno y no constituye un documento tributario.

## 11. Control de versiones

**Frontend:** [ARCHIVE-src](https://github.com/Cadennnnnn/ARCHIVE-src)

Rama de desarrollo de la migración: `feature/react-rebuild`.

La rama `main` se mantiene separada de los cambios de migración hasta completar la revisión y validación correspondiente.

**Backend:** [ARCHIVE-backend](https://github.com/Cadennnnnn/ARCHIVE-backend)
