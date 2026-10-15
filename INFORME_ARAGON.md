# Continuación OpoSprint · Aragón C1 · 07/10/2026

Cambios realizados directamente, conservando identidad visual y localStorage.

## Resultado

- Banco activo: 225 preguntas oficiales técnicas (117 Aragón 2026, 108 TAI 2024). Preguntas propias, Administración y anuladas fuera de actividades.
- Dos ejercicios del examen de Aragón de 13/06/2026, convocatoria 24/0023. Plantilla definitiva del 01/07/2026 aplicada: segundo ejercicio pregunta 20 anulada, reserva 41 sustitutiva.
- Simulacros Aragón: teoría 50, mixto 50, segundo ejercicio 40. Opciones A/B/C/D originales y soluciones ocultas hasta finalizar.
- Itinerario Aragón/TAI funcional y persistente. Inicio, entrenamiento y origen predeterminado de práctica usan la preferencia.
- 36 explicaciones Aragón revisadas, nueve juegos de pistas específicas, ejemplos y ampliaciones de conceptos. Las explicaciones restantes se señalan pendientes.
- Repaso activo después de tests y entrenamiento; prioridades de errores/blancos, comprobación oculta, fecha de repaso y reglas personales.
- Cuaderno por pregunta: guarda texto local hasta 2000 caracteres, incluido en exportación; no concede XP ni dominio.
- Evaluaciones oficiales en los ocho recorridos. Las revisiones anteriores se archivan, manteniendo XP e historial.

## Archivos principales

Datos: official-aragon.mjs, aragon-keys.mjs, aragon-sources.mjs, course-bank.mjs, official-course.mjs, active-lessons.mjs, curriculum.mjs y tracks.mjs.

Motor: core/learning.mjs, pedagogy.mjs, teacher-local.mjs, storage.mjs y declaraciones de tipos.

Interfaz: ui/exam.mjs, home.mjs, practice.mjs, session.mjs, training.mjs, recall.mjs, components.mjs, platform.mjs, catalog.mjs, course.mjs, lessons.mjs, teacher.mjs y errors.mjs; app.js, index.html y styles.css.

Verificación: tests oficiales nuevos y fixtures, regresiones de UI y persistencia; scripts/server.mjs, check-content.mjs y eslint.config.mjs (entrada app.js ahora módulo).

Documentación: README.md, OFICIALES_ARAGON.md y avisos de actualización en documentos históricos del motor. Páginas de cuestionarios en assets/aragon-pages/; sin imágenes de plantillas en recursos públicos.

## Validación

npm.cmd ci: correcta, 0 vulnerabilidades reportadas. Build correcto, incluidos typecheck, lint y contentcheck. Tests: 76/76. Servidor de desarrollo activo en http://localhost:3000. HTTP 200 para aplicación, banco y página de supuesto; .env y tmp/ devuelven 404. Revisión de Chrome aislado a 1440 px y 500 px: sin errores registrados ni desbordamiento horizontal. Las capturas desactivan animaciones solo en el servidor de QA, sin cambiar el producto. No sustituyen la revisión en dispositivos físicos.

## Ejecución desde PowerShell

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

## Pendiente

Ampliar otros años/turnos de Aragón contrastando sus plantillas definitivas; completar explicaciones y distractores revisados. No se afirma cubrir todas las convocatorias. Importación de progreso, sincronización y reanudación del intento activo siguen pendientes. Las reglas de tiempo y nota son de entrenamiento, no predicciones de convocatoria. Fuentes, hashes y exclusiones detalladas en OFICIALES_ARAGON.md.
