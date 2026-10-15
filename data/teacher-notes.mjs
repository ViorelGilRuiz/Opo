/** @type {import("../core/teacher-types.js").TeacherNote[]} */
export const teacherNotes = [
  {
    topicId: "osi",
    hints: [
      "Identifica la función: señal física, entrega en un enlace o camino entre redes.",
      "Para cruzar redes se necesita una decisión basada en la dirección IP, no solo en MAC.",
    ],
    advanced:
      "Clasifica la operación, no la caja: un switch multicapa puede conmutar tramas y encaminar paquetes. Un dispositivo no pertenece necesariamente a una sola capa para todas sus funciones.",
  },
  {
    topicId: "tcpip",
    hints: [
      "Separa servicio de aplicación, transporte y control de red.",
      "Pregúntate si intervienen puertos TCP/UDP o mensajes de control de la capa Internet.",
    ],
    advanced:
      "La fiabilidad puede existir también en una aplicación construida sobre UDP. Que UDP no garantice entrega no implica que toda aplicación que lo use carezca de mecanismos de recuperación.",
  },
  {
    topicId: "ipv4",
    hints: [
      "Distingue bits totales, prefijo y siguiente salto.",
      "Compara primero el destino con la subred; después decide a qué interfaz local entregar la trama.",
    ],
    advanced:
      "El direccionamiento por clases es una clasificación histórica. Una máscara explícita debe prevalecer en el cálculo de la subred: no deduzcas la capacidad únicamente del primer octeto.",
  },
  {
    topicId: "subnetting",
    hints: [
      "Cuenta cuántos bits quedan para host o cuántos bits necesitas para subdividir.",
      "Usa una potencia de dos y distingue direcciones totales de hosts convencionales.",
    ],
    advanced:
      "La resta de dos pertenece al caso convencional con red y broadcast. RFC 3021 permite usar ambas direcciones de /31 en enlaces punto a punto; /32 expresa una sola dirección, no una subred convencional con dos reservas.",
  },
  {
    topicId: "dns",
    hints: [
      "Identifica qué dato quieres publicar: dirección, alias, correo o nombre inverso.",
      "Comprueba si la respuesta esperada es una IP o un nombre; no confundas resolver el nombre con prestar el servicio web.",
    ],
    advanced:
      "Si el nombre resuelve correctamente, un fallo de acceso puede proceder de TLS, HTTP o del alojamiento virtual. La comparación entre URL e IP no basta por sí sola para atribuir todo fallo a DNS.",
  },
  {
    topicId: "sql",
    hints: [
      "Distingue el contenido de las filas de la definición de la tabla.",
      "Piensa qué debe seguir existiendo después de ejecutar la sentencia; para valores ausentes revisa la semántica de NULL.",
    ],
    advanced:
      "Las etiquetas DDL, DML y DQL pueden variar entre materiales. El examen histórico clasifica SELECT como DML. Las propiedades de TRUNCATE, transacciones y DDL en triggers requieren revisar el SGBD concreto.",
  },
  {
    topicId: "operating-systems",
    hints: [
      "Separa recursos compartidos de unidades de ejecución.",
      "Distingue ejecutar simultáneamente de alternar trabajo y distingue aislamiento de un kernel invitado.",
    ],
    advanced:
      "Concurrencia y paralelismo no son sinónimos. Dos hilos pueden alternarse en un núcleo; compartir memoria exige coordinación. SIGKILL no ofrece la limpieza de un manejador de cierre ordenado.",
  },
  {
    topicId: "security",
    hints: [
      "Relaciona cada efecto observado con una propiedad de seguridad, sin inventar otros efectos.",
      "Pregunta quién lee, qué se cambia y si el servicio se puede utilizar.",
    ],
    advanced:
      "Una medida protege propiedades concretas. Comparar un hash con una referencia confiable ayuda a detectar cambios, pero no cifra ni elimina malware; no confundas integridad con autenticidad garantizada por sí sola.",
  },
];
