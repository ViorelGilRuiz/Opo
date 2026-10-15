import { relatedOfficialQuestions } from "../core/reinforcement.mjs";
import { verifiedQuestionBank as courseQuestionBank } from "../data/official-catalog.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { lessons } from "../data/lessons.mjs";
import { mastery, shuffleOptions } from "../core/learning.mjs";
import { esc, el, toast, heading } from "./components.mjs";
const bank = courseQuestionBank;
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official')=>void} begin @param {(id:string|null)=>void} study */
export function renderErrors(host, state, begin, study) {
  const errors = bank.filter(
    (q) => q.answer >= 0 && ((state.questions[q.id]?.incorrectCount ?? 0) > 0 || (state.questions[q.id]?.blankCount ?? 0) > 0),
  );
  host.innerHTML =
    heading(
      "Mis errores",
      "Un error no se borra por acertar una vez: su estado cambia con tus intentos y errores recientes.",
    ) +
    '<p>Primero recuerda sin mirar; después comprueba la explicación y escribe qué confundiste. Los repasos vencidos aparecen primero.</p><label>Clasificación<select id="errorFilter"><option value="all">Todos</option><option value="due">Pendientes de repaso hoy</option><option value="active">Sin consolidar</option><option value="once">Fallado una vez</option><option value="several">Fallado varias veces</option><option value="recurrent">Error recurrente (3+)</option><option value="mastered">Dominado posteriormente</option></select></label><p data-error-summary role="status" aria-live="polite"></p><button class="primary-button" data-review-batch>Repasar hasta 10 de esta selección</button><div data-errors></div>';
  const target = el(host, "[data-errors]");
  const render = (filter = "all") => {
    const selected = errors.filter((q) => {
      const s = state.questions[q.id];
      const mastered = mastery(s).status === "DOMINADO";
      return (
        filter === "all" ||
        (filter === "due" && s.dueAt <= Date.now() && !mastered) ||
        (filter === "active" && !mastered) ||
        (filter === "once" && s.incorrectCount === 1) ||
        (filter === "several" && s.incorrectCount === 2) ||
        (filter === "recurrent" && s.incorrectCount >= 3) ||
        (filter === "mastered" && mastered)
      );
    }).sort((a, b) => {
      const sa = state.questions[a.id], sb = state.questions[b.id];
      return Number(mastery(sa).status === "DOMINADO") - Number(mastery(sb).status === "DOMINADO") ||
        Number(sb.dueAt <= Date.now()) - Number(sa.dueAt <= Date.now()) ||
        sb.incorrectCount - sa.incorrectCount || sa.dueAt - sb.dueAt;
    });
    el(host, '[data-error-summary]').textContent = selected.length + ' preguntas · ' + selected.filter(q => state.questions[q.id].dueAt <= Date.now() && mastery(state.questions[q.id]).status !== 'DOMINADO').length + ' repasos vencidos sin consolidar.';
    const batch = /** @type {HTMLButtonElement} */ (el(host, '[data-review-batch]'));
    batch.disabled = !selected.length;
    batch.onclick = () => begin(selected.slice(0, 10).map(shuffleOptions), 'practice');
    target.innerHTML = selected.length
      ? selected
          .map((q) => {
            const s = state.questions[q.id];
            return (
              '<article class="analysis-card error-item"><h2>' +
              esc(q.concept) +
              "</h2><p>" +
              esc(q.prompt) +
              "</p><p>" +
              s.incorrectCount +
              " fallos · " + s.blankCount + " en blanco · " +
              mastery(s).status +
              " · próximo repaso " +
              new Date(s.dueAt).toLocaleString("es-ES") +
              '</p><div class="panel-actions"><button class="primary-button" data-retry="' +
              q.id +
              '">Volver a intentarlo</button><button class="secondary-button" data-concept="' +
              esc(q.concept) +
              '">Estudiar concepto</button><button class="secondary-button" data-feedback="later" data-id="' +
              q.id +
              '">Añadir a repaso</button><button class="secondary-button" data-similar="' +
              esc(q.id) +
              '">Reforzar con otras oficiales</button></div><details><summary>Mostrar explicación</summary><p>' +
              esc(q.explanation) +
              "</p><p>" +
              esc(q.trick) +
              '</p></details><p><b>Antes de abrir la ayuda:</b> explica qué confundiste y por qué descartarías otra opción.</p>' +
              (state.notes?.[q.id] ? '<p class="memory-trick">Mi regla: ' + esc(state.notes[q.id]) + '</p>' : '') +
              '<button class="secondary-button" data-teacher-question="' + esc(q.id) + '" data-teacher-zero-start>Profesor: entender este error</button><button class="secondary-button" data-memory-question="' +
              esc(q.id) +
              '">Mi nota del error</button></article>'
            );
          })
          .join("")
      : '<article class="analysis-card"><p>No hay errores en esta clasificación. Los fallos que comuniques mediante respuestas se incorporarán aquí.</p></article>';
    target.querySelectorAll("[data-retry]").forEach((b) =>
      b.addEventListener("click", () => {
        const q = bank.find((q) => q.id === b.getAttribute("data-retry"));
        if (q) begin([shuffleOptions(q)], "practice");
      }),
    );
    target.querySelectorAll("[data-concept]").forEach((b) =>
      b.addEventListener("click", () => {
        const l = lessons.find(
          (l) => l.topic === b.getAttribute("data-concept"),
        );
        const topic = curriculum.topics.find((t) =>
          t.assessments.some((a) =>
            a.questionIds.some(
              (id) =>
                bank.find((q) => q.id === id)?.concept ===
                b.getAttribute("data-concept"),
            ),
          ),
        );
        if (topic) study("course:" + topic.id);
        else if (l) study(l.id);
        else
          toast(
            "Esta pregunta oficial todavía no tiene una lección enlazada. Consulta el temario y la fuente.",
          );
      }),
    );
    target.querySelectorAll("[data-similar]").forEach((b) =>
      b.addEventListener("click", () => {
        const original = bank.find(
          (q) => q.id === b.getAttribute("data-similar"),
        );
        if (!original) return;
        const related = relatedOfficialQuestions(original, bank, state);
        if (!related.length) {
          toast(
            "No hay otra oficial enlazada a este concepto. Puedes repetir la original tras repasar su explicación.",
          );
          return;
        }
        begin(related.map(shuffleOptions), "practice");
      }),
    );
  };
  render();
  el(host, "#errorFilter").addEventListener("change", (e) =>
    render(/** @type {HTMLSelectElement} */ (e.target).value),
  );
}
