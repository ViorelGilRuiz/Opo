import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { verifiedQuestionBank } from "../data/official-catalog.mjs";
import { initialState } from "../core/learning.mjs";
import { selectOfficial80 } from "../core/official-exam.mjs";
import { startSession } from "../ui/session.mjs";
import { mountOfficialExam } from "../ui/official-exam.mjs";
import { loadState, saveState } from "../core/storage.mjs";
const { window } = parseHTML(
  '<html><body><div id="toast"></div><main id="host"></main></body></html>',
);
const { document } = window;
Object.assign(globalThis, {
  window,
  document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  CustomEvent: window.CustomEvent,
});
window.confirm = () => true;
window.setInterval = () => 1;
window.clearInterval = () => {};
window.setTimeout = () => 1;
window.scrollTo = () => {};
const desc = Object.getOwnPropertyDescriptor(
  window.HTMLSelectElement.prototype,
  "value",
);
Object.defineProperty(window.HTMLSelectElement.prototype, "value", {
  ...desc,
  set(value) {
    for (const option of this.querySelectorAll("option"))
      option.selected = false;
    const option = [...this.querySelectorAll("option")].find(
      (o) => o.value === value,
    );
    if (option) option.selected = true;
  },
});
const host = document.querySelector("#host");
const click = (selector) => {
  const button = host.querySelector(selector);
  assert.ok(button, selector);
  button.click();
};
test("Comodidad: letra grande y reloj se conservan al pausar; corrección ampliable", () => {
  const state = initialState();
  const questions = verifiedQuestionBank.slice(0, 2);
  let view = startSession(host, state, questions, "exam", () => {}, () => {});
  click('[data-action="text"]');
  click('[data-action="clock"]');
  assert.ok(host.querySelector('.reader-large'));
  assert.ok(host.querySelector('[data-clock]').hasAttribute('hidden'));
  const input = host.querySelector('input[value="' + questions[0].answer + '"]');
  input.dispatchEvent(new window.Event('change'));
  assert.match(host.querySelector('.quick-correction').textContent, /Qué recordar/);
  assert.equal(host.querySelector('.quick-correction details').hasAttribute('open'), false);
  click('[data-action="pause"]');
  view.dispose();
  assert.equal(state.draft.options.largeText, true);
  assert.equal(state.draft.options.hideClock, true);
  assert.equal(state.attempts.length, 0);
  view = startSession(host, state, questions, "exam", () => {}, () => {});
  assert.ok(host.querySelector('.reader-large'));
  assert.ok(host.querySelector('[data-clock]').hasAttribute('hidden'));
  click('[data-action="clock"]');
  assert.equal(host.querySelector('[data-clock]').hasAttribute('hidden'), false);
  view.dispose();
});

