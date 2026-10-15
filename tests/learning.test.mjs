import test from "node:test";
import assert from "node:assert/strict";
import { freshQuestions } from "../data/fresh-questions.mjs";
import { officialQuestions } from "../data/official-2024.mjs";
import { lessons } from "../data/lessons.mjs";
import { dailyPlan } from "../data/tracks.mjs";
import {
  initialState,
  recordAnswer,
  mastery,
  grade,
  selectQuestions,
  aggregate,
  officialSet,
  DAY,
  dayKey,
  streak,
  shuffleOptions,
} from "../core/learning.mjs";
import { loadState, saveState, LEARNING_KEY } from "../core/storage.mjs";
test("Nuevo examen: 50 inéditas, distribución, cuatro opciones y razones específicas", () => {
  assert.equal(freshQuestions.length, 50);
  const counts = {};
  for (const q of freshQuestions) {
    counts[q.category] = (counts[q.category] ?? 0) + 1;
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.rationales.length, 4);
    assert.ok(q.rationales.every((r) => r.length > 15));
    const shuffled = shuffleOptions(q);
    assert.equal(shuffled.options[shuffled.answer], q.options[q.answer]);
    assert.equal(shuffled.rationales[shuffled.answer], q.rationales[q.answer]);
  }
  assert.deepEqual(Object.values(counts), [10, 7, 7, 7, 6, 6, 4, 3]);
  assert.equal(new Set(freshQuestions.map((q) => q.id)).size, 50);
});
test("Puntuación: blancos no penalizan y un tercio exacto en oficial", () => {
  const qs = freshQuestions.slice(0, 3);
  const r = grade(qs, [0, 1, null]);
  assert.equal(r.correct, 1);
  assert.equal(r.wrong, 1);
  assert.equal(r.blank, 1);
  assert.ok(Math.abs(r.direct - 2 / 3) < 1e-10);
  assert.equal(grade(qs, [1, 1, 1]).score, 0);
  assert.equal(grade(qs, [0, 0, 0]).score, 10);
});
test("Modelo 2024: 135 preguntas, 4 anulaciones y reservas sustituyen en cada parte", () => {
  assert.equal(officialQuestions.length, 135);
  assert.equal(officialQuestions.filter((q) => q.answer === -1).length, 4);
  for (const q of officialQuestions) {
    assert.equal(q.options.length, 4);
    assert.ok(q.page >= 33 && q.page <= 46);
  }
  for (const choice of [1, 2]) {
    const qs = officialSet(officialQuestions, choice);
    assert.equal(qs.length, 100);
    assert.equal(qs.filter((q) => q.section === 0).length, 80);
    assert.equal(qs.filter((q) => q.section === choice).length, 20);
    assert.ok(qs.every((q) => q.answer >= 0));
    assert.equal(qs.filter((q) => q.section === 0 && q.reserve).length, 3);
    assert.equal(
      qs.filter((q) => q.section === choice && q.reserve).length,
      choice === 2 ? 1 : 0,
    );
  }
});
test("Los errores acercan el repaso y tres éxitos amplían intervalo; una respuesta no domina", () => {
  const state = initialState();
  const q = freshQuestions[0];
  const now = 1000000000;
  recordAnswer(state, q, 1, 2000, now);
  assert.equal(state.questions[q.id].dueAt, now + 600000);
  assert.equal(mastery(state.questions[q.id]).status, "REFORZAR");
  recordAnswer(state, q, 0, 3000, now + DAY);
  assert.notEqual(mastery(state.questions[q.id]).status, "DOMINADO");
  recordAnswer(state, q, 0, 3000, now + 2 * DAY);
  recordAnswer(state, q, 0, 3000, now + 3 * DAY);
  assert.equal(state.questions[q.id].dueAt, now + 10 * DAY);
  assert.equal(aggregate(state, "concept")[q.concept].attempts, 4);
  assert.equal(aggregate(state, "block")[q.block].totalResponseTime, 11000);
});
test("XP de acierto limitado por pregunta/día y dominio por concepto solo una vez", () => {
  const state = initialState();
  const q = freshQuestions[0];
  for (let i = 0; i < 3; i++) recordAnswer(state, q, 0, 1000, 1000);
  assert.equal(state.xp, 35);
  recordAnswer(state, q, 1, 1000, 1000);
  for (let i = 0; i < 8; i++) recordAnswer(state, q, 0, 1000, 1000);
  assert.equal(state.xp, 35);
  assert.equal(state.masteredConceptAwards.length, 1);
});
test("Adaptación filtra por fallos y no duplica preguntas en bancos pequeños", () => {
  const state = initialState();
  const q = freshQuestions[0];
  recordAnswer(state, q, 1, 1000);
  assert.deepEqual(
    selectQuestions(state, freshQuestions, { count: 50, mode: "errors" }).map(
      (q) => q.id,
    ),
    [q.id],
  );
  assert.equal(
    selectQuestions(state, freshQuestions, { count: 50, topic: "ICMP" }).length,
    1,
  );
  const adaptive = selectQuestions(state, freshQuestions, {
    count: 5,
    mode: "smart",
  });
  assert.equal(adaptive[0].id, q.id);
});
test("Persistencia valida datos, mantiene formato v2 y tolera bloqueo/corrupción", () => {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  };
  const state = initialState();
  recordAnswer(state, freshQuestions[0], 0, 1000);
  assert.equal(saveState(storage, state), true);
  assert.equal(loadState(storage).state.questions["nuevo-01"].attempts, 1);
  store.set(LEARNING_KEY, "{");
  assert.ok(loadState(storage).warning);
  assert.equal(store.get(LEARNING_KEY), "{");
  store.set(LEARNING_KEY, JSON.stringify({ ...state, events: [null] }));
  assert.ok(loadState(storage).warning);
  assert.equal(
    saveState(
      {
        setItem() {
          throw new Error("blocked");
        },
      },
      state,
    ),
    false,
  );
});
test("Plan de 120 minutos, lecciones vinculadas y racha por días reales", () => {
  assert.equal(
    dailyPlan.reduce((sum, s) => sum + s.minutes, 0),
    120,
  );
  assert.equal(lessons.length, 46);
  for (const l of lessons) {
    assert.ok(freshQuestions.find((q) => q.id === l.questionId));
    if (l.prerequisite) assert.ok(lessons.find((p) => p.id === l.prerequisite));
  }
  const state = initialState();
  const now = new Date(2026, 9, 7, 12).getTime();
  recordAnswer(state, freshQuestions[0], 0, 1000, now - DAY);
  recordAnswer(state, freshQuestions[1], 0, 1000, now);
  assert.equal(streak(state, now), 2);
  assert.equal(dayKey(now), "2026-10-07");
});

test("Todas las claves importadas coinciden con la plantilla definitiva de referencia", async () => {
  const { readFile } = await import("node:fs/promises");
  const fixture = JSON.parse(
    await readFile(
      new URL("./fixtures/tai-2024-answer-key.json", import.meta.url),
      "utf8",
    ),
  );
  for (const q of officialQuestions) {
    const section = fixture.sections[q.section * 2 + Number(q.reserve)];
    assert.equal(
      q.answer,
      section.find((k) => k.number === q.number).answer,
      q.id,
    );
  }
});
