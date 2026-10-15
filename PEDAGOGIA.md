> Actualización 07/10/2026: las actividades activas usan únicamente preguntas oficiales técnicas de Aragón 2026 y TAI 2024. Bancos propios y ejercicios editoriales anteriores quedan archivados; Administración aplazada. Consulta README.md y OFICIALES_ARAGON.md para el estado vigente.

# Motor pedagógico de OpoSprint

## Contraste del temario

Se mantienen los cuatro bloques del proyecto y del anexo V del programa de referencia TAI ingreso libre (Resolución de 18-12-2025, BOE-A-2025-26262): I Estado/Administración electrónica, II Tecnología básica, III Desarrollo de sistemas y IV Sistemas/comunicaciones. Fuente: https://www.boe.es/buscar/doc.php?id=BOE-A-2025-26262

Las 25 agrupaciones propuestas no se tratan como epígrafes oficiales independientes: Windows/Linux son desarrollo de sistemas operativos; SQL desarrolla interrogación de bases de datos; OSI/TCP/IP/subnetting/DNS desarrollan comunicaciones. Se añade un área IPv4 y se hacen visibles tres materias oficiales ausentes de la lista: Java/Jakarta EE/.NET, accesibilidad/usabilidad y repositorios/pruebas/metodologías. Resultado: 29 áreas editoriales con referencia a epígrafes y límites de cobertura. Cloud se marca como ampliación didáctica, no como epígrafe literal de ese programa.

Este mapa no promete cubrir todo el programa. Las áreas pendientes describen lo que falta, incluyendo legislación, ENS/ENI, igualdad, empleo público, periféricos, NoSQL, modelado y normalización, administración, correo, CPD y comunicaciones inalámbricas. Aragón conserva el estado pendiente previo.

## Separación entre datos, motor e interfaz

- data/curriculum.mjs: mapa editorial, fases, áreas y epígrafes de referencia.
- data/course-topics.mjs: ocho temas versionados, objetivos, prerrequisitos, conceptos, ejemplos, ejercicios, minitests y guías de repaso.
- data/course-sources.mjs: fuentes primarias, tipo, edición/alcance y fecha de consulta.
- data/course-foundations.mjs: 16 preguntas nuevas, redactadas para esta demostración con explicación de los cuatro distractores.
- data/course-bank.mjs: unión sin duplicación del banco existente, fundamentos y preguntas oficiales válidas. Nueve preguntas oficiales reciben explicaciones pedagógicas; se mantienen IDs, enunciados, opciones y claves históricas.
- core/pedagogy-types.d.ts: contrato tipado de contenidos y progreso.
- core/pedagogy.mjs: validación, avance, evaluación y programación de repaso; recibe currículo/tema/preguntas, sin importar nombres concretos de temas.
- ui/course.mjs: representación genérica de bloques y recorrido. No tiene ramas para OSI, DNS o SQL: las tablas, capas, pasos, código y callouts se definen en los datos.

## Recorrido y evaluación

Introducción → Conceptos → Ejemplo → Ejercicio → Minitest → Repaso. Las fases posteriores se abren en orden. Los prerrequisitos entre temas son recomendaciones: no bloquean a quien ya tiene conocimientos.

Cada concepto incluye ID estable, título, explicación sencilla y técnica, ejemplo, error habitual, regla de memoria, dificultad, preguntas relacionadas y fuentes. Hay dos conceptos y dos ejercicios por demostración. Los ejercicios son de selección o resultado numérico: requieren un intento válido, muestran explicación y permiten corregir el razonamiento. Leer y comprobar ejercicios no concede XP ni dominio.

El minitest tiene tres niveles: fundamentos, aplicación técnica y pregunta oficial histórica. Se requiere 80 % de aciertos en cada nivel antes del siguiente; en muestras de una o dos preguntas esto supone acertarlas todas. El porcentaje es un umbral didáctico, no una nota oficial de corte. La puntuación también muestra penalización de un tercio por error. Opciones mezcladas, soluciones ocultas hasta corregir y respuestas conservadas con sus índices canónicos.

