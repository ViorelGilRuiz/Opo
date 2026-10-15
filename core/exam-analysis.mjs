import { aggregate, mastery } from "./learning.mjs";
/** @param {import('./types.js').LearningState} state @param {import('./types.js').Question[]} questions @param {import('./types.js').Attempt} attempt */
export function examAnalysis(state, questions, attempt) {
  const concepts = aggregate(state, "concept");
  const topics = new Map();
  for (const [i, q] of questions.entries()) {
    const row = topics.get(q.topic) ?? {
      topic: q.topic,
      correct: 0,
      wrong: 0,
      blank: 0,
      total: 0,
    };
    row.total++;
    if (attempt.picks[i] === null) row.blank++;
    else if (attempt.picks[i] === q.answer) row.correct++;
    else row.wrong++;
    topics.set(q.topic, row);
  }
  const previous = state.attempts
    .filter(
      (a) =>
        a.id !== attempt.id &&
        a.kind === attempt.kind &&
        a.questionIds.length === attempt.questionIds.length &&
        a.sessionOptions?.mode === attempt.sessionOptions?.mode &&
        a.sessionOptions?.penalty === attempt.sessionOptions?.penalty,
    )
    .at(-1);
  const recurrent = questions
    .filter((q) => (state.questions[q.id]?.incorrectCount ?? 0) >= 2)
    .map((q) => ({ question: q, count: state.questions[q.id].incorrectCount }));
  const knowledge = [...new Set(questions.map((q) => q.concept))].map(
    (concept) => ({ concept, ...mastery(concepts[concept]) }),
  );
  return {
    topics: [...topics.values()].sort(
      (a, b) => a.correct / a.total - b.correct / b.total,
    ),
    previous,
    recurrent,
    knowledge,
  };
}
