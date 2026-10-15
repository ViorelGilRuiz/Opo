# OpoSprint

## Estado vigente: V3 · 13/10/2026

El catálogo V3 ofrece **301 preguntas válidas**: Zaragoza 53 (37 técnicas + 16 de legislación), Aragón 117 técnicas y TAI 131 (108 técnicas + 23 de legislación histórica reactivadas). El banco técnico anterior de 262 se mantiene para recorridos y actividades anteriores. Las secciones históricas siguientes deben leerse junto a esta actualización.

Inicio abre **Simulacro de 80 preguntas oficiales**: examen personalizado, 80 distintas, orden aleatorio de preguntas y opciones originales. Configura administración, contenido, materia, tema, tiempo (1–300 minutos) y baremo de entrenamiento. Si no alcanza 80, informa del déficit. El banco mixto requiere selección expresa o marcar la autorización; mantiene los demás filtros y prioriza el origen elegido. Zaragoza necesita otros bancos para llegar a 80.

La configuración, respuestas, marcas, posición y tiempo se guardan en el borrador v2; se reanudan desde Inicio. Se pide confirmación antes de corregir, incluso con todas respondidas. El tiempo fuera de la aplicación queda pausado. Soluciones al terminar.

Practicar ofrece entrenamiento adaptativo de 20, 40 u 80, con filtro de contenido y autorización de mezcla. Por defecto sigue siendo técnico. Si el banco no alcanza la cantidad, no empieza una sesión corta. Mis errores incluye legislación y notas personales.

El catálogo de **Exámenes históricos completos** indica documentos pendientes y bloquea la reproducción con baremo oficial hasta contrastarlos. Zaragoza ofrece el primer ejercicio completo como entrenamiento de 50 evaluables: anuladas 15/16 sustituidas por R1/R2, sin mezclar convocatorias. Las bases generales actuales incorporan una modificación posterior al examen de abril; su aplicación histórica no se certifica automáticamente.

**Banco de preguntas verificadas** permite buscar conceptos, convocatorias y materias y consultar procedencia y hashes sin mostrar soluciones. Resultados: temas, comparación de intentos de igual modalidad/tamaño/penalización, errores recurrentes, dominio estimado y plan. Las ayudas jurídicas pendientes se señalan; R4/R5 de Zaragoza incluyen explicaciones contrastadas con TREBEP.

[Entrega y cobertura V3](INFORME_V3.md) · [Auditoría previa](AUDITORIA_V3.md) · [Importador y validación](docs/IMPORTADOR_OFICIAL.md). El importador mantiene cuarentena y exige referencia revisada y descarga oficial con hash coincidente para activar un paquete.


Plataforma local para preparar informática C1, con prioridad Aragón. HTML, CSS y JavaScript modular; servidor estático Node, TypeScript checkJs y ESLint. El progreso se guarda en localStorage. No necesita cuenta, base de datos ni claves de IA.

## PREPARACIÓN CON PREGUNTAS OFICIALES

El banco activo contiene **225 preguntas técnicas oficiales**: **117 de Ejecutivos de Informática C1 Aragón (13/06/2026, convocatoria 24/0023)** y **108 de TAI 2024**. Se excluyen Administración Pública, legislación y preguntas anuladas. Las preguntas propias de versiones anteriores quedan archivadas y no se seleccionan en ninguna actividad. Las explicaciones, esquemas y reglas de memoria son ayudas de OpoSprint, no parte del enunciado oficial.

Aragón: 73 preguntas técnicas del primer ejercicio y 44 válidas del segundo, incluidas reservas. La plantilla definitiva de 01/07/2026 mantiene la primera plantilla y anula la pregunta 20 del segundo ejercicio, sustituida por la reserva 41. El simulacro práctico usa exactamente 40 preguntas con esa sustitución; la práctica permite también las demás reservas válidas. Hay 36 explicaciones de Aragón revisadas; las restantes indican expresamente que su explicación está pendiente. No se inventan razones para los distractores.

