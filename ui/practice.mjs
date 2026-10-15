import { courseQuestionBank as freshQuestions } from "../data/course-bank.mjs";
import { blocks } from "../data/tracks.mjs";
import { selectQuestions } from "../core/learning.mjs";
import { esc, el, toast, heading } from "./components.mjs";
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official')=>void} begin */
export function renderPractice(host, state, begin) {
  const categories = [...new Set(freshQuestions.map((q) => q.category))];
  const topics = [...new Set(freshQuestions.map((q) => q.topic))];
  host.innerHTML =
    heading(
      "Practicar con explicación",
      "Sesiones de 5, 10, 20, 30 o 50 preguntas. Si un filtro contiene menos, se usan solo las disponibles, sin duplicarlas.",
    ) +
    '<article class="focus-card"><div><p class="eyebrow">ENTRENAMIENTO INTELIGENTE</p><h2>Tu siguiente pregunta, a tu medida.</h2><p>20, 40 u 80 preguntas oficiales. La selección se ajusta con cada respuesta.</p><label>Contenido<select data-training-scope><option value="technical">Solo técnica</option><option value="all">Técnica y legislación histórica</option><option value="law">Legislación histórica</option></select></label><label>Cantidad<select data-training-count><option>20</option><option>40</option><option>80</option></select></label><label><input type="checkbox" data-training-mixed> Autorizo usar todos los bancos para completar el entrenamiento</label><p data-training-error role="alert"></p></div><button class="primary-button" data-train-now>Entrenar ahora</button></article><form id="practiceForm" class="analysis-card config-form"><label>Origen<select name="track"><option value="zaragoza-c1">Zaragoza C1 · 2026</option><option value="aragon-c1">Aragón C1 · 2026</option><option value="tai">TAI · 2024</option><option value="">Todos los bancos oficiales</option></select></label><label>Preguntas<select name="count">' +
    [5, 10, 20, 30, 50].map((n) => "<option>" + n + "</option>").join("") +
    '</select></label><label>Selección<select name="mode"><option value="smart">Repaso inteligente</option><option value="all">Todos los temas</option><option value="weak">Mis puntos débiles</option><option value="errors">Solo preguntas falladas</option></select></label><label>Bloque<select name="block"><option value="">Todos los bloques técnicos</option>' +
    blocks
      .filter((b) => b.id !== "I")
      .map(
        (b) =>
          '<option value="' +
          b.id +
          '">' +
          b.id +
          " · " +
          esc(b.name) +
          "</option>",
      )
      .join("") +
    '</select></label><label>Materia<select name="category"><option value="">Todas</option>' +
    categories.map((c) => "<option>" + esc(c) + "</option>").join("") +
    '</select></label><label>Tema<select name="topic"><option value="">Todos</option>' +
    topics.map((c) => "<option>" + esc(c) + "</option>").join("") +
    '</select></label><button class="primary-button" type="submit">Empezar práctica</button></form><p>La prioridad inicial se basa en tus dificultades comunicadas; después se actualiza con tus respuestas medidas.</p>';
  const origin = /** @type {HTMLSelectElement|null} */ (
    host.querySelector('select[name="track"]')
  );
  if (origin) origin.value = state.studyTrack ?? "zaragoza-c1";
  el(host, "[data-train-now]").onclick = () =>
    document.dispatchEvent(
      new CustomEvent("oposprint-train", {
        detail: {
          scope:
            /** @type {HTMLSelectElement} */ (el(host, "[data-training-scope]"))
              .value || "technical",
          count: Number(
            /** @type {HTMLSelectElement} */ (el(host, "[data-training-count]"))
              .value || 20,
          ),
          allowMixed: /** @type {HTMLInputElement} */ (
            el(host, "[data-training-mixed]")
          ).checked,
        },
      }),
    );
  el(host, "#practiceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(/** @type {HTMLFormElement} */ (e.target));
    const requested = Number(form.get("count"));
    const qs = selectQuestions(
      state,
      freshQuestions.filter(
        (q) => !form.get("track") || q.track === form.get("track"),
      ),
      {
        count: requested,
        mode: String(form.get("mode")),
        block: String(form.get("block")),
        category: String(form.get("category")),
        topic: String(form.get("topic")),
      },
    );
    if (qs.length && qs.length < requested)
      toast(
        "Este filtro contiene " +
          qs.length +
          " preguntas; entrenarás sin repeticiones.",
      );
    begin(qs, "practice");
  });
}
