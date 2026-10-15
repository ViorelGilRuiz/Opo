import test from "node:test";
import assert from "node:assert/strict";
import { keyConceptsMarkup } from "../ui/key-concepts.mjs";
import { verifiedQuestionBank } from "../data/official-catalog.mjs";

test("El repaso agrupa fallos y blancos por concepto, prioriza repetidos y escapa contenido", () => {
  const base = verifiedQuestionBank[0];
  const questions = [
    { ...base, id: 'a', concept: '<concepto>', explanation: '<script>' },
    { ...base, id: 'b', concept: 'Otro' },
    { ...base, id: 'c', concept: 'Otro' },
    { ...base, id: 'd', concept: 'Acertado' },
  ];
  const html = keyConceptsMarkup(questions, [null, null, null, base.answer]);
  assert.ok(html.indexOf('<h3>Otro') < html.indexOf('<h3>&lt;concepto&gt;'));
  assert.ok(!html.includes('<h3>Acertado'));
  assert.ok(!html.includes('<script>'));
  assert.match(html, /2 preguntas por reforzar/);
  assert.match(keyConceptsMarkup([base], [base.answer]), /pleno/);
});
