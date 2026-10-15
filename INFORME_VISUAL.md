# Evolución visual de OpoSprint

Se mantiene JavaScript modular y CSS nativo, identidad violeta, fondos claros y persistencia localStorage. No se añaden dependencias ni se modifica el banco de preguntas o la puntuación.

- Inicio: hero único, CTA de simulacro nuevo, aprendizaje, ilustración CSS y métricas reales. El clásico mantiene su acceso.
- Preguntas: tarjetas A/B/C/D, selección sin reconstruir la pantalla, foco de teclado, corrección verde/rojo en práctica, transición corta entre enunciados.
- Lecciones: diagramas contextuales de subnetting, OSI, DNS, ARP e ICMP, comparación TCP/UDP, SQL y terminales ilustrativos.
- Progreso: nivel/XP, dominio de conceptos practicados, nota orientativa del último simulacro, racha, actividad semanal, materias fuertes/débiles y objetivo diario.
- Resultados: nota destacada, aciertos/fallos/blancos, fortalezas, refuerzo, plan y correcciones filtrables.
- Estilos: tokens compartidos, responsive y movimiento reducido.

Archivos: index.html, styles.css, ui/home.mjs, ui/progress.mjs, ui/session.mjs, ui/lessons.mjs, ui/components.mjs y nuevo ui/visuals.mjs; README.md e informe.

Validación: npm run build (incluye typecheck y lint), npm test: 23 tests. Capturas reales de Chrome del inicio desktop (1440 px) y responsive (500 px); Chrome impuso un viewport mínimo al intentar 390 px, por lo que esa captura recortada no se considera validación móvil. Pendiente revisión visual manual de todas las vistas y de móviles físicos.

Local: npm run dev → http://localhost:3000.
