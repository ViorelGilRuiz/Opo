import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseHTML } from "linkedom";
import {courseQuestionBank,technicalTheoryQuestions as freshQuestions} from "../data/course-bank.mjs";
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const { window } = parseHTML(html);
const document = window.document;
const selectPrototype = window.HTMLSelectElement.prototype;
const valueDescriptor = Object.getOwnPropertyDescriptor(
  selectPrototype,
  "value",
);
Object.defineProperty(selectPrototype, "value", {
  ...valueDescriptor,
  set(value) {
    for (const option of this.querySelectorAll("option"))
      option.selected = option.value === value;
  },
});
const memory = new Map();
Object.assign(globalThis, {
  window,
  document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  CustomEvent: window.CustomEvent,
  localStorage: {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  },
});
window.confirm = () => true;
window.scrollTo = () => {};
window.setInterval = () => 1;
window.clearInterval = () => {};
window.setTimeout = () => 1;
await import("../ui/platform.mjs");
const host = document.querySelector("#learningPlatform");
function click(selector, root = document) {
  const el = root.querySelector(selector);
  assert.ok(el, "Existe " + selector);
  el.click();
}
function route(name) {
  click('[data-route="' + name + '"]');
}
test("Navegación: las siete secciones se pueden abrir sin excepciones", () => {
  for (const name of [
    "aprender",
    "practicar",
    "simulacro",
    "errores",
    "progreso",
    "temario",
    "inicio",
  ]) {
    route(name);
    assert.equal(
      document
        .querySelector('[data-route="' + name + '"]')
        .getAttribute("aria-current"),
      "page",
    );
  }
  assert.match(
    document.querySelector("#learningHome").textContent,
    /dos horas/i,
  );
});
test("Nuevo simulacro con corrección inmediata, marcar, responder y corregir blancos", () => {
  route("simulacro");
  click("[data-new]", host);
  assert.equal(host.querySelectorAll("[data-go]").length, 50);
  assert.equal(document.body.classList.contains("test-focus"),true);
  assert.equal(host.querySelectorAll(".correction-card").length, 0);
  click('[data-action="flag"]', host);
  assert.match(host.querySelector('[data-go="0"]').textContent, /⚑/);
  const prompt = host.querySelector("#learningQuestion").textContent;
  const q = courseQuestionBank.find((q) => q.prompt === prompt);
  const labels = [...host.querySelectorAll(".option-label")];
  const correct = labels.find((label) =>
    label.textContent.includes(q.options[q.answer]),
  );
  const radio = correct.querySelector("input");
  radio.checked = true;
  radio.setAttribute("checked", "");
  radio.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.equal(host.querySelectorAll(".correction-card").length, 1);
  click('[data-action="finish"]', host);
  assert.match(host.textContent, /Aciertos: 1/);
  assert.equal(document.body.classList.contains("test-focus"),false);
  assert.match(host.textContent, /En blanco: 49/);
  assert.equal(host.querySelectorAll(".correction-card").length, 50);
  assert.ok(memory.has("oposprint-learning-v2"));
  click("[data-filter]", host);
  assert.equal(host.querySelectorAll(".correction-card").length, 49);
  click("[data-exit]", host);
});
test("Lección en seis pasos: ejercicio y pregunta final actualizan aprendizaje", () => {
  route("aprender");
  click('[data-lesson="lesson-0"]', host);
  for (let i = 0; i < 5; i++) click("[data-next]", host);
  const radio = host.querySelector("input");
  radio.checked = true;
  radio.setAttribute("checked", "");
  click("[data-check]", host);
  assert.equal(host.querySelectorAll(".correction-card").length, 1);
  assert.match(host.textContent, /Lección completada/);
  click("[data-prev]", host);
  click("[data-next]", host);
  assert.equal(host.querySelectorAll(".correction-card").length, 1);
  const saved = JSON.parse(memory.get("oposprint-learning-v2"));
  assert.equal(saved.completedLessons.length, 1);
  click("[data-back]", host);
});
test("Buscador encuentra DNS y respeta textos que no existen", () => {
  route("temario");
  const input = host.querySelector("#topicSearch");
  input.value = "DNS";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.ok(host.querySelectorAll("[data-lesson]").length > 0);
  input.value = "zzzzzz";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.match(host.textContent, /No hay una lección/);
});
test("Examen histórico conserva contexto y fuentes sin plantillas visibles", () => {
  route("simulacro");
  const select = host.querySelector("#practicalChoice");
  select.querySelector("option").selected = true;
  click("[data-official]", host);
  assert.equal(host.querySelectorAll("[data-go]").length, 79);
  assert.equal(host.querySelectorAll(".correction-card").length, 0);
  assert.ok(host.querySelector('a[href^="/assets/exam-pages/"]'));
  assert.equal(host.querySelectorAll('a[href$=".pdf"]').length, 0);
  route("inicio");
});

