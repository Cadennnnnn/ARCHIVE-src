# ARCHIVE[src] — E-commerce & Management System

Plataforma e-commerce y sistema de administración desarrollados con **React y TypeScript** para la asignatura **Desarrollo Full Stack II (DSY1104), Duoc UC**.

El proyecto corresponde a la migración de una aplicación web legacy hacia una arquitectura frontend moderna, modular y reutilizable, aplicando **Atomic Design**, separación de responsabilidades y persistencia mediante `localStorage`.

## 1. Descripción del proyecto

**ARCHIVE[src]** es una tienda online inspirada en la cultura streetwear y el coleccionismo de moda (*archive fashion*).

La aplicación contempla dos áreas principales:

- **Tienda:** catálogo, categorías, ofertas, detalle de productos, carrito, checkout, pedidos, perfil de cliente y contenido editorial.
- **Administración:** dashboard, inventario, categorías, usuarios, pedidos, control de stock crítico y reportes.

La aplicación implementa autenticación y control de acceso por roles, validaciones de formularios y persistencia local.

## 2. Tecnologías utilizadas

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

## 5. Persistencia y datos

La aplicación utiliza `localStorage` como mecanismo de persistencia en el navegador.

Entre los datos almacenados se encuentran:

- Carrito de compras.
- Sesión y datos de autenticación.
- Usuarios registrados.
- Pedidos y sus detalles.
- Información de perfil y preferencias.
- Datos de administración que utilizan los servicios locales.

Los pedidos conservan información de los productos y precios registrados al momento de la compra, permitiendo consultar el historial y generar comprobantes internos.

**Importante:** el proyecto no cuenta con backend ni base de datos remota. Los datos permanecen en el almacenamiento local del navegador y no se sincronizan entre dispositivos.

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

## 7. Pruebas unitarias y cobertura

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

## 8. Instalación y ejecución

### Requisitos previos

- Node.js y npm.
- Git.
- Google Chrome para ejecutar las pruebas con ChromeHeadless.

### Clonar el repositorio

```bash
git clone https://github.com/Cadennnnnn/ARCHIVE-src.git
cd ARCHIVE-src
```

### Instalar dependencias

```bash
npm install
```

### Iniciar el entorno de desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación.

### Ejecutar validaciones

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

## 9. Documentación adicional

La documentación técnica se encuentra en la carpeta `docs/`:

- `docs/ERS-v2.md`: Especificación de Requisitos de Software.
- `docs/cobertura-testing.md`: documentación de pruebas, herramientas, resultados y cobertura.

## 10. Estado y limitaciones conocidas

- La aplicación frontend está implementada y validada mediante pruebas manuales de sus módulos principales.
- La persistencia se realiza localmente mediante `localStorage`.
- No existe backend ni base de datos remota.
- El pago es simulado y no utiliza una pasarela real.
- El inventario administrativo no está sincronizado automáticamente con el catálogo inicial de la tienda.
- La integración de video en los artículos del blog (RF-18) permanece pendiente de una URL válida.
- La boleta generada es un comprobante interno y no constituye un documento tributario.

## 11. Control de versiones

Repositorio: [ARCHIVE-src](https://github.com/Cadennnnnn/ARCHIVE-src)

Rama de desarrollo de la migración: `feature/react-rebuild`.

La rama `main` se mantiene separada de los cambios de migración hasta completar la revisión y validación correspondiente.
