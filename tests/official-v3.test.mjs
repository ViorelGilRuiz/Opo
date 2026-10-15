import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  verifiedQuestionBank,
  isVerifiedOfficialQuestion,
  zaragozaHistoricalSet,
  historicalExams,
} from "../data/official-catalog.mjs";
import {
  selectOfficial80,
  eligibleOfficialQuestions,
  validSessionOptions,
} from "../core/official-exam.mjs";
import {
  validateOfficialImport,
  compareOfficialTranscripts,
} from "../core/official-import.mjs";
import { initialState, grade } from "../core/learning.mjs";
import { validDraft, resumableQuestions } from "../core/session-draft.mjs";
import { loadState, saveState } from "../core/storage.mjs";
import { examAnalysis } from "../core/exam-analysis.mjs";
import {
  createTraining,
  selectTrainingQuestion,
  answerTraining,
} from "../core/training.mjs";
const bank = verifiedQuestionBank;
test("V3: 301 válidas, procedencia, hashes y 39 nuevas disponibles sin modificar IDs técnicos", async () => {
  assert.equal(bank.length, 301);
  assert.deepEqual(
    ["zaragoza-c1", "aragon-c1", "tai"].map(
      (track) => bank.filter((q) => q.track === track).length,
    ),
    [53, 117, 131],
  );
  assert.equal(bank.filter((q) => q.block === "I").length, 39);
  assert.equal(new Set(bank.map((q) => q.id)).size, 301);
  assert.ok(bank.every(isVerifiedOfficialQuestion));
  const hash = createHash("sha256")
    .update(
      await readFile(
        new URL("../test-corregido-tai-tl-2026-04-20.pdf", import.meta.url),
      ),
    )
    .digest("hex");
  assert.equal(
    bank.find((q) => q.track === "tai").provenance.documentHash,
    hash,
  );
  const refs = JSON.parse(
    await readFile(
      new URL("fixtures/zaragoza-law-2026.json", import.meta.url),
      "utf8",
    ),
  );
  for (const r of refs) {
    const q = bank.find((q) => q.id === r.id);
    assert.equal(q.answer, r.answer);
    assert.equal(q.prompt, r.prompt);
    assert.deepEqual(q.options, r.options);
  }
  assert.equal(
    bank.find((q) => q.id.endsWith("1-R5") && q.track === "zaragoza-c1").answer,
    1,
  );
});
test("80 estrictas: aleatorias, únicas y opciones originales intactas", () => {
  for (let n = 0; n < 40; n++) {
    const r = selectOfficial80(bank, { track: "aragon-c1" });
    assert.equal(r.error, "");
    assert.equal(r.questions.length, 80);
    assert.equal(new Set(r.questions.map((q) => q.id)).size, 80);
    assert.ok(
      r.questions.every(
        (q) => q.track === "aragon-c1" && isVerifiedOfficialQuestion(q),
      ),
    );
    for (const q of r.questions)
      assert.deepEqual(q.options, bank.find((x) => x.id === q.id).options);
  }
  const a = selectOfficial80(bank, {}, () => 0.1);
  const b = selectOfficial80(bank, {}, () => 0.9);
  assert.notDeepEqual(
    a.questions.map((q) => q.id),
    b.questions.map((q) => q.id),
  );
});
test("80: insuficiencia sin mezcla automática; mixto autorizado conserva todas las Zaragoza disponibles", () => {
  const own = selectOfficial80(bank, { track: "zaragoza-c1" });
  assert.equal(own.available, 53);
  assert.equal(own.questions.length, 0);
  assert.match(own.error, /necesitas 80/);
  const mixed = selectOfficial80(bank, {
    track: "zaragoza-c1",
    allowMixed: true,
  });
  assert.equal(mixed.questions.length, 80);
  assert.equal(
    mixed.questions.filter((q) => q.track === "zaragoza-c1").length,
    53,
  );
  assert.equal(mixed.mixed, true);
  const law = selectOfficial80(bank, { scope: "law", allowMixed: true });
  assert.equal(law.questions.length, 0);
  assert.equal(law.available, 39);
});
test("Filtros y rechazo de falsas oficiales, anuladas, opciones alteradas y metadatos falsos", () => {
  const q = bank[0];
  for (const fake of [
    { ...q, id: "fake" },
    { ...q, block: "I" },
    { ...q, category: "Inventada" },
    { ...q, answer: -1 },
    { ...q, answer: (q.answer + 1) % 3 },
    { ...q, prompt: q.prompt + "?" },
    { ...q, options: [...q.options].reverse() },
    {
      ...q,
      provenance: {
        ...q.provenance,
        documentUrl: "https://academia.example/exam.pdf",
      },
    },
  ])
    assert.equal(isVerifiedOfficialQuestion(fake), false);
  assert.equal(eligibleOfficialQuestions([...bank, ...bank]).length, 301);
  assert.ok(
    eligibleOfficialQuestions(bank, { scope: "technical" }).every(
      (q) => q.block !== "I",
    ),
  );
  assert.ok(
    eligibleOfficialQuestions(bank, {
      category: q.category,
      topic: q.topic,
    }).every((x) => x.category === q.category && x.topic === q.topic),
  );
  assert.equal(selectOfficial80([]).questions.length, 0);
});
test("Histórico Zaragoza: orden, sustitutas, 50 válidas sin otras reservas y baremo pendiente explícito", () => {
  const qs = zaragozaHistoricalSet();
  assert.equal(qs.length, 50);
  assert.equal(qs[14].number, 51);
  assert.equal(qs[15].number, 52);
  for (let i = 0; i < 50; i++)
    assert.equal(qs[i].number, i === 14 ? 51 : i === 15 ? 52 : i + 1);
  assert.ok(qs.every((q) => q.track === "zaragoza-c1"));
  assert.ok(historicalExams.every((e) => !e.rulesVerified && e.missing.length));
});
test("Baremos seleccionados: puntuación directa, blancos y normalización sobre 10", () => {
  const qs = bank.slice(0, 4);
  const picks = [qs[0].answer, (qs[1].answer + 1) % 3, null, qs[3].answer];
  assert.equal(grade(qs, picks, 0.25).direct, 1.75);
  assert.equal(grade(qs, picks, 0.25).score, 4.375);
  assert.equal(grade(qs, picks, 0).direct, 2);
});
test("Configuración V3 persiste sin alterar progreso anterior y rechaza tiempo/baremo corruptos", () => {
  const state = initialState();
  state.xp = 123;
  const qs = selectOfficial80(bank).questions;
  state.draft = {
    kind: "exam",
    createdAt: 100,
    current: 3,
    elapsedMs: 500,
    questionIds: qs.map((q) => q.id),
    picks: qs.map(() => null),
    flags: qs.map(() => false),
    recorded: qs.map(() => false),
    durations: qs.map(() => 0),
    options: {
      title: "80 oficiales",
      mode: "custom80",
      budgetMs: 90 * 60000,
      penalty: 0.25,
      rulesVerified: false,
    },
  };
  let raw;
  saveState({ setItem: (_, v) => (raw = v) }, state);
  const restored = loadState({ getItem: () => raw });
  assert.equal(restored.warning, "");
  assert.equal(restored.state.xp, 123);
  assert.deepEqual(restored.state.draft, state.draft);
  assert.equal(resumableQuestions(restored.state.draft, bank).length, 80);
  assert.equal(
    validDraft({ ...state.draft, options: { budgetMs: -1 } }),
    false,
  );
  assert.equal(validSessionOptions({ rulesVerified: true }), false);
  assert.equal(validSessionOptions({ penalty: NaN }), false);
  const old = initialState();
  old.xp = 456;
  saveState({ setItem: (_, v) => (raw = v) }, old);
  assert.equal(loadState({ getItem: () => raw }).state.xp, 456);
});
test("Entrenamiento 20/40/80: sin duplicados, respuestas reales e índices de opción válidos", () => {
  for (const count of [20, 40, 80]) {
    const state = initialState();
    const session = createTraining(state, { count });
    while (true) {
      const selection = selectTrainingQuestion(state, bank, session);
      if (!selection) break;
      session.selected.push(selection.question);
      session.buckets.push(selection.bucket);
      assert.equal(
        answerTraining(state, session, selection.question.answer, 100),
        true,
      );
    }
    assert.equal(session.picks.length, count);
    assert.equal(new Set(session.selected.map((q) => q.id)).size, count);
    assert.equal(state.events.length, count);
  }
  const state = initialState();
  const session = createTraining(state);
  session.selected.push(bank[0]);
  assert.equal(answerTraining(state, session, 3, 10), false);
});
test("Importador: JSON inválido, fuentes de academia, hashes, duplicados y referencia diferente rechazados", () => {
  assert.ok(validateOfficialImport(null).length);
  assert.ok(validateOfficialImport({ documents: "invalid" }).length);
  const q = bank[0];
  const doc = {
    id: "exam",
    url: q.provenance.documentUrl,
    sha256: q.provenance.documentHash,
    kind: "questionnaire",
    localFile: "tmp/exam.pdf",
  };
  const pack = {
    version: 1,
    administration: "Ayuntamiento de Zaragoza",
    body: "C1",
    call: "1731",
    year: 2026,
    documents: [doc, { ...doc, id: "key", kind: "definitive-key" }],
    questions: [q],
  };
  assert.deepEqual(validateOfficialImport(pack), []);
  assert.ok(
    validateOfficialImport({
      ...pack,
      documents: [{ ...doc, url: "https://academia.example/exam.pdf" }],
    }).length,
  );
  assert.ok(validateOfficialImport({ ...pack, questions: [q, q] }).length);
  assert.ok(
    compareOfficialTranscripts(
      [q],
      [{ ...q, options: [...q.options].reverse() }],
    ).length,
  );
  assert.deepEqual(compareOfficialTranscripts([q], [q]), []);
});
test("Estadísticas: temas, errores recurrentes y comparación sin atribuir comprensión a lectura", () => {
  const state = initialState();
  const qs = bank.slice(0, 2);
  const picks = [qs[0].answer, null];
  const attempt = {
    id: "a",
    kind: "exam",
    questionIds: qs.map((q) => q.id),
    picks,
    at: 1,
    elapsedMs: 100,
    ...grade(qs, picks),
    sessionOptions: { mode: "custom80", penalty: 0.25 },
  };
  state.attempts.push({ ...attempt, id: "previous", score: 2 }, attempt);
  const report = examAnalysis(state, qs, attempt);
  assert.equal(report.previous.id, "previous");
  assert.equal(
    report.topics.reduce((n, r) => n + r.total, 0),
    2,
  );
  assert.ok(report.knowledge.every((c) => c.status !== "DOMINADO"));
  assert.equal(report.recurrent.length, 0);
});
