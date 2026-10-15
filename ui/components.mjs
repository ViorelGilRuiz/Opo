/** @param {unknown} value */
export function esc(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c,
  );
}
/** @param {number} value @param {number} [digits] */
export function number(value, digits = 1) {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
/** @param {number} ms */
export function time(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return (
    String(Math.floor(s / 60)).padStart(2, "0") +
    ":" +
    String(s % 60).padStart(2, "0")
  );
}
/** @param {HTMLElement} host @param {string} selector @returns {HTMLElement} */
export function el(host, selector) {
  const node = host.querySelector(selector);
  if (!(node instanceof HTMLElement))
    throw new Error("Elemento no encontrado: " + selector);
  return node;
}
/** @param {string} text */
export function toast(text) {
  const node = document.querySelector("#toast");
  if (!node) return;
  node.textContent = text;
  node.classList.add("visible");
  window.setTimeout(() => node.classList.remove("visible"), 5000);
}
/** @param {string} title @param {string} value @param {string} [detail] */
export function metric(title, value, detail = "") {
  return (
    '<article class="stat-card"><div class="stat-label">' +
    esc(title) +
    '</div><div class="stat-value">' +
    esc(value) +
    '</div><div class="stat-foot">' +
    esc(detail) +
    "</div></article>"
  );
}
/** @param {import('../core/types.js').Question} q @param {number|null} pick @param {boolean} [actions] */
export function correction(q, pick, actions = true) {
  const correct = pick === q.answer;
  return (
    '<article class="correction-card ' +
    (correct ? "correct-card" : "wrong-card") +
    '"><div class="correction-top"><span>' +
    esc(q.category) +
    " · " +
    esc(q.topic) +
    " · " +
    esc(q.difficulty) +
    "</span><strong>" +
    (pick === null
      ? "○ EN BLANCO"
      : correct
        ? "✅ CORRECTA"
        : "❌ INCORRECTA") +
    "</strong></div><h3>" +
    esc(q.prompt) +
    "</h3><p>Tu respuesta: " +
    esc(pick === null ? "En blanco" : q.options[pick]) +
    "</p><p><b>Correcta: " +
    esc(q.options[q.answer]) +
    '</b></p><p class="coverage-note">Ayuda didáctica de OpoSprint, separada del enunciado y de la plantilla oficial.</p><p><b>Concepto que estudiar:</b> ' +
    esc(q.concept) +
    "</p>" +
    (!correct && pick !== null && q.rationales[pick]
      ? '<div class="learning-example"><h4>Por qué falla tu opción</h4><p>' + esc(q.rationales[pick]) + '</p><p>Compara con la correcta: <b>' + esc(q.options[q.answer]) + '</b>. Explica la diferencia antes de continuar.</p></div>'
      : '') +
    (q.teaching
      ? "<h4>Desde cero</h4><p>" +
        esc(q.teaching.simple) +
        "</p><h4>Explicación técnica</h4>"
      : "") +
    '<div class="explanation">' +
    esc(q.explanation) +
    "</div>" +
    (q.rationales.length
      ? '<ul class="option-reasons">' +
        q.options
          .map(
            (o, i) =>
              "<li><b>" + esc(o) + "</b>: " + esc(q.rationales[i]) + "</li>",
          )
          .join("")
      : '<p class="coverage-note">Corrección oficial disponible; explicación de distractores pendiente de revisión didáctica.</p>') +
    '<p class="memory-trick">Regla: ' +
    esc(q.trick) +
    "</p>" +
    (q.teaching
      ? '<details class="learning-example"><summary>Ver un ejemplo para fijarlo</summary><p>' +
        esc(q.teaching.example) +
        "</p><p><b>Ahora tú:</b> explica el concepto sin mirar y por qué descartarías una de las respuestas incorrectas.</p></details>"
      : "") +
    "<small>" +
    esc(q.source) +
    " · Subtema: " +
    esc(q.subtopic) +
    "</small>" +
    officialContext(q) +
    (actions
      ? '<div class="panel-actions"><button data-feedback="understood" data-id="' +
        esc(q.id) +
        '" class="secondary-button">Entendido</button><button data-feedback="later" data-id="' +
        esc(q.id) +
        '" class="secondary-button">Repasar después</button><button data-feedback="unclear" data-id="' +
        esc(q.id) +
        '" class="secondary-button">No lo entiendo</button></div>'
      : "") +
    (actions
      ? '<div class="teacher-callout"><span>¿No lo entiendes?</span><button class="secondary-button" data-teacher-question="' +
        esc(q.id) +
        '" data-teacher-zero-start>Explícamelo desde cero · Profesor →</button><button class="secondary-button" data-memory-question="' +
        esc(q.id) +
        '">Mi regla de memoria</button><button class="secondary-button" data-reinforce-question="' +
        esc(q.id) +
        '">Reforzar con otras oficiales</button></div>'
      : "") +
    "</article>"
  );
}

/** @param {import('../core/types.js').Question} q @param {number|null} pick */
export function quickCorrection(q, pick) {
  return '<section class="quick-correction" aria-label="Corrección de la respuesta"><p><strong>' +
    (pick === q.answer ? 'Correcta. ' : 'Vamos a reforzar esta idea. ') +
    'Respuesta: ' + esc(q.options[q.answer]) + '</strong></p><p><b>Qué recordar:</b> ' +
    esc(q.trick || q.concept) + '</p>' +
    (pick !== null && pick !== q.answer && q.rationales[pick] ? '<p><b>Tu confusión:</b> ' + esc(q.rationales[pick]) + '</p>' : '') +
    '<details><summary>Entenderlo paso a paso y ver la corrección completa</summary>' + correction(q, pick) + '</details></section>';
}

export function heading(title, subtitle) {
  return (
    '<div class="section-heading"><div><div class="eyebrow">OPOSPRINT · TAI C1</div><h1>' +
    title +
    "</h1><p>" +
    subtitle +
    "</p></div></div>"
  );
}

let previousXP = 0;
/** @param {HTMLElement} host @param {number} value */
export function animateXP(host, value) {
  const nodes = host.querySelectorAll("[data-xp-count]");
  const from = Math.min(previousXP, value);
  previousXP = value;
  if (
    !nodes.length ||
    typeof window.requestAnimationFrame !== "function" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const start = performance.now();
  /** @param {number} now */
  function frame(now) {
    const ratio = Math.min(1, (now - start) / 220);
    const shown = Math.round(from + (value - from) * (1 - (1 - ratio) ** 3));
    nodes.forEach((node) => {
      if (node.isConnected) node.textContent = number(shown, 0);
    });
    if (ratio < 1 && Array.from(nodes).some((node) => node.isConnected))
      window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
}

/** @param {import('../core/types.js').Question} q */
export function officialContext(q) {
  if (
    !q.originalPage ||
    !/^\/assets\/(?:aragon|zaragoza)-pages\/(first|second)-[0-9]{1,2}\.png$/.test(
      q.originalPage,
    )
  )
    return "";
  return (
    '<details class="official-context" ' +
    (q.section && [4, 8, 37].includes(q.number ?? 0) ? "open" : "") +
    "><summary>" +
    (q.track === "zaragoza-c1" ? "Zaragoza 2026" : "Aragón 2026") +
    " · " +
    (q.section ? "Segundo" : "Primer") +
    " ejercicio · " +
    (q.reserve ? "Reserva " : "Pregunta ") +
    (q.track === "zaragoza-c1" && q.reserve
      ? "R" + ((q.number ?? 50) - 50)
      : q.number) +
    " · original sin soluciones</summary><p>" +
    esc(q.context ?? "") +
    "</p>" +
    [...(q.contextPages ?? []), q.originalPage]
      .filter((p) =>
        /^\/assets\/(?:aragon|zaragoza)-pages\/(first|second)-[0-9]{1,2}\.png$/.test(
          p,
        ),
      )
      .map(
        (p) =>
          '<a href="' +
          esc(p) +
          '" target="_blank" rel="noopener"><img loading="lazy" class="source-page" src="' +
          esc(p) +
          '" alt="Página del cuestionario oficial, código y diagramas originales"></a>',
      )
      .join("") +
    "</details>"
  );
}
