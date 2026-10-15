# Entrega OpoSprint V3 · 13/10/2026

## Mejoras implementadas

- Auditoría antes de editar: AUDITORIA_V3.md. Se conserva la arquitectura nativa y el banco técnico de los recorridos.
- Simulacro personalizado de exactamente 80 preguntas oficiales distintas. Filtros por administración, técnica/legislación, materia y tema. Mezcla solo con autorización expresa; mantiene los demás filtros y prioriza el origen. Orden aleatorio de preguntas y alternativas originales.
- Tiempo configurable de 1 a 300 minutos y baremo de entrenamiento por origen, −1/4, −1/3, −1/2 o sin penalización. Blancos sin penalización. No se atribuye el formato de 80 a una convocatoria.
- Sesión con mapa, marcas, blancos, reloj, confirmación siempre antes de corregir, checkpoint periódico y guardado al salir de la página. Configuración incluida en borrador e intento. Reanudación de examen/práctica con posición, selecciones y tiempo pausado fuera de la aplicación.
- Catálogo histórico con estado documental explícito. Primer ejercicio Zaragoza disponible como entrenamiento de 50 evaluables, en orden original con sustitución 15→R1 y 16→R2. R3–R5 permanecen en práctica/banco. No mezcla convocatorias.
- Entrenamiento adaptativo de 20, 40 u 80 con filtro de contenido y autorización de mezcla. Conserva cuotas, debilidad, errores, repaso y distinción de ayuda. En el grupo de poco trabajadas favorece las nunca vistas. Rechaza índices de opción inexistentes en preguntas de tres respuestas.
- Resultados por temas, puntuación directa, nota orientativa, tiempo total y medio, comparación de intentos del mismo modo/tamaño/penalización, errores recurrentes, dominio estimado y plan de estudio.
- Cuaderno de errores y notas para preguntas nuevas. Profesor utiliza el catálogo ampliado. Corrección distingue el contenido didáctico y muestra concepto, explicación sencilla y ejemplo cuando están revisados; faltas de cobertura explícitas.
- Banco consultable por concepto/materia/convocatoria con organismo, cuerpo, convocatoria, año, ejercicio, número, reserva, documento, hashes y estado. No muestra claves en el listado.
- Importador por CLI con cuarentena, esquema, fuentes HTTPS admitidas, hashes locales, referencia independiente y activación con descarga oficial coincidente y revisión identificada. No sobrescribe IDs ya incorporados.

## Banco antes y después

| Administración | Antes, técnicas activas | Después, técnicas | Después, legislación histórica | Total V3 |
|---|---:|---:|---:|---:|
| Zaragoza | 37 | 37 | 16 | 53 |
| Aragón | 117 | 117 | 0 | 117 |
| AGE / TAI | 108 | 108 | 23 | 131 |
| Total | 262 | 262 | 39 | 301 |

16 de Zaragoza se transcribieron/cotejaron ahora sobre páginas originales y plantilla definitiva. Las 23 de TAI ya estaban transcritas y verificadas en el archivo histórico: se reactivaron en V3; no son una nueva descarga. Las cuatro anulaciones TAI y las anuladas Zaragoza siguen excluidas. El primer ejercicio original Zaragoza tiene 50 ordinarias + 5 reservas; 53 entradas válidas después de sus dos anulaciones.

## Cobertura por materia

Categorías editoriales heredadas, no epígrafes oficiales exhaustivos. Algunas se solapan conceptualmente; se preservaron las clasificaciones para compatibilidad.

| Materia registrada | Preguntas |
|---|---:|
| Administración | 5 |
| Constitución / administración | 18 |
| Legislación / administración | 16 |
| Bases de datos | 41 |
| Programación | 40 |
| Programación / web | 17 |
| Redes | 39 |
| Sistemas | 28 |
| Seguridad | 14 |
| Hardware | 6 |
| Docker / Cloud | 4 |
| Docker / virtualización | 3 |
| Virtualización | 3 |
| Web | 4 |
| Web / HTTP | 14 |
| Supuesto de desarrollo | 25 |
| Supuesto de sistemas | 24 |

## Fuentes procesadas y consultadas

Se procesaron los PDF locales ya aportados. No se descargó ningún examen nuevo de otra administración durante esta entrega. Las descargas del entorno local fallan y varias páginas INAP devolvieron 403. Las fuentes de cuestionarios Aragón/TAI y sus claves mantienen su revisión anterior; no se declara un nuevo cotejo visual de todas esas preguntas.

