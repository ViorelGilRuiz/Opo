import {
  verifiedQuestionBank,
  historicalExams,
  zaragozaHistoricalSet,
} from "../data/official-catalog.mjs";
import {
  eligibleOfficialQuestions,
  selectOfficial80,
} from "../core/official-exam.mjs";
import { el, esc } from "./components.mjs";
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official',options?:import('../core/types.js').SessionOptions)=>void} begin */
export function mountOfficialExam(host, state, begin) {
  const card = document.createElement("section");
  card.className = "analysis-card official-v3";
  card.innerHTML =
    '<p class="eyebrow">OPOSPRINT V3 · PRIORIDAD ZARAGOZA</p><h2>Simulacro de 80 preguntas oficiales</h2><p>Simulacro personalizado: exactamente 80 preguntas distintas, orden aleatorio y alternativas originales. Este formato no se atribuye a ninguna convocatoria.</p><form class="config-form" data-official80-form><label>Administración<select name="v3track"><option value="zaragoza-c1">Zaragoza C1</option><option value="aragon-c1">Aragón C1</option><option value="tai">TAI C1</option><option value="">Mixto Zaragoza, Aragón y TAI</option></select></label><label>Contenido<select name="v3scope"><option value="all">Técnica y legislación histórica</option><option value="technical">Solo técnica</option><option value="law">Solo legislación histórica</option></select></label><label>Materia<select name="v3category"><option value="">Todas las materias</option>' +
    [...new Set(verifiedQuestionBank.map((q) => q.category))]
      .sort()
      .map((c) => "<option>" + esc(c) + "</option>")
      .join("") +
    '</select></label><label>Tema<select name="v3topic"><option value="">Todos los temas</option>' +
    [...new Set(verifiedQuestionBank.map((q) => q.topic))]
      .sort()
      .map((c) => "<option>" + esc(c) + "</option>")
      .join("") +
    '</select></label><label>Tiempo en minutos<input name="v3minutes" type="number" min="1" max="300" step="1" value="80" required></label><label>Baremo de entrenamiento<select name="v3penalty"><option value="origin">Por origen: Zaragoza −0,50; Aragón/TAI −1/3</option><option value="0.25">−0,25 por fallo</option><option value="0.3333333333333333">−1/3 por fallo</option><option value="0.5">−0,50 por fallo</option><option value="0">Sin penalización</option></select></label><label class="mixed-consent"><input type="checkbox" name="v3mixed"> Autorizo completar con oficiales de otros bancos, manteniendo materia, tema y contenido</label><p data-availability role="status" aria-live="polite"></p><button class="primary-button" type="submit">Empezar 80 oficiales</button><p data-official80-error role="alert"></p></form><p class="coverage-note">Legislación histórica: su presencia en estos exámenes no acredita que toda ella sea aplicable a tu próxima convocatoria. Las explicaciones sin revisión se señalan pendientes.</p><h2>Exámenes históricos completos</h2><p>Catálogo de documentos y reglas. No se mezclan convocatorias. Solo se habilitará una reproducción con baremo oficial cuando estén contrastados todos sus documentos.</p>' +
    historicalExams
      .map(
        (e) =>
          '<article class="historical-entry"><h3>' +
          esc(e.title) +
          "</h3><p>" +
          e.questionCount +
          " ordinarias + " +
          e.reserveCount +
          " reservas.</p><p>Documentos pendientes: " +
          esc(e.missing.join("; ")) +
          '.</p><button class="secondary-button" disabled>Modo auténtico · pendiente de documentos</button><a target="_blank" rel="noopener" href="' +
          esc(e.source) +
          '">Consultar fuente oficial</a></article>',
      )
      .join("") +
    '<article class="historical-entry"><h3>Zaragoza · primer ejercicio reconstruido para entrenamiento</h3><p>50 preguntas evaluables, en orden original; las anuladas 15 y 16 se sustituyen por R1 y R2. R3–R5 quedan en el banco. Tiempo y penalización de entrenamiento: usa los valores del formulario superior. La versión histórica aplicable de las bases generales aún no está contrastada. La versión actual consultada indica 55 minutos y −1/4; no se atribuye automáticamente al examen de abril.</p><button class="secondary-button" data-zaragoza-historical>Practicar el primer ejercicio completo · 50</button></article><button class="secondary-button" data-open-bank>Banco de preguntas verificadas →</button>';
  host.prepend(card);
  const form = /** @type {HTMLFormElement} */ (
    el(card, "[data-official80-form]")
  );
  const field = (name) =>
    /** @type {HTMLInputElement|HTMLSelectElement} */ (
      el(form, '[name="' + name + '"]')
    );
  field("v3track").value = state.studyTrack ?? "zaragoza-c1";
  const filters = () => ({
    track: field("v3track").value,
    scope: field("v3scope").value,
    category: field("v3category").value,
    topic: field("v3topic").value,
    allowMixed: /** @type {HTMLInputElement} */ (field("v3mixed")).checked,
  });
  const availability = () => {
    const f = filters();
    const own = eligibleOfficialQuestions(verifiedQuestionBank, f).length;
    const total = eligibleOfficialQuestions(verifiedQuestionBank, {
      ...f,
      track: f.allowMixed ? "" : f.track,
    }).length;
    el(card, "[data-availability]").textContent =
      own +
      " disponibles en el origen seleccionado · " +
      total +
      " disponibles con tu autorización actual · se requieren 80.";
  };
  form.addEventListener("change", availability);
  availability();
  const options = () => {
    const minutes = Number(field("v3minutes").value);
    const penalty =
      field("v3penalty").value === "origin"
        ? undefined
        : Number(field("v3penalty").value);
    return {
      budgetMs: minutes * 60000,
      penalty,
      mode: "custom80",
      rulesVerified: false,
      scoringLabel:
        "Nota de entrenamiento. " +
        (penalty === undefined
          ? "Penalización por origen: Zaragoza −0,50; Aragón/TAI −1/3."
          : "Penalización seleccionada: −" + penalty + " por fallo.") +
        " Blancos sin penalización. No es una nota oficial.",
    };
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const config = options();
    if (
      !Number.isInteger(config.budgetMs / 60000) ||
      config.budgetMs < 60000 ||
      config.budgetMs > 300 * 60000
    ) {
      el(card, "[data-official80-error]").textContent =
        "El tiempo debe ser un entero entre 1 y 300 minutos.";
      return;
    }
    const selection = selectOfficial80(verifiedQuestionBank, filters());
    el(card, "[data-official80-error]").textContent = selection.error;
    if (selection.error) return;
    begin(selection.questions, "exam", {
      ...config,
      title:
        "Simulacro personalizado · 80 preguntas oficiales" +
        (selection.mixed ? " · mixto autorizado" : ""),
    });
  });
  el(card, "[data-zaragoza-historical]").onclick = () => {
    const config = options();
    if (config.budgetMs < 60000 || config.budgetMs > 300 * 60000) return;
    begin(zaragozaHistoricalSet(), "exam", {
      ...config,
      mode: "historical-training",
      title: "Zaragoza 2026 · primer ejercicio completo · entrenamiento",
    });
  };
  el(card, "[data-open-bank]").onclick = () =>
    document.dispatchEvent(
      new CustomEvent("oposprint-route", { detail: "banco" }),
    );
}
