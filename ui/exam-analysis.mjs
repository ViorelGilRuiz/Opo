import { examAnalysis } from "../core/exam-analysis.mjs";
import { esc, number } from "./components.mjs";
/** @param {import('../core/types.js').LearningState} state @param {import('../core/types.js').Question[]} questions @param {import('../core/types.js').Attempt} attempt */
export function examAnalysisMarkup(state, questions, attempt) {
  const report = examAnalysis(state, questions, attempt);
  return (
    '<section class="analysis-card"><h2>Análisis por temas</h2><div class="table-scroll"><table><thead><tr><th scope="col">Tema</th><th scope="col">Aciertos</th><th scope="col">Fallos</th><th scope="col">Blancos</th></tr></thead><tbody>' +
    report.topics
      .map(
        (r) =>
          '<tr><th scope="row">' +
          esc(r.topic) +
          "</th><td>" +
          r.correct +
          "/" +
          r.total +
          "</td><td>" +
          r.wrong +
          "</td><td>" +
          r.blank +
          "</td></tr>",
      )
      .join("") +
    "</tbody></table></div><h3>Comparación con el anterior</h3><p>" +
    (report.previous
      ? "Misma modalidad, tamaño y penalización: " +
        number(report.previous.score, 2) +
        " → " +
        number(attempt.score, 2) +
        "/10. Diferencia " +
        number(attempt.score - report.previous.score, 2) +
        ". La dificultad de las selecciones puede variar."
      : "Todavía no hay otro intento comparable de esta modalidad, tamaño y penalización.") +
    "</p><h3>Cuaderno de errores recurrentes</h3>" +
    (report.recurrent.length
      ? report.recurrent
          .map(
            (r) =>
              "<p>" +
              esc(r.question.concept) +
              " · " +
              r.count +
              ' fallos acumulados <button class="secondary-button" data-memory-question="' +
              esc(r.question.id) +
              '">Mi nota</button></p>',
          )
          .join("")
      : "<p>No hay preguntas de este intento con dos fallos acumulados.</p>") +
    "<details><summary>Conocimientos dominados y pendientes</summary>" +
    report.knowledge
      .map(
        (r) =>
          "<p>" +
          esc(r.concept) +
          " · " +
          esc(r.status) +
          " · índice " +
          r.score +
          "/100</p>",
      )
      .join("") +
    "</details><h3>Plan según este resultado</h3><p>20 min de repaso de errores, 30 min para explicar sin ayuda " +
    esc(report.topics[0]?.topic ?? "los conceptos pendientes") +
    ", 50 min de práctica y 20 min de corrección. Usa otra pregunta oficial del concepto para comprobar la transferencia; ver una solución no demuestra comprensión.</p></section>"
  );
}
