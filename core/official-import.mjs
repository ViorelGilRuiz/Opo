/** @typedef {{id:string;url:string;sha256:string;kind:'questionnaire'|'definitive-key';localFile:string}} ImportDocument */
/** @typedef {{version:1;administration:string;body:string;call:string;year:number;documents:ImportDocument[];questions:import('./types.js').Question[]}} OfficialImportPackage */
/** Valida estructura y trazabilidad; por sí sola no certifica autenticidad. @param {unknown} value @returns {string[]} */
export function validateOfficialImport(value) {
  const errors = [];
  if (!value || typeof value !== "object")
    return ["El paquete debe ser un objeto JSON"];
  const p = /** @type {OfficialImportPackage} */ (value);
  if (p.version !== 1) errors.push("Versión de paquete no admitida");
  for (const field of /** @type {('administration'|'body'|'call')[]} */ ([
    "administration",
    "body",
    "call",
  ]))
    if (typeof p[field] !== "string" || !p[field].trim())
      errors.push("Falta " + field);
  if (!Number.isInteger(p.year) || p.year < 1980 || p.year > 2100)
    errors.push("Año inválido");
  if (!Array.isArray(p.documents) || !p.documents.length)
    errors.push("Faltan documentos fuente");
  else
    for (const d of p.documents) {
      if (
        !d ||
        typeof d.id !== "string" ||
        typeof d.localFile !== "string" ||
        !d.localFile ||
        !["questionnaire", "definitive-key"].includes(d.kind) ||
        !/^[a-f0-9]{64}$/.test(d.sha256 ?? "")
      )
        errors.push("Documento o hash inválido");
      try {
        const url = new globalThis.URL(d.url);
        if (
          url.protocol !== "https:" ||
          !/(^|\.)(zaragoza\.es|aragon\.es|inap\.es|inap\.gob\.es|boe\.es)$/.test(
            url.hostname,
          ) ||
          url.username ||
          url.password
        )
          errors.push("URL fuera de administraciones admitidas");
      } catch {
        errors.push("URL de documento inválida");
      }
    }
  if (
    !Array.isArray(p.documents) ||
    !p.documents.some((d) => d?.kind === "questionnaire") ||
    !p.documents.some((d) => d?.kind === "definitive-key")
  )
    errors.push("Se exige cuestionario y plantilla definitiva");
  if (!Array.isArray(p.questions) || !p.questions.length)
    errors.push("Faltan preguntas");
  else {
    const ids = new Set();
    for (const q of p.questions) {
      if (!q || typeof q.id !== "string" || ids.has(q.id)) {
        errors.push("ID ausente o duplicado");
        continue;
      }
      ids.add(q.id);
      if (
        typeof q.prompt !== "string" ||
        !q.prompt.trim() ||
        !Array.isArray(q.options) ||
        ![3, 4].includes(q.options.length) ||
        q.options.some((o) => typeof o !== "string" || !o.trim()) ||
        !Number.isInteger(q.answer) ||
        q.answer < 0 ||
        q.answer >= q.options.length
      )
        errors.push("Pregunta inválida o anulada: " + q.id);
      for (const field of /** @type {('track'|'examSet'|'category'|'topic'|'concept'|'subtopic'|'block'|'source')[]} */ ([
        "track",
        "examSet",
        "category",
        "topic",
        "concept",
        "subtopic",
        "block",
        "source",
      ]))
        if (typeof q[field] !== "string" || !q[field])
          errors.push("Falta " + field + " en " + q.id);
      if (
        !Number.isInteger(q.number) ||
        !Number.isInteger(q.section) ||
        typeof q.reserve !== "boolean"
      )
        errors.push("Falta número, ejercicio o reserva: " + q.id);
      if (
        typeof q.explanation !== "string" ||
        !Array.isArray(q.rationales) ||
        typeof q.trick !== "string" ||
        typeof q.difficulty !== "string"
      )
        errors.push("Contrato didáctico incompleto: " + q.id);
    }
  }
  return errors;
}
/** Compara una transcripción contra una referencia revisada independiente. @param {import('./types.js').Question[]} questions @param {import('./types.js').Question[]} references */
export function compareOfficialTranscripts(questions, references) {
  const errors = [];
  const refs = new Map(references.map((q) => [q.id, q]));
  if (refs.size !== references.length || references.length !== questions.length)
    errors.push("Referencia duplicada o tamaño diferente");
  for (const q of questions) {
    const r = refs.get(q.id);
    if (
      !r ||
      q.examSet !== r.examSet ||
      q.track !== r.track ||
      q.number !== r.number ||
      q.section !== r.section ||
      q.reserve !== r.reserve ||
      q.prompt !== r.prompt ||
      q.answer !== r.answer ||
      q.options.length !== r.options.length ||
      q.options.some((o, i) => o !== r.options[i])
    )
      errors.push("No coincide con referencia: " + q.id);
  }
  return errors;
}
