import { motivationSnapshot, levelNames } from "../core/motivation.mjs";
import { motivationConfig } from "../data/motivation.mjs";
import { esc, number } from "./components.mjs";
/** @param {import('../core/types.js').LearningState} state @param {boolean} [compact] */
export function motivationMarkup(state, compact = false) {
  const s = motivationSnapshot(state, motivationConfig);
  const missions = s.missions;
  return (
    '<section class="motivation-panel"><div class="section-heading"><div><p class="eyebrow">PROGRESO CON PROPÓSITO</p><h2>Tus misiones de hoy.</h2><p>Cada paso cuenta. Los objetivos se renuevan cada día.</p></div><span class="visual-chip">' +
    missions.filter((m) => m.completed).length +
    '/5 completadas</span></div><div class="mission-grid">' +
    missions
      .map(
        (m) =>
          '<article class="mission-card ' +
          (m.completed ? "mission-complete" : "") +
          '"><div class="mission-top"><span aria-hidden="true">' +
          (m.completed ? "✓" : "↗") +
          "</span><small>+" +
          m.reward +
          " XP</small></div><h3>" +
          esc(m.title) +
          '</h3><div class="mission-value">' +
          Math.min(m.value, m.target) +
          " <small>/ " +
          m.target +
          '</small></div><progress max="' +
          m.target +
          '" value="' +
          Math.min(m.value, m.target) +
          '" aria-label="' +
          esc(m.title) +
          '"></progress>' +
          (m.completed
            ? '<span class="mission-status">Completada</span>'
            : '<button class="back-button" data-mission-route="' +
              m.route +
              '">Continuar →</button>') +
          "</article>",
      )
      .join("") +
    '</div><p class="coverage-note">Errores antiguos = de días anteriores. Minutos = actividad registrada al corregir respuestas. Las ayudas de Profesor no acreditan dominio.</p></section>' +
    (compact
      ? ""
      : '<section class="motivation-panel"><div class="section-heading"><div><p class="eyebrow">TU TRAYECTORIA</p><h2>Logros que cuentan.</h2><p>Se conservan al desbloquearlos; el dominio actual se comprueba con repasos.</p></div></div><div class="achievement-grid">' +
        s.achievements
          .map(
            (a) =>
              '<article class="achievement-card ' +
              (a.earned ? "achievement-earned" : "") +
              '"><span class="achievement-symbol" aria-hidden="true">' +
              (a.earned ? "✦" : "◇") +
              "</span><div><h3>" +
              esc(a.title) +
              "</h3><p>" +
              (a.earned
                ? "Desbloqueado"
                : Math.min(a.value, a.target) + " / " + a.target) +
              '</p><progress max="' +
              a.target +
              '" value="' +
              (a.earned ? a.target : Math.min(a.value, a.target)) +
              '" aria-label="' +
              esc(a.title) +
              '"></progress></div></article>',
          )
          .join("") +
        '</div></section><section class="motivation-panel"><p class="eyebrow">ETAPAS DE CONSTANCIA</p><h2>Nivel ' +
        s.level.level +
        " — " +
        esc(s.level.name) +
        '</h2><div class="level-track">' +
        levelNames
          .map(
            (name, i) =>
              '<div class="' +
              (s.level.level >= i + 1 ? "level-reached" : "") +
              '"><b>0' +
              (i + 1) +
              "</b><span>" +
              name +
              "</span><small>" +
              number(i * 500, 0) +
              " XP</small></div>",
          )
          .join("") +
        "</div><p>" +
        s.level.remaining +
        ' XP hasta el siguiente nivel. A partir del nivel 5 continúa la etapa Preparado. Los niveles miden constancia, no garantizan una nota.</p><div class="content-grid">' +
        s.topicMastery
          .map(
            (t) =>
              '<article class="analysis-card"><h3>' +
              esc(t.title) +
              "</h3><p>" +
              t.value +
              "/" +
              t.target +
              " conceptos comprobados</p>" +
              t.concepts
                .map(
                  (c) =>
                    "<p>" +
                    esc(c.title) +
                    " <b>" +
                    c.score +
                    " %</b> · " +
                    (c.mastered ? "Dominado" : "En consolidación") +
                    "</p>",
                )
                .join("") +
              "</article>",
          )
          .join("") +
        "</div></section>")
  );
}
/** @param {import('../core/motivation-types.js').Milestone[]} milestones */
export function celebrate(milestones) {
  if (!milestones.length) return;
  let node = document.querySelector("#milestoneToast");
  if (!node) {
    node = document.createElement("aside");
    node.id = "milestoneToast";
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    document.body.append(node);
  }
  const surface =
    document.querySelector("#teacherDialog[open]") ?? document.body;
  surface.append(node);
  const m = milestones[0];
  node.innerHTML =
    '<span class="milestone-symbol" aria-hidden="true">✦</span><div><strong>' +
    esc(m.title) +
    "</strong><p>" +
    esc(m.detail) +
    "</p>" +
    (milestones.length > 1
      ? "<small>Y " +
        (milestones.length - 1) +
        " hitos más. Consulta Mi progreso.</small>"
      : "") +
    '</div><button class="back-button" aria-label="Cerrar celebración">×</button>';
  node.classList.add("visible");
  const current = String(Date.now()) + Math.random();
  node.setAttribute("data-celebration", current);
  node
    .querySelector("button")
    ?.addEventListener("click", () => node?.classList.remove("visible"));
  window.setTimeout(() => {
    if (node?.getAttribute("data-celebration") === current)
      node.classList.remove("visible");
  }, 6000);
}
