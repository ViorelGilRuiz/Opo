import { eligibleOfficialQuestions } from "../core/official-exam.mjs";
import { renderOfficialBank } from "./official-bank.mjs";
import { verifiedQuestionBank } from "../data/official-catalog.mjs";
import { relatedOfficialQuestions } from "../core/reinforcement.mjs";
import { resumableQuestions } from "../core/session-draft.mjs";
import { syncMotivation } from "../core/motivation.mjs";
import { motivationConfig } from "../data/motivation.mjs";
import { celebrate } from "./motivation.mjs";
import { startTraining } from "./training.mjs";
import { trainingQuestions } from "../data/course-bank.mjs";
import { createLocalTeacherProvider } from "../core/teacher-local.mjs";
import { teacherNotes } from "../data/teacher-notes.mjs";
import { mountTeacher } from "./teacher.mjs";
import { curriculum } from "../data/curriculum.mjs";
import { courseQuestionBank } from "../data/course-bank.mjs";
import { openCourse } from "./course.mjs";
import { renderCatalog } from "./catalog.mjs";
import { renderPractice } from "./practice.mjs";
import { renderExam } from "./exam.mjs";
import { renderErrors } from "./errors.mjs";
import { renderProgress } from "./progress.mjs";
import { renderHome } from "./home.mjs";
import { lessons } from "../data/active-lessons.mjs";
import { tracks } from "../data/tracks.mjs";
import { initialState, DAY } from "../core/learning.mjs";
import { loadState, saveState } from "../core/storage.mjs";
import { el, toast, esc } from "./components.mjs";
import { startSession } from "./session.mjs";
import { openLesson } from "./lessons.mjs";
const host = /** @type {HTMLElement} */ (
  document.querySelector("#learningPlatform")
);
const storage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
};
const loaded = loadState(storage);
let state = loaded.state;
let writable = !loaded.warning;
let route = "inicio";
syncMotivation(state, motivationConfig);
const teacherProvider = createLocalTeacherProvider(
  curriculum,
  verifiedQuestionBank,
  lessons,
  teacherNotes,
);
/** @type {ReturnType<typeof mountTeacher>|null} */ let teacherView = null;
/** @type {ReturnType<typeof mountTeacher>|null} */ let teacherModal = null;
const teacherDialog = /** @type {HTMLDialogElement} */ (
  document.querySelector("#teacherDialog")
);
function closeTeacher() {
  teacherModal?.dispose();
  teacherModal = null;
  if (typeof teacherDialog.close === "function") teacherDialog.close();
  else teacherDialog.removeAttribute("open");
}
function disposeTeacher() {
  teacherView?.dispose();
  teacherView = null;
  closeTeacher();
}

/** @type {ReturnType<typeof startSession> | ReturnType<typeof startTraining> | null} */
let session = null;

function save() {
  celebrate(syncMotivation(state, motivationConfig));
  if (!writable) {
    toast(
      "Datos anteriores no legibles: progreso solo en memoria hasta restablecer el progreso adaptativo.",
    );
    return;
  }
  if (!saveState(storage, state))
    toast(
      "No se pudo guardar. Puedes seguir en esta sesión o exportar tu progreso.",
    );
}
function clearSession() {
  if (
    session?.isActive() &&
    !window.confirm("Salir pierde el simulacro en curso. ¿Continuar?")
  )
    return false;
  session?.dispose();
  session = null;
  return true;
}
function updateNav() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    const active = button.getAttribute("data-route") === route;
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}
/** @param {string} next */
function navigate(next) {
  if (!clearSession()) return;
  disposeTeacher();
  route = next;
  document
    .querySelectorAll("main > .screen")
    .forEach((screen) => screen.classList.add("hidden"));
  updateNav();
  if (next === "inicio") {
    el(document.body, "#dashboard").classList.remove("hidden");
    renderHome(state, writable ? "" : loaded.warning, begin);
  } else {
    host.classList.remove("hidden");
    renderRoute();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** @param {import('../core/types.js').Question[]} questions @param {'practice'|'exam'|'official'} kind @param {import('../core/types.js').SessionOptions} [options] @param {boolean} [resume] */
function begin(questions, kind, options, resume = false) {
  questions = questions.filter((q) =>
    verifiedQuestionBank.some((active) => active.id === q.id),
  );
  if (!questions.length) {
    toast("Todavía no hay preguntas en ese filtro. Prueba todos los temas.");
    return;
  }
  if (!clearSession()) return;
  if (!resume && state.draft) {
    if (
      !window.confirm(
        "Empezar un nuevo test sustituirá el test pausado. ¿Continuar?",
      )
    )
      return;
    delete state.draft;
    save();
  }
  disposeTeacher();
  route = kind === "practice" ? "practicar" : "simulacro";
  updateNav();
  document
    .querySelectorAll("main > .screen")
    .forEach((screen) => screen.classList.add("hidden"));
  host.classList.remove("hidden");
  session = startSession(
    host,
    state,
    questions,
    kind,
    save,
    () => navigate(route),
    options,
  );
  window.scrollTo({ top: 0 });
}
function renderRoute() {
  if (route === "banco") renderOfficialBank(host);
  if (route === "profesor")
    teacherView = mountTeacher(host, teacherProvider, state, save);
  if (route === "aprender" || route === "temario")
    renderCatalog(host, state, route, study, begin);
  if (route === "practicar") renderPractice(host, state, begin);
  if (route === "simulacro") renderExam(host, state, begin);
  if (route === "errores") renderErrors(host, state, begin, study);
  if (route === "progreso")
    renderProgress(host, state, () => {
      state = initialState();
      syncMotivation(state, motivationConfig);
      writable = true;
      save();
      renderRoute();
    });
}

/** @param {string|null} id */
function study(id) {
  if (id?.startsWith("course:")) {
    const topic = curriculum.topics.find((t) => t.id === id.slice(7));
    if (topic) {
      route = "aprender";
      updateNav();
      openCourse(
        host,
        curriculum,
        topic,
        courseQuestionBank,
        state,
        save,
        () => renderCatalog(host, state, "aprender", study, begin),
        (next) => study("course:" + next),
      );
    }
    return;
  }
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return;
  const q = courseQuestionBank.find((q) => q.id === lesson.questionId);
  openLesson(host, lesson, q, state, save, () => {
    route = "aprender";
    updateNav();
    renderCatalog(host, state, route, study, begin);
  });
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-mission-route]");
  if (button)
    navigate(button.getAttribute("data-mission-route") ?? "practicar");
});

