# Documento de Cobertura de Testing

**Proyecto:** ARCHIVE[src] --- Tienda online
**Asignatura:** DSY1104 Desarrollo Full Stack II · Duoc UC
**Fecha de actualización documental:** 04/11/2026
**Rama:** `feature/react-rebuild`
**Repositorio:** https://github.com/Cadennnnnn/ARCHIVE-src

---
## 1. Objetivo

Documentar el alcance de la suite de pruebas unitarias del frontend
React, las herramientas utilizadas, los comportamientos verificados, los
resultados de cobertura y las limitaciones que permanecen pendientes.

La suite verifica funciones de validación, renderizado de componentes y
páginas, props, estado, eventos, navegación y operaciones del carrito.

## 2. Entorno de pruebas

| Herramienta | Función |
|---|---|
| Jasmine | Framework de pruebas: `describe`, `it`, `expect` y spies. |
| Karma | Ejecutor de pruebas en navegador. |
| ChromeHeadless | Navegador utilizado por Karma. |
| Webpack + Babel | Empaquetado y transpilación de los archivos de prueba. |
| Testing Library | Utilidades para disparar eventos en componentes React. |
| React DOM | Montaje y desmontaje de componentes mediante `createRoot`. |
| Istanbul | Instrumentación y medición de cobertura. |

La configuración se encuentra en `karma.conf.cjs`.

### 2.1 Archivos de prueba

- `spec/components/componentBehavior.spec.tsx`
- `spec/context/CartContext.spec.tsx`
- `spec/validation/authValidation.spec.ts`

### 2.2 Ejecución

Desde la raíz del proyecto:
```bash
npm run test
```

Karma ejecuta las pruebas en ChromeHeadless y genera reportes HTML, LCOV
y resumen de cobertura en el directorio `coverage/`.

## 3. Resultados de ejecución

La última ejecución validada antes de esta actualización documental
registró **43 pruebas exitosas y 0 fallidas**.

| Métrica | Resultado registrado |
|---|---:|
| Pruebas exitosas | 43 |
| Pruebas fallidas | 0 |
| Statements | 70,86 % (107/151) |
| Branches | 54,08 % (53/98) |
| Functions | 89,36 % (42/47) |
| Lines | 70,83 % (102/144) |

**Importante:** estos porcentajes corresponden a la última ejecución
validada disponible y a los módulos instrumentados por la configuración
de pruebas. Antes de entregar o integrar cambios posteriores, se debe
volver a ejecutar `npm run test` y reemplazar esta tabla si los
resultados cambian. No representan cobertura exhaustiva de todos los
archivos de la aplicación.

El reporte HTML detallado se genera en `coverage/` y no se versiona.

## 4. Detalle de las pruebas

  ---------------------------------------------------------------------------
  Archivo / grupo           N.º de pruebas Tipo             Qué verifica
  ------------------ --------------------- ---------------- -----------------
  `ProductCard`                          1 Renderizado y    Datos del
                                           props            producto, imagen,
                                                            categoría e
                                                            insignia de
                                                            oferta.

  `Button`                               2 Props y eventos  Variante visual,
                                                            contenido y
                                                            ejecución de
                                                            `onClick`.

  `FormInput`                            1 Estado y eventos Actualización del
                                                            valor de un
                                                            componente
                                                            controlado al
                                                            escribir.

  `BlogCard`                             2 Props y          Datos del
                                           navegación       artículo, imagen
                                                            y destinos de los
                                                            enlaces.

  `BlogsPage`                            1 Renderizado      Encabezado y
                                                            listado de
                                                            artículos
                                                            publicados.

  `BlogDetailPage`                       2 Renderizado y    Contenido según
                                           navegación       slug y
                                                            redirección
                                                            cuando no existe.

  `AboutPage`                            2 Renderizado y    Manifiesto,
                                           navegación       pilares de
                                                            autenticidad y
                                                            enlace a
                                                            productos.

  `CartContext` /                       18 Estado y lógica  Inicialización,
  `useCart`                                                 persistencia,
                                                            almacenamiento
                                                            inválido, stock,
                                                            agregar
                                                            productos,
                                                            tallas,
                                                            cantidades,
                                                            eliminación,
                                                            limpieza,
                                                            subtotal y uso
                                                            fuera del
                                                            proveedor.

  `authValidation`                      14 Lógica           RUN, dominios de
                                                            correo, reglas de
                                                            contraseña,
                                                            validación y
                                                            normalización de
                                                            teléfonos móviles
                                                            chilenos.

  **Total**                         **43**
  ---------------------------------------------------------------------------

