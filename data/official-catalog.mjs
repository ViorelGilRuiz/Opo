import { importedOfficialQuestions } from "./imported-official.mjs";
import { courseQuestionBank } from "./course-bank.mjs";
import { officialQuestions } from "./official-2024.mjs";
import { zaragozaLawQuestions } from "./official-zaragoza-law.mjs";
import { aragonSource } from "./aragon-sources.mjs";
import { zaragozaSource } from "./zaragoza-sources.mjs";
/** @import {Question} from '../core/types.js' */
const taiSource = {
  page: "https://www.inap.es/web/sede-inap/tail-2024",
  title: "AGE · Técnicos Auxiliares de Informática C1",
  call: "TAI 2024 · modelo A",
  examDate: "2024-12-14",
  documents: [
    {
      name: "provided-compilation",
      url: "https://www.inap.es/web/sede-inap/tail-2024",
      sha256:
        "072eb15bdcb3d0110bbfafe7a12d2572506af2903a3239cb7ffdb0a556dd0cfe",
      reference:
        "PDF aportado test-corregido-tai-tl-2026-04-20.pdf · cuestionario páginas 33–46 y plantilla 47. Hash del PDF aportado, no de una descarga INAP.",
    },
  ],
};
/** @param {Question} q */
export function provenanceFor(q) {
  const source =
    q.track === "zaragoza-c1"
      ? zaragozaSource
      : q.track === "aragon-c1"
        ? aragonSource
        : taiSource;
  const doc =
    q.track === "tai"
      ? source.documents[0]
      : source.documents.find(
          (d) => d.name === (q.section ? "second" : "first"),
        );
  const key =
    q.track === "zaragoza-c1"
      ? zaragozaSource.documents[1]
      : q.track === "aragon-c1"
        ? aragonSource.documents.find(
            (d) => d.name === (q.section ? "correction" : "key1"),
          )
        : source.documents[0];
  return {
    administration:
      q.track === "zaragoza-c1"
        ? "Ayuntamiento de Zaragoza"
        : q.track === "aragon-c1"
          ? "Gobierno de Aragón"
          : "Administración General del Estado",
    body: source.title,
    call:
      q.track === "zaragoza-c1"
        ? "Proceso 1731 · OEP 2024/2025"
        : q.track === "aragon-c1"
          ? "24/0023"
          : "TAI 2024 · modelo A",
    year: Number(source.examDate.slice(0, 4)),
    exercise: q.section ?? 0,
    originalNumber:
      q.reserve && q.track === "zaragoza-c1"
        ? "R" + ((q.number ?? 50) - 50)
        : String(q.number),
    documentUrl: doc?.url ?? source.page,
    sourcePage: source.page,
    documentHash: doc?.sha256 ?? "",
    keyUrl: key?.url ?? source.page,
    keyHash: key?.sha256 ?? "",
    reference:
      q.track === "tai"
        ? taiSource.documents[0].reference
        : "Cuestionario y plantilla definitiva incorporados",
    validation: "verified",
    reserve: !!q.reserve,
    annulled: false,
  };
}
/** Catálogo V3: mantiene intacto el banco técnico de los recorridos anteriores. @type {Question[]} */
export const verifiedQuestionBank = [
  ...[
    ...courseQuestionBank,
    ...zaragozaLawQuestions,
    ...officialQuestions.filter((q) => q.block === "I" && q.answer >= 0),
  ].map((q) => ({
    ...q,
    options: [...q.options],
    provenance: provenanceFor(q),
  })),
  ...importedOfficialQuestions,
];
const originals = new Map(
  verifiedQuestionBank.map((q) => [
    q.id,
    { ...q, options: [...q.options], provenance: { ...q.provenance } },
  ]),
);
/** @param {Question} q */
export function isVerifiedOfficialQuestion(q) {
  const original = originals.get(q?.id);
  return (
    !!original &&
    q.answer >= 0 &&
    q.examSet === original.examSet &&
    q.track === original.track &&
    q.block === original.block &&
    q.category === original.category &&
    q.topic === original.topic &&
    q.concept === original.concept &&
    q.number === original.number &&
    q.section === original.section &&
    q.reserve === original.reserve &&
    q.prompt === original.prompt &&
    q.answer === original.answer &&
    Array.isArray(q.options) &&
    q.options.length === original.options.length &&
    q.options.every((o, i) => o === original.options[i]) &&
    q.provenance?.validation === "verified" &&
    JSON.stringify(q.provenance) === JSON.stringify(original.provenance) &&
    q.provenance?.documentHash === original.provenance?.documentHash &&
    q.provenance?.keyHash === original.provenance?.keyHash
  );
}
export const historicalExams = [
  {
    id: "zaragoza-2026-first",
    title: "Zaragoza C1 · primer ejercicio · 28/04/2026",
    track: "zaragoza-c1",
    questionCount: 50,
    reserveCount: 5,
    annulled: [15, 16],
    substitutions: [
      { number: 15, reserve: 51 },
      { number: 16, reserve: 52 },
    ],
    missing: [
      "Versión de las bases generales vigente el 28/04/2026: la fuente actual incorpora una modificación posterior (31/07/2026)",
    ],
    rulesVerified: false,
    source: zaragozaSource.page,
  },
  {
    id: "aragon-2026-first",
    title: "Aragón C1 · primer ejercicio · 13/06/2026",
    track: "aragon-c1",
    questionCount: 100,
    reserveCount: 10,
    missing: [
      "37 preguntas de legislación/normativa pendientes de cotejo para V3",
      "Tiempo y baremo oficial",
    ],
    rulesVerified: false,
    source: aragonSource.page,
  },
  {
    id: "tai-2024",
    title: "TAI 2024 · modelo A · teoría y supuesto",
    track: "tai",
    questionCount: 80,
    reserveCount: 5,
    missing: [
      "Bases y criterios de valoración de esta convocatoria sin contraste completo",
      "La nota oficial requiere cortes y transformación por parte",
    ],
    rulesVerified: false,
    source: taiSource.page,
  },
];
/** Zaragoza: 48 ordinarias válidas + R1/R2; R3–R5 no puntúan. @returns {Question[]} */
export function zaragozaHistoricalSet() {
  const bank = verifiedQuestionBank.filter((q) => q.track === "zaragoza-c1");
  return Array.from({ length: 50 }, (_, i) =>
    bank.find(
      (q) => q.number === (i + 1 === 15 ? 51 : i + 1 === 16 ? 52 : i + 1),
    ),
  ).filter((q) => !!q);
}