Al superar examen se marca el recorrido completado y se programa repaso en tres días. Un repaso activo prioriza hasta tres preguntas por errores y necesidad de refuerzo: éxito → siete días; fallo → diez minutos. El motor de preguntas mantiene además sus propios intervalos por pregunta. Completar un recorrido o repetir sus pocas preguntas no acredita todo el tema ni una preparación completa para oposición. El dominio adaptativo sigue siendo una estimación basada en respuestas, no en lectura.

## Demostraciones publicadas

OSI; TCP/IP; IPv4; subnetting; DNS; SQL; sistemas operativos; seguridad informática. Cada una conecta fundamentos con preguntas específicas del modelo A de TAI 2024 aportado. SQL tiene dos oficiales; los demás una. La cobertura es deliberadamente limitada y se indica qué contenido queda por ampliar.

OSI distingue la referencia histórica ISO/IEC 7498-1:1994 de una afirmación sobre la edición actual. IPv4 separa clases históricas y CIDR. Subnetting marca las excepciones /31 y /32. DNS separa resolución y fallo de servicio. SQL identifica diferencias entre SGBD y taxonomías DML/DQL. Seguridad técnica no se presenta como obligaciones normativas.

## Persistencia y revisiones

Se conserva localStorage, la clave oposprint-learning-v2 y el historial clásico v1. Se añade pedagogy: {version: 1, topics: {...}}. La carga de datos v2 anteriores crea automáticamente ese apartado vacío y mantiene XP, eventos y fichas completadas. Los datos corruptos se conservan y no se sobrescriben automáticamente.

Cada tema guarda revisión, fase actual, fases completadas, ejercicios corregidos, resultados por nivel y fecha de repaso. Los intentos ya corregidos se reanudan con su explicación; un nivel aprobado permite retomar el siguiente. Las respuestas no corregidas de un minitest permanecen solo en memoria mientras esa vista está abierta.

El historial pedagógico limita cada nivel a sus tres últimos intentos y el repaso a doce. Los eventos de aprendizaje originales se conservan en el motor existente. Incrementar la revisión de un tema reinicia la evidencia de ese recorrido al abrirlo; no elimina XP ni eventos generales. Si cambian pregunta, opciones o significado, usa un ID de pregunta nuevo para que sus estadísticas no se mezclen.

## Añadir o modificar contenido

1. Define fuentes con URL primaria, edición, alcance y fecha real de revisión.
2. Añade un tema con ID estable y los campos del contrato; asigna IDs de preguntas y prerrequisitos existentes.
3. Redacta ejercicios y preguntas con una única respuesta y explica cada distractor; no derives preguntas masivamente de una plantilla.
4. Incluye el tema en las áreas editoriales y referencia los epígrafes del programa utilizado.
5. Incrementa la revisión cuando cambie sustancialmente el contenido evaluado.
6. Ejecuta npm run contentcheck, npm run typecheck, npm run lint, npm test y npm run build.

Cambiar nombres, orden, agrupaciones, contenido o prerrequisitos no requiere tocar el motor. Introducir una modalidad nueva de ejercicio sí exige ampliar el contrato, evaluador, interfaz y pruebas.

## Validación

Build incluye typecheck, lint y contentcheck. Las pruebas verifican los ocho recorridos de principio a fin, reanudación, soluciones ocultas, opción mezclada corregida correctamente, doble envío, fases/niveles bloqueados, repaso, migración, cambio de revisión, referencias y HTML escapado. Se conservan las pruebas de los simulacros anteriores.

Revisión visual de ejemplos OSI desktop y SQL responsive en Chrome con perfiles temporales, sin datos del usuario. Las capturas se hacen en una superficie aislada de QA y con animación desactivada para inspeccionar el estado final; no altera la interfaz productiva.

Las fuentes públicas son referencias, no un sistema automático de actualización normativa. Antes de publicar cursos jurídicos se necesitan revisión y fuentes aplicables a la convocatoria.