test("Práctica inmediata: explicación, bloqueo de doble registro y resultado final", async () => {
  const { startSession } = await import("../ui/session.mjs");
  const { initialState } = await import("../core/learning.mjs");
  const state = initialState();
  let saves = 0;
  const session = startSession(
    host,
    state,
    freshQuestions.slice(0, 2),
    "practice",
    () => saves++,
    () => {},
  );
  const input = host.querySelector('input[value="0"]');
  input.setAttribute("checked", "");
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
  click('[data-action="check"]', host);
  assert.equal(host.querySelectorAll(".correction-card").length, 1);
  assert.equal(state.events.length, 1);
  click('[data-action="check"]', host);
  assert.equal(state.events.length, 1);
  click('[data-action="next"]', host);
  click('[data-action="finish"]', host);
  assert.equal(state.events.length, 2);
  assert.equal(state.attempts.length, 1);
  assert.ok(saves >= 2);
  session.dispose();
});

test("Tiempo agotado finaliza el examen automáticamente sin penalizar el blanco", async () => {
  const { startSession } = await import("../ui/session.mjs");
  const { initialState } = await import("../core/learning.mjs");
  const state = initialState();
  const previousNow = Date.now;
  const previousInterval = window.setInterval;
  let now = 1000000000;
  let tick;
  Date.now = () => now;
  window.setInterval = (callback) => {
    tick = callback;
    return 1;
  };
  try {
    const session = startSession(
      host,
      state,
      [freshQuestions[0]],
      "exam",
      () => {},
      () => {},
    );
    now += 50 * 60000;
    tick();
    assert.equal(state.attempts.length, 1);
    assert.equal(state.attempts[0].blank, 1);
    assert.equal(state.attempts[0].wrong, 0);
    assert.equal(session.isActive(), false);
  } finally {
    Date.now = previousNow;
    window.setInterval = previousInterval;
  }
});

test("Administración queda fuera de búsquedas y las preguntas técnicas siguen disponibles", () => {
  route("temario");
  const input = host.querySelector("#topicSearch");
  input.value = "Constitución";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(host.querySelector("[data-official-question]"),null);
  input.value="OSI";input.dispatchEvent(new window.Event("input",{bubbles:true}));
  assert.ok(host.querySelector("[data-official-question]"));
  click('[data-official-question="tai-2024-0-0-72"]', host);
  assert.equal(host.querySelectorAll(".correction-card").length, 0);
  assert.match(host.textContent, /OSI/);
  route("inicio");
});

test("Profesor integrado abre sobre la lección, cierra sin perderla y navega a su vista", async () => {
  route("aprender");
  click("[data-lesson]", host);
  const title = host.textContent;
  click("[data-teacher-lesson]", host);
  await new Promise(setImmediate);
  const dialog = document.querySelector("#teacherDialog");
  assert.ok(dialog.hasAttribute("open"));
  assert.ok(dialog.querySelector(".teacher-intro"));
  click("[data-close-teacher]");
  assert.equal(dialog.hasAttribute("open"), false);
  assert.equal(host.textContent, title);
  route("profesor");
  await new Promise(setImmediate);
  assert.ok(host.querySelector(".teacher-intro"));
  route("inicio");
  assert.equal(
    document.querySelector("#teacherModalContent").children.length,
    0,
  );
});

