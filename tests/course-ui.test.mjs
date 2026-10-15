import test from "node:test";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
import { curriculum } from "../data/curriculum.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { initialState } from "../core/learning.mjs";
import { openCourse, contentBlocks } from "../ui/course.mjs";
const { window } = parseHTML(
  '<html><body><section id="host"></section><div id="toast"></div></body></html>',
);
Object.assign(globalThis, {
  window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  CustomEvent: window.CustomEvent,
});
window.scrollTo = () => {};
window.setTimeout = () => 1;
const host = window.document.querySelector("#host");
const bank = new Map(courseQuestionBank.map((q) => [q.id, q]));
function click(selector) {
  const b = host.querySelector(selector);
  assert.ok(b, selector);
  b.click();
}
function submit(form) {
  form.dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true }),
  );
}
function choose(input) {
  assert.ok(input);
  input.setAttribute("checked", "");
  input.checked = true;
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
}
for (const topic of curriculum.topics)
  test("Recorrido UI completo y reanudación: " + topic.title, () => {
    const state = initialState();
    let saves = 0;
    const open = () =>
      openCourse(
        host,
        curriculum,
        topic,
        courseQuestionBank,
        state,
        () => saves++,
        () => {},
        () => {},
      );
    open();
    assert.equal(host.querySelectorAll(".correction-card").length, 0);
    assert.equal(
      host
        .querySelector('[data-course-step="review"]')
        .hasAttribute("disabled"),
      true,
    );
    click("[data-course-next]");
    assert.equal(state.pedagogy.topics[topic.id].step, "concepts");
    open();
    assert.equal(state.pedagogy.topics[topic.id].step, "concepts");
    click("[data-course-next]");
    click("[data-course-next]");
    assert.equal(state.pedagogy.topics[topic.id].step, "exercise");
    for (const e of topic.exercises) {
      const form = host.querySelector('[data-exercise="' + e.id + '"]');
      if (e.type === "number")
        form.querySelector("input").value = String(e.answer);
      else choose(form.querySelector('input[value="' + e.answer + '"]'));
      submit(form);
    }
    click("[data-course-next]");
    assert.equal(state.pedagogy.topics[topic.id].step, "minitest");
    for (const a of topic.assessments) {
      assert.equal(host.querySelectorAll(".correction-card").length, 0);
      const form = host.querySelector("[data-course-quiz]");
      assert.ok(form);
      a.questionIds.forEach((id, i) =>
        choose(
          form.querySelector(
            'input[name="course-q-' +
              i +
              '"][value="' +
              bank.get(id).answer +
              '"]',
          ),
        ),
      );
      submit(form);
      const count = state.events.length;
      submit(form);
      assert.equal(state.events.length, count);
      assert.equal(
        host.querySelectorAll(".correction-card").length,
        a.questionIds.length,
      );
      if (a.id !== "exam") {
        click("[data-course-level]");
        open();
        assert.equal(host.querySelectorAll(".correction-card").length, 0);
      } else {
        open();
        assert.ok(host.querySelector(".correction-card"));
      }
    }
    click("[data-course-next]");
    assert.equal(state.pedagogy.topics[topic.id].step, "review");
    click("[data-course-review]");
    assert.equal(host.querySelectorAll(".correction-card").length, 0);
    const form = host.querySelector("[data-course-quiz]");
    [...host.querySelectorAll(".course-question")].forEach((card, i) => {
      const q = courseQuestionBank.find(
        (q) => q.prompt === card.querySelector("h3").textContent,
      );
      choose(
        form.querySelector(
          'input[name="course-q-' + i + '"][value="' + q.answer + '"]',
        ),
      );
    });
    submit(form);
    assert.ok(
      state.pedagogy.topics[topic.id].completedSteps.includes("review"),
    );
    assert.ok(saves >= 6);
  });
test("Los bloques de contenido escapan HTML y el motor visual no depende del título del tema", () => {
  const rendered = contentBlocks([
    { type: "text", title: "<script>", body: "<img src=x onerror=x>" },
    { type: "code", title: "SQL", body: "SELECT <texto>" },
  ]);
  assert.doesNotMatch(rendered, /<script>|<img/);
  assert.match(rendered, /&lt;script&gt;/);
  assert.match(rendered, /&lt;texto&gt;/);
});
