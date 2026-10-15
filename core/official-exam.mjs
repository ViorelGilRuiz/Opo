import { isVerifiedOfficialQuestion } from "../data/official-catalog.mjs";
/** @import {Question} from './types.js' */
/** @typedef {{track?:string;category?:string;topic?:string;scope?:string;allowMixed?:boolean}} ExamFilters */
/** @param {Question[]} bank @param {ExamFilters} [filters] */
export function eligibleOfficialQuestions(bank, filters = {}) {
  return [
    ...new Map(
      bank
        .filter(
          (q) =>
            isVerifiedOfficialQuestion(q) &&
            (!filters.category || q.category === filters.category) &&
            (!filters.topic || q.topic === filters.topic) &&
            (filters.scope !== "technical" || q.block !== "I") &&
            (filters.scope !== "law" || q.block === "I") &&
            (!filters.track || q.track === filters.track),
        )
        .map((q) => [q.id, q]),
    ).values(),
  ];
}
/** Selección estricta: nunca rellena sin autorización ni devuelve un examen corto. @param {Question[]} bank @param {ExamFilters} [filters] @param {()=>number} [random] */
export function selectOfficial80(bank, filters = {}, random = Math.random) {
  const preferred = eligibleOfficialQuestions(bank, filters);
  const pool = filters.allowMixed
    ? eligibleOfficialQuestions(bank, { ...filters, track: "" })
    : preferred;
  if (pool.length < 80)
    return {
      questions: [],
      available: pool.length,
      preferred: preferred.length,
      mixed: false,
      error:
        "Hay " +
        pool.length +
        " preguntas oficiales válidas para estos filtros; necesitas 80. Amplía los filtros o autoriza completar con otros bancos.",
    };
  /** @param {Question[]} values */ const shuffle = (values) => {
    const out = [...values];
    for (let i = out.length - 1; i > 0; i--) {
      const value = random();
      if (!Number.isFinite(value) || value < 0 || value >= 1)
        throw new Error("Generador aleatorio inválido");
      const j = Math.floor(value * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const first = shuffle(preferred).slice(0, 80);
  const used = new Set(first.map((q) => q.id));
  const selected = first.concat(
    shuffle(pool.filter((q) => !used.has(q.id))).slice(0, 80 - first.length),
  );
  return {
    questions: shuffle(selected),
    available: pool.length,
    preferred: preferred.length,
    mixed: selected.some((q) => filters.track && q.track !== filters.track),
    error: "",
  };
}
/** @param {unknown} value @returns {value is import('./types.js').SessionOptions} */
export function validSessionOptions(value) {
  if (!value || typeof value !== "object") return false;
  const v = /** @type {import('./types.js').SessionOptions} */ (value);
  return (
    (v.largeText === undefined || typeof v.largeText === "boolean") &&
    (v.hideClock === undefined || typeof v.hideClock === "boolean") &&
    (v.title === undefined ||
      (typeof v.title === "string" && v.title.length <= 250)) &&
    (v.budgetMs === undefined ||
      (Number.isFinite(v.budgetMs) &&
        v.budgetMs >= 60000 &&
        v.budgetMs <= 300 * 60000)) &&
    (v.penalty === undefined ||
      (Number.isFinite(v.penalty) && v.penalty >= 0 && v.penalty <= 1)) &&
    (v.mode === undefined ||
      ["custom80", "historical-training"].includes(v.mode)) &&
    (v.rulesVerified === undefined || v.rulesVerified === false) &&
    (v.scoringLabel === undefined ||
      (typeof v.scoringLabel === "string" && v.scoringLabel.length <= 500))
  );
}