test("Entrenar ahora: selección en vivo, 20 correcciones, informe y nueva sesión protegida", async () => {
  const { trainingQuestions } = await import("../data/course-bank.mjs");
  route("practicar");
  click("[data-train-now]", host);
  for (let i = 0; i < 20; i++) {
    assert.equal(host.querySelectorAll(".correction-card").length, 0);
    const prompt = host.querySelector("#trainingQuestion").textContent;
    const q = trainingQuestions.find((q) => q.prompt === prompt);
    assert.ok(q);
    const input = host.querySelector('input[value="' + q.answer + '"]');
    input.dispatchEvent(new window.Event("change", { bubbles: true }));
    click("[data-training-check]", host);
    assert.equal(host.querySelectorAll(".correction-card").length, 1);
    click("[data-training-next]", host);
  }
  assert.match(host.textContent, /HOY HAS MEJORADO/);
  assert.equal(document.body.classList.contains("test-focus"),false);
  assert.match(host.textContent, /Recomendación para mañana/);
  const saved = JSON.parse(memory.get("oposprint-learning-v2"));
  assert.equal(saved.attempts.at(-1).kind, "training");
  assert.equal(saved.attempts.at(-1).correct, 20);
  click("[data-training-again]", host);
  assert.ok(host.querySelector("#trainingQuestion"));
  window.confirm = () => false;
  route("inicio");
  assert.ok(host.querySelector("#trainingQuestion"));
  window.confirm = () => true;
  route("inicio");
});

test("El entrenamiento aparece en el historial sin contar como simulacro ni otorgar su insignia", async () => {
  const { initialState } = await import("../core/learning.mjs");
  const { renderProgress } = await import("../ui/progress.mjs");
  const state = initialState();
  state.attempts.push({
    id: "train-only",
    kind: "training",
    questionIds: [],
    picks: [],
    at: Date.now(),
    elapsedMs: 0,
    correct: 0,
    wrong: 0,
    blank: 0,
    raw: 0,
    score: 10,
    percent: 0,
    direct: 0,
  });
  renderProgress(host, state, () => {});
  const card = [...host.querySelectorAll(".stat-card")].find(
    (card) =>
      card.querySelector(".stat-label")?.textContent ===
      "Simulacros completados",
  );
  assert.equal(card.querySelector(".stat-value").textContent, "0");
  assert.doesNotMatch(host.textContent, /Primer simulacro completo/);
  assert.match(host.textContent, /training/);
});

test("Misiones visibles, niveles con nombre y celebración discreta que puede cerrarse", async () => {
  route("inicio");
  const home = document.querySelector("#learningHome");
  assert.equal(home.querySelectorAll(".mission-card").length, 5);
  assert.match(home.textContent, /Nivel [0-9]+ —/);
  const action = home.querySelector("[data-mission-route]");
  assert.ok(action);
  const target = action.getAttribute("data-mission-route");
  action.click();
  assert.equal(
    document
      .querySelector('[data-route="' + target + '"]')
      .getAttribute("aria-current"),
    "page",
  );
  route("progreso");
  assert.equal(host.querySelectorAll(".achievement-card").length, 9);
  assert.equal(host.querySelectorAll(".level-track>div").length, 5);
  const { celebrate } = await import("../ui/motivation.mjs");
  celebrate([
    { kind: "level", title: "Nivel 2 — Base", detail: "Un paso más" },
  ]);
  const notice = document.querySelector("#milestoneToast");
  assert.equal(notice.getAttribute("role"), "status");
  assert.match(notice.textContent, /Base/);
  assert.ok(notice.classList.contains("visible"));
  notice.querySelector("button").click();
  assert.equal(notice.classList.contains("visible"), false);
});

