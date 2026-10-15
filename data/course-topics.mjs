/** @type {import("../core/pedagogy-types.js").CourseTopic[]} */
export const courseTopics = [
  {
    id: "osi",
    revision: 1,
    title: "Modelo OSI",
    block: "IV",
    category: "Redes",
    summary:
      "Ubica funciones y unidades de datos antes de memorizar protocolos.",
    estimatedMinutes: 25,
    prerequisiteIds: [],
    officialRefs: ["IV.7"],
    sourceIds: ["osi", "tai2024"],
    objectives: [
      "Ordenar las siete capas",
      "Distinguir enlace, red y transporte",
      "Detectar errores de capa en un enunciado oficial",
    ],
    introduction: [
      {
        type: "text",
        title: "Un problema, varias responsabilidades",
        body: "Enviar un mensaje implica representar datos, entregarlos entre aplicaciones y transportarlos por enlaces. OSI organiza esas responsabilidades; es un modelo de referencia, no un programa que se instala.",
      },
    ],
    concepts: [
      {
        id: "osi-capas",
        title: "Siete capas, siete responsabilidades",
        simple:
          "Las capas inferiores mueven datos; las superiores organizan el diálogo de las aplicaciones.",
        technical:
          "Orden ascendente: física, enlace, red, transporte, sesión, presentación, aplicación. Red se ocupa del encaminamiento; transporte de comunicación entre extremos. MAC y LLC son subcapas de enlace, no de sesión.",
        example:
          "Un cable corresponde a física; una trama Ethernet a enlace; un paquete IP a red.",
        commonError: "Olvidar enlace y contar solo seis capas.",
        memory:
          "Física Enlace Red Transporte Sesión Presentación Aplicación. Repite el orden antes de asignar protocolos.",
        questionIds: ["fund-osi-1", "tai-2024-0-0-72"],
        sourceIds: ["osi"],
        difficulty: "foundation",
      },
      {
        id: "osi-dispositivos",
        title: "MAC, IP y puertos",
        simple: "Piensa qué dato mira un dispositivo para decidir la entrega.",
        technical:
          "Un switch Ethernet habitual conmuta por MAC (capa 2); un router encamina por IP (capa 3). TCP/UDP son transporte (capa 4). Hay equipos multicapa; clasifica la función, no solo el nombre comercial.",
        example: "Un switch aprende la MAC de origen por el puerto de entrada.",
        commonError:
          "Atribuir siempre capa 3 al switch o enrutamiento a transporte.",
        memory: "MAC → 2; IP → 3; puertos → 4.",
        questionIds: ["fund-osi-2", "nuevo-09"],
        sourceIds: ["osi", "tcpip"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "layers",
        title: "OSI de arriba abajo",
        items: [
          "7 · Aplicación: servicios para aplicaciones",
          "6 · Presentación: representación de datos",
          "5 · Sesión: organización del diálogo",
          "4 · Transporte: comunicación entre extremos",
          "3 · Red: direccionamiento y encaminamiento",
          "2 · Enlace: entrega de tramas en el enlace",
          "1 · Física: señales y bits",
        ],
      },
      {
        type: "callout",
        title: "Referencia de examen",
        body: "La pregunta de 2024 cita ISO/IEC 7498-1:1994. X.200 (1994) es la referencia utilizada aquí; no se deduce que sea la edición más reciente en cualquier fecha.",
      },
    ],
    exercises: [
      {
        id: "osi-e1",
        type: "choice",
        conceptIds: ["osi-capas"],
        prompt: "¿Dónde se decide el encaminamiento IP?",
        options: ["Enlace", "Red", "Transporte", "Presentación"],
        answer: 1,
        hint: "Busca la función, no el cable.",
        explanation: "Red (capa 3) gestiona direccionamiento y encaminamiento.",
      },
      {
        id: "osi-e2",
        type: "number",
        conceptIds: ["osi-dispositivos"],
        prompt: "¿Número de capa de un switch que decide por MAC?",
        answer: 2,
        unit: "capa",
        hint: "MAC es un dato de enlace.",
        explanation:
          "Enlace es la capa 2. Un switch multicapa puede realizar además otras funciones.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-osi-1", "fund-osi-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-09"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-0-0-72"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Sin mirar el diagrama, enumera las siete capas y explica por qué un router no es transporte.",
      },
      {
        type: "text",
        title: "Pregunta que cambia el contexto",
        body: "Si el equipo combina switching y routing, identifica qué función está describiendo el enunciado antes de responder.",
      },
    ],
  },
  {
    id: "tcpip",
    revision: 1,
    title: "TCP/IP",
    block: "IV",
    category: "Redes",
    summary:
      "Relaciona el modelo de Internet con OSI y separa ICMP de TCP/UDP.",
    estimatedMinutes: 25,
    prerequisiteIds: ["osi"],
    officialRefs: ["IV.7", "IV.8"],
    sourceIds: ["tcpip", "tai2024"],
    objectives: [
      "Ubicar los protocolos en cuatro capas",
      "Comparar TCP y UDP",
      "Explicar por qué ping no tiene puerto TCP",
    ],
    introduction: [
      {
        type: "text",
        title: "Del modelo a Internet",
        body: "TCP/IP describe la familia de protocolos empleada en Internet. Su presentación habitual tiene cuatro capas; algunos textos docentes separan física de enlace y cuentan cinco. Identifica la convención del enunciado.",
      },
    ],
    concepts: [
      {
        id: "tcpip-capas",
        title: "Las cuatro capas",
        simple:
          "Aplicación usa servicios; transporte comunica procesos; Internet encamina; enlace entrega al siguiente salto.",
        technical:
          "La arquitectura de RFC 1122 distingue aplicación, transporte, Internet y enlace. HTTP y DNS son aplicación; TCP/UDP transporte; IP e ICMP Internet. No hay una capa de sesión separada en esta descripción.",
        example:
          "HTTPS sobre TCP pasa por aplicación, transporte, Internet y enlace. HTTP/3 usa QUIC sobre UDP: HTTPS no implica universalmente TCP.",
        commonError:
          "Colocar TCP/UDP en Internet o añadir sesión a las cuatro capas.",
        memory: "Aplicación → Transporte → Internet → Enlace.",
        questionIds: ["fund-tcpip-1", "tai-2024-0-0-73"],
        sourceIds: ["tcpip"],
        difficulty: "foundation",
      },
      {
        id: "tcpip-control",
        title: "TCP, UDP e ICMP",
        simple:
          "TCP ofrece entrega fiable y ordenada del flujo; UDP envía datagramas; ICMP informa y diagnostica.",
        technical:
          "TCP usa conexión y retransmisiones. UDP no garantiza entrega u orden. El eco de ping usa ICMP: no es un servicio TCP/UDP con un puerto. La falta de eco puede ser filtrado y no prueba una caída.",
        example: "Un servidor puede responder HTTPS y bloquear Echo Request.",
        commonError:
          "Buscar el puerto 443 de ping o creer que UDP nunca puede usarse en aplicaciones fiables.",
        memory: "PING = ICMP. La aplicación puede añadir garantías sobre UDP.",
        questionIds: ["fund-tcpip-2", "nuevo-01", "nuevo-08"],
        sourceIds: ["tcpip"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Comparación de responsabilidades",
        headers: ["Capa TCP/IP", "Ejemplos", "OSI aproximado"],
        rows: [
          ["Aplicación", "DNS, HTTP", "5–7"],
          ["Transporte", "TCP, UDP", "4"],
          ["Internet", "IP, ICMP", "3"],
          ["Enlace", "Ethernet", "1–2"],
        ],
      },
      {
        type: "steps",
        title: "Caso: ping bloqueado, web accesible",
        items: [
          "Prueba el servicio HTTPS por separado.",
          "Revisa el filtrado de ICMP Echo.",
          "No sustituyas la prueba de servicio por una conclusión basada solo en ping.",
        ],
      },
    ],
    exercises: [
      {
        id: "tcpip-e1",
        type: "choice",
        conceptIds: ["tcpip-control"],
        prompt:
          "Un servidor responde al navegador pero no a ping. ¿Qué puede estar bloqueado?",
        options: [
          "DNS obligatoriamente",
          "ICMP Echo",
          "Todo el tráfico IP",
          "TCP 443 obligatoriamente",
        ],
        answer: 1,
        hint: "El eco no lleva puerto.",
        explanation: "Puede bloquearse ICMP mientras HTTPS sigue funcionando.",
      },
      {
        id: "tcpip-e2",
        type: "choice",
        conceptIds: ["tcpip-capas"],
        prompt: "¿Dónde se sitúan TCP y UDP en TCP/IP?",
        options: ["Aplicación", "Internet", "Enlace", "Transporte"],
        answer: 3,
        hint: "Separar IP de entrega entre procesos.",
        explanation:
          "TCP y UDP pertenecen a transporte; ICMP pertenece a Internet.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-tcpip-1", "fund-tcpip-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-01", "nuevo-08"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-0-0-73"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Dibuja las cuatro capas y coloca DNS, TCP, IP e ICMP sin consultar la tabla.",
      },
      {
        type: "text",
        title: "Comprueba la regla",
        body: "Responde en una frase: ¿por qué abrir TCP 443 no arregla necesariamente ping?",
      },
    ],
  },
  {
    id: "ipv4",
    revision: 1,
    title: "IPv4",
    block: "IV",
    category: "Redes",
    summary:
      "Entiende bits, direcciones y entrega local antes de calcular subredes.",
    estimatedMinutes: 25,
    prerequisiteIds: ["tcpip"],
    officialRefs: ["IV.7"],
    sourceIds: ["ipv4", "cidr", "tcpip", "tai2024"],
    objectives: [
      "Contar los 32 bits",
      "Interpretar un prefijo",
      "Decidir cuándo usar puerta de enlace",
    ],
    introduction: [
      {
        type: "text",
        title: "Una dirección no es una red completa",
        body: "Una IPv4 identifica una interfaz en un contexto de red. Para decidir qué destinos son locales necesitas también la máscara o el prefijo.",
      },
    ],
    concepts: [
      {
        id: "ipv4-bits",
        title: "Octetos y prefijos",
        simple: "Cuatro grupos de ocho bits forman una dirección IPv4.",
        technical:
          "IPv4 tiene 32 bits; cada octeto decimal va de 0 a 255. /n marca los bits de red, no los hosts disponibles. IPv6 tiene 128 bits aunque la escritura esté abreviada. CIDR permite prefijos de longitud variable.",
        example:
          "192.0.2.10/24 reserva 24 bits para red y deja 8 bits para host.",
        commonError:
          "Confundir caracteres escritos con bits o utilizar clases como única forma moderna de subnetting.",
        memory: "4 × 8 = 32; IPv6 = 8 × 16 = 128.",
        questionIds: ["fund-ipv4-1", "nuevo-02"],
        sourceIds: ["ipv4", "cidr"],
        difficulty: "foundation",
      },
      {
        id: "ipv4-salto",
        title: "Red local y siguiente salto",
        simple:
          "Si el destino no está en tu subred, entrega al router que puede encaminarlo.",
        technical:
          "En Ethernet/IPv4, ARP resuelve la MAC del siguiente salto local: el destino si es local o normalmente la puerta de enlace si es remoto. La IP de destino del paquete sigue siendo la del destinatario final.",
        example:
          "192.168.1.10/24 → 192.168.2.20: MAC del router local, IP final 192.168.2.20.",
        commonError: "Suponer que ARP obtiene por Internet la MAC remota.",
        memory: "IP = destino final; MAC = siguiente salto local.",
        questionIds: ["fund-ipv4-2", "nuevo-05"],
        sourceIds: ["tcpip", "ipv4"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "steps",
        title: "Dos direcciones con /26",
        items: [
          "255.255.255.192 equivale a /26: el bloque del último octeto mide 64.",
          "192.168.123.71 está en 64–127.",
          "192.168.123.133 está en 128–191.",
          "No comparten la subred; el prefijo forma parte del razonamiento.",
        ],
      },
      {
        type: "callout",
        title: "Terminología histórica",
        body: "El modelo por clases del examen usa A: /8; B: /16; C: /24 por defecto. 172.x se clasificaba como B; una C convencional tenía 254 hosts. CIDR actual no obliga a conservar esas máscaras. La pregunta histórica pide la afirmación INCORRECTA.",
      },
    ],
    exercises: [
      {
        id: "ipv4-e1",
        type: "number",
        conceptIds: ["ipv4-bits"],
        prompt: "¿Cuántos bits de host deja /26?",
        answer: 6,
        unit: "bits",
        hint: "Resta el prefijo a 32.",
        explanation: "32 − 26 = 6 bits de host.",
      },
      {
        id: "ipv4-e2",
        type: "choice",
        conceptIds: ["ipv4-salto"],
        prompt:
          "Para un destino remoto en otra subred Ethernet/IPv4, ¿qué MAC buscas normalmente?",
        options: [
          "La del servidor remoto por Internet",
          "La del DNS",
          "La del router local",
          "Ninguna: IP sustituye Ethernet",
        ],
        answer: 2,
        hint: "Piensa en el siguiente salto.",
        explanation:
          "ARP resuelve la MAC de la puerta de enlace local, no la del servidor remoto.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-ipv4-1", "fund-ipv4-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-02", "nuevo-05"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-0-0-74"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Explica la diferencia entre bits de red, bits de host y octetos. Luego decide si .71 y .133 con /26 son vecinos de subred.",
      },
      {
        type: "text",
        title: "Antes de responder",
        body: "Si el enunciado habla de clases, reconoce el modelo histórico; si da una máscara, calcula con esa máscara.",
      },
    ],
  },
  {
    id: "subnetting",
    revision: 1,
    title: "Subnetting",
    block: "IV",
    category: "Redes",
    summary:
      "Calcula bloques, hosts y división de redes con un método repetible.",
    estimatedMinutes: 25,
    prerequisiteIds: ["ipv4"],
    officialRefs: ["IV.7"],
    sourceIds: ["cidr", "point-to-point", "tai2024"],
    objectives: [
      "Calcular hosts convencionales",
      "Encontrar red y broadcast",
      "Dividir un prefijo en subredes iguales",
    ],
    introduction: [
      {
        type: "text",
        title: "No memorices solo una tabla",
        body: "Cada bit extra de red duplica el número de subredes y divide por dos el tamaño de cada bloque. Usa el prefijo para reconstruir el resultado.",
      },
    ],
    concepts: [
      {
        id: "subnet-capacidad",
        title: "Capacidad de una subred",
        simple:
          "El espacio de direcciones depende de los bits que quedan para host.",
        technical:
          "IPv4 tiene 2^(32−n) direcciones por /n. En subredes convencionales hasta /30 se reservan red y broadcast: hosts = total − 2. En enlaces punto a punto /31 puede usar las dos direcciones (RFC 3021); /32 representa una sola dirección.",
        example: "/27: 5 bits de host → 32 direcciones → 30 hosts habituales.",
        commonError: "Aplicar −2 indiscriminadamente a /31 y /32.",
        memory: "32 − prefijo; potencia de dos; resta dos si procede.",
        questionIds: ["fund-subnetting-1", "nuevo-03"],
        sourceIds: ["cidr", "point-to-point"],
        difficulty: "foundation",
      },
      {
        id: "subnet-dividir",
        title: "Dividir y situar un host",
        simple: "Para crear 16 subredes necesitas cuatro bits más de red.",
        technical:
          "2^4 = 16. De /16 a /20 quedan 12 bits de host: 4096 direcciones, 4094 hosts. Para /27 dentro de un /24, el bloque es de 32: 0–31, 32–63, 64–95…",
        example:
          "192.168.7.77/27 está en el bloque 64–95: red .64, broadcast .95.",
        commonError:
          "Confundir la cantidad de subredes creadas con la cantidad de hosts por subred.",
        memory: "Dividir una red en 2^k subredes: suma k al prefijo.",
        questionIds: ["fund-subnetting-2", "nuevo-04", "tai-2024-2-0-1"],
        sourceIds: ["cidr"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Reconstruye la tabla",
        headers: ["Prefijo", "Direcciones", "Hosts convencionales"],
        rows: [
          ["/24", "256", "254"],
          ["/25", "128", "126"],
          ["/26", "64", "62"],
          ["/27", "32", "30"],
          ["/28", "16", "14"],
          ["/29", "8", "6"],
          ["/30", "4", "2"],
        ],
      },
      {
        type: "steps",
        title: "Ejemplo oficial: /16 dividido en 16",
        items: [
          "16 = 2⁴: añade 4 bits de red.",
          "/16 + 4 = /20.",
          "32 − 20 = 12 bits de host.",
          "2¹² − 2 = 4094 hosts por subred.",
        ],
      },
    ],
    exercises: [
      {
        id: "subnet-e1",
        type: "number",
        conceptIds: ["subnet-capacidad"],
        prompt: "¿Hosts utilizables convencionales en /27?",
        answer: 30,
        unit: "hosts",
        hint: "Distingue el total de la capacidad útil.",
        explanation: "2⁵ − 2 = 30 hosts; 32 direcciones totales.",
      },
      {
        id: "subnet-e2",
        type: "number",
        conceptIds: ["subnet-dividir"],
        prompt:
          "Un /24 se divide en 16 subredes iguales. ¿Nuevo prefijo? Escribe solo el número.",
        answer: 28,
        unit: "prefijo",
        hint: "16 = 2⁴.",
        explanation:
          "24 + 4 = 28; cada subred tiene 16 direcciones y 14 hosts convencionales.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-subnetting-1", "fund-subnetting-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-03", "nuevo-04"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-2-0-1"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Sin tabla: calcula /26, /27 y /28; después ubica .77/27 y explica red y broadcast.",
      },
      {
        type: "text",
        title: "Varía el dato",
        body: "Para no memorizar un resultado, cambia el prefijo o el número de subredes y reconstruye todas las operaciones.",
      },
    ],
  },
  {
    id: "dns",
    revision: 1,
    title: "DNS",
    block: "IV",
    category: "Redes",
    summary:
      "Resuelve nombres, identifica registros y diagnostica sin confundir servicios.",
    estimatedMinutes: 25,
    prerequisiteIds: ["ipv4"],
    officialRefs: ["IV.7", "IV.8"],
    sourceIds: ["dns", "dns-records", "dns-aaaa", "tcpip", "tai2024"],
    objectives: [
      "Distinguir A, AAAA, CNAME, MX y PTR",
      "Separar resolución y conectividad",
      "Interpretar el papel de DNS en TCP/IP",
    ],
    introduction: [
      {
        type: "text",
        title: "El nombre y la dirección son datos distintos",
        body: "DNS es un sistema distribuido y jerárquico que publica información sobre nombres. El navegador lo usa para obtener direcciones, pero DNS no sirve la página web.",
      },
    ],
    concepts: [
      {
        id: "dns-registros",
        title: "Cada registro responde una pregunta",
        simple: "A guarda IPv4, AAAA guarda IPv6 y CNAME remite a otro nombre.",
        technical:
          "MX indica servidores de correo; PTR se usa en resolución inversa; TXT publica texto. Un CNAME no contiene una IP y su nombre no debe tener otros datos ordinarios coexistentes, con excepciones protocolarias como DNSSEC.",
        example:
          "www.aula.test CNAME portal.aula.test; portal.aula.test A 192.0.2.10.",
        commonError: "Confundir alias, servidor de correo y dirección.",
        memory: "A=IPv4; AAAA=IPv6; CNAME=otro nombre; PTR=la vuelta.",
        questionIds: ["fund-dns-1", "nuevo-06", "nuevo-07"],
        sourceIds: ["dns", "dns-records", "dns-aaaa"],
        difficulty: "foundation",
      },
      {
        id: "dns-diagnostico",
        title: "Diagnóstico y servicios de soporte",
        simple:
          "Que funcione por IP y falle por nombre invita a comprobar DNS antes de cambiarlo todo.",
        technical:
          "Compara resolución del nombre, acceso por IP y acceso por servicio. DNS puede utilizar UDP y TCP; no es siempre orientado a conexión. RFC 1122 distingue servicios de usuario y de soporte en aplicación: FTP presta transferencia al usuario; DNS da soporte de resolución.",
        example:
          "nslookup falla mientras una prueba por IP funciona: revisa servidor DNS, registros y caché. El acceso web por IP puede diferir por TLS o virtual hosting.",
        commonError:
          "Afirmar que toda diferencia entre una URL y una IP demuestra DNS, sin comprobar resolución.",
        memory: "IP funciona + resolución falla → empieza por DNS.",
        questionIds: ["fund-dns-2", "nuevo-48", "tai-2024-2-0-6"],
        sourceIds: ["tcpip", "dns"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Registros principales",
        headers: ["Registro", "Respuesta"],
        rows: [
          ["A", "Nombre → IPv4"],
          ["AAAA", "Nombre → IPv6"],
          ["CNAME", "Alias → nombre canónico"],
          ["MX", "Servidores de correo"],
          ["PTR", "IP → nombre en zona inversa"],
          ["TXT", "Texto"],
        ],
      },
      {
        type: "steps",
        title: "Caso: el portal falla por nombre",
        items: [
          "Consulta el nombre con nslookup o un resolvedor equivalente.",
          "Si la consulta falla, revisa el servidor DNS y los registros.",
          "Si resuelve bien, comprueba TLS, HTTP y el servicio; no atribuyas todo a DNS.",
        ],
      },
    ],
    exercises: [
      {
        id: "dns-e1",
        type: "choice",
        conceptIds: ["dns-registros"],
        prompt:
          "¿Qué registro permite seguir a portal.aula.test sin duplicar su IP?",
        options: ["A", "MX", "CNAME", "PTR"],
        answer: 2,
        hint: "El dato apunta a otro nombre.",
        explanation: "CNAME crea un alias al nombre canónico.",
      },
      {
        id: "dns-e2",
        type: "choice",
        conceptIds: ["dns-diagnostico"],
        prompt: "Por IP se accede, pero nslookup falla. ¿Primera comprobación?",
        options: [
          "Reinstalar la aplicación",
          "Revisar resolución y servidor DNS",
          "Cambiar la memoria RAM",
          "Borrar todas las rutas",
        ],
        answer: 1,
        hint: "La prueba aisló la resolución.",
        explanation:
          "La evidencia apunta primero a DNS; otras causas se investigan si la resolución es correcta.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-dns-1", "fund-dns-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-06", "nuevo-48"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-2-0-6"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Escribe A, AAAA, CNAME, MX y PTR con su función sin consultar la tabla.",
      },
      {
        type: "text",
        title: "Caso de transferencia",
        body: "Si el nombre resuelve bien pero el certificado no coincide, cambia el foco a TLS y al nombre solicitado; no culpes automáticamente a DNS.",
      },
    ],
  },
  {
    id: "sql",
    revision: 1,
    title: "SQL",
    block: "III",
    category: "Bases de datos",
    summary: "Lee y modifica datos entendiendo qué cambia y qué permanece.",
    estimatedMinutes: 25,
    prerequisiteIds: [],
    officialRefs: ["II.5", "III.1", "III.3"],
    sourceIds: ["sql", "tai2024"],
    objectives: [
      "Consultar con SELECT y WHERE",
      "Distinguir filas y objetos",
      "Tratar NULL sin igualarlo a cero",
    ],
    introduction: [
      {
        type: "text",
        title: "Tablas antes de comandos",
        body: "Una tabla contiene filas y columnas. SQL expresa qué datos quieres obtener o modificar; el motor decide el plan de ejecución. Primero distingue el contenido de la tabla de su definición.",
      },
    ],
    concepts: [
      {
        id: "sql-consulta",
        title: "SELECT, WHERE y NULL",
        simple:
          "SELECT elige datos y WHERE filtra filas. NULL expresa un valor ausente o desconocido.",
        technical:
          "Para comprobar NULL se usa IS NULL, no = NULL. Las comparaciones ordinarias con NULL no producen verdadero, sino desconocido; WHERE conserva solo las filas donde la condición es verdadera. SELECT se agrupa con DML en la plantilla TAI 2024; otros materiales lo separan como DQL.",
        example: "SELECT nombre FROM personas WHERE telefono IS NULL;",
        commonError:
          "Usar telefono = NULL o suponer que NULL es siempre cero o cadena vacía.",
        memory: "NULL se pregunta con IS, no con =.",
        questionIds: ["fund-sql-1", "nuevo-29", "tai-2024-0-0-37"],
        sourceIds: ["sql"],
        difficulty: "foundation",
      },
      {
        id: "sql-cambios",
        title: "DELETE y DROP",
        simple: "DELETE borra filas; DROP elimina el objeto y su definición.",
        technical:
          "DELETE FROM auditoria sin WHERE afecta a todas las filas, pero conserva la tabla. DROP TABLE auditoria elimina la tabla y sus datos. TRUNCATE vacía filas con reglas que dependen del SGBD; no es un filtro por WHERE. DDL/DML y restricciones de triggers pueden variar por motor.",
        example:
          "Tras DELETE puedes insertar de nuevo en la misma tabla; tras DROP necesitarías crearla otra vez.",
        commonError: "Confundir vaciar contenido con borrar la estructura.",
        memory: "DELETE = datos; DROP = definición.",
        questionIds: ["fund-sql-2", "nuevo-26", "tai-2024-0-0-38"],
        sourceIds: ["sql"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Tabla personas de ejemplo",
        headers: ["id", "nombre", "telefono"],
        rows: [
          ["1", "Ana", "NULL"],
          ["2", "Luis", "600000001"],
          ["3", "Eva", "NULL"],
        ],
      },
      {
        type: "code",
        title: "Consulta ilustrativa · no ejecuta SQL",
        body: "SELECT nombre\nFROM personas\nWHERE telefono IS NULL;\n\n-- Resultado: Ana y Eva",
      },
      {
        type: "callout",
        title: "Alcance del ejemplo",
        body: "Sintaxis de consulta compatible con PostgreSQL 18; revisa las diferencias por motor antes de generalizar DDL, TRUNCATE o transacciones.",
      },
    ],
    exercises: [
      {
        id: "sql-e1",
        type: "number",
        conceptIds: ["sql-consulta"],
        prompt:
          "En la tabla del ejemplo, ¿cuántas filas devuelve telefono IS NULL?",
        answer: 2,
        unit: "filas",
        hint: "Cuenta los valores ausentes, no los ceros.",
        explanation: "Ana y Eva: dos filas.",
      },
      {
        id: "sql-e2",
        type: "choice",
        conceptIds: ["sql-cambios"],
        prompt:
          "Quieres borrar filas y conservar la tabla auditoria. ¿Qué sentencia encaja?",
        options: [
          "DROP TABLE auditoria;",
          "DELETE FROM auditoria;",
          "DROP DATABASE auditoria;",
          "SELECT * FROM auditoria;",
        ],
        answer: 1,
        hint: "Contenido y definición son cosas distintas.",
        explanation:
          "DELETE borra las filas y conserva la definición; sin WHERE afecta a todas las filas.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-sql-1", "fund-sql-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-26", "nuevo-29"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-0-0-37", "tai-2024-0-0-38"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Explica qué queda después de DELETE y después de DROP. Escribe una consulta que encuentre NULL.",
      },
      {
        type: "text",
        title: "Próxima ampliación",
        body: "JOIN, claves, normalización y transacciones quedan para recorridos siguientes. Estas preguntas oficiales comprueban solo la parte publicada.",
      },
    ],
  },
  {
    id: "operating-systems",
    revision: 1,
    title: "Sistemas operativos",
    block: "II",
    category: "Sistemas",
    summary:
      "Separa programa, proceso, hilo y kernel para razonar sobre concurrencia.",
    estimatedMinutes: 25,
    prerequisiteIds: [],
    officialRefs: ["II.4", "IV.1"],
    sourceIds: ["threads", "signals", "tai2024"],
    objectives: [
      "Distinguir proceso e hilo",
      "Separar concurrencia y paralelismo",
      "Explicar la función del kernel",
    ],
    introduction: [
      {
        type: "text",
        title: "El sistema operativo administra recursos",
        body: "Coordina CPU, memoria, entrada/salida y acceso a recursos. Un programa almacenado no es todavía un proceso en ejecución. Un hilo es una unidad de ejecución dentro de un proceso.",
      },
    ],
    concepts: [
      {
        id: "os-ejecucion",
        title: "Procesos e hilos",
        simple: "Un proceso contiene recursos; sus hilos realizan trabajo.",
        technical:
          "Los hilos de un mismo proceso comparten su espacio de direcciones y recursos, pero mantienen contexto de ejecución y pila propios. Concurrencia significa progresar entre tareas; paralelismo significa ejecutar a la vez y depende de recursos y planificación.",
        example:
          "Un editor puede tener un hilo de interfaz y otro de trabajo; un único núcleo puede alternarlos.",
        commonError:
          "Pensar que crear hilos garantiza ejecución paralela o memoria privada por cada hilo.",
        memory: "Proceso = recursos; hilo = ejecución.",
        questionIds: ["fund-operating-systems-1", "tai-2024-0-0-55"],
        sourceIds: ["threads"],
        difficulty: "foundation",
      },
      {
        id: "os-kernel",
        title: "Kernel, aislamiento y señales",
        simple:
          "El kernel arbitra el acceso al hardware y las operaciones privilegiadas.",
        technical:
          "Los contenedores Linux ordinarios comparten kernel con el host; una VM ejecuta su kernel invitado. En Linux SIGKILL no se puede capturar, bloquear ni ignorar, pero un proceso en espera ininterrumpible puede no desaparecer inmediatamente.",
        example:
          "Una herramienta intenta SIGTERM para cierre ordenado y recurre a SIGKILL si procede; no asegura limpieza propia de la aplicación.",
        commonError:
          "Confundir kernel compartido con ausencia de aislamiento o SIGKILL con finalización limpia.",
        memory: "SIGTERM solicita; SIGKILL fuerza sin manejador del proceso.",
        questionIds: ["fund-operating-systems-2", "nuevo-17", "nuevo-44"],
        sourceIds: ["signals", "threads"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Responsabilidades",
        headers: ["Elemento", "Qué conserva"],
        rows: [
          ["Programa", "Código almacenado"],
          ["Proceso", "Espacio de direcciones y recursos"],
          ["Hilo", "Pila y contexto de ejecución"],
          ["Kernel", "Gestión privilegiada de recursos"],
        ],
      },
      {
        type: "steps",
        title: "Ejemplo: dos tareas en un núcleo",
        items: [
          "La aplicación crea dos hilos.",
          "El planificador alterna qué hilo ejecuta.",
          "Hay concurrencia aunque no exista ejecución simultánea en ese núcleo.",
        ],
      },
    ],
    exercises: [
      {
        id: "os-e1",
        type: "choice",
        conceptIds: ["os-ejecucion"],
        prompt:
          "Dos hilos se alternan en un único núcleo. ¿Qué puedes afirmar?",
        options: [
          "No hay concurrencia",
          "Hay paralelismo obligatorio",
          "Hay concurrencia, no paralelismo simultáneo en ese núcleo",
          "Cada hilo necesita otra máquina virtual",
        ],
        answer: 2,
        hint: "Progresar juntos no implica ejecutar al mismo tiempo.",
        explanation:
          "El núcleo alterna tareas: concurrencia sin simultaneidad en ese núcleo.",
      },
      {
        id: "os-e2",
        type: "choice",
        conceptIds: ["os-kernel"],
        prompt: "¿Qué afirmación sobre SIGKILL es correcta?",
        options: [
          "El proceso puede capturarlo y posponerlo",
          "No puede capturarse por el proceso",
          "Siempre guarda cambios antes de salir",
          "Solo existe en Windows",
        ],
        answer: 1,
        hint: "Distingue fuerza de cierre ordenado.",
        explanation:
          "SIGKILL no se captura; no ofrece la limpieza que podría hacer un manejador de SIGTERM.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-operating-systems-1", "fund-operating-systems-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-17", "nuevo-44"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-0-0-55"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Compara programa, proceso e hilo. Dibuja dos hilos que comparten memoria, pero no pila.",
      },
      {
        type: "text",
        title: "Límite de la demostración",
        body: "Planificación detallada, memoria virtual, ficheros y administración Windows/Linux necesitan recorridos adicionales; siguen disponibles las fichas técnicas existentes.",
      },
    ],
  },
  {
    id: "security",
    revision: 1,
    title: "Seguridad informática",
    block: "IV",
    category: "Seguridad",
    summary: "Relaciona amenazas, propiedades afectadas y controles concretos.",
    estimatedMinutes: 25,
    prerequisiteIds: ["operating-systems", "tcpip"],
    officialRefs: ["III.8", "IV.5", "IV.9"],
    sourceIds: ["security", "injection", "xss", "tai2024"],
    objectives: [
      "Distinguir confidencialidad, integridad y disponibilidad",
      "Separar SQL Injection, XSS y DDoS",
      "Aplicar mínimo privilegio",
    ],
    introduction: [
      {
        type: "text",
        title: "Empieza por qué quieres proteger",
        body: "No todos los incidentes hacen lo mismo. Identifica el activo, qué ha ocurrido y qué propiedad ha resultado dañada antes de elegir una medida.",
      },
    ],
    concepts: [
      {
        id: "sec-propiedades",
        title: "Confidencialidad, integridad y disponibilidad",
        simple:
          "Confidencialidad limita quién accede; integridad protege frente a cambios indebidos; disponibilidad permite usar el servicio.",
        technical:
          "Un incidente puede afectar a varias propiedades. Corrupción de datos y servicio inaccesible afectan a integridad y disponibilidad. Un resumen hash comparado con una referencia confiable ayuda a detectar cambios; por sí solo no cifra, autentica al autor ni elimina malware.",
        example:
          "Una base corrupta que no abre pierde integridad y disponibilidad aunque exista un registro de quién causó el incidente.",
        commonError:
          "Confundir corrupción con filtración o pensar que toda caída destruye la trazabilidad.",
        memory: "C = quién ve; I = qué cambia; D = se puede usar.",
        questionIds: ["fund-security-1", "tai-2024-2-0-8", "nuevo-19"],
        sourceIds: ["security"],
        difficulty: "foundation",
      },
      {
        id: "sec-controles",
        title: "Ataques distintos, controles distintos",
        simple:
          "SQL Injection altera consultas; XSS ejecuta script en el navegador; DDoS satura desde múltiples fuentes.",
        technical:
          "Usa consultas parametrizadas para separar datos y código SQL; codifica la salida según contexto para reducir XSS; limita privilegios al mínimo necesario. Mitigar DDoS requiere medidas de capacidad y filtrado adecuadas: no lo resuelve parametrizar SQL.",
        example:
          "Una cuenta de informes con solo SELECT reduce el alcance de un fallo de la aplicación.",
        commonError:
          "Llamar SQL Injection a todo script malicioso o conceder permisos de administrador por comodidad.",
        memory: "SQLi → consulta; XSS → navegador; DDoS → disponibilidad.",
        questionIds: ["fund-security-2", "nuevo-18", "nuevo-22"],
        sourceIds: ["injection", "xss", "security"],
        difficulty: "practice",
      },
    ],
    example: [
      {
        type: "table",
        title: "Del síntoma a la prioridad",
        headers: [
          "Síntoma",
          "Propiedad o riesgo",
          "Primer control relacionado",
        ],
        rows: [
          ["Datos leídos sin permiso", "Confidencialidad", "Control de acceso"],
          [
            "Filas alteradas indebidamente",
            "Integridad",
            "Permisos y validación",
          ],
          [
            "Servicio saturado",
            "Disponibilidad",
            "Mitigación de tráfico y capacidad",
          ],
          ["Entrada concatenada a SQL", "SQL Injection", "Parametrización"],
          ["Script en salida HTML", "XSS", "Codificación según contexto"],
        ],
      },
      {
        type: "callout",
        title: "No es una lección normativa",
        body: "Este tema enseña fundamentos técnicos. ENS, protección de datos y obligaciones jurídicas tienen un área separada pendiente; no se infieren requisitos legales de estos ejemplos.",
      },
    ],
    exercises: [
      {
        id: "sec-e1",
        type: "choice",
        conceptIds: ["sec-propiedades"],
        prompt:
          "Se corrompen datos y el servicio deja de estar accesible. ¿Qué está afectado directamente?",
        options: [
          "Solo confidencialidad",
          "Solo trazabilidad",
          "Integridad y disponibilidad",
          "Solo autenticidad",
        ],
        answer: 2,
        hint: "Lee ambos hechos por separado.",
        explanation:
          "La corrupción afecta a integridad; no poder acceder afecta a disponibilidad.",
      },
      {
        id: "sec-e2",
        type: "choice",
        conceptIds: ["sec-controles"],
        prompt:
          "Una cuenta solo genera informes con SELECT. ¿Permiso razonable?",
        options: [
          "Administrador completo",
          "Lectura sobre los datos necesarios",
          "DROP sobre toda la base",
          "Escritura global por si acaso",
        ],
        answer: 1,
        hint: "Ajusta el permiso a la tarea.",
        explanation:
          "El mínimo privilegio concede solo la lectura necesaria; otros permisos amplían el impacto de fallos.",
      },
    ],
    assessments: [
      {
        id: "foundation",
        title: "Fundamentos",
        questionIds: ["fund-security-1", "fund-security-2"],
        passPercent: 80,
      },
      {
        id: "practice",
        title: "Aplicación técnica",
        questionIds: ["nuevo-18", "nuevo-22"],
        passPercent: 80,
      },
      {
        id: "exam",
        title: "Pregunta oficial histórica",
        questionIds: ["tai-2024-2-0-8"],
        passPercent: 80,
      },
    ],
    review: [
      {
        type: "callout",
        title: "Recuperación activa",
        body: "Inventa un incidente para C, otro para I y otro para D. Explica un control para SQLi y otro para XSS.",
      },
      {
        type: "text",
        title: "No memorices etiquetas aisladas",
        body: "Si varias propiedades están dañadas, enumera todas las respaldadas por los hechos. No añadas una filtración que el enunciado no describe.",
      },
    ],
  },
];
