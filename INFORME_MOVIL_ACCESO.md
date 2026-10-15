# Móvil, rendimiento y acceso · 07/10/2026

Servidor activo en puerto 3000, HOST=0.0.0.0. Respuesta HTTP 200 en localhost; la versión previa también se comprobó en 192.168.1.50. No se ha creado una regla de firewall ni se ha publicado el túnel remoto.

## Mejoras

- Compresión Brotli/gzip con negociación de calidad; variantes en memoria e invalidación por modificación del archivo.
- ETag por representación, Vary: Accept-Encoding y revalidación 304.
- Fuentes tipográficas sin bloqueo de CSS inicial.
- Vista de concentración móvil con progreso/tiempo, navegación inferior fija, controles de 48 px y mapa de preguntas desplegable.
- Corrección de cierre/desmontaje de la vista: restaura la navegación al salir o finalizar.
- Arranque protegido preparado en scripts/start-remote.ps1; requiere AllowedEmail y no modifica router/firewall.

## Evidencia

Build con typecheck, lint y contentcheck correcto. 78 tests correctos, con cobertura añadida de compresión, negociación, fidelidad de contenido, invalidación y salida de modo de concentración. Script PowerShell validado con el parser, sin ejecutar la publicación.

Chrome aislado con emulación móvil 390×844: sin desbordamiento horizontal, navegación general oculta durante el test y ambos botones inferiores visibles, de 48 px de alto.

Medidas HTTP locales Brotli: CSS 57.538 → 13.252 bytes (77 % menos), banco Aragón 183.577 → 25.397 bytes (86 % menos). Petición condicional de ambos recursos: 304. Son medidas de transferencia local anteriores al último ajuste pequeño de CSS, no una garantía de latencia remota.

## Acceso remoto pendiente

La revisión automática rechazó el túnel público sin autenticación y la regla permanente de firewall porque requiere autorización expresa de ese alcance. Se solicitó correo para un enlace protegido o autorización explícita de acceso público; aún no se ha recibido la elección. No hay una URL externa disponible todavía.

El túnel temporal exige mantener PC y proceso encendidos, conexión activa y permiso de la red para tráfico saliente. Una dirección permanente e independiente de la oficina requiere desplegar dist/ en un alojamiento. El progreso sigue siendo localStorage por origen/navegador y no se sincroniza automáticamente entre PC y móvil.
