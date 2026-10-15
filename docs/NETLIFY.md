# Publicar OpoSprint en Netlify

Conecta el repositorio GitHub `ViorelGilRuiz/Opo` y selecciona la rama `main`.
La configuración `netlify.toml` fija Node 24, `npm run build` y la carpeta pública `dist`.
Cada actualización de la rama desplegada generará una nueva versión del sitio.

La web funciona como aplicación estática, sin el servidor local encendido.
Solo se publica el contenido generado en `dist`: no se necesitan variables secretas ni la carpeta `tmp`.

## Progreso personal

El historial, las notas y los borradores se guardan en el navegador mediante localStorage.
Publicar el mismo código no sincroniza el progreso entre teléfono y ordenador.
Exporta una copia desde la aplicación local e impórtala en la URL de Netlify para trasladar el progreso.
Conserva la copia original antes de importar y revisa el resultado de la importación.

## Verificación

Ejecuta `npm ci`, `npm run build` y `npm test`.
Después de desplegar, comprueba Inicio, temarios, profesor, un simulacro,
la nota en directo y la pausa/reanudación. Las imágenes originales de los exámenes
deben cargar desde `/assets/`.
