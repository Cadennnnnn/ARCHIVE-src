# Documento de Cobertura de Testing

**Proyecto:** ARCHIVE[src] — Tienda online (Evaluación Parcial 2)  
**Asignatura:** DSY1104 Desarrollo Fullstack II · Duoc UC  
**Autor:** Caden Alexander Nieto González  
**Fecha de actualización:** 04/11/2026  
**Repositorio:** https://github.com/Cadennnnnn/ARCHIVE-src  
**Rama:** `feature/react-rebuild`

---

## 1. Objetivo

Validar el alcance de los elementos cubiertos por las pruebas unitarias del frontend React, verificando renderizado, propiedades, estado, eventos, navegación, lógica de validación y comportamiento del carrito de compras.

El proceso utiliza Jasmine y Karma para ejecutar pruebas en ChromeHeadless, junto con Istanbul para medir la cobertura del código instrumentado.

## 2. Entorno de pruebas

| Herramienta | Rol |
|---|---|
| **Jasmine** (`jasmine-core`, `karma-jasmine`) | Framework de pruebas: `describe`, `it`, `expect` y spies. |
| **Karma** | Ejecutor de pruebas en navegador. |
| **ChromeHeadless** | Navegador donde se ejecutan las pruebas. |
| **Webpack + Babel** | Empaquetado y transpilación de TypeScript, JSX y módulos ES. |
| **Testing Library** (`@testing-library/react`) | Simulación de eventos mediante `fireEvent`. |
| **Istanbul** (`babel-plugin-istanbul`, `karma-coverage`) | Instrumentación y generación de reportes de cobertura. |
| **React DOM** | Montaje y desmontaje de componentes mediante `createRoot`. |

**Configuración:** `karma.conf.cjs`.

Los archivos de prueba se encuentran organizados en:

- `spec/validation/authValidation.spec.ts`
- `spec/components/componentBehavior.spec.tsx`
- `spec/context/CartContext.spec.tsx`

**Ejecución:**

```bash
npm run test
```

La configuración utiliza ChromeHeadless y genera reportes HTML, LCOV y resumen de cobertura.

## 3. Resultados de ejecución

**36 pruebas exitosas (0 fallidas).**

Resultados de la ejecución del 04/11/2026:

| Métrica | Resultado |
|---|---:|
| Sentencias (Statements) | 69,28 % (97/140) |
| Ramas (Branches) | 50 % (44/88) |
| Funciones (Functions) | 88,88 % (40/45) |
| Líneas (Lines) | 69,17 % (92/133) |

**Alcance de la medición:** los porcentajes corresponden a los módulos instrumentados y ejecutados durante esta suite de pruebas. No representan una medición exhaustiva de todos los archivos de la aplicación.

El reporte HTML detallado se genera en `coverage/` y no se versiona.

## 4. Detalle de las pruebas

| Archivo / componente | N.º de pruebas | Tipo | Qué verifica |
|---|---:|---|---|
| `authValidation.spec.ts` | 7 | Lógica | RUN, dominios de correo y reglas de contraseña. |
| `ProductCard` | 1 | Renderizado y props | Datos del producto, imagen, categoría e insignia de oferta. |
| `Button` | 2 | Props y eventos | Variante visual, contenido y ejecución de `onClick`. |
| `FormInput` | 1 | Estado y eventos | Actualización del valor mediante escritura del usuario en un componente controlado. |
| `BlogCard` | 2 | Props y navegación | Datos del artículo, imagen y destinos de los enlaces. |
| `BlogsPage` | 1 | Renderizado | Encabezado y listado de artículos publicados. |
| `BlogDetailPage` | 2 | Renderizado y navegación | Contenido según slug y redirección cuando no existe. |
| `AboutPage` | 2 | Renderizado y navegación | Manifiesto, pilares de autenticidad y enlace a productos. |
| `CartContext` | 18 | Estado y lógica | Inicialización, persistencia, almacenamiento inválido, stock, agregar productos, tallas, cantidades, eliminación, limpieza y subtotal. |
| **Total** | **36** | | |

### 4.1 Correspondencia con los criterios de evaluación

| Criterio | Evidencia |
|---|---|
| Renderizado correcto | ProductCard, BlogsPage, BlogDetailPage y AboutPage. |
| Propiedades (props) | Button y BlogCard. |
| Estado (state) | FormInput mediante un componente controlado y CartContext mediante operaciones sobre el estado del carrito. |
| Eventos | Button mediante evento click y FormInput mediante evento change. |
| Navegación | BlogCard, BlogDetailPage y AboutPage mediante MemoryRouter. |
| Renderizado condicional | BlogDetailPage cuando el slug no existe. |
| Lógica de validación | RUN, correo y contraseña. |
| Persistencia | CartContext mediante almacenamiento local. |

## 5. Uso de mocks y aislamiento

- **Spy de Jasmine:** `jasmine.createSpy` simula el callback `onClick` y permite comprobar su ejecución.
- **MemoryRouter:** permite probar enlaces y navegación sin depender del navegador ni de un servidor.
- **Componente controlado:** `ControlledForm` permite verificar la actualización del estado de React al modificar un campo.
- **DOM aislado:** cada prueba monta su propio contenedor mediante `createRoot` y lo desmonta en `afterEach`.
- **Almacenamiento local:** las pruebas del carrito verifican inicialización, persistencia, recuperación y comportamiento ante datos inválidos de `localStorage`.

Las pruebas actuales no implementan mocks de API ni de servicios externos. No se declara cobertura de esos escenarios.

## 6. Análisis de resultados

La suite verifica componentes de interfaz, reglas de validación y operaciones relevantes del carrito de compras.

Se incorporaron pruebas para las páginas de Blogs y Nosotros, verificando su contenido, estructura, enlaces y comportamiento ante rutas inexistentes. También se añadieron pruebas del contexto del carrito para comprobar sus operaciones y persistencia.

La cobertura de funciones alcanza el 88,88 %, mientras que las ramas presentan un 50 %. Esto indica que todavía existen caminos condicionales que no han sido ejercitados.

**Oportunidades de mejora:**

- Ampliar pruebas de ramas y condiciones.
- Incorporar pruebas de integración para los flujos de autenticación y checkout.
- Probar operaciones CRUD del inventario.
- Ampliar pruebas de navegación y protección de rutas.
- Incorporar pruebas adicionales para el procesamiento de pedidos y sus resultados.

## 7. Conclusión

El proyecto cuenta con una suite de 36 pruebas unitarias ejecutadas correctamente mediante Jasmine y Karma, sin fallos en la última ejecución.

Se verifican propiedades, renderizado, estado, eventos, navegación, validaciones y operaciones del carrito. También se utiliza Istanbul para analizar la cobertura del código instrumentado.

La suite supera el mínimo de 10 pruebas unitarias establecido en la rúbrica. Los resultados permiten identificar oportunidades concretas de mejora y respaldan la validación técnica de los componentes implementados.