test("Nota en directo y corrección inmediata respetan la penalización y el borrador", () => {
  const state = initialState();
  const questions = verifiedQuestionBank.slice(0, 2);
  const view = startSession(host, state, questions, "exam", () => {}, () => {}, { penalty: 0.5 });
  const answer = (value) => {
    const input = host.querySelector('input[value="' + value + '"]');
    input.checked = true;
    input.dispatchEvent(new window.Event("change"));
  };
  answer(questions[0].answer);
  assert.match(host.querySelector('[data-live-score]').textContent, /5,00|5\.00/);
  assert.equal(host.querySelectorAll('.correction-card').length, 1);
  click('[data-action="next"]');
  answer((questions[1].answer + 1) % questions[1].options.length);
  assert.match(host.querySelector('[data-live-score]').textContent, /2,50|2\.50/);
  assert.equal(state.attempts.length, 0);
  click('[data-action="clear"]');
  assert.equal(host.querySelectorAll('.correction-card').length, 0);
  assert.match(host.querySelector('[data-live-score]').textContent, /5,00|5\.00/);
  click('[data-action="pause"]');
  view.dispose();
});
test("UI V3: informa de 53 Zaragoza y exige autorización antes de empezar 80 mixtas", () => {
  const state = initialState();
  let selected;
  mountOfficialExam(
    host,
    state,
    (questions, kind, options) => (selected = { questions, kind, options }),
  );
  const form = host.querySelector("form");
  assert.match(host.querySelector("[data-availability]").textContent, /53/);
  form.dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
  assert.equal(selected, undefined);
  assert.match(
    host.querySelector("[data-official80-error]").textContent,
    /necesitas 80/,
  );
  host.querySelector('[name="v3mixed"]').checked = true;
  host.querySelector('[name="v3minutes"]').value = "95";
  host.querySelector('[name="v3penalty"]').value = "0.25";
  form.dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
  assert.equal(selected.questions.length, 80);
  assert.equal(selected.options.budgetMs, 95 * 60000);
  assert.equal(selected.options.penalty, 0.25);
  assert.equal(selected.options.mode, "custom80");
  assert.equal(
    host.querySelectorAll(".historical-entry button[disabled]").length,
    3,
  );
});
test("Examen 80: soluciones ocultas, marcas, blancos, pausa/recarga, reloj y XP sin duplicación", () => {
  host.innerHTML = "";
  const state = initialState();
  const questions = selectOfficial80(verifiedQuestionBank, {
    track: "aragon-c1",
  }).questions;
  const options = {
    mode: "custom80",
    title: "80 oficiales",
    budgetMs: 95 * 60000,
    penalty: 0.25,
    rulesVerified: false,
  };
  let raw;
  const save = () => saveState({ setItem: (_, v) => (raw = v) }, state);
  let view = startSession(
    host,
    state,
    questions,
    "exam",
    save,
    () => {},
    options,
  );
  assert.equal(host.querySelectorAll("[data-go]").length, 80);
  assert.equal(host.querySelectorAll(".correction-card").length, 0);
  assert.match(host.querySelector("[data-clock]").textContent, /94:|95:/);
  click('[data-action="flag"]');
  const input = host.querySelector(
    'input[value="' + questions[0].answer + '"]',
  );
  input.checked = true;
  input.dispatchEvent(new window.Event("change"));
  click('[data-go="3"]');
  click('[data-action="pause"]');
  view.dispose();
  const restored = loadState({ getItem: () => raw }).state;
  assert.equal(restored.draft.current, 3);
  assert.equal(restored.draft.flags[0], true);
  assert.equal(restored.draft.picks[0], questions[0].answer);
  assert.equal(restored.draft.options.budgetMs, 95 * 60000);
  assert.equal(restored.xp, 0);
  view = startSession(
    host,
    restored,
    questions,
    "exam",
    () => {},
    () => {},
  );
  assert.equal(
    host.querySelector('[data-go="3"]').getAttribute("aria-current"),
    "step",
  );
  assert.equal(host.querySelectorAll(".correction-card").length, 0);
  window.confirm = () => false;
  click('[data-action="finish"]');
  assert.equal(restored.attempts.length, 0);
  window.confirm = () => true;
  click('[data-action="finish"]');
  assert.equal(restored.attempts.length, 1);
  assert.equal(restored.attempts[0].correct, 1);
  assert.equal(restored.attempts[0].blank, 79);
  assert.equal(restored.events.length, 80);
  assert.equal(host.querySelectorAll(".correction-card").length, 80);
  assert.match(
    host.textContent,
    /Nota de entrenamiento|no es una nota oficial/,
  );
  const xp = restored.xp;
  view.dispose();
  assert.equal(restored.xp, xp);
  assert.equal(restored.attempts.length, 1);
  assert.equal(restored.draft, undefined);
});
test("Confirmación también con todas respondidas; título de configuración escapa HTML", () => {
  const state = initialState();
  const questions = verifiedQuestionBank.slice(0, 1);
  let view = startSession(
    host,
    state,
    questions,
    "exam",
    () => {},
    () => {},
    { title: "<img src=x onerror=alert(1)>", penalty: 0.25 },
  );
  assert.equal(host.querySelector(".session-heading img"), null);
  const input = host.querySelector("input");
  input.checked = true;
  input.dispatchEvent(new window.Event("change"));
  window.confirm = () => false;
  click('[data-action="finish"]');
  assert.equal(state.attempts.length, 0);
  window.confirm = () => true;
  click('[data-action="finish"]');
  assert.equal(state.attempts.length, 1);
  view.dispose();
});
