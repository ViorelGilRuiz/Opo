import { grade, recordAnswer } from "./learning.mjs";
/** @import {TeacherProvider,TeacherRequest,TeacherResponse,TeacherState,TeacherLevel,TeacherAttempt} from './teacher-types.js' */
/** @import {LearningState} from './types.js' */
export const teacherLevels = [
  { id: "zero", title: "Desde cero" },
  { id: "normal", title: "Normal" },
  { id: "exam", title: "Nivel examen" },
  { id: "advanced", title: "Avanzado" },
];
export const teacherModes = [
  { id: "easy", title: "Explícamelo fácil" },
  { id: "technical", title: "Explícamelo técnicamente" },
  { id: "example", title: "Ponme un ejemplo" },
  { id: "scheme", title: "Hazme un esquema" },
  { id: "question", title: "Ponme otra pregunta" },
  { id: "assessment", title: "Examíname sobre esto" },
];
/** @returns {TeacherState} */
export function initialTeacherState() {
  return { version: 1, level: "normal", attempts: [] };
}
/** @param {unknown} value @returns {value is TeacherState} */
export function validTeacherState(value) {
  if (!value || typeof value !== "object") return false;
  const v = /** @type {TeacherState} */ (value);
  return (
    v.version === 1 &&
    teacherLevels.some((l) => l.id === v.level) &&
    Array.isArray(v.attempts) &&
    v.attempts.length <= 100 &&
    v.attempts.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        ["question", "assessment"].includes(a.mode) &&
        Number.isFinite(a.at) &&
        a.at >= 0 &&
        Array.isArray(a.questionIds) &&
        a.questionIds.every((id) => typeof id === "string") &&
        Array.isArray(a.picks) &&
        a.picks.length === a.questionIds.length &&
        a.picks.every(
          (p) => p === null || (Number.isInteger(p) && p >= 0 && p < 4),
        ) &&
        Array.isArray(a.assistedQuestionIds) &&
        a.assistedQuestionIds.every((id) => a.questionIds.includes(id)) &&
        a.result &&
        [
          "correct",
          "wrong",
          "blank",
          "raw",
          "score",
          "percent",
          "direct",
        ].every((key) =>
          Number.isFinite(a.result[/** @type {'correct'} */ (key)]),
        ),
    )
  );
}
/** @param {unknown} value @returns {value is TeacherResponse} */
export function validTeacherResponse(value) {
  if (!value || typeof value !== "object") return false;
  const r = /** @type {TeacherResponse} */ (value);
  if (
    !["explanation", "activity", "unavailable"].includes(r.kind) ||
    !["published", "partial"].includes(r.coverage) ||
    typeof r.title !== "string" ||
    typeof r.notice !== "string" ||
    !r.context ||
    typeof r.context !== "object" ||
    !Array.isArray(r.blocks) ||
    !Array.isArray(r.sources) ||
    !Array.isArray(r.questions)
  )
    return false;
  const blocks = r.blocks.every(
    (b) =>
      b &&
      typeof b.title === "string" &&
      (["text", "callout", "code"].includes(b.type)
        ? "body" in b && typeof b.body === "string"
        : b.type === "table"
          ? Array.isArray(b.headers) &&
            b.headers.every((h) => typeof h === "string") &&
            Array.isArray(b.rows) &&
            b.rows.every(
              (row) =>
                Array.isArray(row) &&
                row.length === b.headers.length &&
                row.every((cell) => typeof cell === "string"),
            )
          : (b.type === "steps" || b.type === "layers") &&
            Array.isArray(b.items) &&
            b.items.every((item) => typeof item === "string")),
  );
  const sources = r.sources.every(
    (s) =>
      s &&
      typeof s.id === "string" &&
      typeof s.title === "string" &&
      typeof s.url === "string" &&
      s.url.startsWith("https://") &&
      typeof s.version === "string" &&
      typeof s.checkedAt === "string",
  );
  const questions = r.questions.every((item) => {
    const q = item.question;
    return (
      q &&
      typeof q.id === "string" &&
      typeof q.prompt === "string" &&
      typeof q.explanation === "string" &&
      typeof q.source === "string" &&
      typeof q.topic === "string" &&
      typeof q.category === "string" &&
      typeof q.concept === "string" &&
      typeof q.block === "string" &&
      Array.isArray(q.options) &&
      [3, 4].includes(q.options.length) &&
      q.options.every((o) => typeof o === "string") &&
      new Set(q.options).size === q.options.length &&
      Number.isInteger(q.answer) &&
      q.answer >= 0 &&
      q.answer < q.options.length &&
      Array.isArray(q.rationales) &&
      [0, q.options.length].includes(q.rationales.length) &&
      q.rationales.every((s) => typeof s === "string") &&
      Array.isArray(item.hints) &&
      item.hints.length <= 2 &&
      item.hints.every((h) => typeof h === "string")
    );
  });
  return (
    blocks &&
    sources &&
    questions &&
    new Set(r.questions.map((q) => q.question.id)).size ===
      r.questions.length &&
    (r.kind !== "activity" || r.questions.length > 0)
  );
}
/** @param {TeacherProvider} provider */
export function createTeacherSession(provider) {
  let closed = false;
  let sequence = 0;
  /** @type {AbortController|undefined} */ let controller;
  return {
    /** @param {TeacherRequest} request @returns {Promise<TeacherResponse|null>} */
    async ask(request) {
      if (closed) return null;
      if (
        !teacherModes.some((m) => m.id === request.mode) ||
        !teacherLevels.some((l) => l.id === request.level)
      )
        throw new Error("Modo o nivel no válido.");
      controller?.abort();
      controller = new globalThis.AbortController();
      const current = ++sequence;
      const signal = controller.signal;
      try {
        const result = await provider.respond(request, { signal });
        if (closed || current !== sequence || signal.aborted) return null;
        if (!validTeacherResponse(result))
          throw new Error("El proveedor devolvió contenido no válido.");
        return result;
      } catch (error) {
        if (closed || current !== sequence || signal.aborted) return null;
        throw error;
      }
    },
    cancel() {
      controller?.abort();
      sequence++;
    },
    dispose() {
      closed = true;
      controller?.abort();
      sequence++;
    },
  };
}
/** @param {LearningState} state @param {TeacherResponse} activity @param {'question'|'assessment'} mode @param {(number|null)[]} picks @param {string[]} assistedIds @param {string} id @param {number} responseMs @param {number} [now] */
export function submitTeacherActivity(
  state,
  activity,
  mode,
  picks,
  assistedIds,
  id,
  responseMs,
  now = Date.now(),
) {
  if (
    activity.kind !== "activity" ||
    !validTeacherResponse(activity) ||
    picks.length !== activity.questions.length ||
    picks.some((p) => p !== null && (!Number.isInteger(p) || p < 0 || p > 3)) ||
    state.teacher.attempts.some((a) => a.id === id)
  )
    return { ok: false };
  const questions = activity.questions.map((item) => item.question);
  const known = new Set(questions.map((q) => q.id));
  if (assistedIds.some((id) => !known.has(id))) return { ok: false };
  const result = grade(questions, picks);
  questions.forEach((q, i) => {
    if (!assistedIds.includes(q.id))
      recordAnswer(state, q, picks[i], responseMs / questions.length, now);
  });
  const attempt = {
    id,
    mode,
    questionIds: questions.map((q) => q.id),
    picks: [...picks],
    assistedQuestionIds: [...new Set(assistedIds)],
    result,
    at: now,
  };
  state.teacher.attempts.push(attempt);
  state.teacher.attempts = state.teacher.attempts.slice(-100);
  return { ok: true, result };
}
