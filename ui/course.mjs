import {officialContext} from "./components.mjs";
import { esc, el, number, correction, toast } from "./components.mjs";
import {
  topicProgress,
  canOpenStep,
  completeStep,
  submitExercise,
  nextAssessment,
  latestAssessment,
  submitAssessment,
} from "../core/pedagogy.mjs";
import { priority, shuffled } from "../core/learning.mjs";
/** @import {ContentBlock,Curriculum,CourseTopic,LevelId,AssessmentAttempt} from '../core/pedagogy-types.js' */
/** @import {LearningState,Question} from '../core/types.js' */
/** @param {ContentBlock[]} blocks */
export function contentBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.type === "table")
        return (
          '<section class="learning-visual"><h3>' +
          esc(b.title) +
          '</h3><div class="table-scroll"><table><thead><tr>' +
          b.headers.map((h) => '<th scope="col">' + esc(h) + "</th>").join("") +
          "</tr></thead><tbody>" +
          b.rows
            .map(
              (row) =>
                "<tr>" +
                row.map((cell) => "<td>" + esc(cell) + "</td>").join("") +
                "</tr>",
            )
            .join("") +
          "</tbody></table></div></section>"
        );
      if (b.type === "layers" || b.type === "steps")
        return (
          '<section class="learning-visual"><h3>' +
          esc(b.title) +
          '</h3><ol class="' +
          (b.type === "layers" ? "osi-stack" : "course-sequence") +
          '">' +
          b.items.map((item) => "<li>" + esc(item) + "</li>").join("") +
          "</ol></section>"
        );
      if (b.type === "code")
        return (
          '<section class="terminal"><div class="terminal-top">' +
          esc(b.title) +
          "</div><pre><code>" +
          esc("body" in b ? b.body : "") +
          "</code></pre></section>"
        );
      return (
        '<section class="' +
        (b.type === "callout" ? "lesson-callout" : "course-copy") +
        '"><h3>' +
        esc(b.title) +
        "</h3><p>" +
        esc("body" in b ? b.body : "") +
        "</p></section>"
      );
    })
    .join("");
}
/** @param {HTMLElement} host @param {Curriculum} curriculum @param {CourseTopic} topic @param {Question[]} bank @param {LearningState} state @param {()=>void} save @param {()=>void} back @param {(id:string)=>void} openTopic */
export function openCourse(
  host,
  curriculum,
  topic,
  bank,
  state,
  save,
  back,
  openTopic,
) {
  const progress = topicProgress(state, topic);
  const questionsById = new Map(bank.map((q) => [q.id, q]));
  const sources = curriculum.sources.filter((s) =>
    topic.sourceIds.includes(s.id),
  );
  /** @type {LevelId} */ let level =
    nextAssessment(progress, topic)?.id ?? "exam";
  /** @type {AssessmentAttempt|undefined} */ let shown = latestAssessment(
    progress,
    level,
  );
  /** @type {Question[]} */ let questions = [];
  /** @type {(number|null)[]} */ let picks = [];
  const orders = new Map();
  let assessmentStarted = Date.now();
  let attemptId = "";
  let sequence = 0;
  function prepare() {
    const config = topic.assessments.find((a) => a.id === level);
    const ids =
      level === "review"
        ? [...new Set(topic.assessments.flatMap((a) => a.questionIds))]
            .map((id) => questionsById.get(id))
            .filter((q) => q !== undefined)
            .sort((a, b) => priority(state, b) - priority(state, a))
            .slice(0, 3)
            .map((q) => q.id)
        : (config?.questionIds ?? []);
    questions = ids
      .map((id) => questionsById.get(id))
      .filter((q) => q !== undefined);
    questions.forEach((q) => orders.set(q.id, /^(tai|aragon|zaragoza)-/.test(q.examSet)?[...q.options]:shuffled(q.options)));
    picks = questions.map(() => null);
    assessmentStarted = Date.now();
    attemptId =
      topic.id +
      ":" +
      Date.now() +
      ":" +
      ++sequence +
      ":" +
      Math.random().toString(36).slice(2);
  }
  prepare();
  /** @param {boolean} disabled */
  function assessmentMarkup(disabled = false) {
    if (shown) {
      const next = nextAssessment(progress, topic);
      return (
        '<article class="analysis-card"><div class="eyebrow">' +
        esc(
          shown.level === "review"
            ? "REPASO CORREGIDO"
            : (topic.assessments.find((a) => a.id === shown?.level)?.title ??
                "MINITEST"),
        ) +
        "</div><h2>" +
        number(shown.result.percent, 0) +
        " % de aciertos</h2><p>" +
        shown.result.correct +
        " aciertos · " +
        shown.result.wrong +
        " fallos · " +
        shown.result.blank +
        " en blanco · nota penalizada " +
        number(shown.result.score, 2) +
        "/10.</p><p>" +
        (shown.passed
          ? "Comprobación superada."
          : "Revisa los conceptos señalados y vuelve a comprobarlos. Estos pocos ítems no acreditan por sí solos dominio completo.") +
        '</p><div class="panel-actions">' +
        (shown.passed && next && level !== "review"
          ? '<button class="primary-button" data-course-level>Continuar: ' +
            esc(next.title) +
            "</button>"
          : "") +
        '<button class="secondary-button" data-course-retry>Reintentar comprobación</button></div></article>' +
        shown.questionIds
          .map((id, i) => {
            const q = questionsById.get(id);
            return q ? correction(q, shown?.picks[i] ?? null) : "";
          })
          .join("")
      );
    }
    return (
      '<article class="analysis-card"><div class="eyebrow">' +
      esc(
        level === "review"
          ? "RECUPERACIÓN ACTIVA"
          : (topic.assessments.find((a) => a.id === level)?.title ?? ""),
      ) +
      "</div><h2>Comprueba sin mirar las soluciones.</h2><p>" +
      questions.length +
      " preguntas · umbral didáctico 80 % de aciertos. No es una nota de corte oficial.</p></article><form data-course-quiz>" +
      questions
        .map(
          (q, index) =>
            '<article class="question-panel course-question"><p class="eyebrow">' +
            (index + 1) +
            " / " +
            questions.length +
            " · " +
            esc(q.difficulty) +
            "</p>" +
            (q.examSet === "tai-2024"
              ? '<details><summary>Contexto y procedencia del examen histórico</summary><p class="lesson-copy">' +
                esc(
                  q.context ??
                    "Pregunta de primera parte, sin contexto adicional.",
                ) +
                '</p><a target="_blank" rel="noopener" href="/assets/exam-pages/page-' +
                q.page +
                '.png">Página original del cuestionario · TAI 2024</a><p>Clave histórica definitiva; explicación didáctica añadida por OpoSprint.</p></details>'
              : "") +
            officialContext(q) + "<h3>" +
            esc(q.prompt) +
            '</h3><fieldset class="options-list"><legend class="sr-only">Respuesta a la pregunta ' +
            (index + 1) +
            "</legend>" +
            (orders.get(q.id) ?? q.options)
              .map(
                (o, i) =>
                  '<label class="option-label"><input type="radio" name="course-q-' +
                  index +
                  '" value="' +
                  q.options.indexOf(o) +
                  '" ' +
                  (disabled ? "disabled" : "") +
                  '><span class="option-letter">' +
                  "ABCD"[i] +
                  '</span><span class="option-text">' +
                  esc(o) +
                  "</span></label>",
              )
              .join("") +
            "</fieldset></article>",
        )
        .join("") +
      '<button class="primary-button" type="submit">Corregir minitest</button></form>'
    );
  }
  function render() {
    const step = progress.step;
    const index = curriculum.steps.findIndex((s) => s.id === step);
    const prerequisite = topic.prerequisiteIds
      .map((id) => curriculum.topics.find((t) => t.id === id))
      .filter((t) => t !== undefined);
    let body = "";
    if (step === "introduction")
      body =
        contentBlocks(topic.introduction) +
        '<article class="analysis-card"><h2>Al terminar podrás…</h2><ul>' +
        topic.objectives.map((s) => "<li>" + esc(s) + "</li>").join("") +
        "</ul><p>" +
        topic.estimatedMinutes +
        " min orientativos · referencia de programa: " +
        topic.officialRefs.map(esc).join(", ") +
        "</p>" +
        prerequisite
          .map(
            (t) =>
              '<p>Base recomendada: <button class="back-button" data-prerequisite="' +
              t.id +
              '">' +
              esc(t.title) +
              "</button></p>",
          )
          .join("") +
        "</article>" +
        '<section class="analysis-card"><h2>Tu hoja de ruta del tema</h2><p>Estudia estas ideas, recuerda sin mirar y comprueba después con el minitest.</p><ol>' +
        topic.concepts.map(c => '<li><b>' + esc(c.title) + '</b>: ' + esc(c.simple) + '</li>').join('') +
        '</ol><p>Para cada idea: da un ejemplo, explica el error habitual y recuerda la regla con tus palabras.</p></section>';
    if (step === "concepts")
      body = topic.concepts
        .map(
          (c) =>
            '<article class="analysis-card course-concept" id="' +
            esc(c.id) +
            '"><div class="eyebrow">' +
            esc(
              {
                foundation: "Fundamentos",
                practice: "Aplicación",
                exam: "Examen",
              }[c.difficulty],
            ) +
            " · " +
            c.questionIds.length +
            " preguntas relacionadas</div><h2>" +
            esc(c.title) +
            "</h2><p>" +
            esc(c.simple) +
            "</p><details><summary>Explicación técnica</summary><p>" +
            esc(c.technical) +
            '</p></details><div class="lesson-callout"><b>Ejemplo</b><p>' +
            esc(c.example) +
            '</p></div><div class="course-trap"><b>Error habitual</b><p>' +
            esc(c.commonError) +
            '</p></div><p class="memory-trick">' +
            esc(c.memory) +
            "</p><small>Fuentes: " +
            c.sourceIds
              .map((id) =>
                esc(curriculum.sources.find((s) => s.id === id)?.title ?? id),
              )
              .join(" · ") +
            '</small><details class="learning-example"><summary>Recordar sin mirar: autoevaluación</summary><p>Explica «' + esc(c.title) + '» con tus palabras y un ejemplo diferente. ¿Cómo evitarías este error: ' + esc(c.commonError) + '?</p><p>Comprueba tu explicación con la definición técnica. Esta reflexión no acredita dominio ni añade XP.</p></details></article>',
        )
        .join("");
    if (step === "example") body = contentBlocks(topic.example);
    if (step === "exercise")
      body =
        (topic.assessmentPolicy === "official-only" ? "<p>Practicarás en el siguiente paso con preguntas oficiales. Los ejercicios propios están retirados; no se inventan preguntas para completar este recorrido.</p>" : "<p>Intenta cada ejercicio antes de avanzar. Si fallas, usa la explicación; el minitest comprobará después lo aprendido.</p>") +
        topic.exercises
          .map((e) => {
            const result = progress.exerciseAttempts[e.id];
            return (
              '<article class="analysis-card"><form data-exercise="' +
              e.id +
              '"><h3>' +
              esc(e.prompt) +
              "</h3><details><summary>Necesito una pista</summary><p>" +
              esc(e.hint) +
              "</p></details>" +
              (e.type === "number"
                ? "<label>Tu resultado (" +
                  esc(e.unit) +
                  ')<input class="course-number" name="exercise-value" type="text" inputmode="decimal" autocomplete="off" value="' +
                  (result?.value ?? "") +
                  '" required></label>'
                : '<fieldset class="options-list"><legend class="sr-only">Elige un resultado</legend>' +
                  e.options
                    .map(
                      (o, i) =>
                        '<label class="option-label"><input type="radio" name="exercise-value" value="' +
                        i +
                        '" ' +
                        (result?.value === i ? "checked" : "") +
                        '><span class="option-letter">' +
                        "ABCD"[i] +
                        "</span><span>" +
                        esc(o) +
                        "</span></label>",
                    )
                    .join("") +
                  "</fieldset>") +
              '<button class="secondary-button" type="submit">Comprobar ejercicio</button></form>' +
              (result
                ? '<div class="exercise-feedback ' +
                  (result.correct ? "answer-correct" : "answer-wrong") +
                  '" role="status"><b>' +
                  (result.correct ? "✓ Correcto" : "Revisa este paso") +
                  "</b><p>" +
                  esc(e.explanation) +
                  "</p></div>"
                : "") +
              "</article>"
            );
          })
          .join("");
    if (step === "minitest") body = assessmentMarkup();
    if (step === "review")
      body =
        '<article class="analysis-card"><div class="eyebrow">RECORRIDO COMPLETADO · DOMINIO POR CONSOLIDAR</div><h2>Recupera, aplica, repite.</h2><p>Próximo repaso: ' +
        (progress.reviewDueAt
          ? new Date(progress.reviewDueAt).toLocaleString("es-ES")
          : "por programar") +
        '</p><p>Completar no significa dominar. Comprueba los conceptos en otros contextos y en días distintos.</p><button class="primary-button" data-course-review>Hacer repaso activo · hasta 3 preguntas</button></article>' +
        contentBlocks(topic.review) +
        (level === "review" ? assessmentMarkup() : "");
    host.innerHTML =
      '<div class="teacher-course-help"><button class="secondary-button" data-teacher-course="' +
      esc(topic.id) +
      '">¿Necesitas entenderlo mejor? Profesor ✦</button></div><header class="session-heading"><button class="back-button" data-course-back>← Temas</button><h1>' +
      esc(topic.title) +
      "</h1><span>" +
      (index + 1) +
      '/6</span></header><nav class="course-step-nav" aria-label="Pasos del tema">' +
      curriculum.steps
        .map(
          (s) =>
            '<button class="secondary-button" data-course-step="' +
            s.id +
            '" aria-current="' +
            (s.id === step ? "step" : "false") +
            '" ' +
            (!canOpenStep(curriculum, topic, progress, s.id)
              ? "disabled"
              : "") +
            ">" +
            esc(s.title) +
            (progress.completedSteps.includes(s.id) ? " ✓" : "") +
            "</button>",
        )
        .join("") +
      '</nav><div class="course-content">' +
      body +
      '</div><div class="quiz-navigation course-navigation"><button class="secondary-button" data-course-prev ' +
      (index === 0 ? "disabled" : "") +
      ">← Anterior</button>" +
      (index < curriculum.steps.length - 1
        ? '<button class="primary-button" data-course-next>Continuar →</button>'
        : '<button class="secondary-button" data-course-back>Volver a los temas</button>') +
      '</div><details class="course-sources"><summary>Fuentes y alcance del contenido</summary>' +
      sources
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
      "<p>Las preguntas oficiales proceden del PDF aportado de TAI 2024 y su plantilla definitiva. No se presenta esa plantilla como normativa vigente ni como convocatoria actual.</p></details>";
    host
      .querySelectorAll("[data-course-back]")
      .forEach((b) => b.addEventListener("click", back));
    host
      .querySelectorAll("[data-prerequisite]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          openTopic(b.getAttribute("data-prerequisite") ?? ""),
        ),
      );
    host.querySelectorAll("[data-course-step]").forEach((b) =>
      b.addEventListener("click", () => {
        const target =
          /** @type {import('../core/pedagogy-types.js').StepId} */ (
            b.getAttribute("data-course-step")
          );
        if (canOpenStep(curriculum, topic, progress, target)) {
          progress.step = target;
          save();
          render();
        }
      }),
    );
    el(host, "[data-course-prev]").onclick = () => {
      if (index > 0) {
        progress.step = curriculum.steps[index - 1].id;
        save();
        render();
      }
    };
    const next = host.querySelector("[data-course-next]");
    next?.addEventListener("click", () => {
      if (!completeStep(topic, progress, step)) {
        toast(
          step === "exercise"
            ? "Intenta todos los ejercicios antes de continuar."
            : "Supera los tres niveles del minitest antes del repaso.",
        );
        return;
      }
      progress.step = curriculum.steps[index + 1].id;
      save();
      render();
      window.scrollTo({ top: 0 });
    });
    host.querySelectorAll("[data-exercise]").forEach((form) =>
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const exercise = topic.exercises.find(
          (e) => e.id === form.getAttribute("data-exercise"),
        );
        if (!exercise) return;
        const input = /** @type {HTMLInputElement|null} */ (
          form.querySelector(
            exercise.type === "number" ? "input" : "input:checked",
          )
        );
        const result = submitExercise(progress, exercise, input?.value);
        if (!result.valid) {
          toast("Introduce un resultado válido antes de comprobar.");
          return;
        }
        progress.lastStudiedAt = Date.now();
        save();
        render();
      }),
    );
    host.querySelectorAll("[data-course-quiz] input").forEach((input) =>
      input.addEventListener("change", () => {
        const i = Number(input.getAttribute("name")?.split("-").at(-1));
        picks[i] = Number(/** @type {HTMLInputElement} */ (input).value);
      }),
    );
    host
      .querySelector("[data-course-quiz]")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (shown) return;
        if (picks.some((p) => p === null)) {
          toast("Responde todas las preguntas antes de corregir.");
          return;
        }
        const result = submitAssessment(
          state,
          topic,
          level,
          questions,
          picks,
          attemptId,
          Date.now() - assessmentStarted,
        );
        if (!result.ok) {
          toast(result.reason ?? "No se pudo registrar.");
          return;
        }
        shown = latestAssessment(progress, level);
        save();
        render();
      });
    host.querySelector("[data-course-retry]")?.addEventListener("click", () => {
      shown = undefined;
      prepare();
      render();
    });
    host.querySelector("[data-course-level]")?.addEventListener("click", () => {
      const next = nextAssessment(progress, topic);
      if (next) {
        level = next.id;
        shown = latestAssessment(progress, level);
        prepare();
        render();
      }
    });
    host
      .querySelector("[data-course-review]")
      ?.addEventListener("click", () => {
        level = "review";
        shown = undefined;
        prepare();
        render();
      });
  }
  save();
  render();
}
