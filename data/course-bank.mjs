import { zaragozaQuestions } from "./official-zaragoza.mjs";
import { aragonQuestions } from "./official-aragon.mjs";
import { freshQuestions } from "./fresh-questions.mjs";
import { officialQuestions } from "./official-2024.mjs";
import { foundationQuestions } from "./course-foundations.mjs";
/** @type {Record<string,[string,string[],string]>} */
const notes = {
  "tai-2024-0-0-72": [
    "La clave histórica es B. El modelo de referencia citado en 2024 es ISO/IEC 7498-1:1994. Las otras opciones omiten enlace o atribuyen funciones a una capa equivocada. No se afirma aquí que una edición sea la más reciente en cualquier fecha.",
    [
      "Enumera solo seis capas: falta enlace.",
      "Es la referencia que da como válida la plantilla histórica de 2024.",
      "Encaminamiento y direccionamiento son funciones de red.",
      "MAC y LLC pertenecen a enlace, no a sesión.",
    ],
    "Siete capas; red encamina; enlace contiene MAC/LLC.",
  ],
  "tai-2024-0-0-73": [
    "ICMP pertenece a la capa de Internet en la descripción TCP/IP utilizada por la pregunta. TCP y UDP son transporte.",
    [
      "La descripción habitual tiene cuatro capas; no agrega sesión. El modelo didáctico de cinco suele separar física y enlace.",
      "TCP y UDP son de transporte.",
      "Telnet es aplicación, no una capa de sesión separada.",
      "ICMP es un protocolo de control en la capa de Internet.",
    ],
    "IP e ICMP → Internet; TCP y UDP → transporte.",
  ],
  "tai-2024-0-0-74": [
    "Pide la INCORRECTA: B. /26 crea bloques de 64; .71 está en 64–127 y .133 en 128–191. Las otras afirmaciones usan el esquema histórico por clases, no una regla de asignación CIDR actual.",
    [
      "172.16 se clasificaba como B en el esquema histórico.",
      "Es incorrecta: los dos últimos octetos pertenecen a bloques /26 distintos.",
      "En el esquema histórico A tenía máscara predeterminada /8.",
      "En una red C convencional /24 había 254 hosts. No generaliza a prefijos CIDR arbitrarios.",
    ],
    "INCORRECTA: marca lo falso; /26 salta de 64 en 64.",
  ],
  "tai-2024-2-0-1": [
    "El contexto aporta /16 dividido en 16 subredes. Añadir 4 bits produce /20: 12 bits de host, 4096 direcciones y 4094 hosts convencionales.",
    [
      "4096 − 2 = 4094 hosts en cada /20.",
      "Es la capacidad convencional del /16 original, no de cada subdivisión.",
      "Cuenta direcciones totales del /20 sin restar reservas.",
      "Cuenta direcciones totales del /16 original.",
    ],
    "16 subredes → 4 bits más; /20 → 4094 hosts.",
  ],
  "tai-2024-2-0-6": [
    "La clasificación histórica distingue protocolos de usuario y de soporte en aplicación: FTP da transferencia al usuario y DNS presta resolución de nombres. Es una distinción de función, no de capa de transporte.",
    [
      "Invierte la clasificación de funciones.",
      "DNS puede usar UDP y TCP: no es siempre orientado a conexión.",
      "FTP y DNS no se clasifican ambos como soporte en este esquema.",
      "FTP es usuario y DNS es soporte según la clasificación empleada en el examen.",
    ],
    "DNS ayuda a resolver; FTP presta transferencia.",
  ],
  "tai-2024-0-0-37": [
    "Según la plantilla de TAI 2024, SELECT se incluye en DML. Algunas taxonomías docentes lo separan como DQL: sigue el contexto del enunciado y la clasificación indicada.",
    [
      "DML significa Data Manipulation Language.",
      "Crear objetos se clasifica como DDL, no como DML en este esquema.",
      "TRUNCATE se clasifica como DDL en el esquema usado por esta pregunta; los detalles dependen del SGBD.",
      "La plantilla histórica clasifica SELECT dentro de DML.",
    ],
    "DML manipula datos; DDL define objetos.",
  ],
  "tai-2024-0-0-38": [
    "DROP TABLE elimina la estructura de la tabla y sus datos. No filtra filas con WHERE; esa tarea corresponde a sentencias como DELETE.",
    [
      "DROP se clasifica como DDL, no DCL.",
      "La posibilidad de DDL en triggers depende del SGBD y no define universalmente DROP.",
      "Describe la eliminación del objeto tabla.",
      "DROP TABLE no selecciona filas mediante WHERE.",
    ],
    "DELETE borra filas; DROP borra el objeto.",
  ],
  "tai-2024-0-0-55": [
    "Los hilos permiten organizar varias tareas de un proceso. Pueden ejecutarse concurrentemente; el paralelismo efectivo depende de los recursos y la planificación.",
    [
      "Es un mecanismo de organización de memoria, no la unidad de ejecución concurrente.",
      "Es un mecanismo de memoria virtual.",
      "Se refiere a anticipar carga de páginas, no a crear unidades de ejecución.",
      "Los hilos son unidades de ejecución dentro de un proceso.",
    ],
    "Proceso = recursos; hilos = tareas de ejecución.",
  ],
  "tai-2024-2-0-8": [
    "Datos corruptos afectan a integridad; servicio inaccesible afecta a disponibilidad. El caso no afirma revelación de datos y conserva información sobre el incidente.",
    [
      "Identifica las dos propiedades descritas por los hechos.",
      "Corrupción no implica que cualquiera pueda leer los datos.",
      "Omite la pérdida de integridad por corrupción.",
      "El caso dice que se sabe cómo, quién y por qué; no evidencia pérdida de trazabilidad.",
    ],
    "Lee los hechos: corrupto → I; inaccesible → D.",
  ],
};
/** @type {import('../core/types.js').Question[]} */
export const archivedCourseQuestionBank = [
  ...freshQuestions,
  ...foundationQuestions,
  ...officialQuestions
    .filter((q) => q.answer >= 0)
    .map((q) => {
      const note = notes[q.id];
      return note
        ? { ...q, explanation: note[0], rationales: note[1], trick: note[2] }
        : q;
    }),
];
export const courseQuestionBank = [
  ...zaragozaQuestions,
  ...aragonQuestions,
  ...archivedCourseQuestionBank.filter(
    (q) => q.examSet === "tai-2024" && q.block !== "I" && q.answer >= 0,
  ),
];
export const trainingQuestions = [...zaragozaQuestions, ...aragonQuestions];
export const technicalTheoryQuestions = courseQuestionBank.filter(
  (q) => q.section === 0,
);
export const activeQuestionIds = new Set(courseQuestionBank.map((q) => q.id));
