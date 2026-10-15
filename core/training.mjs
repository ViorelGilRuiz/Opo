import { aggregate, mastery, recordAnswer, DAY } from "./learning.mjs";
/** @import {Question,LearningState} from './types.js' */
/** @import {Bucket,TrainingConfig,TrainingSession} from './training-types.js' */
/** @type {TrainingConfig} */
export const defaultTrainingConfig = {
  count: 20,
  weights: { weak: 35, recent: 25, spaced: 20, new: 15, retention: 5 },
  recentDays: 7,
  questionCooldown: 6,
  maxTopicRun: 2,
  weakThreshold: 70,
  lowAttempts: 3,
  pressureStep: 1,
  recoveryFactor: 0.6,
};
/** @param {Partial<TrainingConfig>} [input] @returns {TrainingConfig} */
export function trainingConfig(input = {}) {
  const c = {
    ...defaultTrainingConfig,
    ...input,
    weights: { ...defaultTrainingConfig.weights, ...input.weights },
  };
  if (
    !Number.isInteger(c.count) ||
    c.count < 1 ||
    c.count > 100 ||
    !Number.isInteger(c.questionCooldown) ||
    c.questionCooldown < 0 ||
    !Number.isInteger(c.maxTopicRun) ||
    c.maxTopicRun < 1 ||
    !Number.isInteger(c.lowAttempts) ||
    c.lowAttempts < 1 ||
    !Number.isFinite(c.recentDays) ||
    c.recentDays <= 0 ||
    !Number.isFinite(c.weakThreshold) ||
    c.weakThreshold < 0 ||
    c.weakThreshold > 100 ||
    !Number.isFinite(c.pressureStep) ||
    c.pressureStep <= 0 ||
    !Number.isFinite(c.recoveryFactor) ||
    c.recoveryFactor <= 0 ||
    c.recoveryFactor >= 1 ||
    Object.values(c.weights).some((w) => !Number.isFinite(w) || w < 0) ||
    Object.values(c.weights).reduce((a, b) => a + b, 0) <= 0
  )
    throw new Error("Configuración de entrenamiento inválida");
  return c;
}
/** @param {LearningState} state */
export function trainingScores(state) {
  return Object.fromEntries(
    Object.entries(aggregate(state, "topic")).map(([topic, s]) => [
      topic,
      mastery(s).score,
    ]),
  );
}
/** @param {LearningState} state @param {Partial<TrainingConfig>} [config] @param {number} [now] @returns {TrainingSession} */
export function createTraining(state, config = {}, now = Date.now()) {
  return {
    config: trainingConfig(config),
    selected: [],
    picks: [],
    buckets: [],
    pressure: {},
    before: trainingScores(state),
    started: now,
    closed: false,
  };
}
/** @param {LearningState} state @param {Question[]} bank @param {TrainingSession} session @param {number} [now] */
export function selectTrainingQuestion(state, bank, session, now = Date.now()) {
  if (
    session.closed ||
    session.selected.length >= session.config.count ||
    session.selected.length > session.picks.length
  )
    return null;
  const c = session.config;
  const used = new Set(session.selected.map((q) => q.id));
  let pool = [
    ...new Map(
      bank
        .filter(
          (q) =>
            q.answer >= 0 && q.answer < q.options.length && !used.has(q.id),
        )
        .map((q) => [q.id, q]),
    ).values(),
  ];
  if (!pool.length) return null;
  const cooldown = new Set(
    state.events
      .slice(-c.questionCooldown || state.events.length)
      .map((e) => e.questionId),
  );
  const cold = pool.filter((q) => !cooldown.has(q.id));
  if (cold.length) pool = cold;
  const last = session.selected.at(-1)?.topic;
  let run = 0;
  for (
    let i = session.selected.length - 1;
    i >= 0 && session.selected[i].topic === last;
    i--
  )
    run++;
  if (run >= c.maxTopicRun) {
    const alternatives = pool.filter((q) => q.topic !== last);
    if (alternatives.length) pool = alternatives;
  }
  const concepts = aggregate(state, "concept");
  const latest = new Map(state.events.map((e) => [e.questionId, e]));
  /** @param {Question} q @param {Bucket} bucket */
  const eligible = (q, bucket) => {
    const s = state.questions[q.id];
    const concept = concepts[q.concept];
    const event = latest.get(q.id);
    switch (bucket) {
      case "weak":
        return !!concept && mastery(concept).score < c.weakThreshold;
      case "recent":
        return (
          !!event && !event.correct && now - event.at <= c.recentDays * DAY
        );
      case "spaced":
        return !!s && s.dueAt <= now;
      case "new":
        return !s || s.attempts < c.lowAttempts;
      case "retention":
        return mastery(concept).status === "DOMINADO";
    }
  };
  const weights = Object.values(c.weights).reduce((a, b) => a + b, 0);
  const buckets = /** @type {Bucket[]} */ (Object.keys(c.weights));
  // Weighted fair scheduling: biggest deficit first; unavailable categories redistribute naturally.
  buckets.sort(
    (a, b) =>
      ((session.selected.length + 1) * c.weights[b]) / weights -
      session.buckets.filter((x) => x === b).length -
      (((session.selected.length + 1) * c.weights[a]) / weights -
        session.buckets.filter((x) => x === a).length),
  );
  const bucket = buckets.find(
    (b) => c.weights[b] > 0 && pool.some((q) => eligible(q, b)),
  );
  const candidates = bucket ? pool.filter((q) => eligible(q, bucket)) : pool;
  /** @param {Question} q */
  const rank = (q) => {
    const s = state.questions[q.id];
    return (
      (session.pressure[q.topic] ?? 0) * 60 +
      (100 - mastery(concepts[q.concept]).score) * 0.3 +
      (state.reportedProfile.priorities.includes(q.concept) ? 8 : 0) -
      session.selected.filter((x) => x.topic === q.topic).length * 3 -
      (s?.attempts ?? 0) * 2 +
      (bucket === "new" && !s?.attempts ? 25 : 0)
    );
  };
  candidates.sort(
    (a, b) =>
      rank(b) - rank(a) ||
      (state.questions[a.id]?.lastSeenAt ?? 0) -
        (state.questions[b.id]?.lastSeenAt ?? 0) ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return { question: candidates[0], bucket: bucket ?? "new" };
}
/** @param {LearningState} state @param {TrainingSession} session @param {number|null} pick @param {number} duration @param {number} [now] */
export function answerTraining(
  state,
  session,
  pick,
  duration,
  now = Date.now(),
) {
  const q = session.selected.at(-1);
  if (
    session.closed ||
    !q ||
    session.picks.length !== session.selected.length - 1 ||
    (pick !== null &&
      (!Number.isInteger(pick) || pick < 0 || pick >= q.options.length))
  )
    return false;
  session.picks.push(pick);
  recordAnswer(state, q, pick, duration, now);
  const p = session.pressure[q.topic] ?? 0;
  session.pressure[q.topic] =
    pick === q.answer
      ? p * session.config.recoveryFactor
      : Math.min(4, p + session.config.pressureStep);
  return true;
}
/** @param {LearningState} state @param {TrainingSession} session */
export function trainingReport(state, session) {
  const scores = trainingScores(state);
  const topics = [
    ...new Set(
      session.selected.slice(0, session.picks.length).map((q) => q.topic),
    ),
  ];
  const changes = topics
    .map((topic) => ({
      topic,
      before: session.before[topic] ?? 0,
      after: scores[topic] ?? 0,
      delta: (scores[topic] ?? 0) - (session.before[topic] ?? 0),
    }))
    .sort((a, b) => b.delta - a.delta || a.topic.localeCompare(b.topic, "es"));
  const weakest = [...changes].sort(
    (a, b) => a.after - b.after || a.topic.localeCompare(b.topic, "es"),
  )[0];
  return {
    changes,
    recommendation: weakest
      ? "10 minutos de " +
        weakest.topic +
        " + 10 preguntas de " +
        weakest.topic +
        "."
      : "Empieza con una sesión para obtener una recomendación basada en tus respuestas.",
  };
}
