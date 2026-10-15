import { curriculum } from "../data/curriculum.mjs";
import { nextAssessment } from "../core/pedagogy.mjs";
import { courseQuestionBank as officialQuestions } from "../data/course-bank.mjs";
import { lessons } from "../data/active-lessons.mjs";
import { blocks, officialSource } from "../data/tracks.mjs";
import { esc, el, heading } from "./components.mjs";
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {string} route @param {(id:string|null)=>void} study @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official')=>void} begin */
export function renderCatalog(host, state, route, study, begin) {
  host.innerHTML =
    heading(
      route === "aprender" ? "Aprender, paso a paso" : "Buscar en el temario",
      "8 recorridos técnicos y fichas de apoyo. Preguntas oficiales de Aragón 2026 y TAI 2024; Administración aplazada.",
    ) +
    '<label class="search-label">Buscar en el temario<input type="search" id="topicSearch" placeholder="DNS, OSI, SQL, IPv6…"></label><p><a href="' +
    officialSource +
    '" target="_blank" rel="noopener">Programa oficial TAI · convocatoria 2025 (BOE, anexo V)</a>. Aragón C1: banco técnico del 13/06/2026, con plantilla definitiva del IAAP.</p><div data-catalog></div>';
  const normalize = (text) =>
    text
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const target = el(host, "[data-catalog]");
  const render = (query = "") => {
    const term = query
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    const selected = lessons.filter((l) =>
      (l.title + " " + l.category + " " + l.basic + " " + l.technical)
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .includes(term),
    );
    const references = term
      ? officialQuestions
          .filter(
            (q) =>
              q.answer >= 0 &&
              (q.topic + " " + q.prompt)
                .toLocaleLowerCase("es")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(term),
          )
          .slice(0, 20)
      : [];
    const courseTopics = curriculum.topics.filter((t) =>
      normalize(
        t.title +
          " " +
          t.summary +
          " " +
          t.concepts
            .map((c) => c.title + " " + c.simple + " " + c.technical)
            .join(" "),
      ).includes(term),
    );
    target.innerHTML =
      '<section class="catalog-block"><div class="section-heading"><div><div class="eyebrow">FUNDAMENTOS → APLICACIÓN → EXAMEN</div><h2>Recorridos guiados</h2><p>Introducción, conceptos, ejemplo, ejercicio, minitest y repaso. La comprobación oficial requiere al menos 80 % de aciertos; no equivale a dominar toda la materia.</p></div></div><div class="content-grid">' +
      courseTopics
        .map((t) => {
          const p = state.pedagogy.topics[t.id];
          const current = p?.revision === t.revision ? p : null;
          return (
            '<article class="analysis-card"><div class="eyebrow">BLOQUE ' +
            esc(t.block) +
            " · " +
            t.estimatedMinutes +
            " MIN</div><h3>" +
            esc(t.title) +
            "</h3><p>" +
            esc(t.summary) +
            "</p><p>" +
            (!current
              ? "Por empezar"
              : current.completedSteps.includes("minitest")
                ? "Recorrido completado · repaso " +
                  new Date(current.reviewDueAt).toLocaleDateString("es-ES")
                : "Siguiente comprobación: " +
                  esc(nextAssessment(current, t)?.title ?? "Repaso")) +
            '</p><button class="primary-button" data-course="' +
            t.id +
            '">' +
            (current ? "Continuar tema" : "Empezar desde fundamentos") +
            " →</button></article>"
          );
        })
        .join("") +
      "</div></section>" +
      (route === "temario"
        ? '<section class="catalog-block"><h2>Mapa de cobertura del temario</h2><p>Agrupaciones didácticas, no una reproducción literal de los epígrafes oficiales. Referencia: anexo V de la convocatoria indicada.</p><div class="content-grid">' +
          curriculum.areas
            .filter((a) => normalize(a.title + " " + a.coverage).includes(term))
            .map(
              (a) =>
                '<article class="analysis-card"><div class="eyebrow">' +
                esc(a.block) +
                " · " +
                a.officialRefs.map(esc).join(", ") +
                "</div><h3>" +
                esc(a.title) +
                '</h3><span class="visual-chip">' +
                (a.topicIds.length
                  ? "Recorrido parcial publicado"
                  : "Recorrido pendiente") +
                "</span><p>" +
                esc(a.coverage) +
                "</p></article>",
            )
            .join("") +
          "</div></section>"
        : "") +
      '<h2>Fichas técnicas de apoyo</h2><p class="coverage-note">El catálogo anterior se conserva; una ficha breve no sustituye un recorrido completo.</p>' +
      blocks.filter(block=>block.id!=="I")
        .map(
          (block) =>
            '<section class="catalog-block"><h2>Bloque ' +
            block.id +
            " · " +
            esc(block.name) +
            '</h2><p class="coverage-note">' +
            esc(block.coverage) +
            '</p><div class="content-grid">' +
            selected
              .filter((l) => l.block === block.id)
              .map(
                (l) =>
                  '<article class="analysis-card"><div class="eyebrow">' +
                  esc(l.category) +
                  "</div><h3>" +
                  esc(l.title) +
                  "</h3><p>" +
                  esc(l.basic) +
                  "</p><small>" +
                  (state.completedLessons.includes(l.id)
                    ? "Lección completada"
                    : "Pendiente") +
                  "</small>" +
                  (l.prerequisite
                    ? "<p>Base recomendada: " +
                      esc(
                        lessons.find((p) => p.id === l.prerequisite)?.title ??
                          "",
                      ) +
                      "</p>"
                    : "") +
                  '<button class="secondary-button" data-lesson="' +
                  l.id +
                  '">Estudiar concepto →</button></article>',
              )
              .join("") +
            "</div>" +
            (block.id === "I"
              ? "<p>Constitución, administración, protección de datos y administración electrónica: consulta el programa oficial y el modelo histórico; lecciones legales pendientes de revisión.</p>"
              : "") +
            "</section>",
        )
        .join("") +
      (!selected.length
        ? '<p role="status">No hay una lección publicada que coincida. Consulta los bloques y el programa oficial.</p>'
        : "");

    if (references.length)
      target.innerHTML +=
        '<section class="catalog-block"><h2>Preguntas oficiales relacionadas · Aragón y TAI</h2><p>Enunciados oficiales técnicos y clave definitiva histórica. Explicaciones didácticas de OpoSprint.</p>' +
        references
          .map(
            (q) =>
              '<article class="analysis-card"><h3>' +
              esc(q.topic) +
              "</h3><p>" +
              esc(q.prompt) +
              '</p><button class="secondary-button" data-official-question="' +
              q.id +
              '">Intentar esta pregunta</button></article>',
          )
          .join("") +
        "</section>";
    target
      .querySelectorAll("[data-course]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          study("course:" + b.getAttribute("data-course")),
        ),
      );
    target.querySelectorAll("[data-official-question]").forEach((b) =>
      b.addEventListener("click", () => {
        const q = officialQuestions.find(
          (q) => q.id === b.getAttribute("data-official-question"),
        );
        if (q) begin([q], "practice");
      }),
    );

    target
      .querySelectorAll("[data-lesson]")
      .forEach((b) =>
        b.addEventListener("click", () => study(b.getAttribute("data-lesson"))),
      );
  };
  render();
  el(host, "#topicSearch").addEventListener("input", (e) =>
    render(/** @type {HTMLInputElement} */ (e.target).value),
  );
}
