import test from "node:test";
import assert from "node:assert/strict";
import { archivedCurriculum as curriculum } from "../data/curriculum.mjs";
import { archivedCourseQuestionBank as courseQuestionBank } from "../data/course-bank.mjs";
import { officialQuestions } from "../data/official-2024.mjs";
import { foundationQuestions } from "../data/course-foundations.mjs";
import { initialState, DAY } from "../core/learning.mjs";
import { loadState, saveState } from "../core/storage.mjs";
import {
  validateCurriculum,
  topicProgress,
  canOpenStep,
  completeStep,
  submitExercise,
  checkExercise,
  submitAssessment,
  latestAssessment,
  nextAssessment,
  validPedagogy,
} from "../core/pedagogy.mjs";
const bank = new Map(courseQuestionBank.map((q) => [q.id, q]));
function ready(state, topic) {
  const p = topicProgress(state, topic);
  for (const id of ["introduction", "concepts", "example"])
    assert.ok(completeStep(topic, p, id));
  for (const e of topic.exercises) submitExercise(p, e, e.answer, 1000);
  assert.ok(completeStep(topic, p, "exercise"));
  return p;
}
function answer(state, topic, level, id, correct = true, now = 1000) {
  const a = topic.assessments.find((a) => a.id === level);
  const qs = a.questionIds.map((id) => bank.get(id));
  return submitAssessment(
    state,
    topic,
    level,
    qs,
    qs.map((q) => (correct ? q.answer : (q.answer + 1) % 4)),
    id,
    2000,
    now,
  );
}
test("Contenido: ocho temas completos, 16 preguntas nuevas y sin ciclos ni referencias rotas", () => {
  assert.equal(curriculum.topics.length, 8);
  assert.equal(foundationQuestions.length, 16);
  assert.deepEqual(validateCurriculum(curriculum, courseQuestionBank), []);
  const invalid = structuredClone(curriculum);
  invalid.topics[0].prerequisiteIds = ["dns"];
  assert.ok(
    validateCurriculum(invalid, courseQuestionBank).some((e) =>
      e.includes("Ciclo"),
    ),
  );
  invalid.topics[0].sourceIds = ["missing"];
  invalid.topics[0].assessments[0].questionIds = ["missing"];
  assert.ok(
    validateCurriculum(invalid, courseQuestionBank).some((e) =>
      e.includes("Fuente inexistente"),
    ),
  );
  assert.ok(
    validateCurriculum(invalid, courseQuestionBank).some((e) =>
      e.includes("Pregunta inexistente"),
    ),
  );
});
test("La explicación pedagógica conserva las claves oficiales y los enunciados históricos", () => {
  for (const topic of curriculum.topics) {
    for (const id of topic.assessments.find((a) => a.id === "exam")
      .questionIds) {
      const original = officialQuestions.find((q) => q.id === id);
      const q = bank.get(id);
      assert.ok(original);
      assert.equal(q.answer, original.answer);
      assert.equal(q.prompt, original.prompt);
      assert.deepEqual(q.options, original.options);
      assert.equal(q.rationales.length, 4);
      assert.doesNotMatch(q.explanation, /todavía no está desarrollada/);
    }
  }
});
test("Ejercicios: rechazar vacíos, notación ambigua y opciones fuera de rango", () => {
  const topic = curriculum.topics.find((t) => t.id === "subnetting");
  const e = topic.exercises[0];
  for (const v of ["", null, undefined, "0x1e", "NaN", "30 hosts"])
    assert.equal(checkExercise(e, v).valid, false);
  assert.equal(checkExercise(e, "30").correct, true);
  assert.equal(checkExercise(e, "30,0").correct, true);
  assert.equal(checkExercise(e, "32").correct, false);
  const c = curriculum.topics[0].exercises[0];
  assert.equal(checkExercise(c, 4).valid, false);
});
test("El motor impide saltar fases, saltar niveles y registrar el mismo intento dos veces", () => {
  const state = initialState();
  const topic = curriculum.topics[0];
  const p = topicProgress(state, topic);
  assert.equal(canOpenStep(curriculum, topic, p, "review"), false);
  assert.equal(completeStep(topic, p, "minitest"), false);
  assert.equal(answer(state, topic, "foundation", "early").ok, false);
  ready(state, topic);
  assert.equal(answer(state, topic, "exam", "early-exam").ok, false);
  assert.equal(answer(state, topic, "foundation", "fail", false).passed, false);
  assert.equal(answer(state, topic, "practice", "skip").ok, false);
  assert.equal(answer(state, topic, "foundation", "pass").passed, true);
  const events = state.events.length;
  assert.equal(answer(state, topic, "foundation", "pass").ok, false);
  assert.equal(state.events.length, events);
  assert.equal(nextAssessment(p, topic).id, "practice");
});
test("Cada demostración alcanza examen y programa repasos sin equiparar lectura a dominio", () => {
  for (const topic of curriculum.topics) {
    const state = initialState();
    const p = ready(state, topic);
    assert.equal(state.xp, 0);
    for (const a of topic.assessments)
      assert.equal(
        answer(state, topic, a.id, topic.id + ":" + a.id).passed,
        true,
      );
    assert.ok(p.completedSteps.includes("minitest"));
    assert.ok(state.completedLessons.includes("course:" + topic.id));
    assert.equal(p.reviewDueAt, 1000 + 3 * DAY);
    assert.equal(canOpenStep(curriculum, topic, p, "review"), true);
    assert.equal(state.days[Object.keys(state.days)[0]].lessons, 1);
    const qs = topic.assessments[0].questionIds.map((id) => bank.get(id));
    const result = submitAssessment(
      state,
      topic,
      "review",
      qs,
      qs.map((q) => q.answer),
      "review",
      4000,
      2000,
    );
    assert.equal(result.passed, true);
    assert.equal(p.reviewDueAt, 2000 + 7 * DAY);
    assert.ok(p.completedSteps.includes("review"));
    assert.equal(state.days[Object.keys(state.days)[0]].lessons, 1);
  }
});
test("Un fallo de repaso acerca la próxima sesión y una puntuación negativa persiste correctamente", () => {
  const state = initialState();
  const topic = curriculum.topics[0];
  const p = ready(state, topic);
  for (const a of topic.assessments) answer(state, topic, a.id, a.id);
  const qs = topic.assessments[0].questionIds.map((id) => bank.get(id));
  const result = submitAssessment(
    state,
    topic,
    "review",
    qs,
    qs.map((q) => (q.answer + 1) % 4),
    "review-wrong",
    2000,
    3000,
  );
  assert.equal(result.passed, false);
  assert.equal(p.reviewDueAt, 3000 + 10 * 60000);
  assert.ok(latestAssessment(p, "review").result.direct < 0);
  assert.equal(validPedagogy(state.pedagogy), true);
  let raw;
  const storage = { setItem: (k, v) => (raw = v), getItem: () => raw };
  saveState(storage, state);
  assert.equal(loadState(storage).warning, "");
  assert.equal(
    loadState(storage).state.pedagogy.topics[topic.id].assessments.length,
    p.assessments.length,
  );
});
test("Migración aditiva: progreso v2 anterior conserva XP, eventos y lecciones", () => {
  const old = initialState();
  delete old.pedagogy;
  old.xp = 140;
  old.completedLessons = ["lesson-0"];
  const loaded = loadState({ getItem: () => JSON.stringify(old) });
  assert.equal(loaded.warning, "");
  assert.equal(loaded.state.xp, 140);
  assert.deepEqual(loaded.state.completedLessons, ["lesson-0"]);
  assert.deepEqual(loaded.state.pedagogy, { version: 1, topics: {} });
  const invalid = structuredClone(loaded.state);
  invalid.pedagogy.topics.bad = { revision: 1 };
  assert.ok(loadState({ getItem: () => JSON.stringify(invalid) }).warning);
});
test("El temario puede renombrarse y cambiar de revisión sin acoplar el motor a sus nombres", () => {
  const state = initialState();
  const topic = {
    ...structuredClone(curriculum.topics[0]),
    id: "nuevo-tema-editorial",
    title: "Otro título",
  };
  ready(state, topic);
  assert.equal(answer(state, topic, "foundation", "renamed").passed, true);
  const events = state.events.length;
  const p = topicProgress(state, { ...topic, revision: 2 });
  assert.equal(p.step, "introduction");
  assert.deepEqual(p.assessments, []);
  assert.equal(state.events.length, events);
});
