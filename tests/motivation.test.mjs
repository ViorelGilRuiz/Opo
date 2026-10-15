import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  recordAnswer,
  dayKey,
  streak,
  DAY,
} from "../core/learning.mjs";
import {
  syncMotivation,
  motivationSnapshot,
  levelProgress,
  validMotivation,
} from "../core/motivation.mjs";
import { motivationConfig } from "../data/motivation.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { loadState, saveState } from "../core/storage.mjs";
const now = new Date(2026, 9, 7, 12).getTime();
const bank = courseQuestionBank;
function exam(state, id, score) {
  state.attempts.push({
    id,
    kind: "exam",
    questionIds: ["q"],
    picks: [0],
    at: now,
    elapsedMs: 100,
    correct: 1,
    wrong: 0,
    blank: 0,
    score,
    raw: score,
    percent: score * 10,
    direct: 1,
  });
}
test("Niveles coherentes y crecimiento continuo sin perder XP anteriores", () => {
  assert.equal(levelProgress(0).name, "Inicio");
  assert.equal(levelProgress(499).level, 1);
  assert.equal(levelProgress(500).name, "Base");
  assert.equal(levelProgress(1000).name, "Técnico");
  assert.equal(levelProgress(1500).name, "Especialista");
  assert.equal(levelProgress(2000).name, "Preparado");
  assert.equal(levelProgress(4000).level, 9);
  assert.equal(levelProgress(4000).remaining, 500);
});
test("Misiones diarias: recompensas únicas, idempotencia y nuevo día", () => {
  const state = initialState();
  syncMotivation(state, motivationConfig, now);
  for (let i = 0; i < 10; i++)
    recordAnswer(
      state,
      { ...bank[i], concept: "isolated-" + i },
      bank[i].answer,
      100,
      now,
    );
  const before = state.xp;
  const events = syncMotivation(state, motivationConfig, now);
  assert.ok(events.some((e) => e.kind === "mission"));
  assert.equal(state.xp, before + 20);
  const xp = state.xp;
  assert.deepEqual(syncMotivation(state, motivationConfig, now), []);
  assert.equal(state.xp, xp);
  for (let i = 0; i < 10; i++)
    recordAnswer(
      state,
      { ...bank[i], concept: "isolated-" + i },
      bank[i].answer,
      100,
      now + DAY,
    );
  const tomorrowXP = state.xp;
  syncMotivation(state, motivationConfig, now + DAY);
  assert.equal(state.xp, tomorrowXP + 20);
});
test("Errores antiguos: solo recuperaciones de días previos y preguntas distintas", () => {
  const state = initialState();
  for (let i = 0; i < 3; i++)
    recordAnswer(state, bank[i], (bank[i].answer + 1) % 4, 100, now - DAY);
  for (let i = 0; i < 3; i++)
    recordAnswer(state, bank[i], bank[i].answer, 100, now);
  recordAnswer(state, bank[0], bank[0].answer, 100, now);
  recordAnswer(state, bank[3], (bank[3].answer + 1) % 4, 100, now);
  recordAnswer(state, bank[3], bank[3].answer, 100, now);
  const mission = motivationSnapshot(
    state,
    motivationConfig,
    now,
  ).missions.find((m) => m.id === "recover");
  assert.equal(mission.value, 3);
  assert.ok(mission.completed);
});
test("Tiempo medido y minitest de redes usan evidencia; leer o un acierto no domina", () => {
  const state = initialState();
  recordAnswer(state, bank[0], bank[0].answer, 14 * 60000, now);
  let snap = motivationSnapshot(state, motivationConfig, now);
  assert.equal(snap.missions.find((m) => m.id === "minutes").completed, false);
  assert.equal(snap.missions.find((m) => m.id === "master").completed, false);
  recordAnswer(state, bank[1], bank[1].answer, 60000, now);
  snap = motivationSnapshot(state, motivationConfig, now);
  assert.equal(snap.missions.find((m) => m.id === "minutes").completed, true);
  state.pedagogy.topics.osi = {
    revision: 1,
    step: "minitest",
    completedSteps: [],
    exerciseAttempts: {},
    lastStudiedAt: now,
    reviewDueAt: 0,
    assessments: [
      {
        id: "test",
        level: "foundation",
        questionIds: [bank[0].id],
        picks: [bank[0].answer],
        at: now,
        passed: true,
        result: {
          correct: 1,
          wrong: 0,
          blank: 0,
          score: 10,
          raw: 10,
          percent: 100,
          direct: 1,
        },
      },
    ],
  };
  assert.ok(
    motivationSnapshot(state, motivationConfig, now).missions.find(
      (m) => m.id === "network",
    ).completed,
  );
});
test("Logros de dominio exigen todos los conceptos y preguntas distintas; se conserva el logro tras un fallo", () => {
  const state = initialState();
  const original = motivationConfig.topics.find((t) => t.id === "osi");
  const topic={...original,concepts:original.concepts.map(c=>({...c,questionIds:["tai-2024-0-0-72","tai-2024-0-0-58"]}))};
  const config={...motivationConfig,topics:[topic]};
  syncMotivation(state,config,now);
  const q = bank.find((q) => q.id === topic.concepts[0].questionIds[0]);
  for (let i = 0; i < 3; i++) recordAnswer(state, q, q.answer, 100, now);
  assert.equal(
    motivationSnapshot(state, config, now).achievements.find(
      (a) => a.id === "topic-osi",
    ).earned,
    false,
  );
  for (const c of topic.concepts)
    for (const id of [c.questionIds[0], c.questionIds[1], c.questionIds[0]]) {
      const q = bank.find((q) => q.id === id);
      recordAnswer(state, q, q.answer, 100, now);
    }
  syncMotivation(state, config, now);
  assert.ok(state.motivation.unlocked["topic-osi"]);
  recordAnswer(state, q, (q.answer + 1) % 4, 100, now);
  assert.ok(
    motivationSnapshot(state, config, now).achievements.find(
      (a) => a.id === "topic-osi",
    ).earned,
  );
  assert.equal(
    motivationSnapshot(state, config, now).topicMastery.find(
      (t) => t.id === "osi",
    ).mastered,
    false,
  );
});
test("Récord, nivel y racha se celebran una vez; entrenamiento no cuenta como simulacro", () => {
  const state = initialState();
  syncMotivation(state, motivationConfig, now);
  exam(state, "first", 5);
  syncMotivation(state, motivationConfig, now);
  exam(state, "second", 7);
  state.xp = 500;
  const changes = syncMotivation(state, motivationConfig, now);
  assert.ok(changes.some((e) => e.kind === "level"));
  assert.ok(changes.some((e) => e.kind === "record"));
  assert.deepEqual(syncMotivation(state, motivationConfig, now), []);
  const other = initialState();
  exam(other, "training", 10);
  other.attempts[0].kind = "training";
  assert.equal(
    motivationSnapshot(other, motivationConfig, now).achievements.find(
      (a) => a.id === "first-exam",
    ).earned,
    false,
  );
  for (let i = 0; i < 7; i++)
    other.days[dayKey(now - i * DAY)] = {
      answered: 1,
      correct: 1,
      minutes: 1,
      lessons: 0,
      exams: 0,
    };
  assert.equal(streak(other, now), 7);
  assert.ok(
    motivationSnapshot(other, motivationConfig, now).achievements.find(
      (a) => a.id === "streak-7",
    ).earned,
  );
});
test("Migración sin XP retrospectivo ni celebraciones masivas; persistencia y corrupción", () => {
  const state = initialState();
  for (let i = 0; i < 10; i++)
    recordAnswer(state, bank[i], bank[i].answer, 100, now);
  delete state.motivation;
  const loaded = loadState({ getItem: () => JSON.stringify(state) });
  assert.equal(loaded.warning, "");
  const before = loaded.state.xp;
  assert.deepEqual(syncMotivation(loaded.state, motivationConfig, now), []);
  assert.equal(loaded.state.xp, before);
  assert.ok(validMotivation(loaded.state.motivation));
  let raw;
  saveState({ setItem: (_, v) => (raw = v) }, loaded.state);
  assert.equal(loadState({ getItem: () => raw }).warning, "");
  assert.equal(
    validMotivation({ ...loaded.state.motivation, bestScore: NaN }),
    false,
  );
  loaded.state.motivation.version = 99;
  assert.ok(loadState({ getItem: () => JSON.stringify(loaded.state) }).warning);
});
test("100/500 preguntas y cinco simulacros: umbrales exactos", () => {
  const state = initialState();
  for (let i = 0; i < 499; i++)
    state.events.push({
      questionId: "q" + i,
      concept: "c",
      topic: "t",
      block: "II",
      category: "a",
      correct: false,
      blank: false,
      at: now,
      responseMs: 0,
    });
  let snap = motivationSnapshot(state, motivationConfig, now);
  assert.ok(snap.achievements.find((a) => a.id === "questions-100").earned);
  assert.equal(
    snap.achievements.find((a) => a.id === "questions-500").earned,
    false,
  );
  state.events.push({ ...state.events[0], questionId: "last" });
  for (let i = 0; i < 5; i++) exam(state, String(i), 5);
  snap = motivationSnapshot(state, motivationConfig, now);
  assert.ok(snap.achievements.find((a) => a.id === "questions-500").earned);
  assert.ok(snap.achievements.find((a) => a.id === "exams-5").earned);
});

test("La racha usa días naturales al cruzar el cambio de hora", () => {
  const state = initialState();
  const end = new Date(2026, 2, 31, 0, 30);
  for (let i = 0; i < 7; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    state.days[dayKey(d.getTime())] = {
      answered: 1,
      correct: 1,
      minutes: 1,
      lessons: 0,
      exams: 0,
    };
  }
  assert.equal(streak(state, end.getTime()), 7);
});
test("Minitest de Profesor de redes cuenta; ayudas no generan misión de dominio", () => {
  const state = initialState();
  state.teacher.attempts.push({
    id: "teacher-net",
    mode: "assessment",
    questionIds: ["tai-2024-0-0-72"],
    picks: [2],
    assistedQuestionIds: [],
    at: now,
    result: {
      correct: 1,
      wrong: 0,
      blank: 0,
      score: 10,
      raw: 10,
      percent: 100,
      direct: 1,
    },
  });
  const s = motivationSnapshot(state, motivationConfig, now);
  assert.ok(s.missions.find((m) => m.id === "network").completed);
  assert.equal(s.missions.find((m) => m.id === "master").completed, false);
});