- [Zaragoza, ficha oficial 1731](https://www.zaragoza.es/oferta/ofertaDetalle.jsp?id=1731): consultada, con anexos del cuestionario y plantilla definitiva.
- [Cuestionario Zaragoza primer ejercicio](https://www.zaragoza.es/cont/paginas/oferta/archivos/1-1731_Cuestionario%201EJE.pdf): PDF local y páginas 2, 3, 4, 5 y 11 inspeccionadas visualmente para las incorporaciones. Hash previo conservado.
- [Plantilla definitiva Zaragoza](https://www.zaragoza.es/cont/paginas/oferta/archivos/3-%201731%20PLANTILLA%20DEFINITIVA%201EJE.pdf): imagen del PDF local contrastada; R4 y R5 son B.
- [Bases específicas Zaragoza](https://www.zaragoza.es/cont/paginas/oferta/archivos/bases/bases1731.pdf): leídas mediante web; remiten a las bases generales. No descargadas al proyecto ni hash inventado.
- [Bases generales actuales](https://www.zaragoza.es/cont/paginas/oferta/archivos/bases-textorefundido/bases_turno_libre.pdf): consultadas, apartado 7.4.C.1; indican 55 minutos y penalización de 1/4. La página municipal registra una modificación publicada el 31/07/2026, posterior al examen de abril. Pendiente contrastar la versión histórica antes de habilitar baremo auténtico.
- [TREBEP, BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719): artículos 10.1.d y 95.1 usados en nuevas explicaciones de R4/R5 de Zaragoza. Son ayudas OpoSprint, no texto del tribunal.
- [INAP TAI 2024](https://www.inap.es/web/sede-inap/tail-2024): enlace de procedencia histórico; acceso web bloqueado en esta sesión. El hash TAI identifica el PDF recopilatorio aportado, no una descarga individual de INAP, y así se indica en el catálogo.

## Archivos

Nuevos: AUDITORIA_V3.md, INFORME_V3.md, docs/IMPORTADOR_OFICIAL.md; core/official-exam.mjs, core/official-import.mjs, core/exam-analysis.mjs; data/official-catalog.mjs, data/official-zaragoza-law.mjs, data/imported-official.mjs; ui/official-exam.mjs, ui/official-bank.mjs, ui/exam-analysis.mjs; scripts/import-official.mjs; tests/official-v3.test.mjs, tests/official-v3-ui.test.mjs, tests/fixtures/zaragoza-law-2026.json.

Modificados: README.md, package.json, styles.css; core/types.d.ts, core/session-draft.mjs, core/storage.mjs, core/training.mjs; data/course-bank.mjs (anotación de tipos); ui/session.mjs, ui/platform.mjs, ui/exam.mjs, ui/home.mjs, ui/practice.mjs, ui/training.mjs, ui/components.mjs, ui/errors.mjs, ui/progress.mjs; scripts/check-content.mjs. Páginas Zaragoza 2/3 añadidas y 4/5/11 renderizadas para cotejo. dist/ actualizado mediante build. No nuevas dependencias.

## Pruebas ejecutadas

- Inicial: node --test, 95/95 aprobadas.
- Final: npm.cmd run test, 108/108 aprobadas, 0 fallos, 0 omitidas. No se eliminaron tests existentes.
- npm.cmd run typecheck: aprobado, ambas configuraciones.
- npm.cmd run lint: aprobado.
- npm.cmd run contentcheck: aprobado, recorridos, 262 técnicas, relaciones, 301 V3 y fixture jurídica.
- npm.cmd run build: aprobado; ejecuta también los tres controles anteriores.
- HTTP sobre dist/ en servidor temporal puerto 3187: aplicación, módulos V3 y página original 200; .env y plantilla bajo tmp/ 404. Servidor auxiliar detenido.
- Importador ejecutado con paquete de comprobación local: estructura/referencia/hashes válidos; queda pending-review, sin modificar banco. Activación remota no ejecutada.
- QA automatizada con Linkedom: 80 preguntas, ausencia de soluciones, marcas, pausa/recarga, tiempo/baremo conservados, confirmación incluso con todas respondidas, escape HTML y XP sin duplicar.
- No hay navegador conectado en esta sesión: iab no disponible e inventario de navegadores vacío. No se certifica revisión visual real ni móvil físico; las pruebas DOM no miden geometría.

## Persistencia y límites pendientes

Se mantienen claves v1/v2, XP, historial, lecciones, notas, eventos y revisiones. Los nuevos campos de configuración son opcionales y los estados anteriores siguen cargando. Las preguntas técnicas conservan sus IDs. Se valida la configuración y el índice de opción al reanudar. El almacenamiento continúa siendo local por navegador/origen.

Pendiente: reproducción íntegra con reglas oficiales históricas contrastadas (catálogo auténtico bloqueado); primer ejercicio Aragón completo con legislación; otras convocatorias y administraciones; ampliación de explicaciones y refuerzos revisados; QA visual móvil; reanudación del entrenamiento inteligente; sincronización entre dispositivos. No se certifica normativa vigente a partir de claves históricas ni dominio por leer ayudas.

El primer ejercicio Zaragoza se puede entrenar completo con 50 evaluables, pero no representa los dos ejercicios del proceso ni se anuncia como reproducción íntegra de todos sus documentos. Sus 14 nuevas preguntas jurídicas sin explicación revisada y la cobertura TAI pendiente se muestran expresamente. El catálogo V3 no promete todo el temario de la próxima convocatoria.

## Ejecutar en local

    npm.cmd ci
    npm.cmd run dev

Abre http://localhost:3000 y pulsa Simulacro de 80 oficiales. Si ya existe un servidor en ese puerto, utiliza el existente y recarga. Para servir la entrega compilada:

    npm.cmd run build
    npm.cmd start

No ejecutes dev y start simultáneamente en el mismo puerto. Las pruebas no han publicado un túnel nuevo ni cambiado router, firewall o credenciales.
