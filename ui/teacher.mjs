import {officialContext} from "./components.mjs";
import { esc, el, number, correction } from "./components.mjs";
import { contentBlocks } from "./course.mjs";
import {
  createTeacherSession,
  teacherLevels,
  teacherModes,
  submitTeacherActivity,
} from "../core/teacher.mjs";
import { shuffled } from "../core/learning.mjs";
/** @import {TeacherProvider,TeacherContext,TeacherResponse,TeacherMode,TeacherLevel} from '../core/teacher-types.js' */
/** @import {LearningState} from '../core/types.js' */
/** @param {HTMLElement} host @param {TeacherProvider} provider @param {LearningState} state @param {()=>void} save @param {TeacherContext} [initialContext] */
export function mountTeacher(host, provider, state, save, initialContext) {
  const engine = createTeacherSession(provider);
  let disposed = false;
  let sequence = 0;
  let mode = /** @type {TeacherMode} */ ("easy");
  let context = initialContext ?? { topicId: provider.topics[0]?.id };
  /** @type {TeacherResponse|null} */ let response = null;
  /** @type {(number|null)[]} */ let picks = [];
  /** @type {Map<string,string[]>} */ let orders = new Map();
  const assisted = new Set();
  const seen = new Set();
  const revealed = new Set();
  const hints = new Map();
  let corrected = false;
  let graded = /** @type {import('../core/types.js').Result|null} */ (null);
  let began = Date.now();
  let attemptId = "";
  host.innerHTML =
    '<div class="teacher-heading"><div class="teacher-mark" aria-hidden="true">✦</div><div><p class="eyebrow">PROFESOR</p><h1>Entenderlo cambia todo.</h1><p>Una idea, una pista y una comprobación cada vez.</p></div></div><div class="teacher-controls"><label>Tema<select data-teacher-topic><option value="">Elige un tema</option>' +
    provider.topics
      .map(
        (t) =>
          '<option value="' +
          esc(t.id) +
          '">' +
          esc(t.title) +
          (t.coverage === "partial" ? " · ficha parcial" : "") +
          "</option>",
      )
      .join("") +
    "</select></label><label>Concepto<select data-teacher-concept></select></label><label>Nivel<select data-teacher-level>" +
    teacherLevels
      .map((l) => '<option value="' + l.id + '">' + esc(l.title) + "</option>")
      .join("") +
    '</select></label></div><nav class="teacher-mode-nav" aria-label="Cómo quieres aprender">' +
    teacherModes
      .map(
        (m) =>
          '<button class="secondary-button" data-teacher-mode="' +
          m.id +
          '" aria-pressed="false">' +
          esc(m.title) +
          "</button>",
      )
      .join("") +
    '</nav><p class="teacher-status" data-teacher-status role="status" aria-live="polite"></p><div class="teacher-output" data-teacher-output aria-busy="false"></div><p class="coverage-note teacher-provider">' +
    esc(provider.label) +
    " · Leer explicaciones no concede XP. Las respuestas con pistas o solución visible se registran como asistidas.</p>";
  const output = el(host, "[data-teacher-output]");
  const status = el(host, "[data-teacher-status]");
  const topicSelect = /** @type {HTMLSelectElement} */ (
    el(host, "[data-teacher-topic]")
  );
  const conceptSelect = /** @type {HTMLSelectElement} */ (
    el(host, "[data-teacher-concept]")
  );
  const levelSelect = /** @type {HTMLSelectElement} */ (
    el(host, "[data-teacher-level]")
  );
  levelSelect.value = state.teacher.level;
  function selectors() {
    topicSelect.value = context.topicId ?? "";
    const topic = provider.topics.find((t) => t.id === context.topicId);
    conceptSelect.innerHTML =
      '<option value="">Idea general del tema</option>' +
      (topic?.concepts ?? [])
        .map(
          (c) =>
            '<option value="' + esc(c.id) + '">' + esc(c.title) + "</option>",
        )
        .join("");
    conceptSelect.value = context.conceptId ?? "";
    conceptSelect.disabled = !topic?.concepts.length;
  }
  function sourceMarkup() {
    return response?.sources.length
      ? '<details class="teacher-sources"><summary>Procedencia y alcance</summary>' +
          response.sources
            .map(
              (s) =>
                '<p><a href="' +
                esc(s.url) +
                '" target="_blank" rel="noopener">' +
                esc(s.title) +
                "</a><br>" +
                esc(s.version) +
                " · consulta " +
                esc(s.checkedAt) +
                "</p>",
            )
            .join("") +
          "</details>"
      : "";
  }
  function activityMarkup() {
    if (!response) return "";
    return (
      "<form data-teacher-form>" +
      response.questions
        .map(
          ({ question: q, hints: clues }, index) =>
            '<article class="question-panel teacher-question"><p class="eyebrow">' +
            (index + 1) +
            " / " +
            response.questions.length +
            " · " +
            esc(q.difficulty) +
            "</p>" +
            (q.examSet === "tai-2024"
              ? '<details><summary>Contexto de la pregunta oficial histórica</summary><p class="lesson-copy">' +
                esc(q.context ?? "") +
                '</p><a target="_blank" rel="noopener" href="/assets/exam-pages/page-' +
                q.page +
                '.png">Ver página del cuestionario de 2024</a></details>'
              : "") +
            officialContext(q) + "<h2>" +
            esc(q.prompt) +
            '</h2><fieldset class="options-list"><legend class="sr-only">Respuesta a la pregunta ' +
            (index + 1) +
            "</legend>" +
            (orders.get(q.id) ?? q.options)
              .map(
                (o, i) =>
                  '<label class="option-label"><input type="radio" name="teacher-q-' +
                  index +
                  '" value="' +
                  q.options.indexOf(o) +
                  '" ' +
                  (picks[index] === q.options.indexOf(o) ? "checked" : "") +
                  '><span class="option-letter">' +
                  "ABCD"[i] +
                  '</span><span class="option-text">' +
                  esc(o) +
                  "</span></label>",
              )
              .join("") +
            "</fieldset>" +
            (mode === "question"
              ? '<div class="teacher-hints"><p>Si lo necesitas, razona con una pista antes de ver la solución.</p>' +
                (hints.get(q.id)
                  ? '<div class="lesson-callout">' +
                    clues
                      .slice(0, hints.get(q.id))
                      .map(
                        (hint, i) =>
                          "<p><b>Pista " +
                          (i + 1) +
                          "</b> · " +
                          esc(hint) +
                          "</p>",
                      )
                      .join("") +
                    "</div>"
                  : "") +
                ((hints.get(q.id) ?? 0) < clues.length
                  ? '<button type="button" class="secondary-button" data-teacher-hint="' +
                    index +
                    '">Pista ' +
                    ((hints.get(q.id) ?? 0) + 1) +
                    "</button>"
                  : clues.length
                    ? ""
                    : '<p class="coverage-note">No hay pistas redactadas para esta pregunta.</p>') +
                '<button type="button" class="back-button" data-teacher-solution="' +
                index +
                '" ' +
                ((hints.get(q.id) ?? 0) < clues.length ? "disabled" : "") +
                ">Mostrar solución</button>" +
                (revealed.has(q.id)
                  ? '<div class="teacher-solution" role="status"><b>La respuesta correcta es ' +
                    esc(q.options[q.answer]) +
                    ".</b><p>" +
                    esc(q.explanation) +
                    "</p><small>Esta respuesta será asistida, sin XP ni dominio.</small></div>"
                  : "") +
                "</div>"
              : "") +
            "</article>",
        )
        .join("") +
      '<button class="primary-button" type="submit">' +
      (mode === "assessment"
        ? "Finalizar y corregir"
        : "Comprobar mi respuesta") +
      "</button></form>" +
      (mode === "assessment"
        ? '<p class="coverage-note">Sin pistas durante esta comprobación. Las soluciones aparecen al finalizar.</p>'
        : "")
    );
  }
  function bindActivity() {
    output.querySelectorAll("[data-teacher-form] input").forEach((input) =>
      input.addEventListener("change", () => {
        const index = Number(input.getAttribute("name")?.split("-").at(-1));
        picks[index] = Number(/** @type {HTMLInputElement} */ (input).value);
      }),
    );
    output.querySelectorAll("[data-teacher-hint]").forEach((button) =>
      button.addEventListener("click", () => {
        const item =
          response?.questions[Number(button.getAttribute("data-teacher-hint"))];
        if (!item) return;
        assisted.add(item.question.id);
        hints.set(
          item.question.id,
          Math.min(item.hints.length, (hints.get(item.question.id) ?? 0) + 1),
        );
        render();
      }),
    );
    output.querySelectorAll("[data-teacher-solution]").forEach((button) =>
      button.addEventListener("click", () => {
        const item =
          response?.questions[
            Number(button.getAttribute("data-teacher-solution"))
          ];
        if (!item || (hints.get(item.question.id) ?? 0) < item.hints.length)
          return;
        assisted.add(item.question.id);
        revealed.add(item.question.id);
        render();
      }),
    );
    output
      .querySelector("[data-teacher-form]")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!response || corrected) return;
        if (picks.some((p) => p === null)) {
          status.textContent =
            "Elige una respuesta en cada pregunta antes de corregir.";
          return;
        }
        const result = submitTeacherActivity(
          state,
          response,
          mode === "assessment" ? "assessment" : "question",
          picks,
          [...assisted],
          attemptId,
          Date.now() - began,
        );
        if (!result.ok) return;
        corrected = true;
        graded = result.result ?? null;
        response.questions.forEach((item) => seen.add(item.question.id));
        const failed = response.questions.find(
          (item, i) => picks[i] !== item.question.answer,
        );
        const focus = failed?.question ?? response.questions[0].question;
        context = {
          ...response.context,
          questionId: focus.id,
          conceptId: undefined,
        };
        save();
        render();
      });
  }
  function render() {
    if (!response || disposed) return;
    status.textContent = response.notice;
    output.setAttribute("aria-busy", "false");
    output.innerHTML =
      '<article class="teacher-intro"><span class="visual-chip">' +
      (response.coverage === "partial"
        ? "COBERTURA PARCIAL"
        : "CONTENIDO PUBLICADO") +
      "</span><h2>" +
      esc(response.title) +
      "</h2></article>" +
      contentBlocks(response.blocks) +
      (response.kind === "activity"
        ? corrected
          ? '<section class="teacher-activity-result"><h2>' +
            picks.filter((p, i) => p === response?.questions[i].question.answer)
              .length +
            "/" +
            response.questions.length +
            " aciertos</h2><p>Nota penalizada: " +
            number(graded?.score ?? 0, 2) +
            "/10 · fallos: " +
            (graded?.wrong ?? 0) +
            ".</p><p>" +
            assisted.size +
            ' respuestas asistidas. Solo las respuestas sin pistas ni solución aportan evidencia al progreso adaptativo.</p><button class="primary-button" data-teacher-zero>¿No lo entiendes? Explícamelo desde cero</button><button class="secondary-button" data-teacher-another>Ponme otra pregunta →</button></section>' +
            response.questions
              .map(
                (item, i) =>
                  '<p class="coverage-note">' +
                  (assisted.has(item.question.id)
                    ? "Con ayuda · sin XP ni dominio"
                    : "Sin pistas ni solución visible") +
                  "</p>" +
                  correction(item.question, picks[i], false),
              )
              .join("")
          : activityMarkup()
        : response.kind === "unavailable"
          ? '<article class="analysis-card"><h3>Sigamos con lo que sí está disponible.</h3><p>' +
            esc(response.notice) +
            '</p><button class="secondary-button" data-teacher-restart>Reiniciar preguntas del tema</button></article>'
          : "") +
      sourceMarkup() +
      '<section class="analysis-card"><h3>Elige tu siguiente paso</h3><p>Primero entiende la idea; después intenta explicarla sin mirar y compruébala con una pregunta oficial.</p><div class="panel-actions"><button class="secondary-button" data-teacher-next="example">Ver un ejemplo</button><button class="secondary-button" data-teacher-next="scheme">Ordenar las ideas</button><button class="primary-button" data-teacher-next="question">Comprobar con una pregunta</button><button class="secondary-button" data-teacher-next="assessment">Hacer un minitest</button></div><details><summary>Antes de practicar: recordar sin mirar</summary><p>Resume la idea en una frase, da un ejemplo y explica qué dos conceptos podrías confundir. Cierra las explicaciones antes de responder.</p></details></section>';
    output.querySelectorAll('[data-teacher-next]').forEach(button => button.addEventListener('click', () => void request(/** @type {TeacherMode} */ (button.getAttribute('data-teacher-next')))));
    bindActivity();
    output
      .querySelector("[data-teacher-zero]")
      ?.addEventListener("click", () => {
        state.teacher.level = "zero";
        levelSelect.value = "zero";
        save();
        void request("easy");
      });
    output
      .querySelector("[data-teacher-another]")
      ?.addEventListener("click", () => void request("question"));
    output
      .querySelector("[data-teacher-restart]")
      ?.addEventListener("click", () => {
        seen.clear();
        context = { topicId: context.topicId, conceptId: context.conceptId };
        void request("question");
      });
  }
  /** @param {TeacherMode} next */
  async function request(next) {
    mode = next;
    const current = ++sequence;
    corrected = false;
    response = null;
    assisted.clear();
    revealed.clear();
    hints.clear();
    host
      .querySelectorAll("[data-teacher-mode]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.getAttribute("data-teacher-mode") === mode),
        ),
      );
    status.textContent = "Preparando el siguiente paso…";
    output.setAttribute("aria-busy", "true");
    output.innerHTML = '<p class="teacher-loading">Conectando ideas…</p>';
    try {
      const result = await engine.ask({
        context,
        mode,
        level: state.teacher.level,
        excludeQuestionIds: [...seen],
      });
      if (!result || disposed || current !== sequence) return;
      response = result;
      context = result.context;
      selectors();
      picks = response.questions.map(() => null);
      orders = new Map(
        response.questions.map((item) => [
          item.question.id,
          /^(tai|aragon|zaragoza)-/.test(item.question.examSet)?[...item.question.options]:shuffled(item.question.options),
        ]),
      );
      began = Date.now();
      attemptId =
        "teacher:" +
        Date.now() +
        ":" +
        sequence +
        ":" +
        Math.random().toString(36).slice(2);
      render();
    } catch {
      if (disposed || current !== sequence) return;
      output.setAttribute("aria-busy", "false");
      status.textContent =
        "No se pudo preparar el contenido. Puedes reintentarlo o elegir otro tema.";
      output.innerHTML =
        '<button class="secondary-button" data-teacher-retry>Reintentar</button>';
      el(output, "[data-teacher-retry]").onclick = () => void request(mode);
    }
  }
  host
    .querySelectorAll("[data-teacher-mode]")
    .forEach((button) =>
      button.addEventListener(
        "click",
        () =>
          void request(
            /** @type {TeacherMode} */ (
              button.getAttribute("data-teacher-mode")
            ),
          ),
      ),
    );
  topicSelect.addEventListener("change", () => {
    context = { topicId: topicSelect.value };
    seen.clear();
    selectors();
    void request("easy");
  });
  conceptSelect.addEventListener("change", () => {
    context = {
      topicId: topicSelect.value,
      conceptId: conceptSelect.value || undefined,
    };
    seen.clear();
    void request(mode);
  });
  levelSelect.addEventListener("change", () => {
    state.teacher.level = /** @type {TeacherLevel} */ (levelSelect.value);
    save();
    void request(mode);
  });
  selectors();
  void request("easy");
  return {
    dispose() {
      disposed = true;
      sequence++;
      engine.dispose();
      host.replaceChildren();
    },
  };
}
