import { validSessionOptions } from "./official-exam.mjs";
/** @param {unknown} value @returns {value is import('./types.js').SessionDraft} */
export function validDraft(value) {
  if (!value || typeof value !== "object") return false;
  const d = /** @type {import('./types.js').SessionDraft} */ (value);
  const n = d.questionIds?.length;
  return (
    (d.options?.mode !== "custom80" || n === 80) &&
    (d.options === undefined || validSessionOptions(d.options)) &&
    ["practice", "exam", "official"].includes(d.kind) &&
    Number.isFinite(d.createdAt) &&
    d.createdAt >= 0 &&
    Number.isFinite(d.elapsedMs) &&
    d.elapsedMs >= 0 &&
    Array.isArray(d.questionIds) &&
    n > 0 &&
    n <= 300 &&
    new Set(d.questionIds).size === n &&
    d.questionIds.every((id) => typeof id === "string" && id.length < 150) &&
    Number.isInteger(d.current) &&
    d.current >= 0 &&
    d.current < n &&
    Array.isArray(d.picks) &&
    d.picks.length === n &&
    d.picks.every(
      (p) => p === null || (Number.isInteger(p) && p >= 0 && p < 4),
    ) &&
    Array.isArray(d.durations) &&
    d.durations.length === n &&
    d.durations.every((t) => Number.isFinite(t) && t >= 0) &&
    Array.isArray(d.flags) &&
    d.flags.length === n &&
    d.flags.every((t) => typeof t === "boolean") &&
    Array.isArray(d.recorded) &&
    d.recorded.length === n &&
    d.recorded.every((t) => typeof t === "boolean") &&
    (d.kind === "practice" || d.recorded.every((t) => !t))
  );
}
/** @param {import('./types.js').SessionDraft|undefined} draft @param {import('./types.js').Question[]} bank */
export function resumableQuestions(draft, bank) {
  if (!validDraft(draft)) return [];
  const questions = draft.questionIds.map((id) =>
    bank.find((q) => q.id === id),
  );
  if (
    questions.some(
      (q, i) =>
        !q || (draft.picks[i] !== null && draft.picks[i] >= q.options.length),
    )
  )
    return [];
  return /** @type {import('./types.js').Question[]} */ (questions);
}
