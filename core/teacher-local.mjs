import {relatedOfficialQuestions} from "./reinforcement.mjs";
/** @import {TeacherProvider,TeacherRequest,TeacherResponse,TeacherNote} from './teacher-types.js' */
/** @import {Curriculum,CourseTopic,Concept,ContentBlock} from './pedagogy-types.js' */
/** @import {Question,Lesson} from './types.js' */
/** @param {string} text */
const normalize = (text) =>
  text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
/** @param {Curriculum} curriculum @param {Question[]} bank @param {Lesson[]} lessons @param {TeacherNote[]} notes @returns {TeacherProvider} */
export function createLocalTeacherProvider(curriculum, bank, lessons, notes) {
  const aliases = [
    ["osi", "osi"],
    ["tcp", "tcpip"],
    ["icmp", "tcpip"],
    ["subnet", "subnetting"],
    ["ipv4", "ipv4"],
    ["ipv6", "ipv4"],
    ["dns", "dns"],
    ["sql", "sql"],
    ["hilos", "operating-systems"],
    ["procesos", "operating-systems"],
    ["ataques web", "security"],
    ["seguridad", "security"],
  ];
  /** @param {TeacherRequest} request */
  function resolve(request) {
    const q = bank.find((q) => q.id === request.context.questionId);
    let topic = curriculum.topics.find((t) => t.id === request.context.topicId);
    if (!topic && q)
      topic = curriculum.topics.find(
        (t) =>
          t.concepts.some((c) => c.questionIds.includes(q.id)) ||
          t.assessments.some((a) => a.questionIds.includes(q.id)),
      );
    let lesson = lessons.find(
      (l) =>
        "legacy:" + l.id === request.context.topicId || l.questionId === q?.id,
    );
    const search = normalize(request.context.search ?? "");
    if (!topic && !lesson && search) {
      const match = aliases.find(([key]) => search.includes(key));
      if (match) topic = curriculum.topics.find((t) => t.id === match[1]);
      else lesson = lessons.find((l) => search.includes(normalize(l.title)));
    }
    const concept =
      topic?.concepts.find((c) => c.id === request.context.conceptId) ??
      topic?.concepts.find(
        (c) => q && (c.questionIds.includes(q.id) || c.title === q.concept),
      ) ??
      topic?.concepts[0];
    return { topic, concept, lesson, q };
  }
  return {
    id: "local-editorial",
    label: "Profesor · contenido local",
    topics: [
      ...curriculum.topics.map((t) => ({
        id: t.id,
        title: t.title,
        coverage: /** @type {'published'} */ ("published"),
        concepts: t.concepts.map((c) => ({ id: c.id, title: c.title })),
      })),
      ...lessons.map((l) => ({
        id: "legacy:" + l.id,
        title: "Ficha · " + l.title,
        coverage: /** @type {'partial'} */ ("partial"),
        concepts: [],
      })),
    ],
    async respond(request, { signal }) {
      if (signal.aborted) throw new Error("Solicitud cancelada.");
      const { topic, concept, lesson, q } = resolve(request);
      const id = topic?.id ?? (lesson ? "legacy:" + lesson.id : undefined);
      const context = {
        ...request.context,
        topicId: id,
        conceptId: concept?.id,
      };
      /** @type {TeacherResponse} */ const response = {
        kind: "explanation",
        title: concept?.title ?? lesson?.title ?? q?.concept ?? "Contenido pendiente",
        blocks: [],
        sources: topic
          ? curriculum.sources.filter((s) => topic.sourceIds.includes(s.id))
          : [],
        coverage: topic ? "published" : "partial",
        notice: topic
          ? "Contenido local revisado; no es una conversación con IA."
          : "Apoyo de una ficha local. La explicación avanzada y la procedencia detallada están pendientes.",
        context,
        questions: [],
      };
      if(q?.teaching){response.coverage="published";response.notice="Ayuda didáctica local de OpoSprint, separada del enunciado y de la plantilla oficial. Banco histórico; no es una conversación con IA.";response.sources=[{id:"zaragoza-1731",kind:"historical-exam",title:"Cuestionario y plantilla definitiva · Ayuntamiento de Zaragoza",url:"https://www.zaragoza.es/oferta/ofertaDetalle.jsp?id=1731",version:"Examen 28/04/2026 · plantilla publicada 03/06/2026",checkedAt:"2026-10-08"}];}
      if (!concept && !lesson && !q?.teaching) {
        response.kind = "unavailable";
        response.notice =
          "Todavía no hay apoyo docente enlazado a este contenido. Elige un tema publicado; no se generará una explicación normativa sin fuentes.";
        return response;
      }
      const note = notes.find((n) => n.topicId === topic?.id);
      const simple = q?.teaching?.simple ?? concept?.simple ?? lesson?.basic ?? "";
      const technical = q?.teaching?.technical ?? concept?.technical ?? lesson?.technical ?? "";
      const example = q?.teaching?.example ?? concept?.example ?? lesson?.example ?? "";
      const memory = q?.trick ?? concept?.memory ?? lesson?.rule ?? "";
      const trap = q?.teaching?.commonError ?? concept?.commonError ?? lesson?.trap ?? "";
      /** @param {string} title @param {string} body @returns {ContentBlock} */
      const text = (title, body) => ({ type: "text", title, body });
      if (request.mode === "easy")
        response.blocks = [
          text(
            request.level === "zero"
              ? "Empezamos desde cero"
              : "La idea esencial",
            simple,
          ),
          {
            type: "callout",
            title: "Comprueba que lo entiendes",
            body:
              request.level === "zero"
                ? "Intenta explicarlo con tus propias palabras. Después pide un esquema y una pregunta para comprobarlo."
                : memory,
          },
        ];
      if (request.mode === "technical")
        response.blocks = [
          ...(request.level === "zero"
            ? [text("Primero, la base", simple)]
            : []),
          text("Explicación técnica", technical),
        ];
      if (request.mode === "example")
        response.blocks = [
          text("Un caso concreto", example),
          ...(topic
            ? topic.example
            : lesson
              ? [
                  {
                    type: /** @type {'callout'} */ ("callout"),
                    title: "Imagen mental",
                    body: lesson.analogy,
                  },
                ]
              : []),
        ];
      if (request.mode === "scheme")
        response.blocks =
          topic?.example.filter((b) =>
            ["layers", "steps", "table"].includes(b.type),
          ) ?? [];
      if (request.mode === "scheme" && !response.blocks.length)
        response.blocks = [
          {
            type: "steps",
            title: "Relaciona las ideas",
            items: q?.teaching?.schema ?? [simple, technical, memory],
          },
        ];
      if (
        request.level === "exam" &&
        !["question", "assessment"].includes(request.mode)
      )
        response.blocks.push({
          type: "callout",
          title: "La trampa de examen",
          body: trap,
        });
      if (
        request.level === "advanced" &&
        !["question", "assessment"].includes(request.mode)
      ) {
        response.coverage = "partial";
        response.notice +=
          " Nivel avanzado: ampliación puntual; no cubre todas las variantes del tema.";
        if (note) response.blocks.push(text("Límite y matiz", note.advanced));
      }
      if (request.mode === "question" || request.mode === "assessment") {
        const all = topic
          ? [
              ...new Set([
                ...topic.concepts.flatMap(c=>c.questionIds),
                ...topic.assessments.flatMap((a) => a.questionIds),

              ]),
            ]
          : lesson
            ? [lesson.questionId]
            : [];
        const excluded = new Set([
          ...request.excludeQuestionIds,
          ...(q ? [q.id] : []),
        ]);
        let ids = q?.teaching ? bank.filter(item=>item.id!==q.id && (item.concept===q.concept || item.topic===q.topic)).map(item=>item.id) : all;
        if (topic) {
          const level =
            request.level === "zero"
              ? "foundation"
              : request.level === "normal"
                ? "practice"
                : "exam";
          const selected =
            topic.assessments.find((a) => a.id === level)?.questionIds ?? [];
          ids = [

            ...selected,
            ...all,
          ];
        }
        const candidates = q?.teaching ? relatedOfficialQuestions(q,bank,{questions:{}},50).filter(item=>!excluded.has(item.id)) : [...new Set(ids)]
          .filter((id) => !excluded.has(id))
          .flatMap((id) => { const item=bank.find(q=>q.id===id); return item && /^(tai|aragon|zaragoza)-/.test(item.examSet) && item.block!=="I" && item.answer>=0 ? [item] : []; });
        const count = request.mode === "question" ? 1 : 3;
        response.questions = candidates
          .slice(0, count)
          .map((question) => ({ question, hints: question.hints ?? note?.hints ?? [] }));
        response.kind = response.questions.length ? "activity" : "unavailable";
        response.title =
          request.mode === "question"
            ? "Una pregunta para comprobarlo"
            : "Mini examen del tema";
        response.blocks = [];
        if (!response.questions.length)
          response.notice =
            "No quedan preguntas distintas en este pequeño banco. Puedes volver al esquema o reiniciar la práctica del tema; no se inventarán variantes automáticamente.";
        else if (request.mode === "assessment")
          response.notice +=
            " Muestra de " +
            response.questions.length +
            " preguntas disponibles; no acredita el dominio completo ni una nota oficial.";
      }
      if (request.level === "advanced" && response.kind === "activity") {
        response.coverage = "partial";
        response.notice +=
          " Se reutiliza el banco de nivel examen; las preguntas avanzadas específicas están pendientes.";
      }
      return response;
    },
  };
}
