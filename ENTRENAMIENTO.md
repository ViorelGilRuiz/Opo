> Actualización 07/10/2026: las actividades activas usan únicamente preguntas oficiales técnicas de Aragón 2026 y TAI 2024. Bancos propios y ejercicios editoriales anteriores quedan archivados; Administración aplazada. Consulta README.md y OFICIALES_ARAGON.md para el estado vigente.

# Entrenamiento inteligente

## Uso

Pulsa **Entrenar ahora** en Inicio o Practicar. No requiere filtros ni configuración previa: hasta 20 preguntas del banco técnico editorial (66 preguntas existentes). Se corrige cada respuesta antes de elegir la siguiente. «No lo sé» registra un blanco, sin penalización de nota, y aumenta la prioridad de aprendizaje del tema. Puedes terminar antes; solo se evalúan las preguntas corregidas.

## Motor determinista

core/training.mjs contiene funciones independientes de la interfaz:

- trainingConfig: configuración validada y pesos ajustables.
- createTraining: contexto, índice inicial y presión de temas durante la sesión.
- selectTrainingQuestion: selección determinista sin mutar el progreso.
- answerTraining: registro único y adaptación tras cada respuesta.
- trainingScores y trainingReport: índices, diferencias y recomendación.

core/training-types.d.ts define los contratos. ui/training.mjs presenta preguntas y resultados; ui/platform.mjs integra el ciclo de vida con navegación, Profesor y persistencia.

Pesos iniciales: débiles 35, errores recientes 25, repetición espaciada 20, poco trabajado 15, retención 5. Se normalizan si se cambian. El grupo con mayor déficit respecto a su cuota elige primero; si no tiene candidatos elegibles, se redistribuye entre los disponibles. Una pregunta puede reunir varias condiciones, pero cuenta una sola vez, en el grupo que la seleccionó. Las cuotas son objetivos, no garantías cuando el banco se queda corto.

Definiciones:

- Débil: concepto con evidencia y un índice de aprendizaje menor de 70.
- Error reciente: última respuesta no correcta en esa pregunta durante los últimos siete días. Un acierto posterior la saca de este grupo.
- Espaciada: pregunta cuyo dueAt ya ha vencido, utilizando los intervalos existentes.
- Poco trabajado: pregunta con menos de tres intentos, incluidas las nuevas.
- Retención: concepto DOMINADO según el motor existente; exige al menos tres intentos y tres aciertos consecutivos, nunca un único acierto.

Dentro del grupo, la clasificación combina presión del tema, debilidad, prioridades comunicadas, exposición durante la sesión e intentos anteriores. Un fallo añade 1 a la presión del tema, hasta 4; cada acierto la multiplica por 0,6. El índice de concepto también se recalcula con las respuestas reales. El desempate utiliza antigüedad e ID: el mismo estado, banco, sesión, configuración y fecha producen la misma selección, independientemente del orden del banco.

Nunca se repite un ID en la sesión. Las seis últimas preguntas contestadas se evitan mientras existan alternativas. Se limita a dos preguntas consecutivas del mismo tema si hay otros temas disponibles. Un banco insuficiente termina antes; no se generan variantes ni se crea un ciclo para rellenarlo.

Configurable desde trainingConfig/createTraining: count, weights, recentDays, questionCooldown, maxTopicRun, weakThreshold, lowAttempts, pressureStep y recoveryFactor. La configuración no contiene nombres de temas ni referencias a una API.

## Informe y persistencia

«HOY HAS MEJORADO» muestra las subidas reales del índice 0–100 por tema durante esta sesión. También se pueden consultar bajadas y valores sin cambio. No es una predicción de nota oficial ni una suma acumulada de todas las sesiones del día. La recomendación dedica diez minutos y diez preguntas al tema trabajado con menor índice final.

Se conserva localStorage v2. Las respuestas corregidas alimentan eventos, repaso y XP con las reglas existentes; la sesión finalizada entra en attempts como training. No cuenta como simulacro completo, no altera la nota del último simulacro y no concede la bonificación de simulacro. Salir conserva las respuestas ya corregidas; el recorrido pendiente no se reanuda.

## Validación

Tests independientes del algoritmo: cuotas, determinismo, banco invertido, bancos pequeños/vacíos, cooldown, diversidad, aumento y descenso de prioridad de DNS, un acierto insuficiente para dominar, informe real, configuración inválida y doble envío. Las pruebas DOM completan veinte preguntas, comprueban historial/resultados/reinicio y separación de simulacros.

~~~powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run contentcheck
npm.cmd test
npm.cmd run build
~~~

Limitación inicial: la diversidad depende del contenido editorial disponible. Ampliar las variantes de los conceptos con pocas preguntas ayudará más que relajar la protección frente a repeticiones.
