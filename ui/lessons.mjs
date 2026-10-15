import {officialContext} from "./components.mjs";
import { lessonVisual } from "./visuals.mjs";
import {
  completeLesson,
  recordAnswer,
  shuffleOptions,
} from "../core/learning.mjs";
import { esc, el, correction, toast } from "./components.mjs";
/** @import {Lesson,Question,LearningState} from '../core/types.js' */
/** @param {HTMLElement} host @param {Lesson} lesson @param {Question|undefined} original @param {LearningState} state @param {()=>void} save @param {()=>void} back */
export function openLesson(host, lesson, original, state, save, back) {
  let step = 0;
  const started = Date.now();
  const q = original ? shuffleOptions(original) : undefined;
  let finished = false;
  /** @type {number|null} */
  let finalPick = null;
  const steps = [
    ["Desde cero", lesson.basic],
    ["Técnica y ejemplo", lesson.technical + "\n\n" + lesson.example],
    ["Una imagen mental", lesson.analogy],
    ["La trampa y la regla", lesson.trap + "\n\n" + lesson.rule],
    ["Repaso conceptual", lesson.rule],
  ];
  function render() {
    host.innerHTML =
      '<div class="teacher-course-help"><button class="secondary-button" data-teacher-lesson="' +
      esc(lesson.id) +
      '">Preguntar a Profesor ✦</button></div><div class="session-heading"><button class="back-button" data-back>← Lecciones</button><h1>' +
      esc(lesson.title) +
      "</h1><span>Paso " +
      (step + 1) +
      '/6</span></div><progress value="' +
      (step + 1) +
      '" max="6" aria-label="Pasos de la lección"></progress><article class="question-panel lesson-card">' +
      (step < 5
        ? '<p class="eyebrow">' +
          steps[step][0] +
          "</p><h2>" +
          esc(lesson.title) +
          '</h2><p class="lesson-copy">' +
          esc(steps[step][1]) +
          "</p>" +
          (step === 1 ? lessonVisual(lesson) : "")

        : q ? '<p class="eyebrow">PREGUNTA OFICIAL · ARAGÓN / TAI</p><p>'+esc(q.context??"")+'</p>' + officialContext(q) + '<h2>' +
          esc(q.prompt) +
          "</h2><fieldset><legend>Elige una respuesta</legend>" +
          q.options
            .map(
              (o, i) =>
                '<label class="option-label"><span class="option-letter">' +
                "ABCD"[i] +
                '</span><input type="radio" name="lessonAnswer" value="' +
                i +
                '"><span>' +
                esc(o) +
                "</span></label>",
            )
            .join("") +
          '</fieldset><button class="primary-button" data-check>Corregir la pregunta final</button><div data-result></div>' : '<p>No hay una pregunta oficial enlazada a esta ficha todavía. Puedes terminar la lectura; no se añadirán preguntas propias.</p><button class="secondary-button" data-read-complete>Terminar lectura</button>') +
      '<div class="quiz-navigation"><button class="secondary-button" data-prev ' +
      (step === 0 ? "disabled" : "") +
      '>← Anterior</button><button class="primary-button" data-next ' +
      (step === 5 ? "disabled" : "") +
      ">Siguiente →</button></div></article>";
    if (finished && step === 5 && q) {
      el(host, "[data-result]").innerHTML =
        correction(q, finalPick) +
        "<p>Lección completada. Completar no equivale a dominar: lo comprobarás en futuros repasos.</p>";
      host
        .querySelectorAll(".option-label")
        .forEach((label, i) =>
          label.classList.add(
            i === q.answer
              ? "answer-correct"
              : i === finalPick
                ? "answer-wrong"
                : "answer-neutral",
          ),
        );
      host
        .querySelectorAll("input")
        .forEach((input) => (input.disabled = true));
      /** @type {HTMLButtonElement} */ (el(host, "[data-check]")).disabled =
        true;
    }
    el(host, "[data-back]").onclick = back;
    el(host, "[data-prev]").onclick = () => {
      step--;
      render();
    };
    el(host, "[data-next]").onclick = () => {
      step++;
      render();
    };
    host.querySelector("[data-read-complete]")?.addEventListener("click",()=>{completeLesson(state,lesson.id);save();toast("Lectura completada; no concede dominio ni XP.");});
    const button = host.querySelector("[data-check]");
    button?.addEventListener("click", () => {
      if (finished || !q) return;
      const input = /** @type {HTMLInputElement|null} */ (
        host.querySelector("input:checked")
      );
      if (!input) {
        toast("Elige una opción antes de corregir.");
        return;
      }
      finished = true;
      const pick = Number(input.value);
      finalPick = pick;
      recordAnswer(state, q, pick, Date.now() - started);
      completeLesson(state, lesson.id);
      save();
      /** @type {HTMLButtonElement} */ (button).disabled = true;
      render();
    });
  }
  render();
}
