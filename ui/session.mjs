import { examAnalysisMarkup } from "./exam-analysis.mjs";
import { keyConceptsMarkup } from "./key-concepts.mjs";
import { resumableQuestions } from "../core/session-draft.mjs";
import { recallMarkup } from "./recall.mjs";
import { officialContext } from "./components.mjs";
import { grade, recordAnswer, dayKey } from "../core/learning.mjs";
import { correction, quickCorrection, esc, number, time, el, toast } from "./components.mjs";
/** @import {Question,LearningState,Attempt} from '../core/types.js' */
/** @param {HTMLElement} host @param {LearningState} state @param {Question[]} questions @param {'practice'|'exam'|'official'} kind @param {()=>void} save @param {()=>void} exit @param {import('../core/types.js').SessionOptions} [options] */
export function startSession(
  host,
  state,
  questions,
  kind,
  save,
  exit,
  options,
) {
  document.body.classList.add("test-focus");
  const previous = state.draft;
  const restored =
    previous?.kind === kind &&
    resumableQuestions(previous, questions)
      .map((q) => q.id)
      .join("|") === questions.map((q) => q.id).join("|")
      ? previous
      : undefined;
  const config = restored?.options ?? options ?? {};
  let current = restored?.current ?? 0;
  const started = Date.now();
  let entered = started;
  let closed = false;
  let keepDraft = false;
  const budget =
    kind === "practice"
      ? Infinity
      : (config.budgetMs ?? (kind === "official" ? 120 * 60000 : 50 * 60000));
  /** @type {(number|null)[]} */ const picks = restored
    ? [...restored.picks]
    : questions.map(() => null);
  const flags = restored ? [...restored.flags] : questions.map(() => false);
  const durations = restored ? [...restored.durations] : questions.map(() => 0);
  const recorded = restored
    ? [...restored.recorded]
    : questions.map(() => false);
  let correctRun = 0;
  let lastRendered = -1;
  const elapsed = () => (restored?.elapsedMs ?? 0) + Date.now() - started;
  function persistDraft() {
    if (closed) return;
    const snapshot = [...durations];
    snapshot[current] += Date.now() - entered;
    state.draft = {
      options: config,
      kind,
      createdAt: restored?.createdAt ?? started,
      elapsedMs: elapsed(),
      questionIds: questions.map((q) => q.id),
      picks: [...picks],
      durations: snapshot,
      flags: [...flags],
      recorded: [...recorded],
      current,
    };
    save();
  }
  function account() {
    const now = Date.now();
    durations[current] += now - entered;
    entered = now;
  }
  function record(index) {
    if (recorded[index]) return;
    const outcome = recordAnswer(
      state,
      questions[index],
      picks[index],
      durations[index],
    );
    recorded[index] = true;
    correctRun = outcome.correct ? correctRun + 1 : 0;
    if (correctRun === 5) toast("Llevas 5 respuestas correctas seguidas");
    save();
  }
  let lastCheckpoint = started;
  function tick() {
    if (closed) return;
    const node = host.querySelector("[data-clock]");
    if (node)
      node.textContent = time(
        kind === "practice" ? elapsed() : budget - elapsed(),
      );
    if (elapsed() >= budget) finish();
    else if (Date.now() - lastCheckpoint >= 15000) {
      persistDraft();
      lastCheckpoint = Date.now();
    }
  }
  const timer = window.setInterval(tick, 1000);
  function render() {
    if (closed) return;
    const transition = lastRendered !== current;
    lastRendered = current;
    persistDraft();
    const q = questions[current];
    const answered = picks.filter((p) => p !== null).length;
    const live = grade(questions, picks.map((pick, i) => kind === "practice" && !recorded[i] ? null : pick), config.penalty);
    host.innerHTML =
      '<div class="session-status"><div class="session-heading"><button class="back-button" data-action="pause">Pausar</button><button class="back-button" data-action="exit">← Salir</button><h1>' +
      esc(
        config.title ??
          (kind === "practice"
            ? "Práctica guiada"
            : kind === "official"
              ? "TAI 2024 · selección técnica"
              : questions.every((q) => q.track === "zaragoza-c1")
                ? "Zaragoza C1 · test oficial"
                : questions.every((q) => q.track === "aragon-c1")
                  ? "Aragón C1 · test oficial"
                  : "Test técnico oficial"),
      ) +
      '</h1><span data-clock role="timer" aria-label="Tiempo" ' + (config.hideClock ? 'hidden' : '') + '>' +
      time(kind === "practice" ? elapsed() : budget - elapsed()) +
      "</span></div><p>" +
      answered +
      " contestadas · " +
      (questions.length - answered) +
      " pendientes · " +
      (current + 1) +
      "/" +
      questions.length +
      (kind === "practice"
        ? ""
        : " · Corrección inmediata para aprender") +
      '</p><p class="live-score" data-live-score role="status" aria-live="polite">Nota actual: <strong>' +
      number(live.score, 2) + '/10</strong> · ' + live.correct +
      ' aciertos · ' + live.wrong + ' fallos · ' + live.blank +
      (kind === "practice" ? ' sin comprobar. Calculada sobre las ' : ' pendientes. Calculada sobre las ') + questions.length +
      ' preguntas, con la penalización del simulacro. Nota de entrenamiento con ayuda; cambiar una respuesta tras ver la solución no demuestra dominio.' +
      '</p><progress value="' +
      answered +
      '" max="' +
      questions.length +
      '" aria-label="Preguntas respondidas"></progress><details class="test-comfort"><summary>Ajustar lectura y reloj</summary><div class="panel-actions"><button class="secondary-button" data-action="text" aria-pressed="' + !!config.largeText + '">Letra grande</button><button class="secondary-button" data-action="clock" aria-pressed="' + !!config.hideClock + '">Ocultar reloj</button></div><p>Ocultar el reloj no detiene el tiempo. Para descansar, pulsa Pausar: se guarda tu sesión.</p></details></div><div class="quiz-layout ' + (config.largeText ? 'reader-large' : '') + '"><section class="question-panel"><p class="eyebrow">BLOQUE ' +
      esc(q.block) +
      " · " +
      esc(q.category) +
      " · " +
      esc(q.difficulty) +
      "</p>" +
      (q.examSet === "tai-2024"
        ? "<p>" +
          esc(q.section === 0 ? "Primera parte" : "Supuesto " + q.section) +
          " · " +
          (q.reserve ? "Reserva " : "Pregunta ") +
          q.number +
          "</p><details><summary>Contexto y página original, sin soluciones</summary><p>" +
          esc(q.context ?? "") +
          '</p><a target="_blank" rel="noopener" href="/assets/exam-pages/page-' +
          q.page +
          '.png">Abrir página del cuestionario</a>' +
          (q.section
            ? '<img class="source-page" src="/assets/exam-pages/page-' +
              (q.section === 1 ? 40 : 43) +
              '.png" alt="Enunciado original y diagrama del supuesto ' +
              q.section +
              '">'
            : "") +
          "</details>"
        : "") +
      officialContext(q) +
      '<h2 id="learningQuestion" tabindex="-1" class="' +
      (transition ? "question-enter" : "") +
      '">' +
      esc(q.prompt) +
      '</h2><fieldset class="options-list"><legend class="sr-only">Elige una respuesta</legend>' +
      q.options
        .map(
          (option, i) =>
            '<label class="option-label ' +
            (picks[current] === i ? "selected " : "") +
            (recorded[current] || (kind !== "practice" && picks[current] !== null)
              ? i === q.answer
                ? "answer-correct"
                : picks[current] === i
                  ? "answer-wrong"
                  : ""
              : "") +
            '"><input type="radio" name="learningAnswer" value="' +
            i +
            '" ' +
            (picks[current] === i ? "checked " : "") +
            (recorded[current] ? "disabled" : "") +
            '><span class="option-letter">' +
            "ABCD"[i] +
            '</span><span class="option-text">' +
            esc(option) +
            "</span></label>",
        )
        .join("") +
      '</fieldset><div class="panel-actions"><button class="secondary-button" data-action="clear" ' +
      (recorded[current] ? "disabled" : "") +
      '>Dejar en blanco</button><button class="secondary-button" data-action="flag" aria-pressed="' +
      flags[current] +
      '">' +
      (flags[current] ? "Marcada para revisar" : "Marcar para revisar") +
      "</button>" +
      (kind === "practice"
        ? '<button class="primary-button" data-action="check" ' +
          (picks[current] === null || recorded[current] ? "disabled" : "") +
          ">Comprobar y aprender</button>"
        : "") +
      "</div><div data-feedback-panel>" +
      ((kind === "practice" && recorded[current]) || (kind !== "practice" && picks[current] !== null)
        ? quickCorrection(q, picks[current])
        : "") +
      '</div><div class="quiz-navigation"><button class="secondary-button" data-action="prev" ' +
      (current === 0 ? "disabled" : "") +
      '>← Anterior</button><button class="primary-button" data-action="next" ' +
      (current === questions.length - 1 ? "disabled" : "") +
      '>Siguiente →</button><button class="secondary-button" data-action="pending" ' +
      (picks.every((p) => p !== null) ? 'disabled' : '') +
      '>Ir a una pendiente</button></div><div class="finish-wrap"><button class="finish-button" data-action="finish">Finalizar y corregir</button></div></section><aside class="question-rail"><details class="question-map"><summary>Mapa de preguntas · cambiar o revisar</summary><div class="question-grid">' +
      questions
        .map(
          (_, i) =>
            '<button class="grid-question ' +
            (picks[i] !== null ? "answered " : "") +
            (i === current ? "current" : "") +
            '" data-go="' +
            i +
            '" aria-label="Pregunta ' +
            (i + 1) +
            (flags[i] ? ", marcada para revisar" : "") +
            '" aria-current="' +
            (i === current ? "step" : "false") +
            '">' +
            (i + 1) +
            (flags[i] ? " ⚑" : "") +
            "</button>",
        )
        .join("") +
      '</div></details><p class="coverage-note">' +
      (kind === "official"
        ? "Bloque I y anulaciones excluidos. Reservas técnicas usadas en el supuesto cuando corresponde. Es una selección parcial; nota orientativa, no oficial transformada."
        : "Preguntas oficiales históricas. La selección de entrenamiento no reproduce una convocatoria completa.") +
      "</p></aside></div>";
    if (!window.matchMedia?.("(max-width:580px)").matches)
      host.querySelector(".question-map")?.setAttribute("open", "");
    host.querySelectorAll('input[name="learningAnswer"]').forEach((input) =>
      input.addEventListener("change", () => {
        picks[current] = Number(/** @type {HTMLInputElement} */ (input).value);
        if (kind !== "practice") {
          render();
          const selectedInput = host.querySelector('input[name="learningAnswer"][value="' + picks[current] + '"]');
          if (selectedInput instanceof HTMLElement) selectedInput.focus({ preventScroll: true });
          return;
        }
        host
          .querySelectorAll(".option-label")
          .forEach((label, index) =>
            label.classList.toggle("selected", index === picks[current]),
          );
        persistDraft();
        const check = host.querySelector('[data-action="check"]');
        if (check) /** @type {HTMLButtonElement} */ (check).disabled = false;
      }),
    );
    host.querySelectorAll("[data-go]").forEach((button) =>
      button.addEventListener("click", () => {
        account();
        current = Number(button.getAttribute("data-go"));
        render();
      }),
    );
    host.querySelectorAll("[data-action]").forEach((button) =>
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        if (action === "pause") {
          account();
          persistDraft();
          keepDraft = true;
          closed = true;
          document.body.classList.remove("test-focus");
          window.clearInterval(timer);
          exit();
          document.dispatchEvent(
            new CustomEvent("oposprint-route", { detail: "inicio" }),
          );
          return;
        }
        if (action === "exit") {
          if (
            !window.confirm(
              "Salir pierde el intento en curso. Las respuestas ya corregidas en práctica se conservan. ¿Salir?",
            )
          )
            return;
          delete state.draft;
          save();
          closed = true;
          document.body.classList.remove("test-focus");
          window.clearInterval(timer);
          exit();
          return;
        }
        account();
        if (action === "prev") current--;
        if (action === "next") current++;
        if (action === "pending") {
          for (let offset = 1; offset <= questions.length; offset++) {
            const index = (current + offset) % questions.length;
            if (picks[index] === null) { current = index; break; }
          }
        }
        if (action === "flag") flags[current] = !flags[current];
        if (action === "text") config.largeText = !config.largeText;
        if (action === "clock") config.hideClock = !config.hideClock;
        if (action === "clear") picks[current] = null;
        if (action === "check") record(current);
        if (action === "finish") {
          if (
            !window.confirm(
              "¿Finalizar y corregir? Quedan " +
                picks.filter((p) => p === null).length +
                " preguntas en blanco. No penalizan. Una vez corregido no podrás cambiar respuestas.",
            )
          )
            return;
          finish();
          return;
        }
        render();
      }),
    );
    if (transition) {
      const title = host.querySelector('#learningQuestion');
      if (title instanceof HTMLElement) title.focus({ preventScroll: true });
    }
  }
  function finish() {
    if (closed) return;
    account();
    closed = true;
    document.body.classList.remove("test-focus");
    window.clearInterval(timer);
    questions.forEach((_, i) => record(i));
    delete state.draft;
    const result = grade(questions, picks, config.penalty);
    const elapsedMs = elapsed();
    /** @type {Attempt} */ const attempt = /** @type {Attempt} */ ({
      id: "attempt-" + started,
      kind,
      sessionOptions: config,
      questionIds: questions.map((q) => q.id),
      picks: [...picks],
      optionOrders: questions.map((q) => [...q.options]),
      at: Date.now(),
      elapsedMs,
      ...result,
    });
    if (kind === "official") {
      attempt.sections = {};
      for (const section of [0, 1, 2]) {
        const indexes = questions
          .map((q, i) => (q.section === section ? i : -1))
          .filter((i) => i >= 0);
        if (indexes.length)
          attempt.sections[String(section)] = grade(
            indexes.map((i) => questions[i]),
            indexes.map((i) => picks[i]),
          );
      }
    }
    state.attempts.push(attempt);
    if (kind !== "practice") {
      state.xp += 100;
      state.days[dayKey()].exams++;
    }
    save();
    renderResult(attempt);
  }
  /** @param {Attempt} result */
  function renderResult(result) {
    /** @type {Record<string,{correct:number;total:number}>} */ const categories =
      {};
    questions.forEach((q, i) => {
      const row = categories[q.category] ?? { correct: 0, total: 0 };
      row.total++;
      row.correct += Number(picks[i] === q.answer);
      categories[q.category] = row;
    });
    const ranked = Object.entries(categories).sort(
      (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total,
    );
    host.innerHTML =
      '<div class="session-heading"><span class="eyebrow">SIMULACRO COMPLETADO</span><button class="secondary-button" data-exit>Volver</button></div><section class="completion-hero"><div class="completion-symbol" aria-hidden="true">✓</div><div><p class="eyebrow">CADA INTENTO TE ACERCA</p><h1>Tu esfuerzo, en resultados.</h1><p>Ahora convierte cada respuesta en conocimiento.</p></div><div class="completion-score">' +
      number(result.score, 2) +
      '<small>/ 10</small><span>Nota penalizada</span></div></section><div class="stats-grid result-stats">' +
      [
        "Aciertos: " + result.correct,
        "Fallos: " + result.wrong,
        "En blanco: " + result.blank,
        "Porcentaje: " + number(result.percent) + " %",
        "Nota bruta: " + number(result.raw, 2) + "/10",
        "Nota penalizada: " + number(result.score, 2) + "/10",
      ]
        .map((t) => '<article class="stat-card"><b>' + t + "</b></article>")
        .join("") +
      "</div><p>Tiempo total " +
      time(result.elapsedMs) +
      " · media " +
      number(result.elapsedMs / questions.length / 1000) +
      " s/pregunta · puntuación directa " +
      number(result.direct, 2) +
      ". " +
      (config.scoringLabel ??
        (kind === "official"
          ? "La nota oficial requiere la transformación y cortes publicados por la CPS."
          : "Penalización orientativa por fallo: Zaragoza −0,50; Aragón/TAI −0,33. Blancos sin penalización; no es una nota oficial.")) +
      "</p>" +
      (result.sections
        ? '<div class="content-grid">' +
          Object.entries(result.sections)
            .map(
              ([key, r]) =>
                '<article class="analysis-card"><h2>' +
                (key === "0" ? "Primera parte" : "Supuesto " + key) +
                "</h2><p>" +
                r.correct +
                " aciertos · " +
                r.wrong +
                " fallos · " +
                r.blank +
                " blancos · puntuación directa " +
                number(r.direct, 2) +
                "</p></article>",
            )
            .join("") +
          "</div>"
        : "") +
      '<div class="content-grid result-insights"><article class="analysis-card"><div class="eyebrow">TUS PUNTOS FUERTES</div><h2>' +
      esc(ranked[ranked.length - 1][0]) +
      '</h2><p>Tu materia con mayor proporción de aciertos en este intento.</p></article><article class="analysis-card"><div class="eyebrow">TIENES QUE REFORZAR</div><h2>' +
      esc(ranked[0][0]) +
      "</h2><p>" +
      (ranked[0][1].correct === ranked[0][1].total
        ? "Has acertado todo. Mantén el repaso espaciado."
        : "Empieza por las preguntas falladas o en blanco de esta materia.") +
      '</p></article></div><article class="analysis-card"><div class="eyebrow">PLAN RECOMENDADO</div><h2>Tu siguiente avance</h2><p>' +
      (ranked[0][1].correct === ranked[0][1].total
        ? "Pleno: consolida con repasos espaciados."
        : "Primero repasa " +
          esc(ranked[0][0]) +
          ". Después practica tus errores antes de repetir un simulacro.") +
      "</p><p>Bloque más fuerte: " +
      esc(ranked[ranked.length - 1][0]) +
      ".</p>" +
      ranked
        .map(
          ([name, s]) =>
            "<p>" +
            esc(name) +
            " · " +
            s.correct +
            "/" +
            s.total +
            '<progress max="' +
            s.total +
            '" value="' +
            s.correct +
            '" aria-label="Rendimiento ' +
            esc(name) +
            '"></progress></p>',
        )
        .join("") +
      '<button class="primary-button" data-review>Ir a mis errores</button></article>' +
      keyConceptsMarkup(questions, picks) +
      '<div class="corrections-heading"><h2>Pregunta a pregunta</h2><button class="filter-button" data-filter>Ver solo fallos y blancos</button></div><div data-corrections>' +
      questions.map((q, i) => correction(q, picks[i])).join("") +
      "</div>";
    host.insertAdjacentHTML(
      "beforeend",
      examAnalysisMarkup(state, questions, result),
    );
    host.insertAdjacentHTML("beforeend", recallMarkup(questions, picks, state));
    el(host, "[data-exit]").onclick = exit;
    el(host, "[data-review]").onclick = () => {
      exit();
      document.dispatchEvent(
        new CustomEvent("oposprint-route", { detail: "errores" }),
      );
    };
    let only = false;
    el(host, "[data-filter]").onclick = () => {
      only = !only;
      el(host, "[data-filter]").textContent = only
        ? "Ver todas"
        : "Ver solo fallos y blancos";
      el(host, "[data-corrections]").innerHTML = questions
        .filter((q, i) => !only || picks[i] !== q.answer)
        .map((q) => correction(q, picks[questions.indexOf(q)]))
        .join("");
    };
  }
  const pageHide = () => persistDraft();
  window.addEventListener("pagehide", pageHide);
  render();
  return {
    isActive: () => !closed,
    dispose: () => {
      window.removeEventListener("pagehide", pageHide);
      if (!keepDraft) {
        delete state.draft;
        save();
      }
      closed = true;
      document.body.classList.remove("test-focus");
      window.clearInterval(timer);
    },
  };
}
