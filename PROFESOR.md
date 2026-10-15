> Actualización 07/10/2026: las actividades activas usan únicamente preguntas oficiales técnicas de Aragón 2026 y TAI 2024. Bancos propios y ejercicios editoriales anteriores quedan archivados; Administración aplazada. Consulta README.md y OFICIALES_ARAGON.md para el estado vigente.

# Profesor de OpoSprint

## Uso

Abre **Profesor ✦** en la navegación o **Explícamelo desde cero** después de una corrección. Las lecciones y los recorridos también tienen acceso al profesor en una ventana que se cierra sin perder la vista de origen.

Seis acciones: explicación fácil, explicación técnica, ejemplo, esquema, otra pregunta y mini examen. Cuatro niveles: Desde cero, Normal, Nivel examen y Avanzado. El nivel se conserva localmente.

En práctica guiada, Pista 1 → Pista 2 → Mostrar solución. Puedes responder sin pedir ayuda. El mini examen no ofrece pistas ni muestra correcciones hasta responder todas sus preguntas y finalizar. La corrección permite volver a empezar desde cero o comprobarlo con otra pregunta disponible.

## Cobertura inicial

Se reutilizan los ocho temas publicados y las fichas anteriores. OSI incluye dos preguntas editoriales nuevas: identificar Red como capa 3 y aplicar esa idea al router. No se generan variantes automáticamente. Cuando se agota el banco se avisa y se permite reiniciarlo. Los mini exámenes usan hasta tres preguntas distintas disponibles; no equivalen a un simulacro completo ni acreditan dominio.

Las fichas anteriores se identifican como cobertura parcial. Avanzado aporta matices limitados y reutiliza preguntas de examen, con aviso explícito. No hay explicación normativa nueva sin fuentes. Los temas publicados muestran su procedencia y versión mediante los datos editoriales existentes.

## Arquitectura

- core/teacher-types.d.ts: contrato TeacherProvider, contextos, respuestas estructuradas, niveles y estado.
- core/teacher.mjs: sesión asíncrona, validación del contenido, cancelación, protección frente a respuestas obsoletas y registro de actividades.
- core/teacher-local.mjs: proveedor editorial inyectable; recibe temario, banco, fichas y notas.
- data/teacher-notes.mjs y data/teacher-questions.mjs: contenido específico inicial.
- ui/teacher.mjs: interfaz que solo conoce TeacherProvider. Reutiliza los bloques visuales del motor pedagógico.
- ui/platform.mjs: composición del proveedor y accesos desde navegación/correcciones/lecciones.

Para conectar IA posteriormente, implementa otro TeacherProvider con respond(request, {signal}). Debe devolver TeacherResponse válido, con bloques de texto/código/tablas/esquemas, preguntas, pistas, cobertura y fuentes. La interfaz no acepta HTML arbitrario y escapa el texto. Las peticiones anteriores se cancelan; incluso un proveedor que ignore AbortSignal no puede sobrescribir una respuesta más reciente.

Un proveedor remoto debe llamar a un backend propio que custodie credenciales y controle acceso, límites y validación. No debe enviar claves al navegador. Esta entrega no incorpora API externa, claves, credenciales ficticias ni un backend nuevo.

## Persistencia y evaluación

localStorage mantiene la clave oposprint-learning-v2. La migración es aditiva: estados anteriores reciben teacher por defecto sin perder eventos, XP ni lecciones. Se guarda el nivel y hasta 100 actividades recientes, con respuestas y preguntas asistidas.

Leer no concede XP. Una pregunta con cualquier pista o solución visible es asistida: aparece en el historial de Profesor, pero no genera XP ni evidencia de dominio en el motor adaptativo. Las respuestas autónomas utilizan las reglas existentes, incluido el límite de XP por pregunta/día. Un mismo intento no puede registrarse dos veces.

La nota descuenta un tercio por fallo y muestra un mínimo de cero. No se añade una bonificación de simulacro completo por un mini examen.

## Validación

Ejecutar en PowerShell:

~~~powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run contentcheck
npm.cmd test
npm.cmd run build
~~~

Las pruebas cubren ocho temas × seis acciones × cuatro niveles, transición OSI → router, exclusión de preguntas usadas, persistencia, ayudas sin XP, doble envío, contenido inválido, errores recuperables, cancelación y respuestas tardías. Las pruebas DOM comprueban pistas, soluciones ocultas, mini examen y cierre de la ventana sin perder la lección.

Revisión visual en Chrome a 1440 y 500 px con perfiles temporales aislados. Pendiente recomendable: comprobar dispositivos físicos y ampliar contenido avanzado antes de presentarlo como cobertura completa.