document.addEventListener("oposprint-train", (event) => {
  const detail =
    /** @type {CustomEvent<{count?:number;allowMixed?:boolean;scope?:string}>} */ (
      event
    ).detail;
  const count = detail?.count ?? 20;
  if (![20, 40, 80].includes(count)) {
    toast("Selecciona 20, 40 u 80 preguntas.");
    return;
  }
  const bank = detail
    ? eligibleOfficialQuestions(verifiedQuestionBank, {
        scope: detail.scope ?? "technical",
        track: detail.allowMixed ? "" : (state.studyTrack ?? "zaragoza-c1"),
      })
    : state.studyTrack
      ? courseQuestionBank.filter((q) => q.track === state.studyTrack)
      : trainingQuestions;
  if (detail && bank.length < count) {
    const message =
      "Hay " +
      bank.length +
      " oficiales en este banco; se necesitan " +
      count +
      ". Autoriza el banco mixto o reduce la cantidad.";
    const warning = host.querySelector("[data-training-error]");
    if (warning) warning.textContent = message;
    toast(message);
    return;
  }
  if (!clearSession()) return;
  disposeTeacher();
  route = "practicar";
  updateNav();
  document
    .querySelectorAll("main > .screen")
    .forEach((screen) => screen.classList.add("hidden"));
  host.classList.remove("hidden");
  session = startTraining(
    host,
    state,
    bank,
    save,
    () => navigate("practicar"),
    count,
  );
  window.scrollTo({ top: 0 });
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest(
    "[data-teacher-question],[data-teacher-search],[data-teacher-course],[data-teacher-lesson]",
  );
  if (!button) return;
  const context = {
    questionId: button.getAttribute("data-teacher-question") ?? undefined,
    search: button.getAttribute("data-teacher-search") ?? undefined,
    topicId:
      button.getAttribute("data-teacher-course") ??
      (button.getAttribute("data-teacher-lesson")
        ? "legacy:" + button.getAttribute("data-teacher-lesson")
        : undefined),
  };
  teacherModal?.dispose();
  if (button.hasAttribute("data-teacher-zero-start")) {
    state.teacher.level = "zero";
    save();
  }
  teacherModal = mountTeacher(
    el(document.body, "#teacherModalContent"),
    teacherProvider,
    state,
    save,
    context,
  );
  if (!teacherDialog.open) {
    if (typeof teacherDialog.showModal === "function")
      teacherDialog.showModal();
    else teacherDialog.setAttribute("open", "");
  }
});
el(document.body, "[data-close-teacher]").onclick = closeTeacher;
teacherDialog.addEventListener("cancel", () => {
  teacherModal?.dispose();
  teacherModal = null;
});
teacherDialog.addEventListener("close", () => {
  if (teacherDialog.open) return;
  teacherModal?.dispose();
  teacherModal = null;
});
// La corrección registra la preferencia; «Entendido» no concede dominio por sí solo.
host.addEventListener("click", (e) => {
  if (!(e.target instanceof Element)) return;
  const button = e.target.closest("[data-feedback]");
  if (!button) return;
  const id = button.getAttribute("data-id");
  const action = button.getAttribute("data-feedback");
  if (!id || !action) return;
  state.feedback[id] = action;
  const stat = state.questions[id];
  if (stat && action !== "understood")
    stat.dueAt = Date.now() + (action === "unclear" ? 10 * 60000 : DAY);
  save();
  toast(
    action === "understood"
      ? "Anotado. El dominio se comprobará en tus próximos intentos."
      : action === "unclear"
        ? "Concepto priorizado para repaso. Puedes estudiarlo en Aprender."
        : "Añadido al siguiente repaso.",
  );
});
document
  .querySelectorAll("[data-route]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      navigate(button.getAttribute("data-route") ?? "inicio"),
    ),
  );
