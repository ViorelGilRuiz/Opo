# Refuerzo exclusivamente con preguntas oficiales

Se mantiene el banco de 262 preguntas técnicas: Zaragoza 37, Aragón 117 y TAI 108. No se han generado ni añadido preguntas en esta mejora. Se han incorporado diez relaciones didácticas revisadas para enlazar conceptos entre preguntas existentes: subnetting, modelos OSI/TCP-IP, certificados y firmas, LDAP, HTTPS, transferencias seguras, triggers/transacciones, UML, propiedades de seguridad y permisos/identidad Linux.

La selección excluye la original, evita duplicados, prioriza otras no vistas hoy y es determinista. No cambia XP ni marca dominio por solicitar ayuda. Profesor respeta las preguntas ya utilizadas. Sin cobertura, avisa; no sustituye el concepto por una pregunta arbitraria de la misma categoría.

Nuevos accesos desde correcciones y repaso final, y mejora de Mis errores → Reforzar con otras oficiales. Las soluciones siguen ocultas hasta responder en práctica o finalizar el simulacro.

Control de procedencia: cada activa debe coincidir con ID, convocatoria, itinerario, bloque, enunciado, clave y opciones originales. Se permiten explicaciones editoriales separadas; no basta con un prefijo o una etiqueta «oficial». El build verifica asimismo que las relaciones solo referencian preguntas activas existentes.

Archivos: core/official-policy.mjs, core/reinforcement.mjs, data/reinforcement-links.mjs, scripts/check-content.mjs, core/teacher-local.mjs, ui/errors.mjs, ui/recall.mjs, ui/components.mjs, ui/platform.mjs, tests/reinforcement.test.mjs y pruebas de interfaz.

Límites: relaciones inicialmente acotadas, no representan cobertura de todo el temario ni garantizan aprobar. El acceso remoto y el guardado local mantienen las condiciones descritas en README.
