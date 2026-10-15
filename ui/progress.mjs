import { levelProgress } from "../core/motivation.mjs";
import { motivationMarkup } from "./motivation.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { aggregate, mastery, streak, dayKey, DAY } from "../core/learning.mjs";
import { esc, el, metric, number, heading, animateXP } from "./components.mjs";
function legacy() {
  try {
    const data = JSON.parse(
      localStorage.getItem("oposprint-history-v1") ?? "[]",
    );
    return Array.isArray(data)
      ? data.filter(
          (i) => i && Number.isFinite(i.score) && Number.isFinite(i.correct),
        )
      : [];
  } catch {
    return [];
  }
}
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {()=>void} onReset */
export function renderProgress(host, state, onReset) {
  const stats = aggregate(state, "concept");
  const mastered = Object.values(stats).filter(
    (s) => mastery(s).status === "DOMINADO",
  ).length;
  const corrected = Object.values(stats).filter(
    (s) => s.incorrectCount > 0 && mastery(s).status === "DOMINADO",
  ).length;
  const exams = state.attempts.filter(
    (a) => a.kind === "exam" || a.kind === "official",
  );
  const old = legacy();
  const all = [...exams, ...old];
  const best = all.length ? Math.max(...all.map((a) => a.score)) : null;
  const correct = state.events.filter((e) => e.correct).length;
  const answered = state.events.filter((e) => !e.blank).length;
  const minutes = state.events.reduce((s, e) => s + e.responseMs, 0) / 60000;
  const categories = aggregate(state, "category");
  const badges = [
    answered >= 10 ? "Primeras 10 preguntas" : null,
    mastered >= 1 ? "Primer concepto dominado" : null,
    exams.length >= 1 ? "Primer simulacro completo" : null,
    streak(state) >= 3 ? "Racha de 3 días" : null,
  ].filter(Boolean);
  const global =
    stats && Object.values(stats).length
      ? Math.round(
          Object.values(stats).reduce((sum, s) => sum + mastery(s).score, 0) /
            Object.values(stats).length,
        )
      : 0;
  const ranked = Object.entries(categories).sort(
    (a, b) => mastery(a[1]).score - mastery(b[1]).score,
  );
  const latest = exams.at(-1);
  host.innerHTML =
    heading(
      "Mi progreso",
      "Dominio estimado a partir de intentos y errores recientes; las cifras no predicen una plaza.",
    ) +
    '<section class="progress-overview"><div><div class="eyebrow">TU CONSTANCIA TIENE FORMA</div><h2>Nivel ' +
    levelProgress(state.xp).level +
    " — " +
    levelProgress(state.xp).name +
    '</h2><div class="xp-value">' +
    state.xp +
    ' <small>XP</small></div><progress value="' +
    (state.xp % 500) +
    '" max="500" aria-label="XP hacia el siguiente nivel"></progress><p>' +
    (500 - (state.xp % 500)) +
    ' XP hasta el siguiente nivel</p></div><div class="overview-metrics">' +
    metric("Dominio global", global + " %", "Media de conceptos practicados") +
    metric(
      "Nota orientativa",
      latest ? number(latest.score, 2) + "/10" : "—",
      "Último simulacro medido; no predicción oficial",
    ) +
    metric(
      "Racha",
      streak(state) + (streak(state) === 1 ? " día" : " días"),
      "Un día más de constancia",
    ) +
    '</div></section><div class="content-grid"><article class="analysis-card"><div class="eyebrow">TEMAS FUERTES</div><h2>' +
    esc(ranked.at(-1)?.[0] ?? "Tu primera fortaleza está por descubrir") +
    '</h2><p>Mayor dominio estimado entre las materias practicadas.</p></article><article class="analysis-card"><div class="eyebrow">PRÓXIMO FOCO</div><h2>' +
    esc(ranked[0]?.[0] ?? "Empieza con una práctica") +
    '</h2><p>Refuerza conceptos antes de acelerar.</p></article></div><div class="stats-grid compact-stats">' +
    metric("Simulacros completados", String(all.length)) +
    metric(
      "Mejor nota penalizada",
      best === null ? "—" : number(best, 2) + "/10",
    ) +
    metric(
      "Media de aciertos",
      state.events.length
        ? number((correct / state.events.length) * 100) + " %"
        : "—",
      "Medida en el motor adaptativo",
    ) +
    metric("Preguntas realizadas", String(answered)) +
    metric(
      "Racha de estudio",
      String(streak(state)) + (streak(state) === 1 ? " día" : " días"),
    ) +
    metric("Conceptos dominados", String(mastered)) +
    metric("Errores corregidos", String(corrected)) +
    metric("Tiempo de actividad", number(minutes) + " min") +
    metric(
      "XP · nivel",
      state.xp + " · " + (1 + Math.floor(state.xp / 500)),
      "+10 primera respuesta correcta del día por pregunta; +25 nuevo dominio; +100 simulacro; +20 misión diaria",
    ) +
    '</div><div class="content-grid"><article class="analysis-card"><h2>Dominio por materias</h2>' +
    Object.entries(categories)
      .map(
        ([name, s]) =>
          "<p>" +
          esc(name) +
          " · " +
          mastery(s).score +
          " % · " +
          s.attempts +
          ' intentos<progress max="100" value="' +
          mastery(s).score +
          '" aria-label="Dominio ' +
          esc(name) +
          '"></progress></p>',
      )
      .join("") +
    '</article><article class="analysis-card"><div class="eyebrow">OBJETIVO DE HOY</div><h2>Un poco cada día.</h2><p>Hoy: 10 preguntas y 1 lección. ' +
    (state.days[dayKey()]?.answered ?? 0) +
    "/10 preguntas · " +
    (state.days[dayKey()]?.lessons ?? 0) +
    '/1 lección.</p><div class="weekly-grid">' +
    Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(Date.now() - (6 - i) * DAY);
      const day = state.days[key];
      return (
        '<div class="activity-day"><div class="activity-bar" style="--activity: ' +
        Math.min(100, (day?.answered ?? 0) * 5) +
        '%" aria-hidden="true"></div><small>' +
        key.slice(5) +
        "</small><b>" +
        (day?.answered ?? 0) +
        "</b><span>preguntas</span></div>"
      );
    }).join("") +
    "</div><p>Insignias: " +
    (badges.length
      ? badges.map(esc).join(" · ")
      : "Empieza tu primera misión") +
    '</p></article></div><article class="analysis-card"><div class="eyebrow">TU RECORRIDO</div><h2>Últimos simulacros y prácticas</h2><div class="table-scroll"><table><thead><tr><th>Fecha</th><th>Modo</th><th>Aciertos</th><th>Nota penalizada</th></tr></thead><tbody>' +
    state.attempts
      .slice(-20)
      .reverse()
      .map(
        (a) =>
          "<tr><td>" +
          new Date(a.at).toLocaleDateString("es-ES") +
          "</td><td>" +
          esc(a.sessionOptions?.title ?? a.kind) +
          "</td><td>" +
          a.correct +
          "/" +
          a.questionIds.length +
          "</td><td>" +
          number(a.score, 2) +
          "</td></tr>",
      )
      .join("") +
    "</tbody></table></div><p>" +
    old.length +
    ' intentos clásicos conservados con sus estadísticas originales. Los resultados comunicados de 19/30 y 18/30 son contexto, no eventos medidos.</p></article><div class="panel-actions"><button class="secondary-button" data-export>Exportar progreso</button><button class="secondary-button" data-reset>Restablecer progreso adaptativo</button></div>';
  host
    .querySelector(".progress-overview")
    ?.insertAdjacentHTML("afterend", motivationMarkup(state));
  const courses = curriculum.topics
    .map((t) => ({ topic: t, progress: state.pedagogy.topics[t.id] }))
    .filter((item) => item.progress?.revision === item.topic.revision);
  const complete = courses.filter((item) =>
    item.progress.completedSteps.includes("minitest"),
  ).length;
  const due = courses.filter(
    (item) =>
      item.progress.reviewDueAt > 0 && item.progress.reviewDueAt <= Date.now(),
  ).length;
  host
    .querySelector(".progress-overview")
    ?.insertAdjacentHTML(
      "afterend",
      '<article class="analysis-card"><div class="eyebrow">TU RUTA DE FUNDAMENTOS A EXAMEN</div><h2>' +
        complete +
        "/" +
        curriculum.topics.length +
        " recorridos completados</h2><p>" +
        due +
        ' temas con repaso pendiente. Completar el recorrido no equivale a dominar toda la materia.</p><progress value="' +
        complete +
        '" max="' +
        curriculum.topics.length +
        '" aria-label="Recorridos completados"></progress><button class="secondary-button" data-course-progress>Continuar aprendizaje →</button></article>',
    );
  el(host, "[data-course-progress]").onclick = () =>
    document.dispatchEvent(
      new CustomEvent("oposprint-route", { detail: "aprender" }),
    );
  const xp = host.querySelector(".xp-value");
  if (xp)
    xp.innerHTML =
      "<span data-xp-count>" +
      number(state.xp, 0) +
      "</span> <small>XP</small>";
  animateXP(host, state.xp);
  el(host, "[data-export]").onclick = () => {
    const blob = new Blob(
      [JSON.stringify({ learning: state, legacy: old }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oposprint-progreso.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  el(host, "[data-reset]").onclick = () => {
    if (
      !window.confirm(
        "Restablecer el progreso adaptativo elimina sus estadísticas, XP y repasos en este navegador. El historial clásico se conserva. ¿Continuar?",
      )
    )
      return;
    onReset();
  };
}