document.addEventListener("oposprint-route", (e) =>
  navigate(/** @type {CustomEvent<string>} */ (e).detail),
);
document.querySelector("#startExam")?.addEventListener(
  "click",
  () => {
    if (!clearSession()) return;
    disposeTeacher();
    host.classList.add("hidden");
    route = "simulacro";
    updateNav();
  },
  true,
);
const selector = /** @type {HTMLSelectElement} */ (
  document.querySelector("#trackChoice")
);
selector.innerHTML = tracks
  .map(
    (t) =>
      '<option value="' +
      t.id +
      '" ' +
      (!t.enabled ? "disabled" : "") +
      ">" +
      t.name +
      (!t.enabled ? " · próximamente" : "") +
      "</option>",
  )
  .join("");
selector.value = state.studyTrack ?? "zaragoza-c1";
selector.addEventListener("change", () => {
  const previous = state.studyTrack ?? "zaragoza-c1";
  if (!clearSession()) {
    selector.value = previous;
    return;
  }
  if (!["tai", "aragon-c1", "zaragoza-c1"].includes(selector.value)) return;
  state.studyTrack = /** @type {"tai"|"aragon-c1"|"zaragoza-c1"} */ (
    selector.value
  );
  save();
  navigate(route);
});
document.addEventListener("oposprint-resume", () => {
  const draft = state.draft;
  const questions = resumableQuestions(draft, courseQuestionBank);
  if (!draft || !questions.length) {
    delete state.draft;
    save();
    toast("El test guardado ya no es compatible. Empieza uno nuevo.");
    return;
  }
  begin(questions, draft.kind, draft.options, true);
});
renderHome(state, loaded.warning, begin);
updateNav();

const memoryDialog = document.createElement("dialog");
memoryDialog.className = "teacher-dialog";
memoryDialog.setAttribute("aria-label", "Mi regla de memoria");
document.body.append(memoryDialog);
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const trigger = event.target.closest("[data-memory-question]");
  if (!trigger) return;
  const q = verifiedQuestionBank.find(
    (q) => q.id === trigger.getAttribute("data-memory-question"),
  );
  if (!q) return;
  memoryDialog.innerHTML =
    '<article class="analysis-card"><h2>Mi regla de memoria</h2><p>' +
    esc(q.prompt) +
    '</p><label>Escribe qué confundiste y cómo lo recordarás<textarea maxlength="2000" rows="5" id="memoryNote">' +
    esc(state.notes?.[q.id] ?? "") +
    '</textarea></label><p class="coverage-note">Se guarda en este navegador y se incluye al exportar el progreso. No concede XP ni dominio.</p><div class="panel-actions"><button class="primary-button" data-save-note>Guardar regla</button><button class="secondary-button" data-close-note>Cerrar</button></div></article>';
  const close = () => {
    if (typeof memoryDialog.close === "function") memoryDialog.close();
    else memoryDialog.removeAttribute("open");
  };
  el(memoryDialog, "[data-close-note]").onclick = close;
  el(memoryDialog, "[data-save-note]").onclick = () => {
    state.notes ??= {};
    state.notes[q.id] = /** @type {HTMLTextAreaElement} */ (
      el(memoryDialog, "#memoryNote")
    ).value
      .trim()
      .slice(0, 2000);
    save();
    toast("Regla de memoria guardada");
    close();
  };
  if (typeof memoryDialog.showModal === "function") memoryDialog.showModal();
  else memoryDialog.setAttribute("open", "");
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-reinforce-question]");
  if (!button) return;
  const original = verifiedQuestionBank.find(
    (q) => q.id === button.getAttribute("data-reinforce-question"),
  );
  if (!original) return;
  const questions = relatedOfficialQuestions(
    original,
    courseQuestionBank,
    state,
  );
  if (!questions.length) {
    toast("No hay otra pregunta oficial enlazada disponible.");
    return;
  }
  begin(questions, "practice");
});
