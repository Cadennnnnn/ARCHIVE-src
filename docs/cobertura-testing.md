# Documento de Cobertura de Testing
**Proyecto:** ARCHIVE[src] — Tienda online (Evaluación Parcial 2)
**Asignatura:** DSY1104 Desarrollo Fullstack II · Duoc UC
**Autor:** Caden Alexander Nieto González · **Fecha:** [15/10/2026]
**Repositorio:** https://github.com/Cadennnnnn/ARCHIVE-src (rama `feature/migracion-react`)

---

## 1. Objetivo
Validar el alcance de los elementos cubiertos por las pruebas unitarias del frontend React, verificando lógica, renderizado, propiedades, estado y eventos.

## 2. Entorno de pruebas

| Herramienta | Rol |
|---|---|
| **Jasmine** (`jasmine-core`, `karma-jasmine`) | Framework de pruebas: `describe`, `it`, `expect`, spies |
| **Karma** | Ejecutor de pruebas en navegador real |
| **ChromeHeadless** | Navegador donde corren las pruebas |
| **Webpack + Babel** (`preset-env`, `preset-react`) | Empaquetan y transpilan JSX/ES modules para Karma |
| **Testing Library** (`@testing-library/react`) | Renderiza componentes y simula eventos sobre el DOM |
| **Istanbul** (`babel-plugin-istanbul`, `karma-coverage`) | Instrumentación y reporte de cobertura |

**Configuración:** `karma.conf.cjs` (extensión `.cjs` porque `package.json` usa `"type": "module"`). Los archivos de prueba están en `spec/*.spec.js(x)`. Se ejecutan con `npm test`.

**Problema detectado y solución:** Karma interpreta los corchetes de la ruta `ARCHIVE[src]` como patrones glob, por lo que no encontraba ningún archivo (`does not match any file`). Se resolvió ejecutando desde una ruta sin corchetes (unidad virtual `subst X:`).

## 3. Resultados de ejecución

**22 de 22 pruebas exitosas (0 fallidas).**

| Métrica | Cobertura |
|---|---|
| Sentencias (Statements) | 72 % (162/225) |
| Ramas (Branches) | 65 % (91/140) |
| Funciones (Functions) | 79,48 % (62/78) |
| Líneas (Lines) | 74,7 % (127/170) |

El reporte HTML detallado por archivo se genera en `coverage/` (no se versiona).

## 4. Detalle de las pruebas

| Archivo | N° | Tipo | Qué verifica |
|---|---|---|---|
| `validaciones.spec.js` | 4 | Lógica pura | RUN válido/inválido, dominios de correo permitidos, largo de contraseña y confirmación, errores por campo en formulario vacío |
| `filtros.spec.js` | 2 | Lógica pura | Filtro por texto y categoría; categorías sin repetir |
| `db.spec.js` | 4 | CRUD / mock `localStorage` | Inicialización con categorías normalizadas, crear/actualizar/eliminar producto, código duplicado y ofertas, autenticación sin exponer contraseña y correo duplicado |
| `FormField.spec.jsx` | 3 | Renderizado, props, condicional, eventos | Etiqueta y valor por props; mensaje y clase `is-invalid` solo con error; `onChange` con el texto escrito |
| `ProductCard.spec.jsx` | 3 | Props, condicional, eventos | Nombre/categoría/precio por props; insignia OFERTA solo en oferta; clic en Añadir invoca `onAdd` |
| `CartContext.spec.jsx` | 3 | Estado | Agregar y acumular cantidades, precio de oferta, disminuir/eliminar y persistencia en `localStorage` |
| `ProtectedRoute.spec.jsx` | 3 | Renderizado condicional | Redirección a `/login` sin sesión, a la tienda como Cliente, acceso del Administrador |
| **Total** | **22** | | |

### Correspondencia con lo solicitado por el docente
| Tipo de prueba solicitado | Cubierto en |
|---|---|
| Renderizado correcto | `FormField`, `ProductCard` |
| Renderizado condicional | Insignia OFERTA, mensaje de error, `ProtectedRoute` |
| Propiedades (props) | `FormField`, `ProductCard` |
| Estado (state) | `CartContext` |
| Eventos | `fireEvent.change` en `FormField`, `fireEvent.click` en `ProductCard` y `CartContext` |

## 5. Uso de mocks
- **Spies de Jasmine** (`jasmine.createSpy`): simulan los callbacks `onAdd` y `onChange` y permiten comprobar con qué argumentos fueron llamados.
- **`localStorage` simulado:** se limpia en `beforeEach` y se siembra manualmente (por ejemplo la sesión `ARCHIVE_SESSION`) para aislar cada prueba.
- **Componentes sonda** (`Probe`): consumen el contexto del carrito para probar el estado real con eventos.
- **`MemoryRouter`:** simula la navegación sin depender del navegador.

## 6. Análisis de resultados
- La **lógica de negocio** (validaciones, filtros, CRUD) está bien cubierta porque son funciones puras o de datos, fáciles de aislar.
- Los **contextos y componentes clave** del flujo de compra (carrito, tarjeta de producto, formulario base, rutas protegidas) están probados.
- **Menor cobertura:** las páginas completas (`Home`, `Checkout`, `AdminProducts`, `AdminUsers`, `Register`), que combinan muchos componentes y dependen de SweetAlert2 y navegación. Se consideran candidatas a pruebas de integración futuras.
- Las ramas (65 %) quedan por debajo de las demás métricas por los caminos de error no ejercitados en páginas.

## 7. Conclusión
Se implementó un proceso de testeo unitario completo: configuración del entorno, escritura de 22 pruebas, uso de mocks, análisis de resultados y medición de cobertura (72 % de sentencias), superando las 10 pruebas mínimas exigidas.