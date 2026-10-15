import {technicalTheoryQuestions} from "../data/course-bank.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createContext, runInContext } from "node:vm";
const source = (await readFile(new URL("../app.js", import.meta.url), "utf8")).replace(/^import[^\n]+\n/,"");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
function setup(saved = null, blocked = false) {
  const elements = new Map();
  class Element {
    constructor() {
      this.textContent = "";
      this.innerHTML = "";
      this.style = {};
      this.listeners = {};
      this.classList = { add() {}, remove() {}, toggle() {} };
    }
    addEventListener(name, fn) {
      this.listeners[name] = fn;
    }
    setAttribute() {}
    querySelectorAll() {
      return [];
    }
    scrollIntoView() {}
  }
  const storage = new Map(
    saved === null ? [] : [["oposprint-history-v1", saved]],
  );
  const context = createContext({
    technicalTheoryQuestions,
    Element,
    document: {
      querySelector(selector) {
        const id = selector.split("#")[1];
        assert.ok(
          html.includes('id="' + id + '"'),
          "El elemento existe: " + selector,
        );
        if (!elements.has(id)) elements.set(id, new Element());
        return elements.get(id);
      },
      querySelectorAll() {
        return [];
      },
    },
    localStorage: {
      getItem: (key) => {
        if (blocked) throw new Error("Bloqueado");
        return storage.get(key) ?? null;
      },
      setItem: (key, value) => {
        if (blocked) throw new Error("Bloqueado");
        storage.set(key, value);
      },
    },
    window: {
      scrollTo() {},
      clearTimeout() {},
      setTimeout() {},
      confirm: () => true,
    },
    console: { error() {} },
  });
  runInContext(source, context);
  return {
    context,
    elements,
    storage,
    execute: (code) => runInContext(code, context),
  };
}
test("Banco de 50 preguntas válido y opciones mezcladas sin alterar la respuesta", () => {
  const app = setup();
  app.execute("startExam()");
  assert.equal(app.execute("attemptQuestions.length"), 50);
  assert.equal(
    app.execute("new Set(attemptQuestions.map(q => q.sourceIndex)).size"),
    50,
  );
  assert.equal(
    app.execute(
      "attemptQuestions.every(q => [3,4].includes(q.options.length) && q.options[q.answer] === questions[q.sourceIndex].options[questions[q.sourceIndex].answer])",
    ),
    true,
  );
});
test("Finalizar un pleno muestra resultados, guarda historial y permite filtrar", () => {
  const app = setup();
  app.execute(
    "startExam(); answers = attemptQuestions.map(q => q.answer); finishExam()",
  );
  assert.equal(app.elements.get("resultScore").textContent, "10,00");
  assert.equal(
    JSON.parse(app.storage.get("oposprint-history-v1"))[0].correct,
    50,
  );
  app.execute("renderCorrections(true)");
  assert.match(
    app.elements.get("correctionsList").innerHTML,
    /No tienes fallos/,
  );
  const reloaded = setup(app.storage.get("oposprint-history-v1"));
  assert.equal(reloaded.elements.get("attemptCount").textContent, "1");
});
test("Fallos: penalización, corrección y prioridad en el siguiente intento", () => {
  const app = setup();
  app.execute(
    "startExam(); let misses = 0; answers = attemptQuestions.map(q => q.options.length === 4 && misses++ < 10 ? (q.answer + 1) % q.options.length : q.answer); finishExam()",
  );
  assert.equal(app.elements.get("resultScore").textContent, "7,34");
  assert.match(app.elements.get("nextStepTitle").textContent, /Toca afianzar/);
  app.execute("renderCorrections(true)");
  assert.equal(
    (
      app.elements.get("correctionsList").innerHTML.match(/correction-card/g) ||
      []
    ).length,
    10,
  );
  app.execute("startExam()");
  assert.equal(
    app.execute(
      "readHistory()[0].missedTopics.includes(attemptQuestions[0].topic)",
    ),
    true,
  );
});
test("Un examen incompleto no crea historial", () => {
  const app = setup();
  app.execute("startExam(); finishExam()");
  assert.equal(app.storage.size, 0);
});
test("Historial corrupto o almacenamiento bloqueado no impiden entrenar", () => {
  for (const value of [
    "{",
    "{}",
    '[{"score":8,"correct":40,"missedTopics":[null]}]',
  ])
    assert.equal(setup(value).execute("readHistory().length"), 0);
  const app = setup(null, true);
  app.execute(
    "startExam(); answers = attemptQuestions.map(q => q.answer); finishExam()",
  );
  assert.equal(app.elements.get("resultScore").textContent, "10,00");
});
test("Borrar historial actualiza el panel", () => {
  const app = setup();
  app.execute(
    "startExam(); answers = attemptQuestions.map(q => q.answer); finishExam()",
  );
  app.elements.get("resetProgress").listeners.click();
  assert.equal(app.elements.get("attemptCount").textContent, "0");
});

test('Interfaz anterior: tres opciones y penalización Zaragoza coherente',()=>{const app=setup();app.execute('startExam(); attemptQuestions=questions.filter(q=>q.options.length===3).slice(0,20);answers=attemptQuestions.map((q,i)=>i<4?(q.answer+1)%3:q.answer);finishExam()');assert.equal(app.elements.get('resultScore').textContent,'7,00');});
