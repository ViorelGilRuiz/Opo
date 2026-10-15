import { readFile } from "node:fs/promises";
import {
  verifiedQuestionBank,
  isVerifiedOfficialQuestion,
} from "../data/official-catalog.mjs";
import { isOfficialTechnicalQuestion } from "../core/official-policy.mjs";
import { reinforcementGroups } from "../data/reinforcement-links.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { validateCurriculum } from "../core/pedagogy.mjs";
const errors = validateCurriculum(curriculum, courseQuestionBank);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    curriculum.topics.length +
      " recorridos pedagógicos: referencias, preguntas, ejercicios y prerrequisitos válidos.",
  );

for (const q of courseQuestionBank) {
  if (
    !/^(tai|aragon|zaragoza)-/.test(q.examSet) ||
    q.block === "I" ||
    q.answer < 0
  )
    throw new Error("Pregunta activa no oficial/técnica: " + q.id);
}

for (const q of courseQuestionBank)
  if (!isOfficialTechnicalQuestion(q))
    throw new Error("No coincide con el original oficial: " + q.id);
for (const group of reinforcementGroups)
  for (const id of group.ids)
    if (!courseQuestionBank.some((q) => q.id === id))
      throw new Error("Refuerzo sin pregunta oficial: " + id);
console.log(
  courseQuestionBank.length +
    " preguntas contrastadas con originales; " +
    reinforcementGroups.length +
    " relaciones de refuerzo verificadas.",
);

if (
  new Set(verifiedQuestionBank.map((q) => q.id)).size !==
  verifiedQuestionBank.length
)
  throw new Error("IDs V3 duplicados");
for (const q of verifiedQuestionBank)
  if (
    !isVerifiedOfficialQuestion(q) ||
    !/^[a-f0-9]{64}$/.test(q.provenance.documentHash) ||
    !/^[a-f0-9]{64}$/.test(q.provenance.keyHash)
  )
    throw new Error("Procedencia V3 inválida: " + q.id);
console.log(
  verifiedQuestionBank.length +
    " preguntas oficiales V3 válidas, con procedencia y hashes.",
);

const lawReferences = JSON.parse(
  await readFile(
    new URL("../tests/fixtures/zaragoza-law-2026.json", import.meta.url),
    "utf8",
  ),
);
for (const ref of lawReferences) {
  const q = verifiedQuestionBank.find((item) => item.id === ref.id);
  if (
    !q ||
    q.number !== ref.number ||
    q.prompt !== ref.prompt ||
    q.answer !== ref.answer ||
    JSON.stringify(q.options) !== JSON.stringify(ref.options)
  )
    throw new Error("Transcripción jurídica alterada: " + ref.id);
}
