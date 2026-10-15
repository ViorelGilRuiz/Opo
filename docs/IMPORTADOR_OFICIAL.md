# Importador de documentos oficiales

El importador requiere transcripción literal, plantilla definitiva, archivos fuente y una referencia independiente cotejada visualmente. No convierte OCR automáticamente en contenido verificado. Admite dominios de Zaragoza, Aragón, INAP y BOE; ampliar a otros organismos exige revisar la lista.

## Paquete JSON

Campos: version: 1, administration, body, call, year, documents y questions. Cada documento tiene id, kind (questionnaire o definitive-key), url HTTPS oficial, sha256 y localFile relativo al proyecto. Incluye el cuestionario del ejercicio transcrito y su plantilla definitiva.

Cada pregunta cumple core/types.d.ts: id estable nuevo, track, examSet, number, section, reserve, block, category, topic, concept, subtopic, difficulty, prompt exacto, options originales ordenadas, answer de índice cero, source, explanation, rationales y trick. Si no existe explicación revisada, señala pendiente y usa rationales vacío.

referencia-revisada.json contiene un array independiente cotejado con las páginas originales y la clave definitiva. Se comparan identificadores, convocatoria, itinerario, ejercicio, número, reserva, enunciado, opciones y respuesta. Copiar el paquete no sustituye la revisión.

## Validación y cuarentena

    npm.cmd run import:official -- tmp/paquete.json tmp/referencia-revisada.json

Comprueba estructura, URLs, opciones, claves, duplicados, referencia y hashes de archivos locales. Escribe tmp/import-official/last-report.json. Un paquete válido queda pending-review y fuera de las actividades. La estructura no demuestra la procedencia del archivo.

## Activación después de revisar

    npm.cmd run import:official -- tmp/paquete.json tmp/referencia-revisada.json --activate --reviewed-by=NombreDelRevisor
    npm.cmd run build
    npm.cmd test

La activación exige revisión identificada y descarga los documentos desde sus URL oficiales para comprobar sus hashes. Si no coincide el hash o falla Internet, no modifica el banco. No sobrescribe preguntas existentes. Añade el paquete a data/imported-official.mjs, utilizado por el catálogo V3. No añade automáticamente lecciones ni relaciones didácticas.

No se ejecutó activación remota en esta entrega. Se ejecutó validación en cuarentena con los PDF locales de Zaragoza y se probaron rechazos de datos inválidos. No se descargaron nuevos cuestionarios al entorno local.
