export const lessons = [
  {
    id: "lesson-0",
    title: "ICMP",
    topic: "ICMP",
    category: "Redes",
    block: "IV",
    prerequisite: null,
    basic:
      "Ping comprueba si recibe respuestas de eco; que responda no garantiza que todos los servicios funcionen.",
    technical:
      "ICMP es un protocolo de control en la capa de red. Echo Request y Echo Reply no utilizan puertos TCP/UDP propios. El filtrado puede impedir el eco aunque haya conectividad.",
    example:
      "Un portal responde por HTTPS mientras ping no recibe respuesta: el firewall puede filtrar ICMP.",
    analogy: "Llamar a la puerta no es entrar en cada habitación del edificio.",
    trap: "Buscar el puerto TCP de ping o interpretar ausencia de eco como caída segura.",
    rule: "PING = ICMP; un servicio se prueba además en su protocolo.",
    exercise: "¿Ping a una IP necesita TCP 443?",
    exerciseAnswer: "No: el eco utiliza ICMP, no HTTPS.",
    questionId: "nuevo-01",
  },
  {
    id: "lesson-1",
    title: "IPv4 / IPv6",
    topic: "IPv4 / IPv6",
    category: "Redes",
    block: "IV",
    prerequisite: null,
    basic:
      "Una IP identifica una interfaz en una red. No es el nombre del equipo ni su dirección física.",
    technical:
      "IPv4 tiene 32 bits repartidos en 4 octetos. IPv6 tiene 128 bits, representados en 8 grupos hexadecimales; :: abrevia grupos de ceros una sola vez.",
    example: "192.0.2.8 es IPv4. 2001:db8::8 es IPv6.",
    analogy:
      "La IP es una dirección de entrega; la MAC identifica el destino del siguiente enlace.",
    trap: "Contar caracteres impresos en vez de bits: una IPv6 abreviada sigue teniendo 128 bits.",
    rule: "8 grupos × 16 bits = 128.",
    exercise: "¿Cuántos bits tienen cuatro octetos?",
    exerciseAnswer: "32: cada octeto tiene 8 bits.",
    questionId: "nuevo-02",
  },
  {
    id: "lesson-2",
    title: "Subnetting",
    topic: "Subnetting",
    category: "Redes",
    block: "IV",
    prerequisite: "lesson-1",
    basic:
      "Una máscara separa los bits de red y de host. El prefijo /n indica cuántos bits iniciales son de red.",
    technical:
      "En IPv4 quedan 32-n bits de host. Direcciones = 2^(32-n). En subredes convencionales, hosts = direcciones-2. /31 y /32 requieren tratamiento específico.",
    example:
      "/24: 256/254; /25: 128/126; /26: 64/62; /27: 32/30; /28: 16/14; /29: 8/6; /30: 4/2.",
    analogy:
      "Cada bit de red adicional divide una calle de direcciones en dos calles iguales.",
    trap: "Confundir direcciones totales con hosts: /27 tiene 32 direcciones, no 32 hosts convencionales.",
    rule: "32 menos el prefijo; potencia de dos; resta dos si procede.",
    exercise: "¿A qué bloque /27 pertenece el último octeto 77?",
    exerciseAnswer: "Al bloque 64–95. Red 64, broadcast 95 y hosts 65–94.",
    questionId: "nuevo-10",
  },
  {
    id: "lesson-3",
    title: "ARP",
    topic: "ARP",
    category: "Redes",
    block: "IV",
    prerequisite: "lesson-2",
    basic:
      "Para entregar una trama Ethernet hay que conocer una dirección MAC del enlace local.",
    technical:
      "ARP resuelve IPv4 a MAC en el enlace local. Si el destino está fuera de tu subred, normalmente resuelves la MAC de la puerta de enlace. IPv6 utiliza Neighbor Discovery, no ARP.",
    example:
      "Destino remoto: IP final del servidor, MAC del router local en tu primera trama.",
    analogy:
      "La carta lleva dirección final, pero primero la entregas al mensajero del barrio.",
    trap: "Pensar que ARP averigua por Internet la MAC del servidor remoto.",
    rule: "ARP: IPv4 → MAC local.",
    exercise: "Si el servidor está en otra subred, ¿a quién va la trama local?",
    exerciseAnswer: "A la puerta de enlace que encamina hacia el destino.",
    questionId: "nuevo-05",
  },
  {
    id: "lesson-4",
    title: "DNS",
    topic: "DNS",
    category: "Redes",
    block: "IV",
    prerequisite: "lesson-3",
    basic:
      "DNS traduce nombres y publica información sobre servicios; no transporta la página web.",
    technical:
      "A: IPv4; AAAA: IPv6; CNAME: alias a otro nombre; MX: correo; PTR: resolución inversa; TXT: texto. Un CNAME no guarda directamente la IP.",
    example:
      "www → CNAME portal; portal → A 192.0.2.10. El alias sigue al nombre.",
    analogy:
      "Una agenda puede guardar un número o decir «consulta la ficha de esta otra persona».",
    trap: "Confundir un alias CNAME con un registro A o el servidor de correo MX.",
    rule: "A=IPv4, AAAA=IPv6, CNAME=nombre, PTR=vuelta, MX=correo.",
    exercise: "¿Qué registro usarías para IP → nombre?",
    exerciseAnswer: "PTR en la zona inversa correspondiente.",
    questionId: "nuevo-07",
  },
  {
    id: "lesson-5",
    title: "Puertos",
    topic: "Puertos",
    category: "Redes",
    block: "IV",
    prerequisite: null,
    basic:
      "Una dirección IP identifica el destino de red; un puerto de transporte ayuda a identificar el servicio.",
    technical:
      "Puertos habituales: SSH TCP22, HTTP TCP80, HTTPS TCP443, RDP TCP3389. DNS usa UDP53 y también TCP53 cuando corresponde. ICMP no usa puertos TCP/UDP.",
    example:
      "Puedes permitir HTTPS 443 y bloquear HTTP 80: son servicios/reglas distintos.",
    analogy: "IP es el edificio; puerto es la puerta del servicio.",
    trap: "Confundir 80 y 443, o afirmar que DNS utiliza solo UDP.",
    rule: "22 SSH · 80 HTTP · 443 HTTPS · 3389 RDP · 53 DNS.",
    exercise: "¿Qué puerto revisar para un acceso RDP directo estándar?",
    exerciseAnswer:
      "TCP 3389; una pasarela puede utilizar un modelo de conexión diferente.",
    questionId: "nuevo-08",
  },
  {
    id: "lesson-6",
    title: "OSI",
    topic: "OSI",
    category: "Redes",
    block: "IV",
    prerequisite: null,
    basic:
      "Los modelos de capas separan tareas de comunicación para poder razonar sobre ellas.",
    technical:
      "OSI: física, enlace, red, transporte, sesión, presentación, aplicación. Ethernet y MAC se asocian al enlace; IP a red; TCP/UDP a transporte.",
    example: "Switch Ethernet: reenvía por MAC. Router: encamina por IP.",
    analogy: "Una entrega separa vehículo, ruta, recepción y contenido.",
    trap: "Confundir el puerto físico de un switch con un puerto TCP.",
    rule: "Capa 2 MAC; capa 3 IP; transporte TCP/UDP.",
    exercise: "¿Qué dato aprende un switch convencional de una trama entrante?",
    exerciseAnswer: "La MAC de origen y el puerto por el que llegó.",
    questionId: "nuevo-09",
  },
  {
    id: "lesson-7",
    title: "ALU / MMU",
    topic: "ALU / MMU",
    category: "Sistemas",
    block: "II",
    prerequisite: null,
    basic:
      "La CPU calcula y ejecuta instrucciones; la gestión de memoria tiene una función diferente.",
    technical:
      "ALU efectúa operaciones aritméticas/lógicas. MMU traduce direcciones virtuales a físicas. Los registros almacenan operandos y estado inmediato dentro de la CPU.",
    example:
      "Una suma usa ALU; acceder a una dirección virtual requiere traducción de MMU según el sistema.",
    analogy:
      "ALU es la calculadora; MMU traduce el plano virtual al almacén real.",
    trap: "Pensar que MMU suma o que la ALU administra las páginas virtuales.",
    rule: "ALU calcula; MMU mapea memoria.",
    exercise: "¿Qué unidad asocias a AND y suma?",
    exerciseAnswer: "ALU.",
    questionId: "nuevo-11",
  },
  {
    id: "lesson-8",
    title: "Memoria",
    topic: "Memoria",
    category: "Sistemas",
    block: "II",
    prerequisite: null,
    basic:
      "Los datos de trabajo y los datos guardados no tienen las mismas garantías al apagar.",
    technical:
      "RAM convencional es volátil. Flash es no volátil. Registros y cachés son rápidos y forman parte de la jerarquía de memoria; un disco no sustituye el acceso inmediato de CPU.",
    example:
      "Un documento sin guardar en RAM puede perderse al cortar alimentación.",
    analogy: "RAM es la mesa de trabajo; almacenamiento es el archivador.",
    trap: "Confundir memoria rápida con memoria persistente.",
    rule: "Si debe sobrevivir al apagado, guárdalo en almacenamiento persistente.",
    exercise: "¿La flash necesita corriente continua para conservar los datos?",
    exerciseAnswer:
      "No: es no volátil, aunque tiene otras limitaciones físicas.",
    questionId: "nuevo-12",
  },
  {
    id: "lesson-9",
    title: "Linux / permisos",
    topic: "Linux / permisos",
    category: "Sistemas",
    block: "IV",
    prerequisite: null,
    basic: "6 = r+w, 5 = r+x y 0 = ninguno.",
    technical:
      "6 = r+w, 5 = r+x y 0 = ninguno. El grupo tiene solo lectura con 4. 7 da también ejecución al dueño. 605 da permisos al resto, no al grupo.",
    example:
      "¿Qué comando asigna lectura/escritura al dueño y lectura/ejecución al grupo, sin permisos al resto?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "El grupo tiene solo lectura con 4. 7 da también ejecución al dueño. 605 da permisos al resto, no al grupo.",
    rule: "r4 + w2 + x1; dueño, grupo, otros.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "6 = r+w, 5 = r+x y 0 = ninguno.",
    questionId: "nuevo-13",
  },
  {
    id: "lesson-10",
    title: "Linux / ext4",
    topic: "Linux / ext4",
    category: "Sistemas",
    block: "IV",
    prerequisite: null,
    basic:
      "Journaling no equivale a un backup ni garantiza conservar toda escritura reciente.",
    technical:
      "Journaling no equivale a un backup ni garantiza conservar toda escritura reciente. La coherencia de metadatos es uno de sus objetivos. El modo de journaling determina qué se registra. Ayuda a recuperar coherencia, aunque no elimina todos los riesgos.",
    example:
      "Tras una caída, ext4 usa un diario para recuperar coherencia. ¿Qué NO garantiza por sí solo ese mecanismo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "La coherencia de metadatos es uno de sus objetivos. El modo de journaling determina qué se registra. Ayuda a recuperar coherencia, aunque no elimina todos los riesgos.",
    rule: "Diario no significa copia de seguridad.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Journaling no equivale a un backup ni garantiza conservar toda escritura reciente.",
    questionId: "nuevo-14",
  },
  {
    id: "lesson-11",
    title: "Windows",
    topic: "Windows",
    category: "Sistemas",
    block: "IV",
    prerequisite: null,
    basic:
      "tracert descubre saltos hacia el destino usando valores TTL crecientes.",
    technical:
      "tracert descubre saltos hacia el destino usando valores TTL crecientes. ipconfig muestra configuración de interfaces. tasklist lista procesos. services.msc administra servicios.",
    example:
      "Necesitas comprobar la ruta que sigue el tráfico IP desde Windows hasta un destino. ¿Qué herramienta integrada es la más directa?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "ipconfig muestra configuración de interfaces. tasklist lista procesos. services.msc administra servicios.",
    rule: "tracert traza; ipconfig configura la foto local.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "tracert descubre saltos hacia el destino usando valores TTL crecientes.",
    questionId: "nuevo-15",
  },
  {
    id: "lesson-12",
    title: "CPU / registros",
    topic: "CPU / registros",
    category: "Sistemas",
    block: "II",
    prerequisite: null,
    basic: "Los registros son almacenamiento interno muy rápido de la CPU.",
    technical:
      "Los registros son almacenamiento interno muy rápido de la CPU. El disco es mucho más lento y no contiene el estado inmediato de ejecución. DNS no es memoria de la CPU. Swap respalda páginas de memoria, no reemplaza los registros.",
    example:
      "¿Dónde mantiene la CPU un pequeño conjunto de operandos y estado al que accede de forma especialmente directa?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "El disco es mucho más lento y no contiene el estado inmediato de ejecución. DNS no es memoria de la CPU. Swap respalda páginas de memoria, no reemplaza los registros.",
    rule: "Registros: el bolsillo inmediato de la CPU.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Los registros son almacenamiento interno muy rápido de la CPU.",
    questionId: "nuevo-16",
  },
  {
    id: "lesson-13",
    title: "Linux / procesos",
    topic: "Linux / procesos",
    category: "Sistemas",
    block: "IV",
    prerequisite: null,
    basic:
      "SIGKILL termina forzosamente y no puede manejarse; por eso no asegura limpieza.",
    technical:
      "SIGKILL termina forzosamente y no puede manejarse; por eso no asegura limpieza. No da oportunidad de ejecutar un manejador de limpieza. SIGTERM sí puede manejarse o ignorarse. Es una señal de sistemas tipo Unix.",
    example:
      "Un proceso no responde a SIGTERM. ¿Qué afirmación es correcta sobre SIGKILL?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "No da oportunidad de ejecutar un manejador de limpieza. SIGTERM sí puede manejarse o ignorarse. Es una señal de sistemas tipo Unix.",
    rule: "TERM pide; KILL fuerza.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "SIGKILL termina forzosamente y no puede manejarse; por eso no asegura limpieza.",
    questionId: "nuevo-17",
  },
  {
    id: "lesson-14",
    title: "Ataques web",
    topic: "Ataques web",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic:
      "Tres ataques distintos pueden parecer «un fallo de seguridad», pero afectan a objetivos diferentes.",
    technical:
      "SQLi interpreta entrada como código SQL; XSS ejecuta contenido activo en navegadores; DDoS agota un servicio desde varias fuentes.",
    example:
      "SQL concatenado: SQLi. Comentario que ejecuta script ajeno: XSS. Botnet que satura: DDoS.",
    analogy:
      "Manipular instrucciones del archivo, engañar al lector y atascar la puerta son riesgos distintos.",
    trap: "Aplicar escape HTML como sustituto de consultas parametrizadas o confundir XSS y SQLi.",
    rule: "Consulta → SQLi; navegador → XSS; saturación → DDoS.",
    exercise:
      "¿Qué defensa evita mezclar valores de entrada con instrucciones SQL?",
    exerciseAnswer:
      "Consultas parametrizadas, además de controles y permisos apropiados.",
    questionId: "nuevo-18",
  },
  {
    id: "lesson-15",
    title: "Hash",
    topic: "Hash",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic:
      "Un hash es una huella de contenido, no una versión cifrada que puedas descifrar después.",
    technical:
      "SHA-256 produce 256 bits. Una función hash criptográfica no ofrece un procedimiento de recuperación del original. La fiabilidad de una comprobación depende de la fuente del hash de referencia.",
    example:
      "Comparas el hash de una descarga con un resumen publicado por una fuente fiable.",
    analogy:
      "Una huella permite comparar identidades, pero no reconstruir el cuerpo de una persona.",
    trap: "Creer que hash válido significa fichero libre de malware.",
    rule: "Hash compara; cifrado protege y puede revertirse con la clave.",
    exercise: "¿Puedes recuperar un instalador guardando solo su SHA-256?",
    exerciseAnswer: "No; debes conservar el contenido original.",
    questionId: "nuevo-19",
  },
  {
    id: "lesson-16",
    title: "Contraseñas",
    topic: "Contraseñas",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic:
      "Un KDF para contraseñas y sales únicas dificultan ataques masivos y tablas precomputadas.",
    technical:
      "Un KDF para contraseñas y sales únicas dificultan ataques masivos y tablas precomputadas. El hash rápido sin sal facilita probar grandes cantidades de claves. Una filtración revela el texto claro. Base64 es codificación reversible, sin seguridad criptográfica.",
    example:
      "¿Qué almacenamiento de contraseñas reduce mejor el daño de una filtración de la base de datos?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "El hash rápido sin sal facilita probar grandes cantidades de claves. Una filtración revela el texto claro. Base64 es codificación reversible, sin seguridad criptográfica.",
    rule: "Contraseña: derivación lenta + sal única.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Un KDF para contraseñas y sales únicas dificultan ataques masivos y tablas precomputadas.",
    questionId: "nuevo-20",
  },
  {
    id: "lesson-17",
    title: "TLS",
    topic: "TLS",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic:
      "TLS protege el canal; la aplicación puede contener vulnerabilidades propias.",
    technical:
      "TLS protege el canal; la aplicación puede contener vulnerabilidades propias. La validación de identidad es parte del uso del certificado. Son objetivos de TLS correctamente configurado. La validez temporal forma parte de la validación.",
    example:
      "HTTPS protege una petición mientras viaja. ¿Qué NO se deduce de que el navegador valide el certificado?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "La validación de identidad es parte del uso del certificado. Son objetivos de TLS correctamente configurado. La validez temporal forma parte de la validación.",
    rule: "Candado del canal no audita la aplicación.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "TLS protege el canal; la aplicación puede contener vulnerabilidades propias.",
    questionId: "nuevo-21",
  },
  {
    id: "lesson-18",
    title: "Mínimo privilegio",
    topic: "Mínimo privilegio",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic: "El mínimo privilegio concede únicamente las lecturas necesarias.",
    technical:
      "El mínimo privilegio concede únicamente las lecturas necesarias. Ser propietaria excede su función. Eliminar tablas no es necesario para consultar informes. Compartir administración elimina separación y amplía el riesgo.",
    example:
      "Una aplicación de informes solo ejecuta SELECT. ¿Qué permiso de base de datos debería tener su cuenta?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Ser propietaria excede su función. Eliminar tablas no es necesario para consultar informes. Compartir administración elimina separación y amplía el riesgo.",
    rule: "Cuenta de informes: consultar, no administrar.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "El mínimo privilegio concede únicamente las lecturas necesarias.",
    questionId: "nuevo-22",
  },
  {
    id: "lesson-19",
    title: "CSRF",
    topic: "CSRF",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic:
      "Un token impredecible validado por el servidor ayuda a distinguir solicitudes legítimas; se complementa con SameSite y origen.",
    technical:
      "Un token impredecible validado por el servidor ayuda a distinguir solicitudes legítimas; se complementa con SameSite y origen. Escapar HTML aborda XSS, no autentica la intención de la petición. Parametrizar aborda SQLi, no CSRF. El nombre de la cookie no impide que el navegador la envíe.",
    example:
      "Una web ajena provoca una operación en otra donde el usuario tiene sesión mediante cookies. ¿Qué defensa resulta específica frente a este riesgo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Escapar HTML aborda XSS, no autentica la intención de la petición. Parametrizar aborda SQLi, no CSRF. El nombre de la cookie no impide que el navegador la envíe.",
    rule: "CSRF explota tu sesión; valida la intención.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Un token impredecible validado por el servidor ayuda a distinguir solicitudes legítimas; se complementa con SameSite y origen.",
    questionId: "nuevo-23",
  },
  {
    id: "lesson-20",
    title: "AES / hash",
    topic: "AES / hash",
    category: "Seguridad",
    block: "IV",
    prerequisite: null,
    basic: "El cifrado simétrico permite recuperar el contenido con la clave.",
    technical:
      "El cifrado simétrico permite recuperar el contenido con la clave. El hash no permite reconstruir el fichero. Base64 no ofrece confidencialidad. Un checksum no sustituye el contenido ni lo cifra.",
    example:
      "Debes recuperar mañana el contenido confidencial de un fichero. ¿Qué operación encaja, usando una clave protegida?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "El hash no permite reconstruir el fichero. Base64 no ofrece confidencialidad. Un checksum no sustituye el contenido ni lo cifra.",
    rule: "Para recuperar necesitas cifrado; para comparar, hash.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "El cifrado simétrico permite recuperar el contenido con la clave.",
    questionId: "nuevo-24",
  },
  {
    id: "lesson-21",
    title: "ACID",
    topic: "ACID",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic:
      "Una transacción agrupa operaciones que deben tratarse con reglas claras al fallar o ejecutarse a la vez.",
    technical:
      "Atomicidad: todo o nada. Consistencia: respeta restricciones. Aislamiento: controla interferencias concurrentes. Durabilidad: COMMIT persiste ante fallos posteriores según garantías del sistema.",
    example:
      "Compra: stock y pedido juntos. Si falla el pedido, se revierte el stock: atomicidad.",
    analogy: "Un paquete sellado lleva todas sus piezas o se devuelve entero.",
    trap: "Confundir revertir operaciones con durabilidad: durable significa conservar lo confirmado.",
    rule: "A todo o nada · C reglas · I concurrencia · D COMMIT dura.",
    exercise:
      "¿Qué propiedad se relaciona con leer datos de otra transacción aún no confirmada?",
    exerciseAnswer: "Aislamiento; esa observación es una lectura sucia.",
    questionId: "nuevo-28",
  },
  {
    id: "lesson-22",
    title: "DELETE / DROP",
    topic: "DELETE / DROP",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic: "DELETE sin WHERE elimina las filas manteniendo la tabla.",
    technical:
      "DELETE sin WHERE elimina las filas manteniendo la tabla. DROP TABLE elimina la tabla como objeto. DROP DATABASE elimina una base de datos. Eliminar una columna cambia el esquema, no vacía sus filas.",
    example:
      "Quieres vaciar las filas de auditoria sin eliminar la definición de la tabla. ¿Cuál cumple ese objetivo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "DROP TABLE elimina la tabla como objeto. DROP DATABASE elimina una base de datos. Eliminar una columna cambia el esquema, no vacía sus filas.",
    rule: "DELETE: filas. DROP: objeto.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "DELETE sin WHERE elimina las filas manteniendo la tabla.",
    questionId: "nuevo-26",
  },
  {
    id: "lesson-23",
    title: "SQL / JOIN",
    topic: "SQL / JOIN",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic:
      "LEFT JOIN conserva cada fila del lado izquierdo aunque no haya coincidencia.",
    technical:
      "LEFT JOIN conserva cada fila del lado izquierdo aunque no haya coincidencia. INNER JOIN excluye clientes sin coincidencia. CROSS JOIN combina todas las parejas, no la relación buscada. Agrupar pedidos no incorpora clientes que no aparecen en ellos.",
    example:
      "Quieres listar todos los clientes, incluso los que no tienen pedidos, junto a sus pedidos cuando existan. ¿Qué operación corresponde?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "INNER JOIN excluye clientes sin coincidencia. CROSS JOIN combina todas las parejas, no la relación buscada. Agrupar pedidos no incorpora clientes que no aparecen en ellos.",
    rule: "LEFT mantiene toda la izquierda.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "LEFT JOIN conserva cada fila del lado izquierdo aunque no haya coincidencia.",
    questionId: "nuevo-27",
  },
  {
    id: "lesson-24",
    title: "SQL / NULL",
    topic: "SQL / NULL",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic: "IS NULL comprueba ausencia de valor.",
    technical:
      "IS NULL comprueba ausencia de valor. La igualdad con NULL produce UNKNOWN, no TRUE. La desigualdad con NULL también produce UNKNOWN. Cero es un valor concreto, no NULL.",
    example:
      "En SQL, ¿qué condición selecciona las filas cuyo campo telefono no tiene valor?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "La igualdad con NULL produce UNKNOWN, no TRUE. La desigualdad con NULL también produce UNKNOWN. Cero es un valor concreto, no NULL.",
    rule: "NULL se pregunta con IS.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "IS NULL comprueba ausencia de valor.",
    questionId: "nuevo-29",
  },
  {
    id: "lesson-25",
    title: "Índices",
    topic: "Índices",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic: "Los índices tienen un coste de mantenimiento y almacenamiento.",
    technical:
      "Los índices tienen un coste de mantenimiento y almacenamiento. Un índice normal no prohíbe insertar. La indexación no convierte una tabla en solo lectura. El motor sigue soportando transacciones.",
    example:
      "Una columna ya tiene un índice. ¿Por qué añadir índices sobre cada columna puede empeorar una carga de inserciones?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Un índice normal no prohíbe insertar. La indexación no convierte una tabla en solo lectura. El motor sigue soportando transacciones.",
    rule: "Leer rápido también cuesta al escribir.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Los índices tienen un coste de mantenimiento y almacenamiento.",
    questionId: "nuevo-30",
  },
  {
    id: "lesson-26",
    title: "Claves",
    topic: "Claves",
    category: "Bases de datos",
    block: "III",
    prerequisite: null,
    basic:
      "La clave foránea exige que la referencia cumpla la relación definida.",
    technical:
      "La clave foránea exige que la referencia cumpla la relación definida. Un alias no impone restricciones de integridad. DESC solo ordena resultados. El rechazo descrito no requiere una vista.",
    example:
      "Un pedido referencia un cliente inexistente y el motor rechaza la inserción. ¿Qué restricción explica el rechazo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Un alias no impone restricciones de integridad. DESC solo ordena resultados. El rechazo descrito no requiere una vista.",
    rule: "La foránea exige que exista el destino.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "La clave foránea exige que la referencia cumpla la relación definida.",
    questionId: "nuevo-31",
  },
  {
    id: "lesson-27",
    title: "FIFO / LIFO",
    topic: "FIFO / LIFO",
    category: "Programación",
    block: "II",
    prerequisite: null,
    basic: "Una estructura decide dónde añades y por dónde retiras elementos.",
    technical:
      "Cola FIFO: primero en entrar, primero en salir. Pila LIFO: último en entrar, primero en salir.",
    example: "Añade A,B,C: cola retira A; pila retira C.",
    analogy: "Cola de personas frente a pila de platos.",
    trap: "Asociar cola con el último elemento porque fue el último que viste llegar.",
    rule: "Queue/cola = FIFO; Stack/pila = LIFO.",
    exercise: "Tras apilar 2,4,6, ¿qué valor desapilas primero?",
    exerciseAnswer: "6, el último que se apiló.",
    questionId: "nuevo-32",
  },
  {
    id: "lesson-28",
    title: "Complejidad",
    topic: "Complejidad",
    category: "Programación",
    block: "II",
    prerequisite: null,
    basic: "log2(2n)=log2(n)+1; es el patrón de la búsqueda binaria.",
    technical:
      "log2(2n)=log2(n)+1; es el patrón de la búsqueda binaria. Eso correspondería a crecimiento lineal. Cuadruplicar al duplicar caracteriza crecimiento cuadrático. Dividir un intervalo con caso de parada puede terminar.",
    example:
      "Un algoritmo divide por dos el intervalo de búsqueda en cada paso. Al duplicar el tamaño, ¿cómo cambia aproximadamente el número de pasos?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Eso correspondería a crecimiento lineal. Cuadruplicar al duplicar caracteriza crecimiento cuadrático. Dividir un intervalo con caso de parada puede terminar.",
    rule: "Duplicar datos suma un paso al logaritmo binario.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "log2(2n)=log2(n)+1; es el patrón de la búsqueda binaria.",
    questionId: "nuevo-33",
  },
  {
    id: "lesson-29",
    title: "POO",
    topic: "POO",
    category: "Programación",
    block: "III",
    prerequisite: null,
    basic:
      "Una interfaz común admite comportamientos específicos de cada tipo.",
    technical:
      "Una interfaz común admite comportamientos específicos de cada tipo. Serializar transforma objetos a una representación almacenada/transmitida. Normalizar organiza relaciones de datos. Ordenar dependencias no determina el despacho del método.",
    example:
      "El código llama a dibujar() a través de una interfaz y ejecuta una implementación diferente según el objeto. ¿Qué principio lo permite?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Serializar transforma objetos a una representación almacenada/transmitida. Normalizar organiza relaciones de datos. Ordenar dependencias no determina el despacho del método.",
    rule: "Una llamada, varias formas.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Una interfaz común admite comportamientos específicos de cada tipo.",
    questionId: "nuevo-34",
  },
  {
    id: "lesson-30",
    title: "Recursividad",
    topic: "Recursividad",
    category: "Programación",
    block: "III",
    prerequisite: null,
    basic:
      "Al decrementar números negativos se aleja de cero; debe validar la entrada o ajustar la parada.",
    technical:
      "Al decrementar números negativos se aleja de cero; debe validar la entrada o ajustar la parada. No existe esa garantía general de transformación segura. Sin un caso que cubra negativos, no devuelve cero automáticamente. El problema es de control de recursión.",
    example:
      "Una función se llama con n-1, pero su caso base solo cubre n==0. ¿Qué riesgo hay si recibe n negativo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "No existe esa garantía general de transformación segura. Sin un caso que cubra negativos, no devuelve cero automáticamente. El problema es de control de recursión.",
    rule: "La parada debe ser alcanzable desde la entrada.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Al decrementar números negativos se aleja de cero; debe validar la entrada o ajustar la parada.",
    questionId: "nuevo-35",
  },
  {
    id: "lesson-31",
    title: "Java / operadores",
    topic: "Java / operadores",
    category: "Programación",
    block: "III",
    prerequisite: null,
    basic: "^ es XOR bit a bit: 1010 XOR 0110 = 1100 = 12.",
    technical:
      "^ es XOR bit a bit: 1010 XOR 0110 = 1100 = 12. 16 es la suma, no XOR. ^ no expresa potencia en Java. 4 es la diferencia, no XOR.",
    example: "En Java, con enteros a=10 y b=6, ¿qué produce a ^ b?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "16 es la suma, no XOR. ^ no expresa potencia en Java. 4 es la diferencia, no XOR.",
    rule: "El sombrero ^ hace XOR, no potencia.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "^ es XOR bit a bit: 1010 XOR 0110 = 1100 = 12.",
    questionId: "nuevo-36",
  },
  {
    id: "lesson-32",
    title: "Excepciones",
    topic: "Excepciones",
    category: "Programación",
    block: "III",
    prerequisite: null,
    basic:
      "finally y mecanismos equivalentes como try-with-resources permiten la limpieza al salir por rutas normales o excepcionales.",
    technical:
      "finally y mecanismos equivalentes como try-with-resources permiten la limpieza al salir por rutas normales o excepcionales. Si la excepción salta esa sentencia, no limpia. Conservar una referencia no libera el recurso. Ignorar excepciones no garantiza la liberación.",
    example:
      "Una operación lanza una excepción tras abrir un recurso. ¿Qué construcción se usa para intentar liberar ese recurso al salir del bloque?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Si la excepción salta esa sentencia, no limpia. Conservar una referencia no libera el recurso. Ignorar excepciones no garantiza la liberación.",
    rule: "Recursos: planifica la salida antes de trabajar.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "finally y mecanismos equivalentes como try-with-resources permiten la limpieza al salir por rutas normales o excepcionales.",
    questionId: "nuevo-37",
  },
  {
    id: "lesson-33",
    title: "HTTP / idempotencia",
    topic: "HTTP / idempotencia",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic: "PUT es idempotente respecto al efecto previsto sobre el recurso.",
    technical:
      "PUT es idempotente respecto al efecto previsto sobre el recurso. PUT sí puede establecer o reemplazar estado. La duplicación no es el efecto idempotente esperado. La idempotencia no elimina controles de autenticación.",
    example:
      "Un cliente reintenta la misma petición PUT tras perder la respuesta. ¿Qué propiedad de su semántica facilita el reintento?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "PUT sí puede establecer o reemplazar estado. La duplicación no es el efecto idempotente esperado. La idempotencia no elimina controles de autenticación.",
    rule: "PUT repite un estado, no acumula copias.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "PUT es idempotente respecto al efecto previsto sobre el recurso.",
    questionId: "nuevo-38",
  },
  {
    id: "lesson-34",
    title: "HTTP / errores",
    topic: "HTTP / errores",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic: "403 representa una solicitud entendida cuyo acceso se rechaza.",
    technical:
      "403 representa una solicitud entendida cuyo acceso se rechaza. 401 indica que faltan credenciales válidas para autenticación. 201 indica creación correcta de un recurso. 301 indica traslado permanente.",
    example:
      "Una API reconoce al usuario autenticado, pero le niega una operación por su rol. ¿Qué respuesta es la más adecuada?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "401 indica que faltan credenciales válidas para autenticación. 201 indica creación correcta de un recurso. 301 indica traslado permanente.",
    rule: "401 acredita; 403 autoriza.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "403 representa una solicitud entendida cuyo acceso se rechaza.",
    questionId: "nuevo-39",
  },
  {
    id: "lesson-35",
    title: "CORS",
    topic: "CORS",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic:
      "CORS decide qué respuestas pueden leer scripts entre orígenes; no identifica ni autoriza usuarios.",
    technical:
      "CORS decide qué respuestas pueden leer scripts entre orígenes; no identifica ni autoriza usuarios. Permitir un origen no concede permisos de negocio al usuario. CORS es un mecanismo aplicado por navegadores, no una barrera general de red. La defensa CSRF depende del modelo de sesión y controles adicionales.",
    example:
      "Una API permite CORS a cualquier origen. ¿Qué afirmación sigue siendo cierta?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Permitir un origen no concede permisos de negocio al usuario. CORS es un mecanismo aplicado por navegadores, no una barrera general de red. La defensa CSRF depende del modelo de sesión y controles adicionales.",
    rule: "Origen permitido no significa usuario autorizado.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "CORS decide qué respuestas pueden leer scripts entre orígenes; no identifica ni autoriza usuarios.",
    questionId: "nuevo-40",
  },
  {
    id: "lesson-36",
    title: "JWT",
    topic: "JWT",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic:
      "Un JWS protege integridad con su firma, pero normalmente no cifra el contenido.",
    technical:
      "Un JWS protege integridad con su firma, pero normalmente no cifra el contenido. Base64url es codificación, no cifrado. Publicar una clave privada rompería el esquema; no es un requisito JWT. La caducidad afecta a la aceptación, no oculta el payload.",
    example:
      "El payload de un JWT firmado puede leerse sin la clave de firma. ¿Por qué no implica que el atacante pueda modificarlo válidamente?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Base64url es codificación, no cifrado. Publicar una clave privada rompería el esquema; no es un requisito JWT. La caducidad afecta a la aceptación, no oculta el payload.",
    rule: "Leer no es firmar; firma no es cifrado.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Un JWS protege integridad con su firma, pero normalmente no cifra el contenido.",
    questionId: "nuevo-41",
  },
  {
    id: "lesson-37",
    title: "HTTP / caché",
    topic: "HTTP / caché",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic:
      "304 indica que la representación almacenada sigue siendo válida para esa condición.",
    technical:
      "304 indica que la representación almacenada sigue siendo válida para esa condición. 201 se usa al crear un recurso. 403 es una denegación, no validación de caché. 500 es un error del servidor.",
    example:
      "Una petición GET condicional envía If-None-Match y el recurso conserva el mismo ETag. ¿Qué respuesta evita reenviar el cuerpo?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "201 se usa al crear un recurso. 403 es una denegación, no validación de caché. 500 es un error del servidor.",
    rule: "ETag igual: 304, reutiliza tu copia.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "304 indica que la representación almacenada sigue siendo válida para esa condición.",
    questionId: "nuevo-42",
  },
  {
    id: "lesson-38",
    title: "JSON",
    topic: "JSON",
    category: "Web / HTTP",
    block: "III",
    prerequisite: null,
    basic:
      "Las claves van entre comillas dobles; true y null son literales JSON válidos.",
    technical:
      "Las claves van entre comillas dobles; true y null son literales JSON válidos. Las claves deben ir entre comillas dobles. El literal booleano es true, en minúsculas. JSON estándar no admite la coma final.",
    example: "¿Qué documento cumple la sintaxis JSON estándar?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Las claves deben ir entre comillas dobles. El literal booleano es true, en minúsculas. JSON estándar no admite la coma final.",
    rule: "JSON: claves con comillas y literales en minúscula.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Las claves van entre comillas dobles; true y null son literales JSON válidos.",
    questionId: "nuevo-43",
  },
  {
    id: "lesson-39",
    title: "Kernel / VM",
    topic: "Kernel / VM",
    category: "Docker / Cloud",
    block: "IV",
    prerequisite: null,
    basic: "Una VM y un contenedor aíslan trabajo con mecanismos diferentes.",
    technical:
      "Una VM ejecuta un sistema invitado con su kernel sobre hardware virtualizado. Los contenedores convencionales comparten el kernel del host que los ejecuta, usando aislamiento de procesos y recursos.",
    example:
      "Dos contenedores Linux en un host Linux usan normalmente el mismo kernel. Docker Desktop puede incorporar una VM intermedia.",
    analogy:
      "VM es una vivienda completa; contenedores son estancias separadas en el mismo edificio.",
    trap: "Decir que cada contenedor siempre incluye un kernel propio.",
    rule: "Contenedor comparte kernel; VM ejecuta invitado.",
    exercise: "¿Una imagen de contenedor reemplaza el kernel del host?",
    exerciseAnswer:
      "No: contiene su espacio de usuario y metadatos, no arranca necesariamente un kernel propio.",
    questionId: "nuevo-44",
  },
  {
    id: "lesson-40",
    title: "Persistencia",
    topic: "Persistencia",
    category: "Docker / Cloud",
    block: "IV",
    prerequisite: null,
    basic: "Un volumen separa los datos del ciclo del contenedor.",
    technical:
      "Un volumen separa los datos del ciclo del contenedor. Eliminar el contenedor elimina su capa de escritura. Una variable no es un almacenamiento de ficheros persistentes adecuado. El historial de construcción no almacena el estado vivo de la aplicación.",
    example:
      "Un contenedor se elimina y se vuelve a crear. ¿Dónde conviene colocar datos que deben sobrevivir a su ciclo de vida?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Eliminar el contenedor elimina su capa de escritura. Una variable no es un almacenamiento de ficheros persistentes adecuado. El historial de construcción no almacena el estado vivo de la aplicación.",
    rule: "Contenedor reemplazable; datos fuera de su capa.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer: "Un volumen separa los datos del ciclo del contenedor.",
    questionId: "nuevo-45",
  },
  {
    id: "lesson-41",
    title: "Dockerfile",
    topic: "Dockerfile",
    category: "Docker / Cloud",
    block: "IV",
    prerequisite: null,
    basic:
      "La capa de instalación puede reutilizarse mientras sus manifiestos no cambien.",
    technical:
      "La capa de instalación puede reutilizarse mientras sus manifiestos no cambien. Cambiar código puede invalidar la capa anterior a la instalación. Desactivar caché no mejora su aprovechamiento. La construcción de imagen y el borrado del contenedor son ciclos distintos.",
    example:
      "Al reconstruir una imagen, cambias solo el código. ¿Qué orden suele aprovechar mejor la caché de dependencias?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Cambiar código puede invalidar la capa anterior a la instalación. Desactivar caché no mejora su aprovechamiento. La construcción de imagen y el borrado del contenedor son ciclos distintos.",
    rule: "Manifiestos primero; código cambiante después.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "La capa de instalación puede reutilizarse mientras sus manifiestos no cambien.",
    questionId: "nuevo-46",
  },
  {
    id: "lesson-42",
    title: "Cloud",
    topic: "Cloud",
    category: "Docker / Cloud",
    block: "IV",
    prerequisite: null,
    basic:
      "PaaS ofrece una plataforma administrada para ejecutar aplicaciones, con responsabilidades del cliente sobre código y configuración.",
    technical:
      "PaaS ofrece una plataforma administrada para ejecutar aplicaciones, con responsabilidades del cliente sobre código y configuración. IaaS deja normalmente al cliente la gestión del SO invitado. Un disco no ofrece una plataforma de despliegue. PTR es un registro DNS.",
    example:
      "Necesitas un entorno administrado para desplegar tu aplicación sin gestionar directamente el sistema operativo de las máquinas. ¿Qué modelo encaja mejor?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "IaaS deja normalmente al cliente la gestión del SO invitado. Un disco no ofrece una plataforma de despliegue. PTR es un registro DNS.",
    rule: "IaaS te da máquinas; PaaS una plataforma.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "PaaS ofrece una plataforma administrada para ejecutar aplicaciones, con responsabilidades del cliente sobre código y configuración.",
    questionId: "nuevo-47",
  },
  {
    id: "lesson-43",
    title: "Diagnóstico DNS",
    topic: "Diagnóstico DNS",
    category: "Diagnóstico",
    block: "IV",
    prerequisite: null,
    basic:
      "Diagnosticar consiste en separar hipótesis con pruebas pequeñas y observables.",
    technical:
      "Si puedes alcanzar el servicio por IP y falla la resolución del nombre, comprueba resolver, zona y registros DNS. Que falle ping por nombre también puede tener otras causas; observa el mensaje exacto.",
    example:
      "nslookup falla mientras el acceso por IP funciona: investiga resolución antes de reinstalar servicios.",
    analogy:
      "Si conoces la casa pero tu agenda no encuentra su nombre, revisa la agenda.",
    trap: "Dar por caído el servidor solo porque no se resuelve su nombre.",
    rule: "IP sí + nombre no se resuelve → revisar DNS.",
    exercise:
      "¿Reinstalarías el sistema antes de comprobar el servidor DNS configurado?",
    exerciseAnswer: "No: empieza por la hipótesis que explica los síntomas.",
    questionId: "nuevo-48",
  },
  {
    id: "lesson-44",
    title: "Puertos / RDP",
    topic: "Puertos / RDP",
    category: "Diagnóstico",
    block: "IV",
    prerequisite: null,
    basic:
      "Respuesta ICMP no garantiza que RDP escuche ni que TCP 3389 esté permitido.",
    technical:
      "Respuesta ICMP no garantiza que RDP escuche ni que TCP 3389 esté permitido. Ping prueba un mecanismo diferente al servicio RDP. 53 corresponde a DNS. 443 puede usarse en otros mecanismos como una pasarela, pero no es el puerto estándar directo descrito.",
    example:
      "Un equipo permite ping, pero el cliente RDP no conecta al servicio estándar. ¿Qué combinación revisas primero?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "Ping prueba un mecanismo diferente al servicio RDP. 53 corresponde a DNS. 443 puede usarse en otros mecanismos como una pasarela, pero no es el puerto estándar directo descrito.",
    rule: "Ping vivo no significa servicio abierto.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Respuesta ICMP no garantiza que RDP escuche ni que TCP 3389 esté permitido.",
    questionId: "nuevo-49",
  },
  {
    id: "lesson-45",
    title: "Diagnóstico TLS",
    topic: "Diagnóstico TLS",
    category: "Diagnóstico",
    block: "IV",
    prerequisite: null,
    basic:
      "Un reloj atrasado puede situar al cliente antes del inicio de validez.",
    technical:
      "Un reloj atrasado puede situar al cliente antes del inicio de validez. MX controla el correo, no la validación temporal. La impresión no interviene en TLS. El tamaño IPv4 no decide las fechas de un certificado.",
    example:
      "Solo un cliente ve un certificado como todavía no válido; en otros equipos funciona y la fecha real ya está dentro de la vigencia. ¿Qué revisas antes?",
    analogy:
      "Relaciona cada término con su función concreta, como herramientas de una caja.",
    trap: "MX controla el correo, no la validación temporal. La impresión no interviene en TLS. El tamaño IPv4 no decide las fechas de un certificado.",
    rule: "Certificado y fechas: compara también el reloj local.",
    exercise:
      "Explica sin mirar qué diferencia la respuesta correcta de las otras opciones.",
    exerciseAnswer:
      "Un reloj atrasado puede situar al cliente antes del inicio de validez.",
    questionId: "nuevo-50",
  },
];
