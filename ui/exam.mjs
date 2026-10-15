import { mountOfficialExam } from "./official-exam.mjs";
import { zaragozaQuestions } from "../data/official-zaragoza.mjs";
import {
  technicalTheoryQuestions,
  courseQuestionBank,
} from "../data/course-bank.mjs";
import { aragonQuestions } from "../data/official-aragon.mjs";
import { selectQuestions, officialSet } from "../core/learning.mjs";
import { el, heading } from "./components.mjs";
/** @param {HTMLElement} host @param {import('../core/types.js').LearningState} state @param {(questions:import('../core/types.js').Question[],kind:'practice'|'exam'|'official',options?:import('../core/types.js').SessionOptions)=>void} begin */
export function renderExam(host, state, begin) {
  host.innerHTML =
    heading(
      "Selecciones técnicas de entrenamiento",
      "Zaragoza C1, Aragón C1 y TAI. Estas selecciones conservan solo contenido técnico. Para incluir legislación histórica utiliza la configuración V3 superior.",
    ) +
    '<div class="content-grid"><article class="analysis-card"><p class="eyebrow">TU EXAMEN · ZARAGOZA</p><h2>Auxiliar Informática C1 · 28/04/2026</h2><p>37 preguntas técnicas: 34 ordinarias y 3 reservas. Tres respuestas originales A/B/C. Administración y normativa aplazadas; preguntas 15 y 16 anuladas según plantilla definitiva publicada el 3 de junio.</p><label>Cómo quieres entrenar<select id="zaragozaMode"><option value="exam">Simulacro técnico · 34 + reservas R1/R2 sustitutas · 36 preguntas</option><option value="guided">Aprender con cada respuesta · 20 preguntas</option><option value="reinforce">Reforzar con Zaragoza, Aragón y TAI · 50 preguntas</option></select></label><button class="primary-button" data-zaragoza>Empezar Zaragoza</button><p class="coverage-note">Tiempo de entrenamiento: 50 minutos. Selección parcial técnica; penalización orientativa −0,50 por error, blancos sin penalización. No reproduce la prueba completa ni su nota oficial.</p><a href="https://www.zaragoza.es/oferta/ofertaDetalle.jsp?id=1731" target="_blank" rel="noopener">Cuestionario y plantilla definitiva · Ayuntamiento de Zaragoza</a></article><article class="analysis-card"><p class="eyebrow">PRIORIDAD ARAGÓN</p><h2>Ejecutivos de Informática C1 · 2026</h2><p>Examen del 13 de junio de 2026, convocatoria 24/0023. 73 preguntas técnicas del primer ejercicio y 44 válidas del segundo, incluidas reservas. Plantilla definitiva de 1 de julio: pregunta 20 del segundo ejercicio anulada.</p><label>Entrenamiento<select id="aragonExercise"><option value="theory">Teoría técnica · 50 preguntas</option><option value="practice">Segundo ejercicio · 40 preguntas, reserva 41 sustituye a la 20</option><option value="mixed">Mixto técnico · 50 preguntas</option></select></label><button class="primary-button" data-aragon>Empezar Aragón C1</button><p class="coverage-note">Selección histórica de entrenamiento. 50 minutos; no reproduce el examen completo ni su nota oficial.</p><a target="_blank" rel="noopener" href="https://www.aragon.es/-/ejecutivos-de-informatica.-c1.-oferta-de-empleo-publico-de-2018-y-2022">Cuestionarios y plantillas · Gobierno de Aragón</a></article><article class="analysis-card"><h2>TAI 2024 · teoría técnica</h2><p>50 preguntas · 50 minutos. Opciones originales; soluciones al finalizar.</p><button class="primary-button" data-new>Empezar 50 oficiales TAI</button><button class="secondary-button" data-short>Simulacro técnico · 30</button><h3>Selección histórica con supuesto</h3><p>59 preguntas técnicas de teoría y 20 de un supuesto. Bloque I y anulaciones excluidos. Tiempo de entrenamiento: 120 minutos.</p><label>Supuesto<select id="practicalChoice"><option value="1">I · Desarrollo</option><option value="2">II · Sistemas y comunicaciones</option></select></label><button class="secondary-button" data-official>Entrenar selección TAI histórica</button></article></div><article class="analysis-card"><h2>Preparar la siguiente convocatoria</h2><p>Estos exámenes son material histórico. Consulta las bases y fechas de tu siguiente convocatoria en el IAAP; esta aplicación no presupone su calendario ni que su formato vaya a ser idéntico.</p><a href="https://www.aragon.es/-/empleo-publico-en-aragon-convocatorias" target="_blank" rel="noopener">Convocatorias oficiales de Aragón</a></article>';
  el(host, "[data-zaragoza]").onclick = () => {
    const mode =
      /** @type {HTMLSelectElement} */ (el(host, "#zaragozaMode")).value ||
      "exam";
    state.studyTrack = "zaragoza-c1";
    const bank =
      mode === "reinforce"
        ? courseQuestionBank
        : mode === "exam"
          ? zaragozaQuestions.filter(
              (q) => !q.reserve || [51, 52].includes(q.number ?? 0),
            )
          : zaragozaQuestions;
    const selected =
      mode === "exam"
        ? bank
        : selectQuestions(state, bank, {
            count: mode === "guided" ? 20 : 50,
            mode: "smart",
          });
    begin(selected, mode === "guided" ? "practice" : "exam");
  };
  mountOfficialExam(host, state, begin);
  const tai = technicalTheoryQuestions.filter((q) => q.track === "tai");
  el(host, "[data-new]").onclick = () =>
    begin(selectQuestions(state, tai, { count: 50, mode: "all" }), "exam");
  el(host, "[data-short]").onclick = () =>
    begin(selectQuestions(state, tai, { count: 30, mode: "smart" }), "exam");
  el(host, "[data-official]").onclick = () =>
    begin(
      officialSet(
        courseQuestionBank.filter((q) => q.track === "tai"),
        Number(
          /** @type {HTMLSelectElement} */ (el(host, "#practicalChoice")).value,
        ),
      ),
      "official",
    );
  el(host, "[data-aragon]").onclick = () => {
    const mode = /** @type {HTMLSelectElement} */ (el(host, "#aragonExercise"))
      .value;
    const bank =
      mode === "practice"
        ? aragonQuestions.filter(
            (q) => q.section === 1 && (!q.reserve || q.number === 41),
          )
        : mode === "theory"
          ? aragonQuestions.filter((q) => q.section === 0)
          : aragonQuestions;
    begin(
      selectQuestions(state, bank, {
        count: mode === "practice" ? 40 : 50,
        mode: "all",
      }),
      "exam",
    );
  };
}
