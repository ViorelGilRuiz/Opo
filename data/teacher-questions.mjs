/** @type {import("../core/types.js").Question[]} */
export const teacherQuestions = [
  {
    id: "teacher-osi-layer3",
    track: "tai",
    block: "IV",
    category: "Redes",
    topic: "OSI",
    concept: "Siete capas, siete responsabilidades",
    subtopic: "Capa de red",
    difficulty: "Fácil",
    prompt: "¿Cuál es la capa 3 del modelo OSI?",
    options: ["Física", "Transporte", "Red", "Enlace"],
    answer: 2,
    explanation:
      "La capa 3 es Red. Física es 1, Enlace es 2 y Transporte es 4. Red gestiona el direccionamiento y encaminamiento entre redes.",
    rationales: [
      "Física es la capa 1: señales y bits.",
      "Transporte es la capa 4: comunicación entre extremos.",
      "Red es la capa 3: direccionamiento y encaminamiento.",
      "Enlace es la capa 2: entrega de tramas en el enlace.",
    ],
    trick: "MAC 2; IP 3; puertos 4.",
    source:
      "OpoSprint · ejemplo didáctico · ITU-T X.200 (1994), referencia del recorrido OSI",
    examSet: "teacher-local",
  },
  {
    id: "teacher-osi-router",
    track: "tai",
    block: "IV",
    category: "Redes",
    topic: "OSI",
    concept: "MAC, IP y puertos",
    subtopic: "Dispositivos y capa de red",
    difficulty: "Fácil",
    prompt:
      "¿Qué dispositivo trabaja principalmente en la capa 3 para encaminar tráfico IP?",
    options: ["Hub", "Switch Ethernet de capa 2", "Router", "Repetidor"],
    answer: 2,
    explanation:
      "El router encamina paquetes IP entre redes: función de Red (capa 3). Un switch Ethernet de capa 2 reenvía tramas por MAC. Hub y repetidor actúan sobre señales en la capa física.",
    rationales: [
      "El hub ordinario repite señales: capa física.",
      "Este enunciado especifica un switch de capa 2: utiliza MAC.",
      "El router decide rutas IP: capa 3.",
      "El repetidor regenera señales: capa física.",
    ],
    trick: "Router → rutas → Red (3).",
    source:
      "OpoSprint · ejemplo didáctico · ITU-T X.200 (1994), referencia del recorrido OSI",
    examSet: "teacher-local",
  },
];
