/** @type {import("../core/types.js").Question[]} */
export const zaragozaQuestions = [
  {
    "id": "zaragoza-2026-1731-1-12",
    "track": "zaragoza-c1",
    "number": 12,
    "reserve": false,
    "page": 4,
    "section": 0,
    "block": "III",
    "category": "Bases de datos",
    "topic": "SQL",
    "concept": "Vistas materializadas",
    "subtopic": "Vistas materializadas",
    "difficulty": "examen",
    "prompt": "¿Cuál es la principal diferencia entre una vista y una vista materializada en Oracle?",
    "options": [
      "La vista materializada permite joins y la vista no.",
      "La vista materializada almacena físicamente los datos resultantes",
      "La vista materializada no puede actualizarse."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una vista normal conserva una consulta; una materializada conserva también su resultado físico. El resultado materializado necesita refrescarse para reflejar cambios de las tablas origen; los mecanismos dependen de Oracle.",
    "rationales": [
      "Ambos tipos pueden incluir joins.",
      "Describe el almacenamiento físico del resultado.",
      "Puede refrescarse; no significa que nunca se actualice."
    ],
    "trick": "Materializada = material guardado.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-4.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Vistas materializadas."
    ],
    "teaching": {
      "simple": "Una vista normal conserva una consulta; una materializada conserva también su resultado físico.",
      "technical": "El resultado materializado necesita refrescarse para reflejar cambios de las tablas origen; los mecanismos dependen de Oracle.",
      "example": "Un informe nocturno guarda el total de ventas para consultarlo rápidamente.",
      "commonError": "Ambos tipos pueden incluir joins. Puede refrescarse; no significa que nunca se actualice.",
      "schema": [
        "Vistas materializadas",
        "Una vista normal conserva una consulta; una materializada conserva también su resultado físico.",
        "Materializada = material guardado."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-13",
    "track": "zaragoza-c1",
    "number": 13,
    "reserve": false,
    "page": 4,
    "section": 0,
    "block": "III",
    "category": "Bases de datos",
    "topic": "SQL",
    "concept": "Excepciones PL/SQL",
    "subtopic": "Excepciones PL/SQL",
    "difficulty": "examen",
    "prompt": "¿Qué ocurre si se produce una excepción NO manejada en PL/SQL?",
    "options": [
      "Oracle la ignora.",
      "Se hace commit automático.",
      "Se propaga al entorno que invocó el bloque"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Si un bloque no trata una excepción, esta sale hacia el código que lo llamó. La excepción se propaga a un bloque exterior o al entorno invocador; no implica por sí misma un COMMIT.",
    "rationales": [
      "El error no desaparece porque falte un manejador.",
      "No existe COMMIT automático por esta causa.",
      "El llamador recibe la excepción no tratada."
    ],
    "trick": "Sin manejador, el error sube.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-4.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Excepciones PL/SQL."
    ],
    "teaching": {
      "simple": "Si un bloque no trata una excepción, esta sale hacia el código que lo llamó.",
      "technical": "La excepción se propaga a un bloque exterior o al entorno invocador; no implica por sí misma un COMMIT.",
      "example": "Un procedimiento falla y el bloque que lo invocó debe capturar el error.",
      "commonError": "El error no desaparece porque falte un manejador. No existe COMMIT automático por esta causa.",
      "schema": [
        "Excepciones PL/SQL",
        "Si un bloque no trata una excepción, esta sale hacia el código que lo llamó.",
        "Sin manejador, el error sube."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-14",
    "track": "zaragoza-c1",
    "number": 14,
    "reserve": false,
    "page": 4,
    "section": 0,
    "block": "III",
    "category": "Bases de datos",
    "topic": "SQL",
    "concept": "Álgebra relacional",
    "subtopic": "Álgebra relacional",
    "difficulty": "examen",
    "prompt": "El operador del álgebra relacional que elimina atributos o columnas es:",
    "options": [
      "Selección.",
      "Proyección",
      "Diferencia."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "La proyección elige columnas; la selección elige filas. En álgebra relacional, π proyecta atributos y σ selecciona tuplas según una condición.",
    "rationales": [
      "Selecciona filas por una condición.",
      "Reduce los atributos de la relación.",
      "Obtiene tuplas de una relación que no están en otra."
    ],
    "trick": "Proyección = columnas; selección = filas.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-4.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Álgebra relacional."
    ],
    "teaching": {
      "simple": "La proyección elige columnas; la selección elige filas.",
      "technical": "En álgebra relacional, π proyecta atributos y σ selecciona tuplas según una condición.",
      "example": "SELECT nombre FROM empleados proyecta el atributo nombre; WHERE filtra filas.",
      "commonError": "Selecciona filas por una condición. Obtiene tuplas de una relación que no están en otra.",
      "schema": [
        "Álgebra relacional",
        "La proyección elige columnas; la selección elige filas.",
        "Proyección = columnas; selección = filas."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-18",
    "track": "zaragoza-c1",
    "number": 18,
    "reserve": false,
    "page": 4,
    "section": 0,
    "block": "IV",
    "category": "Seguridad",
    "topic": "Seguridad informática",
    "concept": "Ransomware",
    "subtopic": "Ransomware",
    "difficulty": "examen",
    "prompt": "¿Qué principio de seguridad se vulnera principalmente por un ransomware?",
    "options": [
      "Integridad y disponibilidad.",
      "Autenticidad.",
      "No repudio."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Un ransomware puede dejar tus archivos alterados y sin poder usarlos. El cifrado o modificación no autorizados afectan a la integridad; impedir el acceso afecta a la disponibilidad. Puede haber también robo de datos, pero no está descrito aquí.",
    "rationales": [
      "Identifica las propiedades principalmente afectadas en este caso.",
      "La autenticidad no es la pérdida principal descrita.",
      "No repudio trata de evitar negar una acción, no de recuperar el acceso."
    ],
    "trick": "Archivos cambiados = I; inaccesibles = D.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-4.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Ransomware."
    ],
    "teaching": {
      "simple": "Un ransomware puede dejar tus archivos alterados y sin poder usarlos.",
      "technical": "El cifrado o modificación no autorizados afectan a la integridad; impedir el acceso afecta a la disponibilidad. Puede haber también robo de datos, pero no está descrito aquí.",
      "example": "Una carpeta cifrada por un atacante existe, pero ya no puedes leerla.",
      "commonError": "La autenticidad no es la pérdida principal descrita. No repudio trata de evitar negar una acción, no de recuperar el acceso.",
      "schema": [
        "Ransomware",
        "Un ransomware puede dejar tus archivos alterados y sin poder usarlos.",
        "Archivos cambiados = I; inaccesibles = D."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-21",
    "track": "zaragoza-c1",
    "number": 21,
    "reserve": false,
    "page": 5,
    "section": 0,
    "block": "IV",
    "category": "Sistemas",
    "topic": "Almacenamiento",
    "concept": "SAN y NAS",
    "subtopic": "SAN y NAS",
    "difficulty": "examen",
    "prompt": "En una red de almacenamiento Storage Area Network (SAN), ¿cómo se presenta habitualmente el almacenamiento a los servidores?",
    "options": [
      "Como una estructura de directorios y ficheros compartidos mediante el protocolo SMB/CIFS.",
      "Como un repositorio de objetos accesible exclusivamente mediante APIs de servicios web.",
      "Como unidades de disco lógicas (LUN) que el sistema operativo gestiona a nivel de bloque."
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una SAN ofrece discos lógicos al servidor, no carpetas compartidas. Una LUN identifica una unidad lógica de almacenamiento presentada a nivel de bloque. El sistema operativo puede crear en ella su sistema de archivos.",
    "rationales": [
      "Describe acceso a archivos típico de NAS.",
      "Describe almacenamiento de objetos.",
      "Describe almacenamiento en bloques mediante LUN."
    ],
    "trick": "SAN = bloques; NAS = archivos.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-5.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: SAN y NAS."
    ],
    "teaching": {
      "simple": "Una SAN ofrece discos lógicos al servidor, no carpetas compartidas.",
      "technical": "Una LUN identifica una unidad lógica de almacenamiento presentada a nivel de bloque. El sistema operativo puede crear en ella su sistema de archivos.",
      "example": "El servidor ve una LUN como un disco sobre el que puede crear un volumen.",
      "commonError": "Describe acceso a archivos típico de NAS. Describe almacenamiento de objetos.",
      "schema": [
        "SAN y NAS",
        "Una SAN ofrece discos lógicos al servidor, no carpetas compartidas.",
        "SAN = bloques; NAS = archivos."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-22",
    "track": "zaragoza-c1",
    "number": 22,
    "reserve": false,
    "page": 5,
    "section": 0,
    "block": "IV",
    "category": "Virtualización",
    "topic": "Virtualización y cloud",
    "concept": "Hipervisores",
    "subtopic": "Hipervisores",
    "difficulty": "examen",
    "prompt": "En los entornos de virtualización de centros de datos, ¿qué papel desempeña el hipervisor?",
    "options": [
      "Ejecutar las aplicaciones del usuario final directamente sobre elfirmware de la BIOS.",
      "Intermediar entre el hardware físico y las máquinas virtuales para gestionar el reparto de recursos.",
      "Realizar el balanceo de carga de tráfico HTTP entre servidores web físicos."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "El hipervisor reparte los recursos del equipo entre las máquinas virtuales. Gestiona CPU, memoria y dispositivos virtuales, coordinando el acceso al hardware de las máquinas invitadas.",
    "rationales": [
      "Las aplicaciones se ejecutan en sus entornos invitados.",
      "Define la gestión de recursos de las máquinas virtuales.",
      "Un balanceador HTTP cumple otra función."
    ],
    "trick": "Hipervisor = gestor de las VM.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-5.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Hipervisores."
    ],
    "teaching": {
      "simple": "El hipervisor reparte los recursos del equipo entre las máquinas virtuales.",
      "technical": "Gestiona CPU, memoria y dispositivos virtuales, coordinando el acceso al hardware de las máquinas invitadas.",
      "example": "Dos VM reciben memoria y CPU del mismo host sin ser dos equipos físicos.",
      "commonError": "Las aplicaciones se ejecutan en sus entornos invitados. Un balanceador HTTP cumple otra función.",
      "schema": [
        "Hipervisores",
        "El hipervisor reparte los recursos del equipo entre las máquinas virtuales.",
        "Hipervisor = gestor de las VM."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-23",
    "track": "zaragoza-c1",
    "number": 23,
    "reserve": false,
    "page": 5,
    "section": 0,
    "block": "IV",
    "category": "Virtualización",
    "topic": "Virtualización y cloud",
    "concept": "IaaS",
    "subtopic": "IaaS",
    "difficulty": "examen",
    "prompt": "En el modelo de servicios en la nube conocido como Infraestructura como Servicio (IaaS), ¿qué responsabilidad asume el proveedor?",
    "options": [
      "La gestión total de los datos y la configuración de las aplicaciones finales del cliente.",
      "El suministro de recursos de computación, almacenamiento y red de forma virtualizada",
      "El mantenimiento de las licencias del software de gestión empresarial (ERP) utilizado por el cliente."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "IaaS te proporciona infraestructura; tú administras lo que ejecutas sobre ella. El proveedor suministra computación, almacenamiento y red. La responsabilidad compartida deja al cliente tareas como configurar su sistema y aplicaciones.",
    "rationales": [
      "El proveedor no administra todos los datos y aplicaciones del cliente.",
      "Enumera los recursos de infraestructura suministrados.",
      "Las licencias ERP del cliente no definen IaaS."
    ],
    "trick": "IaaS = infraestructura alquilada.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-5.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: IaaS."
    ],
    "teaching": {
      "simple": "IaaS te proporciona infraestructura; tú administras lo que ejecutas sobre ella.",
      "technical": "El proveedor suministra computación, almacenamiento y red. La responsabilidad compartida deja al cliente tareas como configurar su sistema y aplicaciones.",
      "example": "Creas una VM cloud y debes configurar su sistema operativo y tu aplicación.",
      "commonError": "El proveedor no administra todos los datos y aplicaciones del cliente. Las licencias ERP del cliente no definen IaaS.",
      "schema": [
        "IaaS",
        "IaaS te proporciona infraestructura; tú administras lo que ejecutas sobre ella.",
        "IaaS = infraestructura alquilada."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-24",
    "track": "zaragoza-c1",
    "number": 24,
    "reserve": false,
    "page": 5,
    "section": 0,
    "block": "III",
    "category": "Web",
    "topic": "HTTP y HTTPS",
    "concept": "HTTPS",
    "subtopic": "HTTPS",
    "difficulty": "examen",
    "prompt": "¿Cuál es la principal mejora que aporta el protocolo HTTPS respecto al protocolo HTTP estándar?",
    "options": [
      "La optimización del tamaño de las imágenes transmitidas mediante algoritmos de compresión en el lado del cliente.",
      "La seguridad en la transmisión de datos mediante el uso de protocolos de cifrado TLS/SSL.",
      "La capacidad de mantener sesiones persistentes sin necesidad de utilizar cookies de navegador."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "HTTPS protege la comunicación HTTP mediante TLS. TLS aporta confidencialidad, integridad y autenticación del servidor mediante certificados. SSL es la denominación histórica del enunciado; no debe utilizarse como recomendación actual.",
    "rationales": [
      "La compresión de imágenes no define HTTPS.",
      "Identifica la protección criptográfica del transporte.",
      "HTTP también puede mantener conexiones; cookies no definen TLS."
    ],
    "trick": "HTTPS = HTTP dentro de TLS.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-5.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: HTTPS."
    ],
    "teaching": {
      "simple": "HTTPS protege la comunicación HTTP mediante TLS.",
      "technical": "TLS aporta confidencialidad, integridad y autenticación del servidor mediante certificados. SSL es la denominación histórica del enunciado; no debe utilizarse como recomendación actual.",
      "example": "En una red WiFi, TLS protege los datos en tránsito de tu sesión HTTPS.",
      "commonError": "La compresión de imágenes no define HTTPS. HTTP también puede mantener conexiones; cookies no definen TLS.",
      "schema": [
        "HTTPS",
        "HTTPS protege la comunicación HTTP mediante TLS.",
        "HTTPS = HTTP dentro de TLS."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-25",
    "track": "zaragoza-c1",
    "number": 25,
    "reserve": false,
    "page": 6,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Desarrollo web",
    "concept": "Java EE",
    "subtopic": "Java EE",
    "difficulty": "examen",
    "prompt": "Dentro del ecosistema Java EE, ¿cuál es el propósito de un servidor de aplicaciones?",
    "options": [
      "Proveer un contenedor y servicios de infraestructura para ejecutar lógica de negocio distribuida y componentes empresariales.",
      "Gestionar exclusivamente el envío de correos electrónicos a través del protocolo SMTP.",
      "Actuar como un servidor de archivos para el despliegue de contenido multimedia estático."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Un servidor de aplicaciones proporciona el entorno donde viven componentes empresariales. Un contenedor aporta servicios como transacciones, seguridad y gestión de componentes. Se mantiene Java EE como denominación histórica del examen.",
    "rationales": [
      "Describe el contenedor y sus servicios.",
      "SMTP corresponde al correo.",
      "Un servidor de archivos estáticos no define este entorno."
    ],
    "trick": "Servidor de aplicaciones = contenedor + servicios.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-6.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Java EE."
    ],
    "teaching": {
      "simple": "Un servidor de aplicaciones proporciona el entorno donde viven componentes empresariales.",
      "technical": "Un contenedor aporta servicios como transacciones, seguridad y gestión de componentes. Se mantiene Java EE como denominación histórica del examen.",
      "example": "Un componente de negocio usa transacciones gestionadas por el contenedor.",
      "commonError": "SMTP corresponde al correo. Un servidor de archivos estáticos no define este entorno.",
      "schema": [
        "Java EE",
        "Un servidor de aplicaciones proporciona el entorno donde viven componentes empresariales.",
        "Servidor de aplicaciones = contenedor + servicios."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-26",
    "track": "zaragoza-c1",
    "number": 26,
    "reserve": false,
    "page": 6,
    "section": 0,
    "block": "III",
    "category": "Bases de datos",
    "topic": "SQL",
    "concept": "JDBC",
    "subtopic": "JDBC",
    "difficulty": "examen",
    "prompt": "¿Qué tecnología se emplea de forma estándar en Java EE para establecer la comunicación con bases de datos relacionales?",
    "options": [
      "El uso de scripts de automatización de shell en el servidor de base de datos.",
      "El uso de controladores JDBC y la configuración de pools de conexiones (DataSources)",
      "El intercambio de ficheros CSV a través de conexiones seguras FTP."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "JDBC permite que Java converse con una base de datos relacional. Un driver JDBC implementa la comunicación con el SGBD; un DataSource puede proporcionar conexiones administradas y agrupadas en un pool.",
    "rationales": [
      "Un script shell no es la interfaz JDBC.",
      "Drivers y DataSources son los mecanismos citados.",
      "CSV por FTP es intercambio de archivos, no acceso JDBC."
    ],
    "trick": "JDBC conecta; el pool reutiliza.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-6.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: JDBC."
    ],
    "teaching": {
      "simple": "JDBC permite que Java converse con una base de datos relacional.",
      "technical": "Un driver JDBC implementa la comunicación con el SGBD; un DataSource puede proporcionar conexiones administradas y agrupadas en un pool.",
      "example": "Una aplicación toma una conexión del pool, consulta datos y la devuelve.",
      "commonError": "Un script shell no es la interfaz JDBC. CSV por FTP es intercambio de archivos, no acceso JDBC.",
      "schema": [
        "JDBC",
        "JDBC permite que Java converse con una base de datos relacional.",
        "JDBC conecta; el pool reutiliza."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-27",
    "track": "zaragoza-c1",
    "number": 27,
    "reserve": false,
    "page": 6,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Ingeniería del software",
    "concept": "Modelo en cascada",
    "subtopic": "Modelo en cascada",
    "difficulty": "examen",
    "prompt": "El modelo de desarrollo en cascada se caracteriza principalmente por ser:",
    "options": [
      "Un proceso altamente flexible donde se pueden cambiar los requisitos en cualquier momento del desarrollo.",
      "Una metodología ágil basada en la entrega diaria de prototipos funcionales al usuario.",
      "Una metodología lineal y secuencial donde cada fase debe completarse íntegramente para iniciar la siguiente."
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "En cascada las fases se recorren en secuencia. El modelo clásico avanza de requisitos a diseño, implementación y pruebas; el enunciado usa la versión estrictamente secuencial.",
    "rationales": [
      "La flexibilidad constante no caracteriza la cascada clásica.",
      "Describe un enfoque iterativo o ágil.",
      "Describe la secuencia de fases indicada."
    ],
    "trick": "Cascada: un escalón tras otro.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-6.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Modelo en cascada."
    ],
    "teaching": {
      "simple": "En cascada las fases se recorren en secuencia.",
      "technical": "El modelo clásico avanza de requisitos a diseño, implementación y pruebas; el enunciado usa la versión estrictamente secuencial.",
      "example": "Se aprueba el diseño antes de comenzar la implementación de ese modelo.",
      "commonError": "La flexibilidad constante no caracteriza la cascada clásica. Describe un enfoque iterativo o ágil.",
      "schema": [
        "Modelo en cascada",
        "En cascada las fases se recorren en secuencia.",
        "Cascada: un escalón tras otro."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-28",
    "track": "zaragoza-c1",
    "number": 28,
    "reserve": false,
    "page": 6,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Desarrollo web",
    "concept": "Arquitecturas por capas",
    "subtopic": "Arquitecturas por capas",
    "difficulty": "examen",
    "prompt": "¿Cómo se comunican los distintos niveles en una arquitectura moderna de desarrollo de aplicaciones?",
    "options": [
      "Mediante el acceso compartido a variables globales residentes en la memoria física común de los servidores.",
      "Mediante el uso de protocolos estandarizados e interfaces de programación de aplicaciones (API) bien definidas.",
      "Mediante el envío de paquetes de control a través de los servicios de comunicaciones."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Las capas se comunican mediante contratos definidos. Una API especifica operaciones y datos; los protocolos permiten intercambiarlos entre componentes, incluso en máquinas distintas.",
    "rationales": [
      "Los servidores no comparten necesariamente una misma memoria física.",
      "APIs y protocolos expresan el contrato de comunicación.",
      "Paquetes de control no definen la interfaz de negocio."
    ],
    "trick": "Capas separadas, contratos claros.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-6.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Arquitecturas por capas."
    ],
    "teaching": {
      "simple": "Las capas se comunican mediante contratos definidos.",
      "technical": "Una API especifica operaciones y datos; los protocolos permiten intercambiarlos entre componentes, incluso en máquinas distintas.",
      "example": "El frontend llama a una API HTTPS que solicita información a otra capa.",
      "commonError": "Los servidores no comparten necesariamente una misma memoria física. Paquetes de control no definen la interfaz de negocio.",
      "schema": [
        "Arquitecturas por capas",
        "Las capas se comunican mediante contratos definidos.",
        "Capas separadas, contratos claros."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-29",
    "track": "zaragoza-c1",
    "number": 29,
    "reserve": false,
    "page": 6,
    "section": 0,
    "block": "IV",
    "category": "Sistemas",
    "topic": "Sistemas de información",
    "concept": "Big Data y BI",
    "subtopic": "Big Data y BI",
    "difficulty": "examen",
    "prompt": "¿Cuál es la principal diferencia entre un entorno de Big Data y un sistema de Business Intelligence (BI) tradicional?",
    "options": [
      "El Big Data gestiona volúmenes masivos de datos (estructurados y no estructurados) variables en el tiempo, mientras que BI se centra principalmente en datos estructurados.",
      "El BI se enfoca en el almacenamiento de datos no estructurados, mientras que el Big Data solo admite tablas SQL.",
      "El BI requiere hardware especializado de tipo Mainframe, mientras que el Big Data solo puede ejecutarse en la nube pública."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Big Data aborda datos de gran volumen y variedad; BI tradicional suele analizar datos estructurados. Es la distinción didáctica de la pregunta. No implica que las herramientas BI actuales sean incapaces de trabajar con otras fuentes ni que Big Data tenga que estar en cloud.",
    "rationales": [
      "Es la comparación que plantea el enunciado.",
      "Invierte la distinción y restringe incorrectamente Big Data a SQL.",
      "Ninguna de esas exigencias de hardware o ubicación es universal."
    ],
    "trick": "Big Data: volumen y variedad; BI: análisis de negocio.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-6.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Big Data y BI."
    ],
    "teaching": {
      "simple": "Big Data aborda datos de gran volumen y variedad; BI tradicional suele analizar datos estructurados.",
      "technical": "Es la distinción didáctica de la pregunta. No implica que las herramientas BI actuales sean incapaces de trabajar con otras fuentes ni que Big Data tenga que estar en cloud.",
      "example": "Analizar registros y eventos masivos contrasta con un informe de ventas tabular.",
      "commonError": "Invierte la distinción y restringe incorrectamente Big Data a SQL. Ninguna de esas exigencias de hardware o ubicación es universal.",
      "schema": [
        "Big Data y BI",
        "Big Data aborda datos de gran volumen y variedad; BI tradicional suele analizar datos estructurados.",
        "Big Data: volumen y variedad; BI: análisis de negocio."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-30",
    "track": "zaragoza-c1",
    "number": 30,
    "reserve": false,
    "page": 7,
    "section": 0,
    "block": "IV",
    "category": "Virtualización",
    "topic": "Virtualización y cloud",
    "concept": "Snapshots",
    "subtopic": "Snapshots",
    "difficulty": "examen",
    "prompt": "Antes de realizar una actualización crítica de un parche de seguridad en el sistema operativo de un servidor virtual, ¿cuál es la mejor práctica en VMware para asegurar una recuperación inmediata?",
    "options": [
      "Realizar una clonación completa de la máquina virtual hacia un datastore de backup externo.",
      "Exportar la máquina virtual a formato OVF para tener un respaldo en caso de corrupción del almacenamiento local.",
      "Realizar un Snapshot (Instantánea) de la máquina virtual para poder revertir todos los cambios en segundos si la actualización falla."
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una instantánea permite volver al estado previo de una VM tras un cambio fallido. En el escenario descrito se busca reversión inmediata. Una snapshot depende del almacenamiento original y no sustituye una copia de seguridad independiente; no debe mantenerse indefinidamente.",
    "rationales": [
      "Un clon puede servir de copia, pero no es la reversión inmediata buscada.",
      "OVF sirve para exportar la VM; restaurar requiere más pasos.",
      "Es el mecanismo de reversión solicitado."
    ],
    "trick": "Snapshot para volver; backup para sobrevivir a la pérdida.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-7.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Snapshots."
    ],
    "teaching": {
      "simple": "Una instantánea permite volver al estado previo de una VM tras un cambio fallido.",
      "technical": "En el escenario descrito se busca reversión inmediata. Una snapshot depende del almacenamiento original y no sustituye una copia de seguridad independiente; no debe mantenerse indefinidamente.",
      "example": "Tomas una instantánea antes del parche, lo pruebas y la retiras tras verificarlo.",
      "commonError": "Un clon puede servir de copia, pero no es la reversión inmediata buscada. OVF sirve para exportar la VM; restaurar requiere más pasos.",
      "schema": [
        "Snapshots",
        "Una instantánea permite volver al estado previo de una VM tras un cambio fallido.",
        "Snapshot para volver; backup para sobrevivir a la pérdida."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-31",
    "track": "zaragoza-c1",
    "number": 31,
    "reserve": false,
    "page": 7,
    "section": 0,
    "block": "II",
    "category": "Hardware",
    "topic": "Infraestructura CPD",
    "concept": "SAI",
    "subtopic": "SAI",
    "difficulty": "examen",
    "prompt": "En la infraestructura de soporte de un CPD, ¿cuál es el propósito técnico de un sistema de alimentación ininterrumpida (SAI) ?",
    "options": [
      "Realizar el filtrado de armónicos únicamente cuando se detecta un corte en el suministro de la red eléctrica principal.",
      "Conmutar a baterías solo en caso de picos de tensión superiores al 15% del valor nominal para proteger la electrónica de red.",
      "Proporcionar energía eléctrica limpia y constante a los equipos, aislándolos de cualquier anomalía de la red durante un tiempo determinado."
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Un SAI mantiene temporalmente la alimentación de los equipos frente a problemas eléctricos. La autonomía es limitada y depende de carga y batería. Según su diseño puede acondicionar o estabilizar la alimentación; no elimina toda avería posible ni dura indefinidamente.",
    "rationales": [
      "Restringe la función a un caso que no la define.",
      "No actúa exclusivamente ante esa clase de picos.",
      "Es la descripción que acepta la plantilla para el escenario."
    ],
    "trick": "SAI compra tiempo para seguir o apagar bien.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-7.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: SAI."
    ],
    "teaching": {
      "simple": "Un SAI mantiene temporalmente la alimentación de los equipos frente a problemas eléctricos.",
      "technical": "La autonomía es limitada y depende de carga y batería. Según su diseño puede acondicionar o estabilizar la alimentación; no elimina toda avería posible ni dura indefinidamente.",
      "example": "Ante un corte, el servidor continúa unos minutos para apagarse de forma controlada.",
      "commonError": "Restringe la función a un caso que no la define. No actúa exclusivamente ante esa clase de picos.",
      "schema": [
        "SAI",
        "Un SAI mantiene temporalmente la alimentación de los equipos frente a problemas eléctricos.",
        "SAI compra tiempo para seguir o apagar bien."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-32",
    "track": "zaragoza-c1",
    "number": 32,
    "reserve": false,
    "page": 7,
    "section": 0,
    "block": "II",
    "category": "Hardware",
    "topic": "Arquitectura de computadores",
    "concept": "UEFI y GPT",
    "subtopic": "UEFI y GPT",
    "difficulty": "examen",
    "prompt": "¿Cuál es la principal ventaja de la interfaz UEFI en comparación con la BIOS tradicional en cuanto a la gestión de almacenamiento?",
    "options": [
      "Soporte nativo para particiones muy grandes mediante el uso de GPT.",
      "Eliminación completa de la necesidad de controladores para discos duros SATA.",
      "Capacidad de formatear discos magnéticos a una velocidad diez veces superior."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "UEFI puede arrancar usando GPT, que supera límites del esquema MBR tradicional. GPT usa direccionamiento LBA amplio y una tabla moderna de particiones. La compatibilidad exacta depende de firmware y sistema operativo.",
    "rationales": [
      "Es la ventaja de almacenamiento preguntada.",
      "Los discos siguen necesitando soporte y controladores.",
      "No multiplica por diez la velocidad de formateo."
    ],
    "trick": "UEFI + GPT = superar límites de MBR.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-7.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: UEFI y GPT."
    ],
    "teaching": {
      "simple": "UEFI puede arrancar usando GPT, que supera límites del esquema MBR tradicional.",
      "technical": "GPT usa direccionamiento LBA amplio y una tabla moderna de particiones. La compatibilidad exacta depende de firmware y sistema operativo.",
      "example": "Un disco grande se particiona con GPT en un sistema compatible.",
      "commonError": "Los discos siguen necesitando soporte y controladores. No multiplica por diez la velocidad de formateo.",
      "schema": [
        "UEFI y GPT",
        "UEFI puede arrancar usando GPT, que supera límites del esquema MBR tradicional.",
        "UEFI + GPT = superar límites de MBR."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-33",
    "track": "zaragoza-c1",
    "number": 33,
    "reserve": false,
    "page": 7,
    "section": 0,
    "block": "IV",
    "category": "Redes",
    "topic": "Redes",
    "concept": "VLAN",
    "subtopic": "VLAN",
    "difficulty": "examen",
    "prompt": "¿Qué tipo de red local lógica se puede crear en un switch para agrupar dispositivos independientemente de su ubicación física?",
    "options": [
      "VPN",
      "WLAN",
      "VLAN"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una VLAN crea una red lógica dentro de la infraestructura de switches. Separa dominios de broadcast de capa 2. Para comunicar VLAN diferentes hace falta encaminamiento y una configuración adecuada.",
    "rationales": [
      "Una VPN construye un túnel entre extremos.",
      "WLAN significa red local inalámbrica.",
      "VLAN realiza la segmentación lógica descrita."
    ],
    "trick": "VLAN = LAN virtual; VPN = túnel.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-7.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: VLAN."
    ],
    "teaching": {
      "simple": "Una VLAN crea una red lógica dentro de la infraestructura de switches.",
      "technical": "Separa dominios de broadcast de capa 2. Para comunicar VLAN diferentes hace falta encaminamiento y una configuración adecuada.",
      "example": "Separas invitados y personal en VLAN diferentes aunque usen el mismo switch.",
      "commonError": "Una VPN construye un túnel entre extremos. WLAN significa red local inalámbrica.",
      "schema": [
        "VLAN",
        "Una VLAN crea una red lógica dentro de la infraestructura de switches.",
        "VLAN = LAN virtual; VPN = túnel."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-34",
    "track": "zaragoza-c1",
    "number": 34,
    "reserve": false,
    "page": 7,
    "section": 0,
    "block": "IV",
    "category": "Redes",
    "topic": "Directorios",
    "concept": "LDAP",
    "subtopic": "LDAP",
    "difficulty": "examen",
    "prompt": "¿Cuál es el propósito del protocolo LDAP en el contexto de la administración de directorios?",
    "options": [
      "Permitir buscar destinatarios con el buzón lleno en el envío de correos electrónicos masivos.",
      "Permitir la consulta y modificación de información en servicios de directorio como eDirectory.",
      "Permitir el acceso a los datos de un directorio ligero."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "LDAP sirve para consultar y modificar entradas de un directorio. El protocolo define operaciones como búsqueda, adición y modificación. No es simplemente el acceso a cualquier carpeta ni un mecanismo de correo.",
    "rationales": [
      "No define la función de LDAP.",
      "Identifica operaciones de directorio y el ejemplo eDirectory.",
      "Es demasiado imprecisa: LDAP opera sobre servicios de directorio."
    ],
    "trick": "LDAP consulta entradas, no carpetas.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-7.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: LDAP."
    ],
    "teaching": {
      "simple": "LDAP sirve para consultar y modificar entradas de un directorio.",
      "technical": "El protocolo define operaciones como búsqueda, adición y modificación. No es simplemente el acceso a cualquier carpeta ni un mecanismo de correo.",
      "example": "Buscas una cuenta por su uid dentro de un directorio corporativo.",
      "commonError": "No define la función de LDAP. Es demasiado imprecisa: LDAP opera sobre servicios de directorio.",
      "schema": [
        "LDAP",
        "LDAP sirve para consultar y modificar entradas de un directorio.",
        "LDAP consulta entradas, no carpetas."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-35",
    "track": "zaragoza-c1",
    "number": 35,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "IV",
    "category": "Sistemas",
    "topic": "Sistemas operativos",
    "concept": "sudo",
    "subtopic": "sudo",
    "difficulty": "examen",
    "prompt": "¿Cuál es la función principal del comando'sudo' en la administración de sistemas Linux?",
    "options": [
      "Cambiar permanentemente la identidad del usuario actual a root.",
      "Cerrar la sesión actual para entrar como otro usuario.",
      "Ejecutar un comando con los privilegios de otro usuario."
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "sudo ejecuta un comando con la identidad y permisos permitidos de otro usuario. Habitualmente se usa como root, pero puede seleccionar otro usuario autorizado. No cambia permanentemente la identidad de toda la sesión.",
    "rationales": [
      "No cambia permanentemente tu sesión a root.",
      "No exige cerrar la sesión actual.",
      "Describe la ejecución autorizada de un comando."
    ],
    "trick": "sudo: privilegio para este comando.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: sudo."
    ],
    "teaching": {
      "simple": "sudo ejecuta un comando con la identidad y permisos permitidos de otro usuario.",
      "technical": "Habitualmente se usa como root, pero puede seleccionar otro usuario autorizado. No cambia permanentemente la identidad de toda la sesión.",
      "example": "sudo -u postgres id ejecuta id como postgres si tu política lo permite.",
      "commonError": "No cambia permanentemente tu sesión a root. No exige cerrar la sesión actual.",
      "schema": [
        "sudo",
        "sudo ejecuta un comando con la identidad y permisos permitidos de otro usuario.",
        "sudo: privilegio para este comando."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-36",
    "track": "zaragoza-c1",
    "number": 36,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "IV",
    "category": "Sistemas",
    "topic": "Sistemas operativos",
    "concept": "Permisos Linux",
    "subtopic": "Permisos Linux",
    "difficulty": "examen",
    "prompt": "En la representación numérica de permisos, ¿qué significa el valor 755 aplicado a un directorio?",
    "options": [
      "El propietario tiene todos los permisos, mientras que el grupo y otros solo lectura y ejecución.",
      "El archivo es privado y solo el propietario puede leerlo y modificarlo.",
      "Todos los usuarios tienen permisos totales de lectura, escritura y ejecución."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "755 significa todos los permisos para propietario, lectura y ejecución para grupo y otros. r=4, w=2, x=1. En directorios, x permite atravesarlos y w permite modificar sus entradas junto con los permisos necesarios.",
    "rationales": [
      "7=rwx y 5=r-x para los dos grupos restantes.",
      "Una configuración privada sería distinta, por ejemplo 700.",
      "Permisos totales para todos corresponderían a 777."
    ],
    "trick": "7 = 4+2+1; 5 = 4+1.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Permisos Linux."
    ],
    "teaching": {
      "simple": "755 significa todos los permisos para propietario, lectura y ejecución para grupo y otros.",
      "technical": "r=4, w=2, x=1. En directorios, x permite atravesarlos y w permite modificar sus entradas junto con los permisos necesarios.",
      "example": "chmod 755 proyecto permite acceder a grupo y otros, pero no crear archivos en él.",
      "commonError": "Una configuración privada sería distinta, por ejemplo 700. Permisos totales para todos corresponderían a 777.",
      "schema": [
        "Permisos Linux",
        "755 significa todos los permisos para propietario, lectura y ejecución para grupo y otros.",
        "7 = 4+2+1; 5 = 4+1."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-37",
    "track": "zaragoza-c1",
    "number": 37,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "III",
    "category": "Web",
    "topic": "XML y formatos",
    "concept": "ODF",
    "subtopic": "ODF",
    "difficulty": "examen",
    "prompt": "¿Qué caracteriza al formato de archivo ODF (Open Document Format)?",
    "options": [
      "Es el formato binario nativo que solo puede ser abierto por las versiones antiguas de Microsoft Office.",
      "Es un estándar abierto basado en XML, diseñado para ser independiente de cualquier aplicación o plataforma.",
      "Es un formato exclusivo para presentaciones que no permite la inclusión de imágenes ni gráficos vectoriales."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "ODF es un formato documental abierto basado en XML. Define estructuras de documentos de oficina y permite interoperabilidad. No garantiza que toda aplicación represente idénticamente cualquier documento.",
    "rationales": [
      "No es un formato binario exclusivo de Office antiguo.",
      "Describe el estándar abierto y su base XML.",
      "Incluye otros tipos de documento, no solo presentaciones."
    ],
    "trick": "ODF = documentos abiertos.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: ODF."
    ],
    "teaching": {
      "simple": "ODF es un formato documental abierto basado en XML.",
      "technical": "Define estructuras de documentos de oficina y permite interoperabilidad. No garantiza que toda aplicación represente idénticamente cualquier documento.",
      "example": "Un archivo .odt puede abrirse con aplicaciones compatibles diferentes.",
      "commonError": "No es un formato binario exclusivo de Office antiguo. Incluye otros tipos de documento, no solo presentaciones.",
      "schema": [
        "ODF",
        "ODF es un formato documental abierto basado en XML.",
        "ODF = documentos abiertos."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-38",
    "track": "zaragoza-c1",
    "number": 38,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "IV",
    "category": "Seguridad",
    "topic": "Criptografía",
    "concept": "Certificados digitales",
    "subtopic": "Certificados digitales",
    "difficulty": "examen",
    "prompt": "En la gestión de certificados digitales en un navegador, ¿cuál es la función de una Autoridad de Certificación (CA)?",
    "options": [
      "Almacenar de forma segura las contraseñas de todos los usuarios de Internet.",
      "Actuar como un tercero de confianza que valida la identidad del titular y firma el certificado",
      "Bloquear automáticamente el acceso a sitios web que tengan contenido inadecuado."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una CA firma certificados que vinculan una identidad a una clave pública. El receptor verifica la firma y la cadena de confianza, además de vigencia y otros controles aplicables. La CA no administra todas las contraseñas de Internet.",
    "rationales": [
      "No es un almacén global de contraseñas.",
      "Define el tercero de confianza que firma el certificado.",
      "No es un filtro de contenidos."
    ],
    "trick": "CA: certifica la asociación identidad-clave.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Certificados digitales."
    ],
    "teaching": {
      "simple": "Una CA firma certificados que vinculan una identidad a una clave pública.",
      "technical": "El receptor verifica la firma y la cadena de confianza, además de vigencia y otros controles aplicables. La CA no administra todas las contraseñas de Internet.",
      "example": "Tu navegador verifica el certificado del servidor contra autoridades de confianza.",
      "commonError": "No es un almacén global de contraseñas. No es un filtro de contenidos.",
      "schema": [
        "Certificados digitales",
        "Una CA firma certificados que vinculan una identidad a una clave pública.",
        "CA: certifica la asociación identidad-clave."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-39",
    "track": "zaragoza-c1",
    "number": 39,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "IV",
    "category": "Seguridad",
    "topic": "Criptografía",
    "concept": "Firmas digitales",
    "subtopic": "Firmas digitales",
    "difficulty": "examen",
    "prompt": "¿Qué componente de un certificado digital permite al receptor verificar la firma del emisor?",
    "options": [
      "La clave pública del emisor.",
      "La clave privada del emisor.",
      "La clave pública del receptor"
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una firma se verifica con la clave pública de quien la produjo. El emisor firma con su clave privada; el receptor usa la pública del emisor. Para un certificado, la firma la produce la autoridad emisora, no necesariamente el titular.",
    "rationales": [
      "Es la clave de verificación del firmante.",
      "La privada se mantiene secreta y se usa para firmar.",
      "La clave del receptor no verifica la firma del emisor."
    ],
    "trick": "Privada firma; pública del firmante verifica.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Firmas digitales."
    ],
    "teaching": {
      "simple": "Una firma se verifica con la clave pública de quien la produjo.",
      "technical": "El emisor firma con su clave privada; el receptor usa la pública del emisor. Para un certificado, la firma la produce la autoridad emisora, no necesariamente el titular.",
      "example": "Para verificar un certificado firmado por una CA utilizas la clave pública de esa CA.",
      "commonError": "La privada se mantiene secreta y se usa para firmar. La clave del receptor no verifica la firma del emisor.",
      "schema": [
        "Firmas digitales",
        "Una firma se verifica con la clave pública de quien la produjo.",
        "Privada firma; pública del firmante verifica."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-40",
    "track": "zaragoza-c1",
    "number": 40,
    "reserve": false,
    "page": 8,
    "section": 0,
    "block": "IV",
    "category": "Redes",
    "topic": "Servicios de archivos",
    "concept": "NCP",
    "subtopic": "NCP",
    "difficulty": "examen",
    "prompt": "¿Qué protocolo es específico del entorno OES de Microfocus para proporcionar servicios de servidor y cliente?",
    "options": [
      "NCP",
      "CIFS",
      "NFS"
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "El cliente de OES utiliza NCP para acceder a servicios del servidor. NCP significa NetWare Core Protocol. OES también puede ofrecer acceso por otros protocolos; la pregunta pide el específico de ese entorno histórico.",
    "rationales": [
      "Es el protocolo señalado por la plantilla.",
      "CIFS es otro protocolo de acceso a archivos, no el específico pedido.",
      "NFS es habitual en acceso a archivos de entornos Unix."
    ],
    "trick": "NCP = NetWare Core Protocol.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-8.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: NCP."
    ],
    "teaching": {
      "simple": "El cliente de OES utiliza NCP para acceder a servicios del servidor.",
      "technical": "NCP significa NetWare Core Protocol. OES también puede ofrecer acceso por otros protocolos; la pregunta pide el específico de ese entorno histórico.",
      "example": "Un cliente OES accede a un volumen mediante NCP según sus derechos.",
      "commonError": "CIFS es otro protocolo de acceso a archivos, no el específico pedido. NFS es habitual en acceso a archivos de entornos Unix.",
      "schema": [
        "NCP",
        "El cliente de OES utiliza NCP para acceder a servicios del servidor.",
        "NCP = NetWare Core Protocol."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-41",
    "track": "zaragoza-c1",
    "number": 41,
    "reserve": false,
    "page": 9,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Programación",
    "concept": "Polimorfismo",
    "subtopic": "Polimorfismo",
    "difficulty": "examen",
    "prompt": "En el ámbito de los conceptos básicos de la metodología de Análisis y Diseño Orientado a Objetos, ¿qué término de la orientación a objetos permite que una única interfaz o identificador (nombre de un método o mensaje) represente diferentes implementaciones funcionales dependiendo de la clase del objeto que lo recibe?",
    "options": [
      "Abstracción.",
      "Herencia.",
      "Polimorfismo"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una misma operación puede comportarse de manera diferente según el objeto que la recibe. Una interfaz común permite invocar implementaciones de clases distintas. Herencia puede ayudar a expresarlo, pero no es su definición.",
    "rationales": [
      "Abstracción modela características esenciales.",
      "Herencia relaciona clases y reutiliza o especializa comportamiento.",
      "Es el comportamiento dependiente de la clase concreta."
    ],
    "trick": "Mismo mensaje, distintas formas.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-9.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Polimorfismo."
    ],
    "teaching": {
      "simple": "Una misma operación puede comportarse de manera diferente según el objeto que la recibe.",
      "technical": "Una interfaz común permite invocar implementaciones de clases distintas. Herencia puede ayudar a expresarlo, pero no es su definición.",
      "example": "dibujar() representa un círculo o un rectángulo según el objeto.",
      "commonError": "Abstracción modela características esenciales. Herencia relaciona clases y reutiliza o especializa comportamiento.",
      "schema": [
        "Polimorfismo",
        "Una misma operación puede comportarse de manera diferente según el objeto que la recibe.",
        "Mismo mensaje, distintas formas."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-42",
    "track": "zaragoza-c1",
    "number": 42,
    "reserve": false,
    "page": 9,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Ingeniería del software",
    "concept": "UML",
    "subtopic": "UML",
    "difficulty": "examen",
    "prompt": "En el contexto del lenguaje unificado de modelado (UML). ¿Cuál de los siguientes diagramas es el más adecuado para modelar el paso de mensajes entre objetos ordenados cronológicamente?",
    "options": [
      "Diagrama de Secuencia.",
      "Diagrama de Objetos.",
      "Diagrama de Actividades."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Un diagrama de secuencia representa mensajes ordenados en el tiempo. Las líneas de vida y mensajes muestran interacciones entre participantes. Un diagrama de objetos muestra instancias; uno de actividades modela flujos de trabajo.",
    "rationales": [
      "Es el diagrama de interacciones temporales.",
      "Representa una estructura de instancias.",
      "Representa un flujo de actividades."
    ],
    "trick": "Secuencia = mensajes en el tiempo.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-9.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: UML."
    ],
    "teaching": {
      "simple": "Un diagrama de secuencia representa mensajes ordenados en el tiempo.",
      "technical": "Las líneas de vida y mensajes muestran interacciones entre participantes. Un diagrama de objetos muestra instancias; uno de actividades modela flujos de trabajo.",
      "example": "Cliente → API → base de datos representa una secuencia de llamadas.",
      "commonError": "Representa una estructura de instancias. Representa un flujo de actividades.",
      "schema": [
        "UML",
        "Un diagrama de secuencia representa mensajes ordenados en el tiempo.",
        "Secuencia = mensajes en el tiempo."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-43",
    "track": "zaragoza-c1",
    "number": 43,
    "reserve": false,
    "page": 9,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Ingeniería del software",
    "concept": "Mantenimiento correctivo",
    "subtopic": "Mantenimiento correctivo",
    "difficulty": "examen",
    "prompt": "En el contexto del mantenimiento y control de versiones de sistemas de información, según el estándar ISO/IEC 14764, ¿cómo se denomina al mantenimiento realizado para corregir errores descubiertos después de la entrega del software?",
    "options": [
      "Mantenimiento Preventivo",
      "Mantenimiento Correctivo.",
      "Mantenimiento Perfectivo."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Corregir un error ya descubierto es mantenimiento correctivo. Se diferencia del preventivo, orientado a reducir fallos futuros, y del perfectivo, orientado a mejoras. La clasificación citada es la del contexto histórico del examen.",
    "rationales": [
      "Se anticipa a problemas potenciales.",
      "Repara un defecto detectado tras la entrega.",
      "Mejora el producto, no define corregir el defecto preguntado."
    ],
    "trick": "Correctivo corrige; preventivo previene.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-9.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Mantenimiento correctivo."
    ],
    "teaching": {
      "simple": "Corregir un error ya descubierto es mantenimiento correctivo.",
      "technical": "Se diferencia del preventivo, orientado a reducir fallos futuros, y del perfectivo, orientado a mejoras. La clasificación citada es la del contexto histórico del examen.",
      "example": "Reparas una consulta que devuelve duplicados después de entregar la aplicación.",
      "commonError": "Se anticipa a problemas potenciales. Mejora el producto, no define corregir el defecto preguntado.",
      "schema": [
        "Mantenimiento correctivo",
        "Corregir un error ya descubierto es mantenimiento correctivo.",
        "Correctivo corrige; preventivo previene."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-44",
    "track": "zaragoza-c1",
    "number": 44,
    "reserve": false,
    "page": 9,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Algoritmos y estructuras",
    "concept": "Estructuras de control",
    "subtopic": "Estructuras de control",
    "difficulty": "examen",
    "prompt": "En el contexto de la programación estructurada, el teorema de Böhm-Jacopini demuestra que cualquier programa computable puede escribirse utilizando exclusivamente tres estructuras de control: 'secuencia','selección' e 'iteración'. ¿Cuál es la característica principal de la 'secuencia'?",
    "options": [
      "La ejecución de instrucciones una tras otra en el orden en que aparecen.",
      "El salto incondicional a cualquier linea del programa.",
      "La repetición varias veces de un mismo bloque de código mientras se cumpla una condición"
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Secuencia significa ejecutar instrucciones en orden, una detrás de otra. La selección elige un camino según una condición; la iteración repite. No confundas la secuencia con saltos incondicionales.",
    "rationales": [
      "Define la ejecución ordenada.",
      "Un salto incondicional no define secuencia.",
      "Describe iteración."
    ],
    "trick": "Secuencia sigue; selección decide; iteración repite.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-9.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Estructuras de control."
    ],
    "teaching": {
      "simple": "Secuencia significa ejecutar instrucciones en orden, una detrás de otra.",
      "technical": "La selección elige un camino según una condición; la iteración repite. No confundas la secuencia con saltos incondicionales.",
      "example": "Leer dato → calcular resultado → mostrar resultado es una secuencia.",
      "commonError": "Un salto incondicional no define secuencia. Describe iteración.",
      "schema": [
        "Estructuras de control",
        "Secuencia significa ejecutar instrucciones en orden, una detrás de otra.",
        "Secuencia sigue; selección decide; iteración repite."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-45",
    "track": "zaragoza-c1",
    "number": 45,
    "reserve": false,
    "page": 9,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Programación",
    "concept": "Clase y objeto",
    "subtopic": "Clase y objeto",
    "difficulty": "examen",
    "prompt": "En el paradigma de Programación Orientada a Objetos, ¿qué define técnicamente a una \"Clase\"?",
    "options": [
      "Una instancia concreta de un objeto en tiempo de ejecución.",
      "Una función aislada que no comparte estado con otras partes del programa.",
      "Es una plantilla para objetos que incluye definiciones de todos los atributos y operaciones"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Una clase describe cómo son sus objetos; un objeto es una instancia concreta. La clase define atributos y operaciones; cada instancia puede conservar su propio estado. La pregunta usa el modelo habitual de POO basada en clases.",
    "rationales": [
      "Es la definición de objeto o instancia.",
      "Una función aislada no define la clase.",
      "Describe la plantilla de atributos y operaciones."
    ],
    "trick": "Clase = molde; objeto = ejemplar.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-9.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Clase y objeto."
    ],
    "teaching": {
      "simple": "Una clase describe cómo son sus objetos; un objeto es una instancia concreta.",
      "technical": "La clase define atributos y operaciones; cada instancia puede conservar su propio estado. La pregunta usa el modelo habitual de POO basada en clases.",
      "example": "La clase Cuenta define saldo; dos cuentas guardan saldos diferentes.",
      "commonError": "Es la definición de objeto o instancia. Una función aislada no define la clase.",
      "schema": [
        "Clase y objeto",
        "Una clase describe cómo son sus objetos; un objeto es una instancia concreta.",
        "Clase = molde; objeto = ejemplar."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-46",
    "track": "zaragoza-c1",
    "number": 46,
    "reserve": false,
    "page": 10,
    "section": 0,
    "block": "III",
    "category": "Web",
    "topic": "HTTP y HTTPS",
    "concept": "Métodos HTTP",
    "subtopic": "Métodos HTTP",
    "difficulty": "examen",
    "prompt": "Según el estándar RFC 9110, ¿qué método HTTP tiene como función principal la lectura de un recurso identificado, siendo definido formalmente como un \"método seguro\" y no tiene como objetivo alterar el estado del servidor?",
    "options": [
      "PUT.",
      "GET.",
      "DELETE."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "GET solicita leer una representación de un recurso. Seguro significa que el cliente no solicita modificar el estado del servidor. Puede haber efectos secundarios como registros; seguro no significa cifrado. GET también es idempotente en su semántica.",
    "rationales": [
      "PUT solicita crear o reemplazar el estado del recurso.",
      "Es el método seguro de lectura preguntado.",
      "DELETE solicita eliminar el recurso."
    ],
    "trick": "GET obtiene; seguro no significa HTTPS.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-10.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Métodos HTTP."
    ],
    "teaching": {
      "simple": "GET solicita leer una representación de un recurso.",
      "technical": "Seguro significa que el cliente no solicita modificar el estado del servidor. Puede haber efectos secundarios como registros; seguro no significa cifrado. GET también es idempotente en su semántica.",
      "example": "Consultar /productos con GET pide información; registrar el acceso no cambia esa semántica.",
      "commonError": "PUT solicita crear o reemplazar el estado del recurso. DELETE solicita eliminar el recurso.",
      "schema": [
        "Métodos HTTP",
        "GET solicita leer una representación de un recurso.",
        "GET obtiene; seguro no significa HTTPS."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-47",
    "track": "zaragoza-c1",
    "number": 47,
    "reserve": false,
    "page": 10,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Programación",
    "concept": "JVM",
    "subtopic": "JVM",
    "difficulty": "examen",
    "prompt": "¿Qué significan exactamente las siglas JVM y cuál es su función primordial en el ecosistema Java?",
    "options": [
      "Java Verified Module; es un componente de seguridad que valida la firma digital de las librerías.",
      "Java Virtual Machine; proporciona un entorno de ejecución en el que se ejecuta el código de bytes (bytecode) de Java.",
      "Java Variable Method; es el sistema que gestiona la declaración de variables dentro de un método."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "La JVM ejecuta el bytecode de Java. Java Virtual Machine proporciona un entorno de ejecución; puede interpretar o compilar dinámicamente código. No es el compilador que traduce el fuente Java a bytecode.",
    "rationales": [
      "La expansión de las siglas es incorrecta.",
      "Define Java Virtual Machine y su función.",
      "No es un sistema de declaración de variables."
    ],
    "trick": "javac produce bytecode; JVM lo ejecuta.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-10.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: JVM."
    ],
    "teaching": {
      "simple": "La JVM ejecuta el bytecode de Java.",
      "technical": "Java Virtual Machine proporciona un entorno de ejecución; puede interpretar o compilar dinámicamente código. No es el compilador que traduce el fuente Java a bytecode.",
      "example": "Un archivo .class se ejecuta en una JVM compatible.",
      "commonError": "La expansión de las siglas es incorrecta. No es un sistema de declaración de variables.",
      "schema": [
        "JVM",
        "La JVM ejecuta el bytecode de Java.",
        "javac produce bytecode; JVM lo ejecuta."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-48",
    "track": "zaragoza-c1",
    "number": 48,
    "reserve": false,
    "page": 10,
    "section": 0,
    "block": "III",
    "category": "Web",
    "topic": "Desarrollo web",
    "concept": "HTML",
    "subtopic": "HTML",
    "difficulty": "examen",
    "prompt": "En el contexto de las aplicaciones en entorno WEB. ¿Qué significan las siglas HTML?",
    "options": [
      "HyperText Markup Language (lenguaje de marcado de hipertexto).",
      "Hyperlink Tool Management (Gestión de Herramientas de Hipervínculo).",
      "High-level Text Multimedia Language (Lenguaje Multimedia de Texto de Alto Nivel)"
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "HTML es el lenguaje de marcado que estructura una página web. HyperText Markup Language describe elementos y contenido. CSS aporta presentación y JavaScript comportamiento; HTML no es por sí mismo un lenguaje general de programación.",
    "rationales": [
      "Es la expansión correcta de las siglas.",
      "No corresponde a las siglas HTML.",
      "No corresponde a las siglas HTML."
    ],
    "trick": "HTML estructura; CSS viste; JS actúa.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-10.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: HTML."
    ],
    "teaching": {
      "simple": "HTML es el lenguaje de marcado que estructura una página web.",
      "technical": "HyperText Markup Language describe elementos y contenido. CSS aporta presentación y JavaScript comportamiento; HTML no es por sí mismo un lenguaje general de programación.",
      "example": "Un elemento <h1> marca un encabezado principal.",
      "commonError": "No corresponde a las siglas HTML. No corresponde a las siglas HTML.",
      "schema": [
        "HTML",
        "HTML es el lenguaje de marcado que estructura una página web.",
        "HTML estructura; CSS viste; JS actúa."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-49",
    "track": "zaragoza-c1",
    "number": 49,
    "reserve": false,
    "page": 10,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Desarrollo web",
    "concept": "Herramientas de desarrollo",
    "subtopic": "Herramientas de desarrollo",
    "difficulty": "examen",
    "prompt": "¿Cómo se denomina el entorno de desarrollo integrado (IDE) que contiene un conjunto de herramientas creadas por Apple para el desarrollo de aplicaciones iOS?",
    "options": [
      "Xcode.",
      "Eclipse.",
      "Visual Studio Code."
    ],
    "answer": 0,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Xcode es el entorno de desarrollo de Apple para sus plataformas. Integra edición, compilación, depuración y herramientas para desarrollar, entre otras, aplicaciones iOS. Las versiones y requisitos cambian; la respuesta es histórica.",
    "rationales": [
      "Es la herramienta de Apple identificada.",
      "Eclipse no es el IDE de Apple pedido.",
      "Visual Studio Code no es el IDE de Apple pedido."
    ],
    "trick": "Apple → Xcode.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-10.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Herramientas de desarrollo."
    ],
    "teaching": {
      "simple": "Xcode es el entorno de desarrollo de Apple para sus plataformas.",
      "technical": "Integra edición, compilación, depuración y herramientas para desarrollar, entre otras, aplicaciones iOS. Las versiones y requisitos cambian; la respuesta es histórica.",
      "example": "Un proyecto iOS se compila y depura con herramientas de Xcode.",
      "commonError": "Eclipse no es el IDE de Apple pedido. Visual Studio Code no es el IDE de Apple pedido.",
      "schema": [
        "Herramientas de desarrollo",
        "Xcode es el entorno de desarrollo de Apple para sus plataformas.",
        "Apple → Xcode."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-50",
    "track": "zaragoza-c1",
    "number": 50,
    "reserve": false,
    "page": 10,
    "section": 0,
    "block": "III",
    "category": "Programación",
    "topic": "Herramientas de desarrollo",
    "concept": "Git",
    "subtopic": "Git",
    "difficulty": "examen",
    "prompt": "En el contexto de los repositorios y la generación de código. ¿Qué comando de Git se utiliza para actualizar una o más ramas, etiquetas u otras referencias en un repositorio remoto desde su repositorio local y envía todos los datos necesarios que no se encuentren en el repositorio remoto?",
    "options": [
      "git pull.",
      "git push.",
      "git launch."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "git push envía actualizaciones desde tu repositorio local hacia un remoto. Actualiza referencias remotas y transmite los objetos necesarios. Puede rechazarse por permisos o por conflicto con el historial remoto; no garantiza sobrescribirlo.",
    "rationales": [
      "pull trae e integra cambios del remoto.",
      "push publica actualizaciones hacia el remoto.",
      "launch no es el comando estándar de Git pedido."
    ],
    "trick": "push empuja; pull trae.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-10.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Git."
    ],
    "teaching": {
      "simple": "git push envía actualizaciones desde tu repositorio local hacia un remoto.",
      "technical": "Actualiza referencias remotas y transmite los objetos necesarios. Puede rechazarse por permisos o por conflicto con el historial remoto; no garantiza sobrescribirlo.",
      "example": "Tras hacer commit, git push origin main intenta publicar la rama main.",
      "commonError": "pull trae e integra cambios del remoto. launch no es el comando estándar de Git pedido.",
      "schema": [
        "Git",
        "git push envía actualizaciones desde tu repositorio local hacia un remoto.",
        "push empuja; pull trae."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-R1",
    "track": "zaragoza-c1",
    "number": 51,
    "reserve": true,
    "page": 11,
    "section": 0,
    "block": "II",
    "category": "Hardware",
    "topic": "Infraestructura CPD",
    "concept": "Flujo de aire CPD",
    "subtopic": "Flujo de aire CPD",
    "difficulty": "examen",
    "prompt": "Tras una ampliación de servidores en un rack, se detecta que el aire caliente expulsado está recirculando hacia la entrada de los equipos frontales. Como técnico de CPD, ¿qué medida de climatización es la más eficiente para corregir este problema?",
    "options": [
      "Aumentar la velocidad de los ventiladores de las unidades CRAC de toda la sala de forma indiscriminada.",
      "Instalar paneles ciegos en las unidades U libres del rack y asegurar el cerramiento del pasillo frío para evitar la mezcla de flujos de aire.",
      "Configurar las rejillas del suelo técnico para que expulsen aire directamente al pasillo caliente, forzando la extracción."
    ],
    "answer": 1,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Hay que impedir que el aire caliente vuelva a la entrada fría de los equipos. Paneles ciegos y contención del pasillo frío reducen mezcla y recirculación. El diseño concreto exige revisar el CPD; no basta con subir todos los ventiladores.",
    "rationales": [
      "Aumentar ventilación indiscriminadamente no corrige necesariamente la recirculación.",
      "Evita mezcla entre flujos fríos y calientes.",
      "Enviar aire al pasillo caliente no alimenta correctamente las entradas."
    ],
    "trick": "Frío entra por delante; caliente sale por detrás.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-11.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: Flujo de aire CPD."
    ],
    "teaching": {
      "simple": "Hay que impedir que el aire caliente vuelva a la entrada fría de los equipos.",
      "technical": "Paneles ciegos y contención del pasillo frío reducen mezcla y recirculación. El diseño concreto exige revisar el CPD; no basta con subir todos los ventiladores.",
      "example": "Tapas las U libres para que el aire no atraviese huecos y recircule.",
      "commonError": "Aumentar ventilación indiscriminadamente no corrige necesariamente la recirculación. Enviar aire al pasillo caliente no alimenta correctamente las entradas.",
      "schema": [
        "Flujo de aire CPD",
        "Hay que impedir que el aire caliente vuelva a la entrada fría de los equipos.",
        "Frío entra por delante; caliente sale por detrás."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-R2",
    "track": "zaragoza-c1",
    "number": 52,
    "reserve": true,
    "page": 11,
    "section": 0,
    "block": "IV",
    "category": "Redes",
    "topic": "Seguridad informática",
    "concept": "RADIUS",
    "subtopic": "RADIUS",
    "difficulty": "examen",
    "prompt": "En el contexto de RADIUS, ¿qué dispositivo suele actuar como el 'RADIUS Client'?",
    "options": [
      "Un servidor de aplicaciones para securizar una web.",
      "Una base de datos SQL donde se guardan las contraseñas.",
      "Un Servidor de Acceso a la Red (NAS), como un punto de acceso WiFi o un servidor VPN"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "El cliente RADIUS suele ser el equipo que controla el acceso a la red. El NAS envía solicitudes de autenticación al servidor RADIUS. El usuario es quien pide conectarse, pero el cliente del protocolo es el NAS.",
    "rationales": [
      "No es el rol típico descrito para acceso a red.",
      "Una base de datos puede respaldar credenciales, pero no define el cliente.",
      "NAS, punto de acceso o servidor VPN puede ejercer ese rol."
    ],
    "trick": "Usuario pide; NAS pregunta a RADIUS.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-11.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: RADIUS."
    ],
    "teaching": {
      "simple": "El cliente RADIUS suele ser el equipo que controla el acceso a la red.",
      "technical": "El NAS envía solicitudes de autenticación al servidor RADIUS. El usuario es quien pide conectarse, pero el cliente del protocolo es el NAS.",
      "example": "Un punto de acceso consulta al servidor RADIUS para autorizar una conexión.",
      "commonError": "No es el rol típico descrito para acceso a red. Una base de datos puede respaldar credenciales, pero no define el cliente.",
      "schema": [
        "RADIUS",
        "El cliente RADIUS suele ser el equipo que controla el acceso a la red.",
        "Usuario pide; NAS pregunta a RADIUS."
      ]
    }
  },
  {
    "id": "zaragoza-2026-1731-1-R3",
    "track": "zaragoza-c1",
    "number": 53,
    "reserve": true,
    "page": 11,
    "section": 0,
    "block": "IV",
    "category": "Redes",
    "topic": "Directorios",
    "concept": "LDAP",
    "subtopic": "LDAP",
    "difficulty": "examen",
    "prompt": "En el contexto de LDAP ¿qué representa un 'Distinguished Name' (DN)?",
    "options": [
      "El nombre relativo de un objeto dentro de su contenedor inmediato.",
      "Una contraseña cifrada utilizada para la operación de 'Bind'.",
      "La ruta completa y única que identifica unívocamente a una entrada en el árbol de directorio"
    ],
    "answer": 2,
    "examSet": "zaragoza-2026-1731",
    "scoringPenalty": 0.5,
    "explanation": "Un DN identifica una entrada concreta dentro del árbol de directorio. Distinguished Name combina componentes relativos de la jerarquía. El RDN es el nombre relativo en su contenedor, no la ruta completa.",
    "rationales": [
      "Describe un RDN, no el DN completo.",
      "Bind autentica; el DN no es una contraseña.",
      "Describe el identificador completo de la entrada."
    ],
    "trick": "RDN = tramo; DN = camino completo.",
    "source": "Ayuntamiento de Zaragoza · Técnica/o Auxiliar Informática/o C1 · 28/04/2026 · proceso 1731 · plantilla definitiva publicada 03/06/2026. Ayudas didácticas: OpoSprint.",
    "originalPage": "/assets/zaragoza-pages/first-11.png",
    "reviewedExplanation": true,
    "hints": [
      "Identifica qué función se pide y descarta una opción que pertenezca a otro mecanismo.",
      "Distingue el concepto de sus alternativas: LDAP."
    ],
    "teaching": {
      "simple": "Un DN identifica una entrada concreta dentro del árbol de directorio.",
      "technical": "Distinguished Name combina componentes relativos de la jerarquía. El RDN es el nombre relativo en su contenedor, no la ruta completa.",
      "example": "uid=ana,ou=personas,dc=ejemplo,dc=org identifica una entrada del directorio.",
      "commonError": "Describe un RDN, no el DN completo. Bind autentica; el DN no es una contraseña.",
      "schema": [
        "LDAP",
        "Un DN identifica una entrada concreta dentro del árbol de directorio.",
        "RDN = tramo; DN = camino completo."
      ]
    }
  }
];
