import { esc } from "./components.mjs";

/** @param {import('../core/types.js').Question[]} questions @param {(number|null)[]} picks */
export function keyConceptsMarkup(questions, picks) {
  const missed = questions.filter((q, i) => picks[i] !== q.answer);
  if (!missed.length) return '<section class="analysis-card"><h2>Conceptos clave: pleno</h2><p>Explica sin mirar por qué son correctas tus respuestas y compruébalo con otras preguntas oficiales.</p></section>';
  const groups = new Map();
  for (const q of missed) {
    const key = q.concept || q.topic;
    const group = groups.get(key) ?? [];
    group.push(q);
    groups.set(key, group);
  }
  return '<section class="analysis-card key-concepts"><p class="eyebrow">TU REPASO PRIORITARIO</p><h2>Conceptos clave que reforzar</h2><p>Prioridad según tus fallos y blancos de este intento. Lee la idea, cierra la ayuda y explícala con tus palabras antes de practicar otra pregunta.</p>' +
    [...groups.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 5).map(([concept, items]) => {
      const q = items[0];
      return '<article class="recall-item"><h3>' + esc(concept) + '</h3><p>' + items.length + ' preguntas por reforzar · ' + esc(q.topic) + '</p><details><summary>Estudiar la idea y la regla de memoria</summary><p>' + esc(q.teaching?.simple || q.explanation) + '</p><p class="memory-trick">' + esc(q.trick) + '</p></details><p><b>Comprueba que lo entiendes:</b> ¿por qué es correcta «' + esc(q.options[q.answer]) + '»? ¿Qué cambiaría para que otra opción fuera válida?</p><button class="secondary-button" data-teacher-question="' + esc(q.id) + '" data-teacher-zero-start>Aprender este concepto desde cero</button><button class="secondary-button" data-memory-question="' + esc(q.id) + '">Escribir mi regla</button></article>';
    }).join('') + '</section>';
}
