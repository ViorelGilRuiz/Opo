# OpoSprint: aprendizaje orientado al examen

## Resultado

Se mantiene el frontend nativo y el simulacro clásico, y se añaden siete secciones conectadas. El perfil inicial refleja formación DAW, prioridad técnica y dos horas diarias. Los porcentajes previos comunicados no se presentan como datos medidos en la aplicación.

### Funciones implementadas

- 50 preguntas originales nuevas con la distribución solicitada: 10 redes, 7 sistemas, 7 seguridad, 7 SQL, 6 programación, 6 HTTP/web, 4 Docker/cloud y 3 diagnósticos. Cada opción tiene una explicación específica; las soluciones se reservan hasta el final del simulacro.
- 46 fichas técnicas en seis pasos, con campos pedagógicos separados, ejercicios de razonamiento y pregunta final. Hay lecciones de fundamentos y fichas de consolidación derivadas del banco. Red de prerrequisitos recomendados en direccionamiento/subnetting/ARP/DNS.
- Práctica configurable y filtrada. Corrección inmediata al pulsar Comprobar; Entendido, Repasar después y No lo entiendo modifican preferencias sin simular dominio.
- Simulacro técnico de 30 o 50 y entrenamiento histórico 2024 de 80 + 20, con supuesto explícito, cronómetro, blancos, revisión, resultados, desglose y plan de mejora.
- Errores por frecuencia y dominio posterior, reintentos, lecciones asociadas donde existen y preguntas relacionadas disponibles.
- Progreso por materia, conceptos, actividad, XP, niveles, racha, insignias derivadas, misiones diarias, semana y tabla temporal.
- Buscador que encuentra lecciones y preguntas históricas, incluidas las de Constitución. Aragón consta como itinerario futuro, no como contenido ya implementado.

## PDF y fuentes

El PDF aportado tiene 47 páginas y agrupa exámenes/plantillas identificados como 2019, 2022 y 2024. Se integró solo el modelo A de 2024, con 135 preguntas: 80 + 5 reservas de teoría y dos supuestos de 20 + 5 reservas. Se cotejaron todas las claves contra la plantilla definitiva de la página 47. Hay cuatro anulaciones, que se sustituyen por reservas para entrenar dos partes evaluables de 80 y 20 preguntas. Se renderizaron las páginas 33–46 y se inspeccionó el diagrama del supuesto I. Las imágenes preservan contenido no disponible en la extracción de texto.

Las explicaciones pedagógicas de las preguntas oficiales siguen pendientes y están identificadas como tales. No se inventaron justificaciones a partir de la letra de la plantilla. Las preguntas originales nuevas sí incluyen las cuatro explicaciones. La legislación del cuestionario es histórica, sin afirmar que sus redacciones sean actuales.

Se consultó el [BOE-A-2025-26262, anexo V](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-26262) para contrastar bloques y estructura. No se tomó el nombre del PDF como fecha de una convocatoria. La nota oficial necesita cortes y transformaciones por parte; la nota local sobre 10 es entrenamiento, y se muestran además puntuaciones directas de cada parte histórica.

## Arquitectura

ES Modules nativos, sin framework ni backend nuevo:

- data/: banco original de esta fase, banco histórico, lecciones, bloques e itinerarios.
- core/learning.mjs: cálculo puro de notas, agregados, dominio, selección adaptativa, intervalos, XP, actividad y reservas.
- core/storage.mjs: lectura/validación y guardado del estado local.
- core/types.d.ts: tipos de pregunta, estadística, evento, intento, estado y lección.
- ui/platform.mjs: orquestación de navegación y persistencia; cada pantalla tiene su módulo propio. session.mjs maneja el ciclo de práctica/examen y components.mjs reutiliza tarjetas/correcciones.
- app.js conserva la aplicación clásica y su clave de historial, sin reescritura.
- scripts/: servidor con rutas públicas limitadas y build estático que incluye módulos/recursos.

El núcleo nuevo se comprueba con TypeScript strict mediante JSDoc y declaraciones; el resto mantiene checkJs y lint recomendado. Se evita una migración a React o una compilación de frontend innecesaria. linkedom y prettier son herramientas de desarrollo, no dependencias del sitio en ejecución.

## Modelo de datos

| Entidad | Datos principales |
| --- | --- |
| Question | id estable, track, bloque, materia, tema, subtema, concepto, dificultad, opciones, clave, razones, explicación, regla, fuente y metadatos históricos |
| Lesson | fundamento, técnica, ejemplo, analogía, trampa, regla, ejercicio, respuesta del ejercicio, pregunta final y prerrequisito |
| Stat | attempts, correctCount, incorrectCount, blankCount, lastSeenAt, tiempo acumulado, últimos cinco resultados, aciertos consecutivos y dueAt |
| AnswerEvent | IDs y clasificación, resultado, blanco, tiempo de respuesta y fecha |
| Attempt | modo, IDs de preguntas, elecciones, orden de opciones, tiempo total, notas, aciertos/fallos/blancos y desglose histórico por parte |
| LearningState | versión 2, estadísticas, eventos, intentos, actividad por día, lecciones, preferencias, XP y premios de dominio ya otorgados |