[Cuestionarios y plantillas oficiales de Aragón](https://www.aragon.es/-/ejecutivos-de-informatica.-c1.-oferta-de-empleo-publico-de-2018-y-2022). Procedencia, exclusiones y hashes: [OFICIALES_ARAGON.md](OFICIALES_ARAGON.md).

- **Inicio → Empezar simulacro:** 50 preguntas técnicas oficiales de Aragón, 50 minutos, soluciones al finalizar.
- **Simulacro:** teoría, segundo ejercicio o mixto de Aragón; también teoría y supuestos de TAI. Son selecciones de entrenamiento, no predicciones ni notas oficiales de una próxima convocatoria.
- **Entrenar ahora:** hasta 20 preguntas de Aragón; selección determinista que se adapta tras cada respuesta, priorizando debilidades, errores y repaso espaciado.
- **Practicar:** filtros de origen (Aragón, TAI o ambos), materia, tema, cantidad y errores. Los filtros pequeños reducen la sesión sin duplicar preguntas.
- **Profesor:** explicación sencilla/técnica, ejemplos, esquemas, pistas y mini exámenes con preguntas oficiales disponibles. La ayuda no cuenta como un acierto autónomo.
- **Repaso activo al terminar:** hasta seis preguntas prioritarias para recordar el razonamiento antes de abrir la respuesta. Muestra la fecha de próximo repaso y no añade XP por mirar soluciones.
- **Mi regla de memoria:** cuaderno por pregunta para escribir la confusión y una regla propia; se guarda localmente y se incluye en la exportación.
- **Aprender:** ocho recorridos y 46 fichas técnicas. Las evaluaciones usan preguntas oficiales; una ficha sin pregunta verificada permite completar su lectura sin fabricar un ejercicio ni atribuir dominio.
- **Mis errores / Mi progreso:** reintentos, fechas de repaso, historial, rendimiento, XP, racha, misiones y logros.

El plan diario orientativo es de 120 minutos: 20 repaso, 30 aprendizaje, 50 test y 20 corrección. Los resultados comunicados anteriormente son contexto declarado; no se convierten en intentos ni XP ficticios. Consulta las bases y fechas de tu próxima convocatoria en el [IAAP](https://www.aragon.es/-/empleo-publico-en-aragon-convocatorias); el examen de 2026 es material histórico.

## REQUISITOS

Windows PowerShell, Node.js 22.13+ de la rama 22 o Node.js 24+ y un navegador moderno. Internet para instalar dependencias y consultar fuentes. Las fuentes tipográficas remotas tienen alternativas locales.

~~~powershell
node --version
npm.cmd --version
~~~

## INSTALACIÓN

~~~powershell
Set-Location -LiteralPath 'C:\Users\Distribución Gabarre\Desktop\Preparacion Oposicion TAI'
npm.cmd ci
~~~

En otro equipo sustituye la ruta por la carpeta del clon. También funciona npm.cmd install. npm.cmd evita el bloqueo de npm.ps1 en PowerShell.

## EJECUCIÓN

~~~powershell
npm.cmd run dev
~~~

Abre **http://localhost:3000**. Ctrl+C detiene el servidor. Guarda y recarga para ver cambios; no hay HMR. Solo escucha en 127.0.0.1.

## BUILD

~~~powershell
npm.cmd run build
npm.cmd start
~~~

Build ejecuta typecheck, lint y contentcheck, y copia la aplicación a dist/. Detén el servidor de desarrollo antes de npm.cmd start si ambos usan el puerto 3000.

## TESTS

~~~powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run contentcheck
npm.cmd test
~~~

Node test y Linkedom comprueban algoritmos, persistencia, claves definitivas, exclusiones, opciones originales, evaluaciones, profesor y recorridos de interfaz. TypeScript comprueba JavaScript con checkJs y una segunda configuración estricta del motor. No se deshabilitan controles para completar el build.

## ESTRUCTURA DEL PROYECTO

~~~text
index.html / app.js / styles.css  Entrada y simulacro clásico
core/                            Motores puros, tipos y persistencia
ui/                              Pantallas, corrección, profesor y repaso activo
data/official-aragon.mjs          Preguntas oficiales técnicas de Aragón
data/aragon-keys.mjs              Plantillas y exclusiones
data/aragon-sources.mjs           URLs, fecha y hashes de documentos originales
data/course-bank.mjs              Banco activo y contenido antiguo archivado
data/official-course.mjs          Evaluaciones oficiales de los recorridos
assets/aragon-pages/              Páginas de cuestionarios, sin plantillas
assets/exam-pages/                Páginas históricas TAI
tests/fixtures/                  Transcripción de referencia para regresiones
scripts/                         Servidor, build y comprobación de contenido
~~~

No hay React, Next.js, ORM, API de negocio, autenticación ni Docker. El servidor solo sirve recursos públicos autorizados; no expone .env ni tmp/. Los documentos PDF de trabajo y herramientas de extracción están en tmp/ y no son dependencias de ejecución.

## PERSISTENCIA

La clave oposprint-learning-v2 guarda XP, estadísticas, eventos, intentos, repaso, lecciones, evaluaciones, profesor, misiones y notas personales. La clave clásica oposprint-history-v1 se conserva. Cambiar la revisión de un recorrido archiva su progreso anterior; no elimina XP ni respuestas históricas y tampoco las considera evidencia del contenido nuevo.

Un fallo o blanco acerca el repaso a 10 minutos; aciertos consecutivos amplían intervalos de 1/3/7/14/30 días. Un solo acierto no domina un concepto. Ver soluciones, leer fichas sin evaluación y escribir notas no concede dominio. El historial v2 puede exportarse a JSON desde Mi progreso. Importar progreso, sincronizar dispositivos y reanudar un intento activo siguen pendientes.

Usa siempre el mismo navegador y origen: localhost, 127.0.0.1 y distintos puertos tienen almacenamientos diferentes. Recargar pierde el intento en curso. Si el almacenamiento falla se avisa; un dato corrupto se conserva y la aplicación continúa en memoria.

## VARIABLES DE ENTORNO

No se requieren variables. .env.example documenta PORT (3000 por defecto, entero 1–65535); no contiene secretos.

~~~powershell
Copy-Item -LiteralPath '.env.example' -Destination '.env'
notepad.exe .env
~~~

O temporalmente:

~~~powershell
$env:PORT = '3001'
npm.cmd run dev
# Después de detener el servidor:
Remove-Item Env:PORT
~~~

## SOLUCIÓN DE PROBLEMAS

- npm.ps1 bloqueado: usa npm.cmd; no es necesario cambiar la política de PowerShell.
- Puerto ocupado: detén el servidor anterior o configura PORT.
- npm start sin archivos: ejecuta antes npm.cmd run build.
- Cambios que no aparecen: recarga; si utilizas npm start, reconstruye dist/.
- Progreso ausente: comprueba navegador, origen, puerto y modo privado.
- No hay preguntas en un filtro: amplía la selección; no se generan preguntas para rellenarlo.
- Explicación pendiente: la clave oficial está disponible, pero no se atribuye una explicación técnica sin revisar.
- Cuestionario con código o diagramas: abre Contexto y original; las páginas no contienen soluciones. Las tablas del supuesto SQL se conservan en sus páginas originales.

La identidad clara y violeta, el diseño responsive y prefers-reduced-motion se mantienen. Arquitectura previa: AUDITORIA.md. Motores: PEDAGOGIA.md, PROFESOR.md, ENTRENAMIENTO.md y GAMIFICACION.md; las notas históricas de esos documentos deben leerse junto al estado actual descrito aquí.

El selector **Itinerario** guarda la preferencia Aragón/TAI. Inicio y Entrenar ahora usan ese banco; el formulario de práctica permite elegir otro origen expresamente.

## Acceso desde el móvil

HOST=0.0.0.0 en .env permite escuchar en la red local en el puerto PORT. HOST=127.0.0.1 limita el acceso al PC. Acceder desde Internet requiere una publicación o túnel adicional; abrir el servidor local no configura el router. El cliente oficial cloudflared está descargado en tmp/remote/ para preparar un enlace HTTPS; su creación queda pendiente de elegir acceso protegido por correo o autorizar un enlace público. El PC debe permanecer encendido y conectado. Las URL temporales cambian al recrear el túnel y localStorage pertenece a cada origen.

## Rendimiento y tests en móvil

El servidor comprime HTML/CSS/JavaScript con Brotli o gzip según el navegador y revalida recursos con ETag (304 cuando no cambian). Las fuentes se cargan sin bloquear la hoja de estilos principal. Medición local: CSS 77 % menos y banco Aragón 86 % menos con Brotli; no es una medición de latencia de Internet.

Durante un test, la vista móvil oculta la navegación general, mantiene progreso y reloj visibles, ofrece botones de 48 px y navegación inferior fija. El mapa de preguntas se despliega bajo el test. Las celebraciones no cubren los controles. Se conserva prefers-reduced-motion.

El arranque remoto protegido está preparado en scripts/start-remote.ps1 y exige el parámetro AllowedEmail. Todavía no se ha publicado el enlace; falta indicar el correo autorizado. Un túnel temporal requiere PC encendido, conexión y proceso activo; el enlace cambia al recrearlo. Para una URL permanente e independiente de la oficina se necesita alojar el build estático en un proveedor.

## Zaragoza C1 · examen aportado

Simulacros → Empezar Zaragoza ofrece selección técnica de 36 preguntas, práctica guiada de 20 o refuerzo mixto de 50. Se incorporan 37 preguntas oficiales (34 ordinarias y 3 reservas), con tres opciones y plantilla definitiva publicada el 03/06/2026. Administración y normativa siguen aplazadas. El banco total asciende a 262 preguntas. Véase INFORME_ZARAGOZA.md.

Pulsa Pausar en un test para retomarlo desde Inicio → Continuar mi test. El guardado y el progreso son locales a cada navegador/dominio; para cambiar de dispositivo usa exportación/importación. El tiempo queda pausado mientras cierras la aplicación.

## Acceso desde casa, móvil y tablet

El enlace público HTTPS comprobado en esta sesión es https://optics-discrete-routines-thou.trycloudflare.com/ . No pide cuenta ni contraseña, conforme a la autorización del usuario. El ordenador que sirve la aplicación debe permanecer encendido y sin suspenderse. El enlace temporal cambia al reiniciar el túnel: para una URL permanente y disponibilidad 24/7 hace falta desplegar dist/ en un alojamiento estable. El enlace antiguo de VS Code continúa privado y exige GitHub.

Para crear un nuevo enlace público (PowerShell, con el binario oficial cloudflared ya descargado):

```powershell
Set-Location 'C:\Users\Distribución Gabarre\Desktop\Preparacion Oposicion TAI'
npm.cmd install
npm.cmd run build
# Primera consola
npm.cmd start
# Segunda consola: copia la URL HTTPS que imprime
.\tmp\remote\cloudflared.exe tunnel --url http://127.0.0.1:3000 --no-autoupdate --protocol http2
```

cloudflared está en tmp/ y no se distribuye con el repositorio. Para instalarlo en un clon, consulta https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/ . El túnel solo necesita conexiones salientes; no hay que abrir el router. Si el servidor está activo, no arranques una segunda instancia en 3000.

## Refuerzo con oficiales revisadas

Después de corregir, pulsa **Reforzar con otras oficiales** o **Comprobarlo con otra oficial** en el repaso final. La selección usa relaciones didácticas revisadas y el mismo concepto; no rellena con preguntas arbitrarias de la categoría ni genera variantes. Prioriza preguntas que no hayas visto hoy y respeta las utilizadas en Profesor. Si no hay otra oficial enlazada, avisa de la falta de cobertura.

El motor está en core/reinforcement.mjs; las relaciones editables en data/reinforcement-links.mjs. El build compara cada pregunta activa con el enunciado, las opciones, el orden y la clave de los cuestionarios originales incorporados mediante core/official-policy.mjs. Las explicaciones y ayudas siguen identificadas como contenido didáctico, no como preguntas oficiales nuevas. Administración y normativa siguen aplazadas.