### 4.1 Correspondencia con criterios de evaluación

| Criterio | Evidencia |
|---|---|
| Renderizado | ProductCard, BlogsPage, BlogDetailPage y AboutPage. |
| Props | Button y BlogCard reciben y representan propiedades. |
| Estado | FormInput mediante un componente controlado y CartContext mediante operaciones sobre estado compartido. |
| Eventos | Button mediante click, FormInput mediante change y operaciones del carrito mediante interacción. |
| Navegación | BlogCard, BlogDetailPage y AboutPage mediante MemoryRouter. |
| Renderizado condicional | BlogDetailPage cuando el slug solicitado no existe. |
| Lógica de validación | RUN, correo, contraseña y teléfono móvil chileno. |
| Persistencia | CartContext mediante `localStorage`. |
  -----------------------------------------------------------------------

## 5. Uso de spies, aislamiento y almacenamiento

- **Spy de Jasmine:** `jasmine.createSpy` permite observar la
    ejecución del callback `onClick` del botón.
- **MemoryRouter:** permite comprobar destinos y navegación sin
    depender de un servidor o de la navegación real del navegador.
- **Componente controlado:** el formulario de prueba permite comprobar
    el cambio de estado React al modificar un campo.
- **DOM aislado:** las pruebas de componentes montan un contenedor
    propio mediante `createRoot` y lo desmontan al finalizar.
- **localStorage:** las pruebas del carrito limpian el almacenamiento
    antes y después de cada caso y verifican recuperación, persistencia
    y tratamiento de datos inválidos.

Las pruebas no implementan mocks de API ni de servicios externos. El
almacenamiento local se utiliza directamente en las pruebas del carrito;
no debe describirse como una API simulada.

## 6. Análisis de resultados y limitaciones

La suite demuestra pruebas de renderizado, props, estado, eventos,
navegación, validación y persistencia del carrito. Las 43 pruebas
superan el mínimo de 10 pruebas indicado para el proyecto.

La cobertura de funciones registrada es superior a la cobertura de
ramas. El 54,08 % de ramas indica que existen condiciones y caminos
alternativos del código instrumentado que no han sido ejercitados por
esta suite.

### 6.1 Escenarios no cubiertos actualmente por esta suite

- Flujo completo de autenticación y autorización por roles.
- Integración del checkout y sus resultados aceptado/declinado.
- Operaciones CRUD de productos, usuarios y categorías.
- Protección de rutas administrativas.
- Flujo completo de pedidos, reportes y generación de boletas.
- Pruebas de integración entre páginas y servicios.
- Comportamiento con API o backend, ya que la aplicación no utiliza
    uno.

### 6.2 Oportunidades de mejora

- Ampliar pruebas de ramas y condiciones.
- Incorporar pruebas del checkout y procesamiento de pedidos.
- Probar CRUD de inventario, usuarios y categorías.
- Incorporar pruebas de rutas protegidas y permisos por rol.
- Ampliar pruebas de reportes, historial de compras y comprobantes.
- Mantener los porcentajes de cobertura actualizados después de cada
    cambio relevante.

## 7. Conclusión

La suite documentada contiene 43 pruebas unitarias y cubre aspectos
esenciales de la evaluación: renderizado, props, estado, eventos,
navegación, validaciones y persistencia del carrito. La ejecución
utiliza Jasmine y Karma, y la cobertura se mide mediante Istanbul.

Los resultados disponibles muestran oportunidades de mejora,
especialmente en cobertura de ramas y en pruebas de integración de
flujos funcionales. Por ello, los porcentajes deben interpretarse dentro
del alcance de los módulos instrumentados y no como una medición
completa de toda la aplicación.