accuracy, averageResponseTime y masteryScore se calculan a partir de los datos base, evitando copias que puedan desincronizarse. Se agregan estadísticas por concepto, tema, materia y bloque. La estimación de dominio combina 55 % de exactitud histórica y 45 % de exactitud reciente, reduce confianza hasta tres intentos y exige tres aciertos consecutivos para DOMINADO. Un único acierto no basta.

Persistencia: oposprint-history-v1 permanece para el clásico; oposprint-learning-v2 guarda el motor nuevo. No se borró ni se reinterpretó el historial anterior como respuestas detalladas. Los datos corruptos se conservan y no se sobrescriben silenciosamente. Hay exportación local; no hay secretos, cuentas ni datos enviados a un servidor.

## Decisiones

- Se priorizan los conceptos que el alumno comunica como débiles sin inventar intentos previos.
- Penalización técnica aproximada de 0,33; histórica de un tercio exacto; blancos sin penalización.
- Se conservan las páginas/diagramas históricos como imágenes de preguntas; no se incluye la página de respuestas entre ellas.
- El estudio, las métricas y la gamificación se calculan con actividad registrada, sin indicadores ficticios de progreso.
- La escala de dificultad del banco es una clasificación editorial; no se genera contenido nuevo ni se valida automáticamente su dificultad estadística.

## Archivos

Modificados: index.html, styles.css, package.json, package-lock.json, tsconfig.json, eslint.config.mjs, .gitignore, scripts/server.mjs, scripts/build.mjs y README.md. app.js y sus tests se conservaron funcionalmente.

Nuevos: tsconfig.core.json; core/{learning.mjs,storage.mjs,types.d.ts}; data/{fresh-questions.mjs,official-2024.mjs,lessons.mjs,tracks.mjs}; ui/{platform.mjs,components.mjs,home.mjs,catalog.mjs,practice.mjs,exam.mjs,errors.mjs,progress.mjs,lessons.mjs,session.mjs}; assets/exam-pages/page-33.png a page-46.png; tests/learning.test.mjs; tests/platform.test.mjs; tests/fixtures/tai-2024-answer-key.json; este informe. tmp/ contiene material de extracción/renderizado ignorado; dist/ y node_modules/ son generados.

## Pruebas

Windows y Node.js 24.19.0. npm ci correcto, 0 vulnerabilidades notificadas. npm run typecheck, npm run lint y npm run build correctos. npm test: 23 pruebas pasan, incluidas las seis regresiones previas.

Se verifican: cuatro opciones y distribución; correspondencia tras mezclar; notas y blancos; claves oficiales completas; reservas/anulaciones; intervalos; confianza de dominio; deduplicación de XP; filtros; persistencia y corrupción; plan de 120 minutos; rachas; las siete rutas; lección completa; búsqueda de DNS/Constitución; ocultación de soluciones; corrección; doble registro evitado y cierre automático por tiempo.

El servidor de desarrollo responde en http://localhost:3000. Se recorrió el grafo de los 16 módulos desde ui/platform.mjs tanto en desarrollo (puerto 3000) como en dist/ (puerto 3001), sin imports ausentes. También se verificó HTTP 200 para páginas de preguntas, y 404 para .env, declaraciones de tipos y la imagen de la plantilla de respuestas. El servidor auxiliar de dist/ se detuvo tras verificarlo; desarrollo queda activo. No se completó QA visual/E2E en un navegador real: la herramienta no encontró ningún navegador conectado. linkedom comprueba lógica del DOM, no geometría, lectura de pantalla completa ni todas las diferencias de navegador.

## Límites y siguientes mejoras

1. Completar un curso de legislación y Administración electrónica con fuentes actualizadas, y el contenido específico de Aragón.
2. Desarrollar explicaciones contrastadas de las preguntas oficiales; revisar clasificación editorial y casos con erratas históricas.
3. Ampliar variantes por concepto y supuestos técnicos originales; los bancos son finitos y no generan preguntas ilimitadas.
4. Probar visualmente móvil/escritorio y teclado con navegador real; ampliar accesibilidad y visualización de la curva temporal (actualmente tabla y barras semanales).
5. Incorporar reanudación de intentos activos e importación validada del JSON exportado. Las respuestas de examen se guardan al finalizar, la práctica ya corregida durante la sesión; salir/recargar pierde el intento activo.
6. Calibrar los intervalos y el dominio con evidencia de recuerdo a lo largo de días; la estimación actual es orientativa.

## Ejecutar

~~~powershell
Set-Location -LiteralPath 'C:\Users\Distribución Gabarre\Desktop\Preparacion Oposicion TAI'
npm.cmd ci
npm.cmd run dev
~~~

Abre http://localhost:3000 y elige Inicio → Nuevo simulacro · 50 preguntas. Para build/validación consulta README.md.
