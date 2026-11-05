# Documento de Cobertura de Testing

**Proyecto:** ARCHIVE[src] — Tienda online
**Asignatura:** DSY1104 Desarrollo Full Stack II · Duoc UC
**Fecha de actualización:** 04/11/2026
**Rama:** `feature/react-rebuild`
**Repositorio:** https://github.com/Cadennnnnn/ARCHIVE-src

---

## 1. Objetivo

Documentar el entorno de pruebas automatizadas del frontend React, los comportamientos verificados, las herramientas utilizadas, los resultados de ejecución y las limitaciones de cobertura.

La suite contempla pruebas de validación, renderizado, props, estado, eventos, navegación, contextos, servicios, rutas protegidas y procesamiento del checkout.

## 2. Entorno de pruebas

| Herramienta | Función |
|---|---|
| Jasmine | Framework de pruebas: `describe`, `it`, `expect` y spies. |
| Karma | Ejecutor de pruebas en navegador. |
| ChromeHeadless | Navegador utilizado por Karma. |
| Webpack | Empaquetado de los archivos de prueba. |
| Babel | Transpilación de código. |
| Testing Library | Utilidades para interactuar con componentes React. |
| React DOM | Montaje y desmontaje mediante `createRoot`. |
| Istanbul | Instrumentación y medición de cobertura. |

La configuración se encuentra en `karma.conf.cjs`.

### 2.1 Archivos de prueba

La suite incluye pruebas en las siguientes áreas:

- `spec/components/componentBehavior.spec.tsx`
- `spec/context/CartContext.spec.tsx`
- `spec/context/AuthContext.spec.tsx`
- `spec/validation/authValidation.spec.ts`
- `spec/services/productService.spec.ts`
- `spec/services/userService.spec.ts`
- `spec/services/authService.spec.ts`
- `spec/service/productService.spec.ts`
- `spec/service/userService.spec.ts`
- `spec/service/authService.spec.ts`
- `spec/service/orderService.spec.ts`
- `spec/routes/ProtectedRoute.spec.tsx`
- `spec/hooks/useCheckout.spec.tsx`

## 3. Ejecución y resultados

Para ejecutar la suite desde la raíz del proyecto:

```bash
npm run test
```

La última ejecución validada registró:

| Métrica | Resultado |
|---|---:|
| Pruebas exitosas | 135 |
| Pruebas fallidas | 0 |
| Statements | 85,74 % (391/456) |
| Branches | 77,97 % (223/286) |
| Functions | 94,95 % (113/119) |
| Lines | 85,90 % (378/440) |

La ejecución se realizó con Karma y ChromeHeadless. El reporte detallado se genera en `coverage/`.

Los porcentajes corresponden al código instrumentado por la configuración de cobertura y no representan necesariamente todos los archivos de la aplicación.

## 4. Alcance de las pruebas

La suite verifica los siguientes comportamientos:

- **Componentes:** renderizado, contenido, propiedades y eventos.
- **Formularios:** actualización de estado y validaciones.
- **Carrito:** inicialización, persistencia, cantidades, tallas, stock, eliminación y subtotal.
- **Autenticación:** validación de credenciales, contexto y sesión.
- **Servicios:** operaciones de productos, usuarios, autenticación y pedidos.
- **Rutas protegidas:** acceso según autenticación y rol.
- **Checkout:** rechazo de operaciones inválidas, creación de pedidos, datos de envío, persistencia, pagos aceptados y declinados, y manejo de errores.

### 4.1 Correspondencia con criterios de evaluación

| Criterio | Evidencia |
|---|---|
| Renderizado | Pruebas de componentes y páginas. |
| Props | Verificación de propiedades recibidas por componentes. |
| Estado | Formularios controlados y contextos React. |
| Eventos | Interacción mediante eventos click y change. |
| Navegación | Pruebas con MemoryRouter. |
| Renderizado condicional | Contenido según datos y rutas disponibles. |
| Lógica de negocio | Validaciones y servicios. |
| Persistencia | Verificación de datos almacenados en localStorage. |
| Integración | Pruebas de AuthContext, rutas protegidas y useCheckout. |

## 5. Uso de mocks y spies

Se utilizan spies de Jasmine para observar o simular comportamientos durante las pruebas.

Ejemplos implementados:

- `jasmine.createSpy('onClick')`: permite verificar que el callback de un botón se ejecute cuando el usuario realiza click.
- `spyOn(console, 'error')`: intercepta mensajes de error generados durante una prueba de uso incorrecto de `useCart`.
- `spyOn(Storage.prototype, 'setItem').and.throwError(...)`: simula un fallo de persistencia para verificar el manejo de errores del checkout.

El último caso permite comprobar que, cuando falla el guardado del pedido, el hook muestra un mensaje de error, restablece el estado de procesamiento y conserva los productos del carrito.

También se utiliza `MemoryRouter` para probar navegación sin depender de un servidor ni de la navegación real del navegador.

**Limitación:** no se implementan mocks de API ni de servicios externos. Las pruebas de persistencia utilizan `localStorage` del navegador, salvo cuando se intercepta deliberadamente su método `setItem` mediante un spy.

## 6. Análisis de resultados

Las 135 pruebas finalizaron correctamente, sin errores de ejecución.

La cobertura de funciones alcanza el 94,95 %, mientras que la cobertura de ramas alcanza el 77,97 %. Esto indica que todavía existen condiciones alternativas que podrían contar con más casos de prueba.

La cobertura de líneas es de 85,90 %, por lo que una parte importante del código instrumentado está siendo ejecutada durante las pruebas.

Las pruebas de integración de checkout verifican escenarios aceptados, declinados y fallidos, incluyendo la conservación del carrito ante errores de persistencia.

### 6.1 Limitaciones

- La suite no sustituye pruebas completas de aceptación de todos los flujos de interfaz.
- No se prueban integraciones con backend porque la aplicación no dispone de uno.
- No se realizan pruebas de carga ni rendimiento.
- No se simulan servicios externos ni una pasarela bancaria real.
- La cobertura corresponde a los módulos instrumentados, no necesariamente a toda la aplicación.

### 6.2 Mejoras futuras

- Ampliar la cobertura de ramas y condiciones.
- Incorporar pruebas de interacción de páginas completas.
- Ampliar escenarios de errores y permisos por rol.
- Mantener los resultados de cobertura actualizados después de cambios relevantes.

## 7. Conclusión

La suite utiliza Jasmine y Karma para verificar componentes, validaciones, estado, eventos, navegación, persistencia y lógica de negocio del frontend.

La última ejecución validada alcanzó 135 pruebas exitosas y una cobertura de 85,90 % en líneas. Se incorporan spies de Jasmine para observar callbacks, interceptar errores y simular fallos de persistencia.

Los resultados evidencian una suite funcional y una base de pruebas amplia, aunque se mantienen oportunidades de mejora en cobertura de ramas y pruebas de aceptación de flujos completos.