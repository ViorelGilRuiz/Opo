> Actualización 07/10/2026: las actividades activas usan únicamente preguntas oficiales técnicas de Aragón 2026 y TAI 2024. Bancos propios y ejercicios editoriales anteriores quedan archivados; Administración aplazada. Consulta README.md y OFICIALES_ARAGON.md para el estado vigente.

# Motivación y gamificación

## Qué incluye

Inicio muestra cinco misiones diarias. Mi progreso añade nueve logros, las etapas con nombre, el XP hacia el siguiente nivel y el dominio actual de los conceptos de OSI, subnetting y SQL. Los botones de misión llevan a Practicar, Repasar errores o Aprender.

Las etapas mantienen el ritmo de 500 XP por nivel: Inicio (0), Base (500), Técnico (1000), Especialista (1500) y Preparado (2000). A partir del nivel 5 se mantiene la etapa Preparado y continúa subiendo el número de nivel. Los nombres describen constancia; no acreditan nivel de examen ni predicen una plaza.

## XP y misiones

Se conservan las reglas anteriores: +10 por la primera respuesta correcta del día a cada pregunta, +25 por el primer dominio de un concepto y +100 por un simulacro completo. Un entrenamiento o minitest no concede esa bonificación de simulacro. Cada misión completada concede +20 XP una sola vez por día.

Las cinco misiones son:

- Completa 10 preguntas: diez respuestas no vacías registradas hoy.
- Corrige 3 errores antiguos: tres preguntas distintas cuya respuesta previa no era correcta y pertenecía a un día anterior; acertarlas varias veces no multiplica el contador.
- Domina un concepto: primera vez que un concepto alcanza DOMINADO durante hoy, con las reglas de evidencia existentes (al menos tres intentos, tres aciertos consecutivos y un índice mínimo de 85). Un único acierto o leer una explicación no cuentan.
- Estudia 15 minutos: suma del tiempo registrado al corregir preguntas. No mide lectura pasiva ni promete un cronómetro de concentración; se reutiliza la medición de actividad existente.
- Completa un minitest de redes: una evaluación de OSI, TCP/IP, IPv4, subnetting o DNS, en los recorridos o en un mini examen de Profesor enlazado al banco de redes. Completar no significa aprobar ni dominar el tema.

Las respuestas asistidas de Profesor no alimentan evidencia ni minutos/preguntas autónomas. Completar un mini examen docente sí puede completar su misión específica y reconocer la primera sesión.

## Logros y dominio

Primera sesión, 100 preguntas, 500 preguntas, primer simulacro, cinco simulacros, siete días de racha, OSI dominado, Subnetting dominado y SQL dominado. La primera sesión puede ser una práctica, un entrenamiento, un simulacro o una evaluación docente completada. Los contadores de preguntas cuentan respuestas realizadas, no únicamente IDs distintos.

Los tres logros de tema requieren que todos sus conceptos estén dominados, con al menos dos preguntas distintas por concepto y la evidencia acumulada del motor. Las referencias proceden del temario actual; los títulos no se usan como reglas especiales dentro del motor. Los logros ya obtenidos se conservan, mientras la interfaz muestra el dominio actual, que puede disminuir tras errores posteriores.

La racha se calcula por días naturales locales, con continuidad hasta hoy o ayer. Se usa aritmética de calendario para cruzar cambios de hora.

## Celebraciones

Un aviso breve y cerrable celebra nivel, récord de simulacro, primer dominio, misión, logro o hitos de racha (1, 3, 7, 14 y 30 días). Si coinciden varios, se muestra un aviso combinado. No hay confeti, sonidos, dependencias de animación ni celebraciones en cada acierto. Las transiciones duran 180 ms y se eliminan con prefers-reduced-motion. El aviso tiene role=status y aria-live=polite, y también funciona sobre la ventana de Profesor.

Los hitos se sincronizan al guardar progreso desde los recorridos, Profesor, prácticas, simulacros y entrenamiento inteligente. Volver a guardar o recargar no vuelve a conceder recompensas ni a celebrar el mismo hito.

## Arquitectura y persistencia

- core/motivation.mjs: cálculo puro de niveles y snapshot de misiones/logros; sincronización idempotente de recompensas e hitos.
- core/motivation-types.d.ts: contratos del estado y configuración.
- data/motivation.mjs: recompensa y referencias del temario/banco.
- ui/motivation.mjs: tarjetas, trayectoria y avisos.
- ui/platform.mjs: sincronización central al guardar; home/progress reutilizan la interfaz.

localStorage conserva oposprint-learning-v2. Se añade motivation de forma compatible: reconocimientos, misiones reclamadas por fecha, nivel máximo, récord y conceptos ya celebrados. Al cargar un estado antiguo se reconocen sus hitos actuales sin XP retrospectivo ni avisos masivos. Los timestamps de reconocimiento no se presentan como fechas históricas exactas de obtención. El historial clásico se conserva y mantiene su lectura anterior; los nuevos contadores se basan en eventos del motor adaptativo.

No hay recompensas económicas, credenciales nuevas ni backend. El progreso continúa siendo local al navegador.

## Validación

~~~powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run contentcheck
npm.cmd test
npm.cmd run build
~~~

Pruebas: límites de nivel, idempotencia diaria, cambio de día, errores antiguos distintos, minutos medidos, minitests, dominio parcial frente a tema completo, pérdida de dominio y conservación del logro, récords, contadores de 100/500, cinco simulacros, racha por calendario, migración sin XP retrospectivo, datos inválidos y recorrido de interfaz con avisos cerrables.

Resultado de esta entrega: build, typecheck, lint y contentcheck correctos; 67 tests pasan. Revisión visual en Chrome a 1440 y 500 px, con perfiles aislados y datos exclusivamente de prueba.
