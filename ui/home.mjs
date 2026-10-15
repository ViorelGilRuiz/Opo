import { technicalTheoryQuestions } from "../data/course-bank.mjs";
import { selectQuestions } from "../core/learning.mjs";
import { levelProgress } from "../core/motivation.mjs";
import { motivationMarkup } from "./motivation.mjs";
import { dailyPlan } from "../data/tracks.mjs";
import { dayKey, streak } from "../core/learning.mjs";
import { esc, el, number, metric, animateXP } from "./components.mjs";
/** @param {import('../core/types.js').LearningState} state @param {string} warning @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official')=>void} begin */
export function renderHome(state, warning, begin) {
  const today = state.days[dayKey()] ?? { answered: 0, lessons: 0, minutes: 0 };
  const container = el(document.body, "#learningHome");
  const due = Object.values(state.questions).filter(
    (s) => s.dueAt <= Date.now(),
  ).length;
  const accuracy = state.events.length
    ? (100 * state.events.filter((e) => e.correct).length) / state.events.length
    : 0;
  const goal = state.reportedProfile.goal;
  container.innerHTML =
    `<div class="hero premium-hero"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> TU ESPACIO PARA AVANZAR · C1</div><h1>Un paso más cerca.<br><span>Una pregunta cada vez.</span></h1><p>Entrena para TAI, Zaragoza y Ejecutivo de Informática C1 con práctica inteligente, explicaciones claras y progreso que puedes ver.</p><div class="hero-actions"><button class="primary-button" data-fresh>Simulacro de 80 oficiales <span>→</span></button><button class="secondary-button" data-learn>Continuar aprendiendo</button></div><span class="button-caption">${state.studyTrack === "tai" ? "TAI" : state.studyTrack === "aragon-c1" ? "Aragón C1" : "Zaragoza C1"} · Simulacro personalizado · configura filtros y banco mixto</span></div>        <div class="hero-art" aria-hidden="true">
          <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div>
          <div class="art-card art-card-back"><span>OSI</span><b>7</b><small>capas</small></div>
          <div class="art-card art-card-front"><span class="art-check">✓</span><b>+1</b><small>concepto<br>dominado</small></div>
          <div class="art-bubble bubble-a">⌘</div><div class="art-bubble bubble-b">✦</div>
        </div>
<div class="hero-status"><span>◎ Concentración</span><span>↗ Progreso</span><span>✦ Constancia</span></div></div><div class="pulse-grid">` +
    metric(
      "Racha de estudio",
      streak(state) + (streak(state) === 1 ? " día" : " días"),
      "Tu constancia suma",
    ) +
    metric(
      "Experiencia",
      number(state.xp, 0) + " XP",
      "Nivel " +
        levelProgress(state.xp).level +
        " — " +
        levelProgress(state.xp).name,
    ) +
    `<article class="stat-card goal-card"><div class="stat-label">Hacia tu objetivo · ${goal} % de aciertos</div><div class="stat-value">${state.events.length ? number(accuracy) + " %" : "Por empezar"}</div><progress value="${Math.min(accuracy, goal)}" max="${goal}" aria-label="Progreso hacia el objetivo de aciertos"></progress><div class="stat-foot">${state.events.length ? "Aciertos medidos en tu entrenamiento" : "Completa una práctica para medir tu punto de partida"}</div></article></div><article class="focus-card learning-intro"><div class="section-heading"><div><div class="eyebrow">TU SESIÓN DE DOS HORAS</div><h2>Hoy también cuenta.</h2><p>${due} preguntas para repasar · ${today.answered}/10 preguntas · ${today.lessons}/1 lección</p></div><button class="secondary-button" data-home-review>Entrenar ahora →</button></div><div class="daily-grid">` +
    dailyPlan
      .map(
        (s, i) =>
          `<div><span class="step-index">0${i + 1}</span><b>${s.minutes} min</b><span>${esc(s.label)}</span></div>`,
      )
      .join("") +
    `</div><p class="coverage-note">${number(today.minutes, 0)}/120 min de actividad medida. ${esc(state.reportedProfile.baseline)}</p>${warning ? '<p role="alert">' + esc(warning) + "</p>" : ""}</article>`;
  container.insertAdjacentHTML(
    "beforeend",
    '<div class="home-v3-links"><button class="secondary-button" data-home-short>Test técnico corto</button><button class="secondary-button" data-home-route="simulacro">Exámenes históricos completos</button><button class="secondary-button" data-home-route="aprender">Aprender desde cero</button><button class="secondary-button" data-home-route="errores">Repasar mis errores</button><button class="secondary-button" data-home-route="progreso">Progreso y estadísticas</button><button class="secondary-button" data-home-route="banco">Banco de preguntas verificadas</button></div>',
  );
  el(container, "[data-home-short]").onclick = () =>
    begin(
      selectQuestions(
        state,
        technicalTheoryQuestions.filter(
          (q) => q.track === (state.studyTrack ?? "zaragoza-c1"),
        ),
        { count: 50, mode: "all" },
      ),
      "exam",
    );
  container
    .querySelectorAll("[data-home-route]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        document.dispatchEvent(
          new CustomEvent("oposprint-route", {
            detail: button.getAttribute("data-home-route"),
          }),
        ),
      ),
    );
  container.insertAdjacentHTML("beforeend", motivationMarkup(state, true));
  const xpCard = container.querySelectorAll(".pulse-grid .stat-value")[1];
  if (xpCard)
    xpCard.innerHTML =
      "<span data-xp-count>" + number(state.xp, 0) + "</span> XP";
  animateXP(container, state.xp);
  if (state.draft) {
    container.insertAdjacentHTML(
      "afterbegin",
      '<article class="focus-card"><div><p class="eyebrow">CONTINÚA DONDE LO DEJASTE</p><h2>Tu test está guardado</h2><p>Respuestas y posición guardadas en este navegador. El tiempo fuera de la aplicación queda pausado.</p></div><button class="primary-button" data-resume>Continuar mi test</button></article>',
    );
    el(container, "[data-resume]").onclick = () =>
      document.dispatchEvent(new CustomEvent("oposprint-resume"));
  }
  el(container, "[data-fresh]").onclick = () =>
    document.dispatchEvent(
      new CustomEvent("oposprint-route", { detail: "simulacro" }),
    );
  el(container, "[data-home-review]").onclick = () =>
    document.dispatchEvent(new CustomEvent("oposprint-train"));
  el(container, "[data-learn]").onclick = () =>
    document.dispatchEvent(
      new CustomEvent("oposprint-route", { detail: "aprender" }),
    );
}
