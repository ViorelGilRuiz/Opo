import { grade, recordAnswer, completeLesson, DAY } from "./learning.mjs";
/** @import {Curriculum,CourseTopic,TopicProgress,StepId,LevelId,Exercise,QuestionBank,PedagogyState} from './pedagogy-types.js' */
/** @import {LearningState} from './types.js' */
/** @param {unknown} value @returns {value is PedagogyState} */
export function validPedagogy(value) {
  if (!value || typeof value !== "object") return false;
  const p = /** @type {PedagogyState} */ (value);
  const steps = [
    "introduction",
    "concepts",
    "example",
    "exercise",
    "minitest",
    "review",
  ];
  const finite = (/** @type {number} */ n) => Number.isFinite(n) && n >= 0;
  return (
    p.version === 1 &&
    !!p.topics &&
    typeof p.topics === "object" &&
    !Array.isArray(p.topics) &&
    Object.values(p.topics).every(
      (t) =>
        t &&
        Number.isInteger(t.revision) &&
        t.revision > 0 &&
        steps.includes(t.step) &&
        Array.isArray(t.completedSteps) &&
        t.completedSteps.every((s, i) => steps.indexOf(s) === i) &&
        steps.indexOf(t.step) <= t.completedSteps.length &&
        finite(t.reviewDueAt) &&
        finite(t.lastStudiedAt) &&
        !!t.exerciseAttempts &&
        typeof t.exerciseAttempts === "object" &&
        !Array.isArray(t.exerciseAttempts) &&
        Object.values(t.exerciseAttempts).every(
          (a) =>
            a &&
            Number.isFinite(a.value) &&
            typeof a.correct === "boolean" &&
            finite(a.at),
        ) &&
        Array.isArray(t.assessments) &&
        t.assessments.every(
          (a) =>
            a &&
            typeof a.id === "string" &&
            ["foundation", "practice", "exam", "review"].includes(a.level) &&
            typeof a.passed === "boolean" &&
            finite(a.at) &&
            Array.isArray(a.questionIds) &&
            a.questionIds.every((id) => typeof id === "string") &&
            Array.isArray(a.picks) &&
            a.picks.length === a.questionIds.length &&
            a.picks.every(
              (v) => v === null || (Number.isInteger(v) && v >= 0 && v < 4),
            ) &&
            a.result &&
            ["correct", "wrong", "blank", "raw", "score", "percent"].every(
              (key) => finite(a.result[/** @type {'correct'} */ (key)]),
            ) &&
            Number.isFinite(a.result.direct),
        ),
    )
  );
}
/** @param {Curriculum} curriculum @param {QuestionBank} bank @returns {string[]} */
export function validateCurriculum(curriculum, bank) {
  const errors = [];
  const seen = new Set();
  const qids = new Set(bank.map((q) => q.id));
  const sids = new Set(curriculum.sources.map((s) => s.id));
  if (new Set(bank.map((q) => q.id)).size !== bank.length)
    errors.push("IDs de preguntas duplicados");
  for (const q of bank)
    if (
      ![3, 4].includes(q.options.length) ||
      ![0, q.options.length].includes(q.rationales.length) ||
      q.answer < 0 ||
      q.answer >= q.options.length ||
      !Number.isInteger(q.answer)
    )
      errors.push("Pregunta inválida: " + q.id);
  for (const s of curriculum.sources)
    if (
      !s.url.startsWith("https://") ||
      !s.version ||
      !/^\d{4}-\d{2}-\d{2}$/.test(s.checkedAt)
    )
      errors.push("Fuente inválida: " + s.id);
  if (!sids.has(curriculum.programSourceId))
    errors.push("Falta programa de referencia");
  const required = [
    "introduction",
    "concepts",
    "example",
    "exercise",
    "minitest",
    "review",
  ];
  if (curriculum.steps.map((s) => s.id).join() !== required.join())
    errors.push("Secuencia pedagógica incompleta");
  const sourceCounts = new Set(curriculum.sources.map((s) => s.id));
  if (sourceCounts.size !== curriculum.sources.length)
    errors.push("IDs de fuentes duplicados");
  if (
    new Set(curriculum.areas.map((a) => a.id)).size !== curriculum.areas.length
  )
    errors.push("IDs de áreas duplicados");
  /** @param {import('./pedagogy-types.js').ContentBlock[]} blocks */
  function validateBlocks(blocks) {
    for (const block of blocks) {
      if (!block.title) errors.push("Bloque de contenido sin título");
      if (block.type === "table") {
        if (
          !block.headers.length ||
          !block.rows.length ||
          block.rows.some((row) => row.length !== block.headers.length)
        )
          errors.push("Tabla incompleta: " + block.title);
      } else if (block.type === "steps" || block.type === "layers") {
        if (!block.items.length || block.items.some((item) => !item.trim()))
          errors.push("Diagrama incompleto: " + block.title);
      } else if (!("body" in block) || !block.body.trim())
        errors.push("Contenido vacío: " + block.title);
    }
  }
  for (const t of curriculum.topics) {
    validateBlocks([...t.introduction, ...t.example, ...t.review]);
    if (seen.has(t.id)) errors.push("Tema duplicado: " + t.id);
    seen.add(t.id);
    if (
      t.revision < 1 ||
      !t.title ||
      !t.objectives.length ||
      !t.introduction.length ||
      !t.concepts.length ||
      !t.example.length ||
      (!t.exercises.length && t.assessmentPolicy!=="official-only") ||
      !t.review.length
    )
      errors.push("Tema incompleto: " + t.id);
    if (t.assessments.map((a) => a.id).join() !== (t.assessmentPolicy==="official-only"?"exam":"foundation,practice,exam"))
      errors.push("Faltan niveles: " + t.id);
    const concepts = new Set(t.concepts.map((c) => c.id));
    if (
      concepts.size !== t.concepts.length ||
      new Set(t.exercises.map((e) => e.id)).size !== t.exercises.length
    )
      errors.push("IDs internos duplicados: " + t.id);
    for (const c of t.concepts)
      if (
        !c.simple ||
        !c.technical ||
        !c.example ||
        !c.commonError ||
        !c.memory ||
        !c.questionIds.length ||
        !c.sourceIds.length
      )
        errors.push("Concepto incompleto: " + c.id);
    for (const id of [
      ...t.sourceIds,
      ...t.concepts.flatMap((c) => c.sourceIds),
    ])
      if (!sids.has(id)) errors.push("Fuente inexistente: " + id);
    for (const id of [
      ...t.concepts.flatMap((c) => c.questionIds),
      ...t.assessments.flatMap((a) => a.questionIds),
    ])
      if (!qids.has(id)) errors.push("Pregunta inexistente: " + id);
    if(t.assessmentPolicy === "official-only" && [...t.concepts.flatMap(c=>c.questionIds),...t.assessments.flatMap(a=>a.questionIds)].some(id=>{const q=bank.find(q=>q.id===id);return !q || !/^(tai|aragon|zaragoza)-/.test(q.examSet) || q.block==="I" || q.answer<0;})) errors.push("Contenido no oficial en tema: "+t.id);
    for (const a of t.assessments) {
      if (
        a.questionIds.some(
          (id) => t.assessmentPolicy!=="official-only" && bank.find((q) => q.id === id)?.rationales.length !== 4,
        )
      )
        errors.push("Distractores sin explicación: " + t.id);
      if (
        !a.questionIds.length ||
        new Set(a.questionIds).size !== a.questionIds.length ||
        a.passPercent <= 0 ||
        a.passPercent > 100
      )
        errors.push("Minitest inválido: " + t.id);
    }
    for (const e of t.exercises)
      if (
        e.conceptIds.some((id) => !concepts.has(id)) ||
        (e.type === "choice"
          ? e.options.length !== 4 ||
            !Number.isInteger(e.answer) ||
            e.answer < 0 ||
            e.answer > 3
          : !Number.isFinite(e.answer))
      )
        errors.push("Ejercicio inválido: " + e.id);
  }
  for (const area of curriculum.areas)
    for (const id of area.topicIds)
      if (!seen.has(id)) errors.push("Área con tema inexistente: " + id);
  const visiting = new Set();
  const visited = new Set();
  /** @param {CourseTopic} t */
  function visit(t) {
    if (visiting.has(t.id)) {
      errors.push("Ciclo de prerrequisitos: " + t.id);
      return;
    }
    if (visited.has(t.id)) return;
    visiting.add(t.id);
    for (const id of t.prerequisiteIds) {
      const dep = curriculum.topics.find((p) => p.id === id);
      if (dep) visit(dep);
      else errors.push("Prerrequisito inexistente: " + id);
    }
    visiting.delete(t.id);
    visited.add(t.id);
  }
  curriculum.topics.forEach(visit);
  return errors;
}
/** @param {LearningState} state @param {CourseTopic} topic @returns {TopicProgress} */
export function topicProgress(state, topic) {
  const previous = state.pedagogy.topics[topic.id];
  if (previous?.revision === topic.revision) return previous;
  if(previous) state.pedagogy.topics[topic.id+"@revision-"+previous.revision]=previous;
  // Un cambio de revisión no convierte una evaluación anterior en evidencia del nuevo contenido.
  const current = {
    revision: topic.revision,
    step: /** @type {StepId} */ ("introduction"),
    completedSteps: [],
    exerciseAttempts: {},
    assessments: [],
    reviewDueAt: 0,
    lastStudiedAt: 0,
  };
  state.pedagogy.topics[topic.id] = current;
  return current;
}
/** @param {TopicProgress} progress @param {LevelId} level */
export function latestAssessment(progress, level) {
  return progress.assessments.filter((a) => a.level === level).at(-1);
}
/** @param {TopicProgress} progress @param {CourseTopic} topic */
export function nextAssessment(progress, topic) {
  return topic.assessments.find(
    (a) => !latestAssessment(progress, a.id)?.passed,
  );
}
/** @param {Exercise} exercise @param {unknown} input */
export function checkExercise(exercise, input) {
  if (
    (typeof input !== "string" && typeof input !== "number") ||
    String(input).trim() === ""
  )
    return { valid: false, correct: false, value: 0 };
  const raw = String(input).trim().replace(",", ".");
  const value = Number(raw);
  const valid =
    Number.isFinite(value) &&
    (exercise.type === "number"
      ? /^-?\d+(?:[.,]\d+)?$/.test(raw)
      : Number.isInteger(value) &&
        value >= 0 &&
        value < exercise.options.length);
  return { valid, correct: valid && value === exercise.answer, value };
}
/** @param {TopicProgress} progress @param {Exercise} exercise @param {unknown} input @param {number} [now] */
export function submitExercise(progress, exercise, input, now = Date.now()) {
  const result = checkExercise(exercise, input);
  if (result.valid)
    progress.exerciseAttempts[exercise.id] = {
      value: result.value,
      correct: result.correct,
      at: now,
    };
  return result;
}
/** @param {Curriculum} curriculum @param {CourseTopic} topic @param {TopicProgress} progress @param {StepId} step */
export function canOpenStep(curriculum, topic, progress, step) {
  const index = curriculum.steps.findIndex((s) => s.id === step);
  if (index < 0) return false;
  return curriculum.steps
    .slice(0, index)
    .every((s) => progress.completedSteps.includes(s.id));
}
/** @param {CourseTopic} topic @param {TopicProgress} progress @param {StepId} step @param {number} [now] */
export function completeStep(topic, progress, step, now = Date.now()) {
  const order = /** @type {StepId[]} */ ([
    "introduction",
    "concepts",
    "example",
    "exercise",
    "minitest",
    "review",
  ]);
  const index = order.indexOf(step);
  if (
    index < 0 ||
    order.slice(0, index).some((id) => !progress.completedSteps.includes(id))
  )
    return false;
  if (
    step === "exercise" &&
    !topic.exercises.every((e) => progress.exerciseAttempts[e.id])
  )
    return false;
  if (
    step === "minitest" &&
    topic.assessments.some((a) => !latestAssessment(progress, a.id)?.passed)
  )
    return false;
  if (!progress.completedSteps.includes(step))
    progress.completedSteps.push(step);
  progress.lastStudiedAt = now;
  return true;
}
/** @param {LearningState} state @param {CourseTopic} topic @param {LevelId} level @param {QuestionBank} questions @param {(number|null)[]} picks @param {string} attemptId @param {number} responseMs @param {number} [now] */
export function submitAssessment(
  state,
  topic,
  level,
  questions,
  picks,
  attemptId,
  responseMs,
  now = Date.now(),
) {
  const progress = topicProgress(state, topic);
  if (!progress.completedSteps.includes("exercise"))
    return { ok: false, reason: "Completa los ejercicios antes del minitest." };
  if (progress.assessments.some((a) => a.id === attemptId))
    return { ok: false, reason: "Este intento ya está corregido." };
  const assessment = topic.assessments.find((a) => a.id === level);
  const previous = topic.assessments.slice(
    0,
    topic.assessments.findIndex((a) => a.id === level),
  );
  if (
    level !== "review" &&
    (!assessment ||
      previous.some((a) => !latestAssessment(progress, a.id)?.passed) ||
      questions.map((q) => q.id).join() !== assessment.questionIds.join())
  )
    return {
      ok: false,
      reason: "Supera el nivel anterior antes de continuar.",
    };
  const allowed = new Set(topic.assessments.flatMap((a) => a.questionIds));
  if (
    !questions.length ||
    new Set(questions.map((q) => q.id)).size !== questions.length ||
    questions.some((q) => !allowed.has(q.id)) ||
    picks.length !== questions.length ||
    picks.some((p) => p !== null && (!Number.isInteger(p) || p < 0 || p > 3))
  )
    return { ok: false, reason: "Respuestas inválidas." };
  if (level === "review" && !progress.completedSteps.includes("minitest"))
    return { ok: false, reason: "Completa el minitest antes del repaso." };
  const result = grade(questions, picks);
  const passed = result.percent >= (assessment?.passPercent ?? 80);
  questions.forEach((q, i) =>
    recordAnswer(state, q, picks[i], responseMs / questions.length, now),
  );
  progress.assessments.push({
    id: attemptId,
    level,
    questionIds: questions.map((q) => q.id),
    picks: [...picks],
    at: now,
    result,
    passed,
  });
  // Conservar la evidencia de cada nivel al limitar el historial de repasos.
  const reviews = progress.assessments
    .filter((a) => a.level === "review")
    .slice(-12);
  const levels = topic.assessments.flatMap((a) =>
    progress.assessments.filter((x) => x.level === a.id).slice(-3),
  );
  progress.assessments = [...levels, ...reviews].sort((a, b) => a.at - b.at);
  progress.lastStudiedAt = now;
  if (level === "exam" || level === "review") {
    progress.reviewDueAt =
      now + (passed ? (level === "review" ? 7 : 3) * DAY : 10 * 60000);
  }
  if (level === "review" && passed)
    completeStep(topic, progress, "review", now);
  if (
    level === "exam" &&
    passed &&
    completeStep(topic, progress, "minitest", now)
  )
    completeLesson(state, "course:" + topic.id, now);
  return { ok: true, result, passed };
}
