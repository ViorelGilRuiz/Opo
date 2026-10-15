import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { mountTeacher } from "../ui/teacher.mjs";
import { createLocalTeacherProvider } from "../core/teacher-local.mjs";
import { initialState } from "../core/learning.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { teacherNotes } from "../data/teacher-notes.mjs";
import { lessons } from "../data/active-lessons.mjs";
const { window } = parseHTML(
  '<html><body><main id="host"></main></body></html>',
);
Object.assign(globalThis, {
  window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
});
// Linkedom exposes select.value as a getter only; model the browser setter.
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
const host = window.document.querySelector("#host");
const bank = courseQuestionBank;
const provider = createLocalTeacherProvider(
  curriculum,
  bank,
  lessons,
  teacherNotes,
);
const settle = () => new Promise(setImmediate);
async function click(selector) {
  const b = host.querySelector(selector);
  assert.ok(b, selector);
  b.click();
  await settle();
}
function answerAll() {
  for (const card of host.querySelectorAll(".teacher-question")) {
    const q = bank.find(
      (q) => q.prompt === card.querySelector("h2").textContent,
    );
    const input = card.querySelector('input[value="' + q.answer + '"]');
    input.checked = true;
    input.dispatchEvent(new window.Event("change", { bubbles: true }));
  }
}
function submit() {
  host
    .querySelector("form")
    .dispatchEvent(
      new window.Event("submit", { bubbles: true, cancelable: true }),
    );
}
test("Profesor UI: pistas progresivas, solución protegida y respuesta asistida", async () => {
  const state = initialState();
  const view = mountTeacher(host, provider, state, () => {}, {
    questionId: "tai-2024-0-0-72",
  });
  await settle();
  assert.equal(host.querySelectorAll("[data-teacher-mode]").length, 6);
  assert.equal(host.querySelector("[data-teacher-level]").children.length, 4);
  assert.equal(host.querySelectorAll('[data-teacher-next]').length, 4);
  await click('[data-teacher-next="question"]');
  assert.match(host.textContent, /ARP/);
  assert.equal(host.querySelector(".teacher-solution"), null);
  assert.ok(
    host.querySelector("[data-teacher-solution]").hasAttribute("disabled"),
  );
  await click("[data-teacher-hint]");
  assert.ok(
    host.querySelector("[data-teacher-solution]").hasAttribute("disabled"),
  );
  await click("[data-teacher-hint]");
  await click("[data-teacher-solution]");
  assert.match(host.querySelector(".teacher-solution").textContent, /ARP|Address|física|MAC/);
  answerAll();
  submit();
  assert.equal(state.teacher.attempts.length, 1);
  assert.equal(state.events.length, 0);
  assert.ok(host.querySelector(".correction-card"));
  assert.equal(host.querySelector("[data-teacher-question]"), null);
  await click("[data-teacher-zero]");
  assert.equal(state.teacher.level, "zero");
  assert.equal(host.querySelector(".correction-card"), null);
  view.dispose();
  assert.equal(host.children.length, 0);
});
test("Profesor UI: mini examen no muestra pistas ni soluciones y exige responder", async () => {
  const state = initialState();
  const view = mountTeacher(host, provider, state, () => {});
  await settle();
  await click('[data-teacher-mode="assessment"]');
  const count = host.querySelectorAll(".teacher-question").length;
  assert.ok(count > 1);
  assert.equal(host.querySelector("[data-teacher-hint]"), null);
  assert.equal(host.querySelector(".correction-card"), null);
  submit();
  assert.equal(state.teacher.attempts.length, 0);
  answerAll();
  submit();
  assert.equal(state.teacher.attempts.length, 1);
  assert.equal(state.events.length, count);
  assert.equal(host.querySelectorAll(".correction-card").length, count);
  view.dispose();
});
test("Profesor UI: fallo recuperable y desmontaje sin respuesta tardía", async () => {
  let resolve;
  const view = mountTeacher(
    host,
    { ...provider, respond: () => new Promise((r) => (resolve = r)) },
    initialState(),
    () => {},
  );
  view.dispose();
  resolve(
    await provider.respond(
      {
        context: { topicId: "osi" },
        mode: "easy",
        level: "normal",
        excludeQuestionIds: [],
      },
      { signal: new AbortController().signal },
    ),
  );
  await settle();
  assert.equal(host.children.length, 0);
  let first = true;
  const retry = mountTeacher(
    host,
    {
      ...provider,
      respond: async (r, o) => {
        if (first) {
          first = false;
          throw new Error("offline");
        }
        return provider.respond(r, o);
      },
    },
    initialState(),
    () => {},
  );
  await settle();
  assert.ok(host.querySelector("[data-teacher-retry]"));
  await click("[data-teacher-retry]");
  assert.ok(host.querySelector(".teacher-intro"));
  retry.dispose();
});
