# Preguntas oficiales técnicas · estado 07/10/2026

## Banco incorporado

Ejecutivos de Informática C1, turno libre, convocatoria 24/0023, examen celebrado el **13/06/2026**. La fecha de la convocatoria (2024) no es el año del examen.

- Primer ejercicio: 110 preguntas con reservas. Se incorporan 73 técnicas.
- Segundo ejercicio: 45 preguntas con reservas. Se incorporan 44 válidas.
- Acuerdo de 30/06/2026, firmado y publicado 01/07/2026: confirma íntegramente la primera plantilla; anula la pregunta 20 del segundo ejercicio y la sustituye por la 41.
- Simulacro práctico: 39 ordinarias válidas + reserva 41 = 40. Las reservas 42–45 se utilizan solo en práctica/mixto, no como sustituciones adicionales.
- Total Aragón activo: 117. Total con TAI 2024: 225 (108 TAI técnicos válidos).

No se afirma haber incorporado todos los años ni todas las convocatorias de Aragón. Este lote contiene los dos ejercicios de 2026. Otras convocatorias requieren contrastar su cuestionario, plantilla definitiva, anulaciones y turno antes de incorporarlas.

## Fuentes y verificación

[Índice del proceso oficial](https://www.aragon.es/-/ejecutivos-de-informatica.-c1.-oferta-de-empleo-publico-de-2018-y-2022).

Los enlaces directos, fecha de consulta y hashes SHA-256 de los cinco PDF se guardan en data/aragon-sources.mjs. data/aragon-keys.mjs conserva las 110 claves de teoría y las 45 del segundo ejercicio con la anulación (-1). tests/fixtures/aragon-2026.json conserva la transcripción de referencia de las preguntas activas; los tests contrastan número, página, opciones y claves con los datos activos. Las imágenes de cuestionarios conservan código, diagramas y tablas; se revisaron visualmente la plantilla definitiva y páginas representativas de los supuestos. No se sirven las plantillas como imágenes durante el test.

La extracción normaliza espacios y saltos de línea en la versión textual. Para código o diagramas, la página original es la referencia. No se altera el contenido ni se mezcla el orden A/B/C/D. Los errores o matices del documento histórico no se reescriben como si fueran otro enunciado oficial.

## Exclusiones

Primer ejercicio: 1–20, 61–68, 71, 80–81, 102, 104–107 y 110. Incluyen legislación, Administración electrónica y normativa de protección de datos/accesibilidad. Se mantiene administración técnica de sistemas, redes, Linux, Windows y SQL. Segundo ejercicio: 20 anulada. El contexto administrativo del supuesto SQL se conserva porque es necesario para resolver el modelo de datos, no introduce preguntas de legislación.

TAI: Bloque I y cuatro anulaciones históricas fuera de actividades. Bancos propios anteriores y ejercicios inventados quedan archivados; no aparecen en práctica, simulacro, profesor ni evaluaciones activas.

## Ayudas didácticas

36 preguntas de Aragón tienen explicación y regla de memoria revisadas. Las demás muestran la clave oficial y el estado pendiente, sin inventar una justificación de cada alternativa. Profesor utiliza conceptos locales cuando existe cobertura y avisa al agotarse las preguntas oficiales distintas.

Repaso activo tras test/entrenamiento: hasta seis preguntas, prioriza fallos y blancos; respuestas ocultas hasta abrir la comprobación, fecha de repaso y notas personales. Es una actividad asistida, sin XP ni nuevo intento. Cuaderno local por pregunta: texto hasta 2000 caracteres, validado y escapado; se guarda junto al progreso y se exporta a JSON.

Los recorridos conservan teoría sencilla y técnica, ejemplos y esquemas; las comprobaciones usan solo preguntas oficiales. Las revisiones antiguas se archivan en pedagogy.topics con sufijo @revision-N, conservando evidencia general y XP. No se da por superada una evaluación nueva por haber completado otra versión.

## Límites

No hay garantía de nota ni predicción de la siguiente convocatoria. El tiempo de 50 minutos y la nota con −0,33 son reglas de entrenamiento. El siguiente calendario debe consultarse en las convocatorias del IAAP. Pendiente ampliar años y explicaciones, importar progreso y sincronizar dispositivos.
