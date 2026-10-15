import test from "node:test";
import assert from "node:assert/strict";
import {
  createTeacherSession,
  validTeacherResponse,
  submitTeacherActivity,
  teacherModes,
  teacherLevels,
} from "../core/teacher.mjs";
import { createLocalTeacherProvider } from "../core/teacher-local.mjs";
import { initialState } from "../core/learning.mjs";
import { loadState, saveState } from "../core/storage.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { teacherNotes } from "../data/teacher-notes.mjs";
import { lessons } from "../data/active-lessons.mjs";
const provider = createLocalTeacherProvider(
  curriculum,
  courseQuestionBank,
  lessons,
  teacherNotes,
);
const request = (
  mode = "question",
  level = "normal",
  context = { topicId: "osi" },
  excludeQuestionIds = [],
) => ({ mode, level, context, excludeQuestionIds });
const respond = (r) =>
  provider.respond(r, { signal: new AbortController().signal });
test("Profesor: ocho temas, seis acciones y cuatro niveles con respuestas válidas", async () => {
  for (const topic of curriculum.topics)
    for (const mode of teacherModes)
      for (const level of teacherLevels) {
        const r = await respond(
          request(mode.id, level.id, { topicId: topic.id }),
        );
        assert.ok(validTeacherResponse(r), topic.id + mode.id + level.id);
        assert.notEqual(r.kind, "unavailable");
        if (r.kind === "explanation") assert.ok(r.blocks.length);
      }
});
test("OSI: propone otra oficial relacionada y avisa al agotar el banco", async () => {
  const r = await respond(
    request("question", "zero", { questionId: "tai-2024-0-0-72" }),
  );
  assert.equal(r.questions[0].question.id, "aragon-2026-240023-1-38");
  assert.equal(r.questions[0].hints.length, 2);
  const next = await respond(
    request("question", "normal", r.context, [r.questions[0].question.id,"tai-2024-0-0-58"]),
  );
  assert.equal(next.kind,"unavailable");
  const missing = await respond(
    request("easy", "normal", { topicId: "normativa-no-publicada" }),
  );
  assert.equal(missing.kind, "unavailable");
});
test("Ayuda no concede XP ni evidencia; respuesta autónoma sí, sin doble registro", async () => {
  const activity = await respond(request());
  const q = activity.questions[0].question;
  const state = initialState();
  assert.ok(
    submitTeacherActivity(
      state,
      activity,
      "question",
      [q.answer],
      [q.id],
      "help",
      100,
    ).ok,
  );
  assert.equal(state.xp, 0);
  assert.equal(state.events.length, 0);
  assert.ok(
    submitTeacherActivity(
      state,
      activity,
      "question",
      [q.answer],
      [],
      "alone",
      100,
    ).ok,
  );
  assert.equal(state.events.length, 1);
  assert.ok(state.xp > 0);
  assert.equal(
    submitTeacherActivity(
      state,
      activity,
      "question",
      [q.answer],
      [],
      "alone",
      100,
    ).ok,
    false,
  );
  assert.equal(state.events.length, 1);
  let raw;
  assert.ok(saveState({ setItem: (_, v) => (raw = v) }, state));
  assert.equal(
    loadState({ getItem: () => raw }).state.teacher.attempts.length,
    2,
  );
  const old = initialState();
  delete old.teacher;
  assert.equal(loadState({ getItem: () => JSON.stringify(old) }).warning, "");
  assert.equal(
    loadState({ getItem: () => JSON.stringify(old) }).state.teacher.level,
    "normal",
  );
});
test("Proveedor: ignora respuestas obsoletas y canceladas aunque no coopere con AbortSignal", async () => {
  const pending = [];
  const signals = [];
  const session = createTeacherSession({
    ...provider,
    respond: (_, { signal }) => {
      signals.push(signal);
      return new Promise((resolve) => pending.push(resolve));
    },
  });
  const a = session.ask(request("easy"));
  const b = session.ask(request("technical"));
  assert.ok(signals[0].aborted);
  const response = await respond(request("technical"));
  pending[1](response);
  assert.deepEqual(await b, response);
  pending[0](response);
  assert.equal(await a, null);
  const c = session.ask(request());
  session.dispose();
  pending[2](response);
  assert.equal(await c, null);
  assert.equal(await session.ask(request()), null);
});
test("Proveedor: rechaza contenido inválido y permite reintentar un error", async () => {
  let calls = 0;
  const good = await respond(request("easy"));
  const session = createTeacherSession({
    ...provider,
    respond: async () => {
      if (++calls === 1) throw new Error("offline");
      return good;
    },
  });
  await assert.rejects(session.ask(request()), /offline/);
  assert.ok(await session.ask(request()));
  const bad = createTeacherSession({
    ...provider,
    respond: async () => ({
      ...good,
      blocks: [{ type: "html", title: "bad", body: "<script>" }],
    }),
  });
  await assert.rejects(bad.ask(request()), /no válido/);
  assert.equal(
    validTeacherResponse({
      ...good,
      sources: [{ url: "javascript:alert(1)" }],
    }),
    false,
  );
});
