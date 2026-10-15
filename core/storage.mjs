import { validSessionOptions } from "./official-exam.mjs";
import { validDraft } from "./session-draft.mjs";
import { validMotivation } from "./motivation.mjs";
import { validTeacherState } from "./teacher.mjs";
import { validPedagogy } from "./pedagogy.mjs";
import { initialState } from "./learning.mjs";
/** @import {LearningState} from './types.js' */
export const LEARNING_KEY = "oposprint-learning-v2";
/** @param {{getItem:(key:string)=>string|null}} storage @returns {{state:LearningState;warning:string}} */
export function loadState(storage) {
  try {
    const raw = storage.getItem(LEARNING_KEY);
    if (!raw) return { state: initialState(), warning: "" };
    const value = /** @type {LearningState} */ (JSON.parse(raw));
    if (
      value.version !== 2 ||
      !Number.isFinite(value.xp) ||
      value.xp < 0 ||
      !value.questions ||
      typeof value.questions !== "object" ||
      Array.isArray(value.questions) ||
      !Array.isArray(value.events) ||
      !Array.isArray(value.attempts) ||
      !value.days ||
      typeof value.days !== "object" ||
      !Array.isArray(value.completedLessons) ||
      !Array.isArray(value.dailyXpKeys)
    )
      throw new Error("Format invalide");
    const valid =
      Array.isArray(value.completedLessons) &&
      value.completedLessons.every((v) => typeof v === "string") &&
      Array.isArray(value.dailyXpKeys) &&
      value.dailyXpKeys.every((v) => typeof v === "string") &&
      value.feedback &&
      typeof value.feedback === "object" &&
      !Array.isArray(value.feedback) &&
      Object.values(value.feedback).every((v) => typeof v === "string") &&
      Object.values(value.days).every(
        (d) =>
          d &&
          [d.correct, d.answered, d.minutes, d.lessons, d.exams].every(
            (n) => Number.isFinite(n) && n >= 0,
          ),
      ) &&
      value.attempts.every(
        (a) =>
          a &&
          typeof a.id === "string" &&
          typeof a.kind === "string" &&
          (a.sessionOptions === undefined ||
            validSessionOptions(a.sessionOptions)) &&
          Array.isArray(a.questionIds) &&
          a.questionIds.every((id) => typeof id === "string") &&
          Array.isArray(a.picks) &&
          a.picks.every(
            (p) => p === null || (Number.isInteger(p) && p >= 0 && p < 4),
          ) &&
          [
            a.at,
            a.elapsedMs,
            a.correct,
            a.wrong,
            a.blank,
            a.raw,
            a.score,
            a.percent,
            a.direct,
          ].every(Number.isFinite),
      ) &&
      value.events.every(
        (e) =>
          typeof e.questionId === "string" &&
          typeof e.concept === "string" &&
          typeof e.topic === "string" &&
          typeof e.category === "string" &&
          typeof e.block === "string" &&
          typeof e.correct === "boolean" &&
          typeof e.blank === "boolean" &&
          Number.isFinite(e.at) &&
          Number.isFinite(e.responseMs),
      );
    const stats = Object.values(value.questions).every(
      (s) =>
        s &&
        Number.isInteger(s.attempts) &&
        s.attempts >= 0 &&
        Number.isFinite(s.correctCount) &&
        Number.isFinite(s.incorrectCount) &&
        Number.isFinite(s.blankCount) &&
        Number.isFinite(s.totalResponseTime) &&
        Number.isFinite(s.lastSeenAt) &&
        Number.isFinite(s.dueAt) &&
        Number.isInteger(s.consecutive) &&
        s.consecutive >= 0 &&
        Array.isArray(s.recent) &&
        s.recent.length <= 5 &&
        (s.attempts === 0 || s.recent.length > 0) &&
        s.recent.every((v) => typeof v === "boolean"),
    );
    if (
      (value.draft !== undefined && !validDraft(value.draft)) ||
      (value.motivation !== undefined && !validMotivation(value.motivation)) ||
      (value.teacher !== undefined && !validTeacherState(value.teacher)) ||
      (value.pedagogy !== undefined && !validPedagogy(value.pedagogy)) ||
      (value.notes !== undefined &&
        (!value.notes ||
          typeof value.notes !== "object" ||
          Array.isArray(value.notes) ||
          Object.values(value.notes).some(
            (n) => typeof n !== "string" || n.length > 2000,
          ))) ||
      (value.studyTrack !== undefined &&
        !["tai", "aragon-c1", "zaragoza-c1"].includes(value.studyTrack)) ||
      !valid ||
      !stats ||
      (value.masteredConceptAwards !== undefined &&
        (!Array.isArray(value.masteredConceptAwards) ||
          !value.masteredConceptAwards.every((v) => typeof v === "string")))
    )
      throw new Error("Datos inválidos");
    return {
      state: {
        ...initialState(),
        ...value,
        reportedProfile: initialState().reportedProfile,
      },
      warning: "",
    };
  } catch {
    return {
      state: initialState(),
      warning:
        "No se pudo leer el progreso adaptativo. El dato original se conserva; puedes entrenar sin guardarlo.",
    };
  }
}
/** @param {{setItem:(key:string,value:string)=>void}} storage @param {LearningState} state */
export function saveState(storage, state) {
  try {
    storage.setItem(LEARNING_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
