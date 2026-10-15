# Auditoría de OpoSprint — 7 de octubre de 2026

## Alcance y stack detectado

Se inspeccionaron todos los archivos de código y configuración presentes al inicio: index.html, app.js, styles.css y .vscode/settings.json. También se inventarió el PDF test-corregido-tai-tl-2026-04-20.pdf (6.704.957 bytes): no está referenciado ni importado por la aplicación; no se revisó su contenido académico. La carpeta entregada no contiene .git, AGENTS.md, README, package.json, lockfile, tests, Docker, archivos de entorno ni configuración de framework. No se puede comparar con un historial Git desde esta carpeta.

El stack original es HTML5, CSS3 y JavaScript del navegador, con Google Fonts como único recurso remoto declarado. No existe React/Next, hidratación, TypeScript original, backend, API, ORM ni base de datos. Las menciones a SQL, Docker y HTTP son preguntas del banco, no tecnologías utilizadas por el proyecto.

Se incorporaron Node para servir/copiar recursos, TypeScript para comprobar JavaScript, ESLint y el runner integrado de Node. No hay dependencias de ejecución del frontend. package-lock.json fija las herramientas instaladas; no se migró la arquitectura.

## Arquitectura y estado funcional

- index.html contiene tres pantallas: panel, examen y resultados. app.js alterna su visibilidad; no hay router.
- app.js contiene 50 preguntas embebidas, cada una con categoría, dificultad, tema, cuatro opciones, respuesta, explicación y truco de memoria. Hay ocho categorías técnicas.
- El usuario puede elegir y cambiar respuestas, navegar entre preguntas y terminar cuando ha respondido todas.
- La corrección incluye explicaciones, análisis por categoría y filtro de errores. La nota usa max(0, (aciertos - fallos × 0,33) / 50 × 10); no se certifica como baremo oficial de ninguna convocatoria.
- El siguiente intento reordena el mismo banco priorizando temas fallados. No genera preguntas nuevas ni aumenta la dificultad; las frases sobre novedad/progresión son aspiracionales.
- El panel y sus estadísticas usan datos reales locales. La tarjeta «Camino a C1» es contenido estático, no una ruta cuyo avance se persista.
- El PDF está separado del simulacro: no existe importador de exámenes ni trazabilidad de sus preguntas.

## Persistencia existente

Se conserva localStorage, clave oposprint-history-v1. Cada entrada guarda score, correct, missedTopics y date. Se cuentan los temas únicos fallados por intento, no el número de preguntas falladas por tema. No hay usuario identificado, servidor ni sincronización. El intento activo y sus respuestas viven en variables JS y se pierden al recargar. No hay recuperación del examen en curso ni consulta de correcciones históricas. Se conservó la compatibilidad de los datos existentes; ahora se descartan entradas con valores fuera de rango o temas que no sean cadenas.

## Errores encontrados y corregidos

1. renderTopicAnalysis accedía a missedTopics, declarado solo dentro de renderResults. Al finalizar se guardaba el intento, pero la pantalla de resultados fallaba con ReferenceError. Ahora obtiene los temas de lastResult.
2. Todas las respuestas correctas ocupaban la primera opción. Ahora cada intento mezcla opciones y recalcula el índice correcto, conservando la correspondencia para puntuar/corregir.
3. El historial aceptaba temas nulos/no textuales que podían romper la ordenación con localeCompare. Se valida el contenido y los rangos de score/correct; los errores de almacenamiento siguen permitiendo entrenar.
4. La pregunta de diagnóstico TLS contradecía su solución: describía un certificado todavía no vigente y atribuía el error a un reloj adelantado. Se ajustó el caso a un certificado vigente y un reloj atrasado.
5. Faltaban scripts, instalación reproducible, servidor y documentación. Se añadieron sin framework ni reescritura.
6. checkJs detectó asignaciones numéricas a textContent y accesos al DOM sin tipos adecuados. Se añadieron conversiones, anotaciones JSDoc y comprobación del target del evento. No se ignoraron diagnósticos ni se desactivaron reglas para ocultarlos.
7. Los radios invisibles carecían de un foco visible en su etiqueta. Se añadió focus-within conservando el diseño.

## Archivos modificados y creados

Modificados: app.js y styles.css.
Creados: package.json, package-lock.json, .gitignore, .env.example, tsconfig.json, eslint.config.mjs, scripts/server.mjs, scripts/build.mjs, tests/app.test.mjs, README.md y AUDITORIA.md.
Generados/ignorados: node_modules/ y dist/. Se conservaron index.html, la configuración de VS Code y el PDF.

## Validación local

Entorno: Windows, Node.js 24.19.0. Todos los comandos npm se ejecutaron con npm.cmd.

| Comprobación | Resultado |
| --- | --- |
| npm install | Correcto |
| npm ci (instalación limpia) | Correcto; 0 vulnerabilidades notificadas |
| npm run dev | Correcto; servidor en http://localhost:3000 |
| GET /, /app.js, /styles.css | HTTP 200 |
| GET /.env y ruta desconocida | HTTP 404 |
| npm run typecheck | Correcto |
| npm run lint | Correcto, sin diagnósticos |
| npm run build | Correcto; dist/ con HTML, JS y CSS idénticos a las fuentes |
| Servidor de dist/ en puerto 3001 | HTML, JS y CSS responden HTTP 200; detenido después de validar |
| npm test | 6 tests pasan, 0 fallos |

Los tests ejecutan la lógica real con un DOM simulado. Verifican pleno, fallos y penalización, render de resultados, filtro, lectura de historial tras recarga, prioridad de temas, correspondencia de opciones, bloqueo de almacenamiento, datos corruptos y borrado. No había tests existentes.

No se completó una revisión visual/E2E en navegador: la herramienta de control no devolvió navegadores disponibles en esta sesión. Las comprobaciones HTTP y de lógica no validan píxeles, teclado completo ni comportamiento de todos los navegadores.

## Deuda técnica y pendientes

- Banco reducido, sin temario completo ni itinerarios separados para TAI y Aragón, metadatos de convocatoria o fuentes oficiales por pregunta.
- Datos y lógica DOM en un único archivo; numerosos literales de 50 preguntas, sin catálogo extensible.
- No hay respuestas en blanco al finalizar, cronómetro ni baremos por convocatoria.
- Historial sin límite, exportación/importación, detalle histórico ni migraciones. La media asume siempre el tamaño del banco actual.
- No hay autenticación, sincronización ni backup; no se introdujo una base de datos en esta fase.
- No hay E2E de navegador, CI, validación HTML/CSS automatizada ni cobertura visual.
- Al seleccionar una respuesta se reconstruye el DOM de las opciones; conviene revisar foco y navegación por teclado en la próxima prueba de accesibilidad.
- Google Fonts necesita Internet, aunque hay fuentes alternativas locales.
- Desarrollo sin HMR: se requiere recarga manual. El build copia recursos sin minificación.

## Siguiente fase recomendada

Primero completar prueba manual/E2E del ciclo de examen y accesibilidad. Después revisar el banco y distinguir contenidos/criterios de TAI y Aragón con fuentes oficiales; externalizar preguntas y baremos conservando el frontend. Priorizar reanudación del intento y exportación del historial local antes de plantear cuentas o sincronización. Diseñar cualquier backend/base de datos cuando exista un requisito concreto, no como condición para usar esta versión local.
