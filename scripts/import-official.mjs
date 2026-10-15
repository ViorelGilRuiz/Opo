import { readFile, writeFile, realpath, mkdir } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import {
  validateOfficialImport,
  compareOfficialTranscripts,
} from "../core/official-import.mjs";
import { verifiedQuestionBank } from "../data/official-catalog.mjs";
const [packageFile, referenceFile, ...flags] = process.argv.slice(2);
if (!packageFile || !referenceFile)
  throw new Error(
    "Uso: node scripts/import-official.mjs paquete.json referencia-revisada.json [--activate --reviewed-by=nombre]",
  );
const base = await realpath(".");
const safe = async (name) => {
  const path = await realpath(resolve(base, name));
  const rel = relative(base, path);
  if (rel.startsWith("..") || isAbsolute(rel))
    throw new Error("Los documentos deben estar dentro del proyecto");
  return path;
};
const pack = JSON.parse(await readFile(await safe(packageFile), "utf8"));
const refs = JSON.parse(await readFile(await safe(referenceFile), "utf8"));
const errors = validateOfficialImport(pack);
if (!Array.isArray(refs)) errors.push("Referencia debe ser un array");
if (!errors.length)
  errors.push(...compareOfficialTranscripts(pack.questions, refs));
if (!errors.length)
  for (const doc of pack.documents) {
    const bytes = await readFile(await safe(doc.localFile));
    if (createHash("sha256").update(bytes).digest("hex") !== doc.sha256)
      errors.push("Hash local distinto: " + doc.id);
  }
const activate = flags.includes("--activate");
const reviewer = flags.find((f) => f.startsWith("--reviewed-by="))?.slice(14);
if (activate && !reviewer)
  errors.push(
    "Activación exige --reviewed-by y referencia cotejada visualmente",
  );
if (activate && !errors.length)
  for (const doc of pack.documents) {
    try {
      const response = await fetch(doc.url, {
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (createHash("sha256").update(bytes).digest("hex") !== doc.sha256)
        errors.push("La descarga oficial no coincide: " + doc.id);
    } catch (e) {
      errors.push(
        "No se pudo verificar la descarga oficial " + doc.id + ": " + e.message,
      );
    }
  }
if (
  activate &&
  pack.questions.some((q) =>
    verifiedQuestionBank.some((existing) => existing.id === q.id),
  )
)
  errors.push(
    "IDs ya incorporados: no se sobrescriben preguntas ni estadísticas",
  );
await mkdir("tmp/import-official", { recursive: true });
await writeFile(
  "tmp/import-official/last-report.json",
  JSON.stringify(
    {
      status: errors.length
        ? "rejected"
        : activate
          ? "verified"
          : "pending-review",
      reviewer: reviewer ?? null,
      errors,
      count: pack.questions?.length ?? 0,
    },
    null,
    2,
  ),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else if (activate) {
  const previous = await import("../data/imported-official.mjs");
  const questionnaire = pack.documents.find((d) => d.kind === "questionnaire");
  const key = pack.documents.find((d) => d.kind === "definitive-key");
  const additions = pack.questions.map((q) => ({
    ...q,
    provenance: {
      administration: pack.administration,
      body: pack.body,
      call: pack.call,
      year: pack.year,
      exercise: q.section,
      originalNumber: String(q.number),
      documentUrl: questionnaire.url,
      documentHash: questionnaire.sha256,
      keyUrl: key.url,
      keyHash: key.sha256,
      sourcePage: questionnaire.url,
      reference: "Referencia cotejada por " + reviewer,
      validation: "verified",
      reserve: q.reserve,
      annulled: false,
    },
  }));
  await writeFile(
    "data/imported-official.mjs",
    "// Importaciones revisadas, con descarga oficial y hashes comprobados.\nexport const importedOfficialQuestions = " +
      JSON.stringify(
        [...previous.importedOfficialQuestions, ...additions],
        null,
        2,
      ) +
      ";\n",
  );
  console.log(
    additions.length +
      " preguntas incorporadas; ejecuta contentcheck, test y build.",
  );
} else
  console.log(
    "Paquete estructuralmente válido. Pendiente de revisión: no entra en actividades. Informe en tmp/import-official/last-report.json",
  );
