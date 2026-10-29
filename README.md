# ARCHIVE[src] — Official Store & Management System

> Tienda e-commerce y panel administrativo desarrollado para la asignatura **Desarrollo Fullstack II (DSY1104)** en **Duoc UC**.
> **Evaluación 1:** HTML + CSS + Bootstrap + JavaScript (versión en `legacy-eval1/`, tag `v1.0-eval1`).
> **Evaluación 2:** migración a **React** con pruebas unitarias **Jasmine + Karma**.

---

## 1. Tecnologías

- **React 19** + **Vite** (JavaScript, componentes `.jsx`)
- **React Router** (navegación y rutas protegidas por rol)
- **Bootstrap 5** (diseño responsivo)
- **SweetAlert2** (alertas y toasts)
- **Persistencia:** `localStorage` mediante `src/data/db.js` (CRUD de productos, usuarios y pedidos)
- **Pruebas:** Jasmine + Karma + Testing Library, cobertura con Istanbul

## 2. Instalación y ejecución

```bash
npm install
npm run dev      # desarrollo: http://localhost:5173
npm run build    # build de producción
npm test         # pruebas unitarias + reporte de cobertura
```

> **Nota Windows:** Karma interpreta los corchetes de rutas como patrones glob. Si la carpeta del proyecto contiene `[` o `]` (por ejemplo `ARCHIVE[src]`), ejecuta `npm test` desde una ruta sin corchetes (clonar en `C:\dev\archive-src` o usar `subst X: "ruta\al\proyecto"`).

## 3. Estructura

```
src/
├── components/   layout/ products/ cart/ forms/ common/
├── pages/        store/ (tienda pública) · admin/ (panel)
├── context/      AuthContext · CartContext
├── data/         db.js (CRUD) · chileGeo.js · blogs.js
├── utils/        validaciones · filtros · formatters · precios · alerts
└── styles/
spec/             pruebas Jasmine
legacy-eval1/     proyecto HTML de la Evaluación 1
```

## 4. Vistas

**Tienda:** Home (carrusel), Productos (búsqueda y filtro), Detalle, Categorías, Ofertas, Nosotros, Blogs y Detalle de blog, Contacto, Login, Registro, Carrito, Checkout, Compra exitosa, Compra fallida, 404.

**Panel admin (`/admin`):** Dashboard con métricas reales, CRUD de productos, CRUD de usuarios (solo Administrador).

## 5. Reglas de negocio y validaciones

1. **RUN:** 7 a 9 caracteres, sin puntos ni guion (ej. `19011022K`).
2. **Nombre / Apellidos:** obligatorios, máximo 50 y 100 caracteres.
3. **Correo:** solo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com` (máx. 100).
4. **Contraseña:** entre 4 y 10 caracteres.
5. **Región y comuna:** selectores en cascada con las regiones de Chile.
6. **Código de producto:** formato `ABC-123`, único.
7. **Precio:** entero mayor a 0; la oferta debe ser menor al precio.

## 6. Cuentas de prueba

| Perfil | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | `admin@duoc.cl` | `1234` | Panel completo |
| Vendedor | `vendedor@duoc.cl` | `1234` | Panel sin gestión de usuarios |
| Cliente | `cliente@gmail.com` | `1234` | Tienda |

## 7. Pruebas unitarias

22 pruebas en `spec/` que cubren renderizado, renderizado condicional, props, estado y eventos, con mocks (`jasmine.createSpy`, `localStorage` simulado).

| Métrica | Cobertura |
|---|---|
| Sentencias | 72 % |
| Ramas | 65 % |
| Funciones | 79,48 % |
| Líneas | 74,7 % |

El reporte HTML se genera en `coverage/` al ejecutar `npm test`.

## 8. Documentación

- ERS v2 (Especificación de Requisitos de Software)
- Documento de cobertura de testing