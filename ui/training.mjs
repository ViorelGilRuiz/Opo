import { recallMarkup } from "./recall.mjs";
import { officialContext } from "./components.mjs";
import {
  createTraining,
  selectTrainingQuestion,
  answerTraining,
  trainingReport,
} from "../core/training.mjs";
import { grade } from "../core/learning.mjs";
import { esc, el, correction, number } from "./components.mjs";
/** @import {LearningState,Question} from '../core/types.js' */
/** @param {HTMLElement} host @param {LearningState} state @param {Question[]} bank @param {()=>void} save @param {()=>void} exit @param {number} [count] */
export function startTraining(host, state, bank, save, exit, count = 20) {
  /** @type {ReturnType<typeof startTraining>|null} */ let child = null;
  document.body.classList.add("test-focus");
  const session = createTraining(state, { count });
  let entered = Date.now();
  let pick = /** @type {number|null} */ (null);
  let answered = false;
  function next() {
    const selection = selectTrainingQuestion(state, bank, session);
    if (!selection) {
      finish();
      return;
    }
    session.selected.push(selection.question);
    session.buckets.push(selection.bucket);
    entered = Date.now();
    pick = null;
    answered = false;
    render();
  }
  function render() {
    const q = session.selected.at(-1);
    if (!q || session.closed) return;
    host.innerHTML =
      '<div class="session-status"><div class="session-heading"><button class="back-button" data-training-exit>← Salir</button><h1>Entrenamiento inteligente</h1><span>' +
      session.selected.length +
      "/" +
      session.config.count +
      '</span></div><p>La siguiente pregunta se elige después de tu respuesta.</p><progress max="' +
      session.config.count +
      '" value="' +
      session.picks.length +
      '" aria-label="Respuestas corregidas"></progress></div><section class="question-panel"><p class="eyebrow">' +
      esc(q.topic) +
      " · " +
      esc(q.difficulty) +
      "</p>" +
      (q.examSet === "tai-2024"
        ? "<details><summary>Contexto histórico</summary><p>" +
          esc(q.context ?? "") +
          "</p></details>"
        : "") +
      officialContext(q) +
      '<h2 id="trainingQuestion">' +
      esc(q.prompt) +
      '</h2><fieldset class="options-list"><legend class="sr-only">Elige tu respuesta</legend>' +
      q.options
        .map(
          (o, i) =>
            '<label class="option-label ' +
            (answered
              ? i === q.answer
                ? "answer-correct"
                : i === pick
                  ? "answer-wrong"
                  : ""
              : "") +
            '"><input type="radio" name="trainingAnswer" value="' +
            i +
            '" ' +
            (pick === i ? "checked " : "") +
            (answered ? "disabled" : "") +
            '><span class="option-letter">' +
            "ABCD"[i] +
            '</span><span class="option-text">' +
            esc(o) +
            "</span></label>",
        )
        .join("") +
      "</fieldset>" +
      (answered
        ? correction(q, pick) +
          '<button class="primary-button" data-training-next>' +
          (session.picks.length >= session.config.count
            ? "Ver mi progreso"
            : "Siguiente pregunta →") +
          "</button>"
        : '<div class="panel-actions"><button class="primary-button" data-training-check>Comprobar y aprender</button><button class="secondary-button" data-training-blank>No lo sé</button></div>') +
      '<div class="finish-wrap"><button class="finish-button" data-training-finish>Terminar entrenamiento</button></div></section>';
    host.querySelectorAll("input").forEach((input) =>
      input.addEventListener("change", () => {
        pick = Number(input.getAttribute("value"));
        host
          .querySelectorAll(".option-label")
          .forEach((label, i) =>
            label.classList.toggle("selected", i === pick),
          );
      }),
    );
    const check = () => {
      if (pick === null) return;
      if (answerTraining(state, session, pick, Date.now() - entered)) {
        answered = true;
        save();
        render();
      }
    };
    host
      .querySelector("[data-training-check]")
      ?.addEventListener("click", check);
    host
      .querySelector("[data-training-blank]")
      ?.addEventListener("click", () => {
        if (answerTraining(state, session, null, Date.now() - entered)) {
          pick = null;
          answered = true;
          save();
          render();
        }
      });
    host.querySelector("[data-training-next]")?.addEventListener("click", next);
    el(host, "[data-training-finish]").onclick = finish;
    el(host, "[data-training-exit]").onclick = () => {
      if (
        !window.confirm("Salir conserva las respuestas ya corregidas. ¿Salir?")
      )
        return;
      session.closed = true;
      document.body.classList.remove("test-focus");
      exit();
    };
  }
  function finish() {
    if (session.closed) return;
    session.closed = true;
    document.body.classList.remove("test-focus");
    const questions = session.selected.slice(0, session.picks.length);
    const report = trainingReport(state, session);
    const result = grade(questions, session.picks);
    if (questions.length) {
      state.attempts.push({
        id: "training-" + session.started,
        kind: "training",
        questionIds: questions.map((q) => q.id),
        picks: [...session.picks],
        optionOrders: questions.map((q) => [...q.options]),
        at: Date.now(),
        elapsedMs: Date.now() - session.started,
        ...result,
      });
      save();
    }
    host.innerHTML =
      '<section class="analysis-card"><p class="eyebrow">ENTRENAMIENTO COMPLETADO</p><h1>HOY HAS MEJORADO</h1><p>' +
      questions.length +
      " preguntas corregidas · " +
      result.correct +
      " aciertos · " +
      result.wrong +
      " fallos · " +
      result.blank +
      ' en blanco</p><p>Variación del índice de aprendizaje (0–100) durante esta sesión; no son puntos de nota oficial.</p><div class="daily-grid">' +
      report.changes
        .filter((x) => x.delta > 0)
        .map(
          (x) =>
            "<article><b>" +
            esc(x.topic) +
            "</b><strong>+" +
            x.delta +
            "</strong><span>" +
            x.before +
            " → " +
            x.after +
            "</span></article>",
        )
        .join("") +
      "</div>" +
      (!report.changes.some((x) => x.delta > 0)
        ? "<p>No hay una mejora positiva medible todavía. Los errores ya orientan tu próximo entrenamiento.</p>"
        : "") +
      "<details><summary>Ver todas las variaciones</summary>" +
      report.changes
        .map(
          (x) =>
            "<p>" +
            esc(x.topic) +
            ": " +
            (x.delta > 0 ? "+" : "") +
            x.delta +
            " (" +
            x.before +
            " → " +
            x.after +
            ")</p>",
        )
        .join("") +
      "</details><h2>Recomendación para mañana</h2><p>" +
      esc(report.recommendation) +
      "</p><p>Nota orientativa con penalización: " +
      number(result.score, 2) +
      '/10. Penalización orientativa: Zaragoza −0,50; Aragón/TAI −0,33 por fallo; blancos sin penalización.</p><button class="primary-button" data-training-again>Entrenar ahora</button><button class="secondary-button" data-training-back>Volver a practicar</button></section>';
    host.insertAdjacentHTML(
      "beforeend",
      recallMarkup(questions, session.picks, state),
    );
    el(host, "[data-training-again]").onclick = () => {
      child = startTraining(host, state, bank, save, exit, count);
    };
    el(host, "[data-training-back]").onclick = exit;
  }
  next();
  return {
    isActive: () => child?.isActive() ?? !session.closed,
    dispose() {
      session.closed = true;
      document.body.classList.remove("test-focus");
      child?.dispose();
    },
  };
}