test('Aragón: segundo ejercicio usa reserva 41, conserva diagramas y oculta soluciones',()=>{route('simulacro');const select=host.querySelector('#aragonExercise');select.querySelectorAll('option').forEach(o=>o.removeAttribute('selected'));select.querySelector('option[value="practice"]').setAttribute('selected','');click('[data-aragon]',host);assert.equal(host.querySelectorAll('[data-go]').length,40);assert.equal(host.querySelectorAll('.correction-card').length,0);assert.ok(host.querySelector('.official-context'));assert.match(host.querySelector('.official-context').textContent,/Aragón 2026/);route('inicio');});
test('Cuaderno de memoria integrado guarda una regla personal sin añadir XP',()=>{route('practicar');const trigger=document.createElement('button');trigger.setAttribute('data-memory-question','aragon-2026-240023-1-21');host.append(trigger);const before=JSON.parse(memory.get('oposprint-learning-v2')).xp;trigger.click();const dialog=document.querySelector('dialog[aria-label="Mi regla de memoria"]');assert.ok(dialog.hasAttribute('open'));dialog.querySelector('#memoryNote').value='PC = próxima instrucción';click('[data-save-note]',dialog);const saved=JSON.parse(memory.get('oposprint-learning-v2'));assert.equal(saved.notes['aragon-2026-240023-1-21'],'PC = próxima instrucción');assert.equal(saved.xp,before);assert.equal(dialog.hasAttribute('open'),false);route('inicio');});
test('Lección sin pregunta oficial tiene cierre de lectura sin fabricar ejercicio',()=>{route('aprender');click('[data-lesson="lesson-7"]',host);for(let i=0;i<5;i++)click('[data-next]',host);assert.equal(host.querySelector('input[type="radio"]'),null);assert.ok(host.querySelector('[data-read-complete]'));route('inicio');});

test('Itinerario TAI cambia el entrenamiento y persiste sin mezclar bancos',()=>{route('inicio');const selector=document.querySelector('#trackChoice');selector.querySelectorAll('option').forEach(o=>o.removeAttribute('selected'));selector.querySelector('option[value="tai"]').setAttribute('selected','');selector.dispatchEvent(new window.Event('change',{bubbles:true}));assert.equal(JSON.parse(memory.get('oposprint-learning-v2')).studyTrack,'tai');click('[data-home-review]');assert.ok(host.querySelector('#trainingQuestion'));const prompt=host.querySelector('#trainingQuestion').textContent;assert.ok(courseQuestionBank.some(q=>q.track==='tai'&&q.prompt===prompt));route('inicio');});

test('Zaragoza: 36 técnicas, tres opciones, pausa y reanudación conserva selección sin XP',()=>{route('simulacro');click('[data-zaragoza]',host);assert.equal(host.querySelectorAll('[data-go]').length,36);assert.equal(host.querySelectorAll('input[name="learningAnswer"]').length,3);assert.equal(host.querySelectorAll('.correction-card').length,0);const prompt=host.querySelector('#learningQuestion').textContent;const input=host.querySelector('input[name="learningAnswer"][value="1"]');input.checked=true;input.dispatchEvent(new window.Event('change',{bubbles:true}));const before=JSON.parse(memory.get('oposprint-learning-v2')).xp;click('[data-action="next"]',host);click('[data-action="pause"]',host);const paused=JSON.parse(memory.get('oposprint-learning-v2'));assert.equal(paused.draft.current,1);assert.equal(paused.draft.picks[0],1);assert.equal(paused.xp,before);assert.ok(document.querySelector('[data-resume]'));click('[data-resume]');assert.equal(host.querySelectorAll('[data-go]').length,36);click('[data-action="prev"]',host);assert.equal(host.querySelector('#learningQuestion').textContent,prompt);assert.ok(host.querySelector('input[value="1"]').hasAttribute('checked'));click('[data-action="finish"]',host);const finished=JSON.parse(memory.get('oposprint-learning-v2'));assert.equal(finished.draft,undefined);assert.match(host.textContent,/En blanco: 35/);route('inicio');});

test('Corrección: refuerzo enlazado abre oficiales diferentes del concepto',()=>{route('practicar');const trigger=document.createElement('button');trigger.setAttribute('data-reinforce-question','zaragoza-2026-1731-1-39');host.append(trigger);trigger.click();assert.equal(host.querySelectorAll('[data-go]').length,2);const prompt=host.querySelector('#learningQuestion').textContent;assert.ok(courseQuestionBank.some(q=>['aragon-2026-240023-1-30','zaragoza-2026-1731-1-38'].includes(q.id)&&q.prompt===prompt));assert.equal(host.querySelectorAll('.correction-card').length,0);route('inicio');});

