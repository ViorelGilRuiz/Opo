import test from "node:test";
import assert from "node:assert/strict";
import { initialState, recordAnswer, DAY } from "../core/learning.mjs";
import {
  createTraining,
  selectTrainingQuestion,
  answerTraining,
  trainingReport,
  trainingConfig,
} from "../core/training.mjs";
import { trainingQuestions } from "../data/course-bank.mjs";
const now = 2000000000000;
const q = (id, topic = id) => ({
  ...trainingQuestions[0],
  id,
  topic,
  concept: topic,
});
function next(state, bank, s, time = now) {
  const result = selectTrainingQuestion(state, bank, s, time);
  if (result) {
    s.selected.push(result.question);
    s.buckets.push(result.bucket);
  }
  return result;
}
test("Distribución 35/25/20/15/5 exacta cuando todos los grupos tienen candidatos", () => {
  const state = initialState(),
    bank = [];
  for (const group of ["weak", "recent", "spaced", "new", "retention"])
    for (let i = 0; i < 30; i++) {
      const question = q(group + i);
      bank.push(question);
      if (group === "weak")
        recordAnswer(
          state,
          question,
          (question.answer + 1) % 4,
          100,
          now - 10 * DAY,
        );
      if (group === "recent") {
        for (let j = 0; j < 8; j++)
          recordAnswer(
            state,
            question,
            question.answer,
            100,
            now - 2 * DAY + j,
          );
        recordAnswer(
          state,
          question,
          (question.answer + 1) % 4,
          100,
          now - 100,
        );
      }
      if (group === "spaced")
        for (let j = 0; j < 2; j++)
          recordAnswer(
            state,
            question,
            question.answer,
            100,
            now - 4 * DAY + j,
          );
      if (group === "retention")
        for (let j = 0; j < 4; j++)
          recordAnswer(state, question, question.answer, 100, now - 1000 + j);
    }
  const session = createTraining(state, { questionCooldown: 0 }, now);
  for (let i = 0; i < 20; i++) {
    const selected = next(state, bank, session);
    assert.ok(selected);
    answerTraining(state, session, selected.question.answer, 100, now);
  }
  assert.deepEqual(
    Object.fromEntries(
      ["weak", "recent", "spaced", "new", "retention"].map((b) => [
        b,
        session.buckets.filter((x) => x === b).length,
      ]),
    ),
    { weak: 7, recent: 5, spaced: 4, new: 3, retention: 1 },
  );
});
test("Determinista, independiente del orden del banco, sin duplicados y seguro con banco pequeño", () => {
  const bank = trainingQuestions.slice(0, 12);
  const a = initialState(),
    b = initialState();
  const sa = createTraining(a, {}, now),
    sb = createTraining(b, {}, now);
  for (let i = 0; i < 12; i++) {
    const qa = next(a, bank, sa),
      qb = next(b, [...bank].reverse(), sb);
    assert.equal(qa.question.id, qb.question.id);
    assert.equal(selectTrainingQuestion(a, bank, sa, now), null);
    answerTraining(a, sa, qa.question.answer, 100, now);
    answerTraining(b, sb, qb.question.answer, 100, now);
  }
  assert.equal(new Set(sa.selected.map((q) => q.id)).size, 12);
  assert.equal(next(a, bank, sa), null);
  assert.equal(next(a, [], createTraining(a)), null);
});
test("Errores suben presencia del tema y aciertos reducen progresivamente su presión", () => {
  const state = initialState();
  const bank = Array.from({ length: 10 }, (_, i) => q("dns" + i, "DNS")).concat(
    Array.from({ length: 10 }, (_, i) => q("sql" + i, "SQL")),
  );
  const s = createTraining(state, { maxTopicRun: 10 }, now);
  for (let i = 0; i < 3; i++) {
    s.selected.push(bank[i]);
    s.buckets.push("weak");
    answerTraining(state, s, (bank[i].answer + 1) % 4, 100, now);
  }
  assert.equal(s.pressure.DNS, 3);
  assert.equal(
    selectTrainingQuestion(state, bank, s, now).question.topic,
    "DNS",
  );
  for (let i = 3; i < 9; i++) {
    s.selected.push(bank[i]);
    s.buckets.push("weak");
    answerTraining(state, s, bank[i].answer, 100, now);
  }
  assert.ok(s.pressure.DNS < 1);
  assert.equal(
    selectTrainingQuestion(state, bank, s, now).question.topic,
    "SQL",
  );
});
test("Diversifica temas y evita las preguntas recientes entre sesiones", () => {
  const state = initialState();
  const bank = Array.from({ length: 10 }, (_, i) => q("a" + i, "A")).concat(
    Array.from({ length: 10 }, (_, i) => q("b" + i, "B")),
  );
  const s = createTraining(state, {}, now);
  s.pressure.A = 4;
  for (let i = 0; i < 8; i++) {
    const r = next(state, bank, s);
    answerTraining(state, s, r.question.answer, 100, now);
  }
  for (let i = 2; i < s.selected.length; i++)
    assert.ok(
      !(
        s.selected[i].topic === s.selected[i - 1].topic &&
        s.selected[i].topic === s.selected[i - 2].topic
      ),
    );
  const recent = state.events.slice(-6).map((e) => e.questionId);
  assert.ok(
    !recent.includes(
      selectTrainingQuestion(state, bank, createTraining(state), now).question
        .id,
    ),
  );
});
test("Un acierto no domina, informe muestra deltas reales y rechaza doble respuesta/config inválida", () => {
  const state = initialState(),
    session = createTraining(state, {}, now),
    bank = [q("dns", "DNS")];
  next(state, bank, session);
  assert.equal(answerTraining(state, session, bank[0].answer, 100, now), true);
  assert.equal(answerTraining(state, session, bank[0].answer, 100, now), false);
  assert.equal(state.questions.dns.mastered, false);
  const report = trainingReport(state, session);
  assert.equal(report.changes[0].delta, 33);
  assert.match(report.recommendation, /DNS/);
  assert.throws(() =>
    trainingConfig({
      weights: { weak: 0, recent: 0, spaced: 0, new: 0, retention: 0 },
    }),
  );
  assert.throws(() => trainingConfig({ count: 0 }));
  assert.equal(
    trainingReport(initialState(), createTraining(initialState())).changes
      .length,
    0,
  );
});
