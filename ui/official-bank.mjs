import { verifiedQuestionBank } from "../data/official-catalog.mjs";
import { esc, el, heading } from "./components.mjs";
/** @param {HTMLElement} host */
export function renderOfficialBank(host) {
  host.innerHTML =
    heading(
      "Banco de preguntas verificadas",
      verifiedQuestionBank.length +
        " preguntas válidas. Las claves y soluciones se consultan después de practicar; aquí se muestra procedencia y cobertura.",
    ) +
    '<article class="analysis-card"><label>Buscar por concepto, convocatoria o materia<input type="search" data-bank-search></label><div data-bank-results></div></article>';
  const draw = () => {
    const term = /** @type {HTMLInputElement} */ (
      el(host, "[data-bank-search]")
    ).value.toLocaleLowerCase("es");
    const qs = verifiedQuestionBank.filter((q) =>
      [
        q.concept,
        q.topic,
        q.category,
        q.provenance?.administration,
        q.provenance?.call,
      ]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(term),
    );
    el(host, "[data-bank-results]").innerHTML =
      "<p>" +
      qs.length +
      " preguntas</p>" +
      qs
        .map(
          (q) =>
            "<details><summary>" +
            esc(q.provenance.administration) +
            " · " +
            esc(q.provenance.originalNumber) +
            " · " +
            esc(q.concept) +
            "</summary><p>" +
            esc(q.prompt) +
            "</p><p>" +
            esc(q.provenance.body) +
            " · " +
            esc(q.provenance.call) +
            " · ejercicio " +
            q.provenance.exercise +
            " · " +
            (q.reserve ? "reserva" : "ordinaria") +
            " · verificada</p><p>" +
            esc(q.provenance.reference) +
            "</p><p>SHA-256 cuestionario: <code>" +
            esc(q.provenance.documentHash) +
            "</code></p><p>SHA-256 plantilla: <code>" +
            esc(q.provenance.keyHash) +
            '</code></p><a target="_blank" rel="noopener" href="' +
            esc(q.provenance.documentUrl) +
            '">Fuente oficial del cuestionario</a></details>',
        )
        .join("");
  };
  el(host, "[data-bank-search]").addEventListener("input", draw);
  draw();
}
