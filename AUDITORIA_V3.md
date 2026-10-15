# Auditoría previa V3 · 13/10/2026

Leídos README, auditoría inicial, informes de fases, móvil, Zaragoza y refuerzo, documentación pedagógica, Profesor, entrenamiento y gamificación. Revisados contratos y motores en core, bancos/fuentes en data, sesiones y navegación en ui, scripts, pruebas y páginas originales en assets. No hay AGENTS.md en la raíz.

Estado inicial: 262 técnicas activas (Zaragoza 37, Aragón 117, TAI 108). El archivo oficial TAI conserva 135 entradas, cuatro anuladas; legislación archivada. Zaragoza solo tiene selección técnica, no primer ejercicio completo. Exámenes por origen tienen tiempos/penalizaciones de entrenamiento. El algoritmo de selección existente reduce el tamaño si faltan preguntas: no sirve para garantizar exactamente 80.

Reutilizables: sesión de examen con blancos, marcas, mapa, reloj, corrección, pausa/reanudación; almacenamiento v2 y migraciones; aprendizaje, entrenamiento determinista, Profesor local, notas y refuerzo. Se mantendrá el banco técnico anterior para recorridos y regresiones; el catálogo V3 incluirá por separado legislación verificada y la mostrará expresamente.

Validación inicial ejecutada con Node 24.19.0: 95 pruebas, 95 aprobadas, 0 fallos. No existe historial Git en la carpeta. La ejecución shell integrada no arranca; se usa Node con child_process para ejecutar las herramientas instaladas, sin cambiar las comprobaciones.

Fuentes consultadas: ficha municipal proceso 1731, cuestionario y plantilla definitiva de primer ejercicio, bases específicas publicadas el 30/06/2025. Se revisaron visualmente páginas 2, 3, 4 y 11 del PDF aportado y la plantilla definitiva local. Las bases específicas remiten a las generales para tiempo y puntuación; no se atribuirán reglas oficiales sin ese documento. INAP rechaza varias peticiones con 403. Las descargas directas desde el entorno local no están disponibles. Estos límites no impiden implementar V3 con los documentos ya presentes.
