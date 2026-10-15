import { aggregate, emptyStat, mastery, streak, dayKey } from "./learning.mjs";
/** @import {LearningState,AnswerEvent} from './types.js' */
/** @import {MotivationState,MotivationConfig} from './motivation-types.js' */
export const levelNames = [
  "Inicio",
  "Base",
  "Técnico",
  "Especialista",
  "Preparado",
];
/** @param {number} xp */
export function levelProgress(xp) {
  const value = Math.max(0, xp);
  const level = 1 + Math.floor(value / 500);
  return {
    level,
    name: levelNames[Math.min(level - 1, 4)],
    current: value % 500,
    target: 500,
    remaining: 500 - (value % 500),
  };
}
/** @returns {MotivationState} */
export function initialMotivation() {
  return {
    version: 1,
    initialized: false,
    unlocked: {},
    missionClaims: {},
    highestLevel: 1,
    bestScore: 0,
    lastStreakDay: "",
    seenConcepts: [],
  };
}
/** @param {unknown} value @returns {value is MotivationState} */
export function validMotivation(value) {
  if (!value || typeof value !== "object") return false;
  const v = /** @type {MotivationState} */ (value);
  return (
    v.version === 1 &&
    typeof v.initialized === "boolean" &&
    !!v.unlocked &&
    typeof v.unlocked === "object" &&
    !Array.isArray(v.unlocked) &&
    Object.values(v.unlocked).every((n) => Number.isFinite(n) && n >= 0) &&
    !!v.missionClaims &&
    typeof v.missionClaims === "object" &&
    !Array.isArray(v.missionClaims) &&
    Object.entries(v.missionClaims).every(
      ([d, ids]) =>
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(d) &&
        Array.isArray(ids) &&
        ids.every((id) => typeof id === "string"),
    ) &&
    Number.isInteger(v.highestLevel) &&
    v.highestLevel >= 1 &&
    Number.isFinite(v.bestScore) &&
    v.bestScore >= 0 &&
    v.bestScore <= 10 &&
    typeof v.lastStreakDay === "string" &&
    Array.isArray(v.seenConcepts) &&
    v.seenConcepts.every((c) => typeof c === "string")
  );
}
/** @param {LearningState} state @param {MotivationConfig} config @param {number} [now] */
export function motivationSnapshot(state, config, now = Date.now()) {
  const day = dayKey(now);
  const events = state.events.filter((e) => e.at <= now);
  const today = events.filter((e) => dayKey(e.at) === day);
  const stats = aggregate({ ...state, events }, "concept");
  /** @type {Map<string,AnswerEvent>} */ const previous = new Map();
  const recovered = new Set();
  const firstMastered = new Set();
  /** @type {Record<string,import('./types.js').Stat>} */ const running = {};
  const reached = new Set();
  for (const e of events) {
    const prior = previous.get(e.questionId);
    if (
      e.correct &&
      prior &&
      !prior.correct &&
      dayKey(prior.at) < day &&
      dayKey(e.at) === day
    )
      recovered.add(e.questionId);
    previous.set(e.questionId, e);
    const s = running[e.concept] ?? emptyStat();
    s.attempts++;
    s.correctCount += Number(e.correct);
    s.recent = [...s.recent, e.correct].slice(-5);
    s.consecutive = e.correct ? s.consecutive + 1 : 0;
    running[e.concept] = s;
    if (mastery(s).status === "DOMINADO" && !reached.has(e.concept)) {
      reached.add(e.concept);
      if (dayKey(e.at) === day) firstMastered.add(e.concept);
    }
  }
  const topicMastery = config.topics.map((t) => {
    const concepts = t.concepts.map((c) => {
      const subset = events.filter((e) => c.questionIds.includes(e.questionId));
      const s = aggregate(
        { ...state, events: subset.map((e) => ({ ...e, concept: c.id })) },
        "concept",
      )[c.id];
      return {
        title: c.title,
        score: mastery(s).score,
        mastered:
          mastery(s).status === "DOMINADO" &&
          new Set(subset.map((e) => e.questionId)).size >= 2,
      };
    });
    return {
      id: t.id,
      title: t.title,
      concepts,
      mastered: concepts.length > 0 && concepts.every((c) => c.mastered),
      value: concepts.filter((c) => c.mastered).length,
      target: concepts.length,
    };
  });
  const networkTests = Object.entries(state.pedagogy.topics)
    .filter(([id]) => config.networkTopicIds.includes(id))
    .flatMap(([, t]) => t.assessments)
    .filter(
      (a) =>
        a.at <= now &&
        dayKey(a.at) === day &&
        a.level !== "review" &&
        a.questionIds.length > 0,
    ).length;
  const teacherNetworkTests = state.teacher.attempts.filter(
    (a) =>
      a.mode === "assessment" &&
      a.at <= now &&
      dayKey(a.at) === day &&
      a.questionIds.length > 0 &&
      a.questionIds.every((id) => config.networkQuestionIds.includes(id)),
  ).length;
  const missions = [
    {
      id: "questions",
      title: "Completa 10 preguntas",
      value: today.filter((e) => !e.blank).length,
      target: 10,
      route: "practicar",
    },
    {
      id: "recover",
      title: "Corrige 3 errores antiguos",
      value: recovered.size,
      target: 3,
      route: "errores",
    },
    {
      id: "master",
      title: "Domina un concepto",
      value: firstMastered.size,
      target: 1,
      route: "aprender",
    },
    {
      id: "minutes",
      title: "Estudia 15 minutos",
      value: Math.floor(today.reduce((a, e) => a + e.responseMs, 0) / 60000),
      target: 15,
      route: "practicar",
    },
    {
      id: "network",
      title: "Completa un minitest de redes",
      value: networkTests + teacherNetworkTests,
      target: 1,
      route: "aprender",
    },
  ].map((m) => ({
    ...m,
    completed: m.value >= m.target,
    reward: config.missionXP,
  }));
  const learningSessions =
    Object.values(state.pedagogy.topics)
      .flatMap((t) => t.assessments)
      .filter((a) => a.at <= now && a.questionIds.length > 0).length +
    state.teacher.attempts.filter(
      (a) => a.at <= now && a.questionIds.length > 0,
    ).length;
  const sessions = state.attempts.filter(
    (a) => a.at <= now && a.questionIds.length > 0,
  );
  const exams = sessions.filter(
    (a) => a.kind === "exam" || a.kind === "official",
  );
  const answers = events.filter((e) => !e.blank).length;
  const currentStreak = streak(state, now);
  const achievements = [
    {
      id: "first-session",
      title: "Primera sesión",
      value: sessions.length + learningSessions,
      target: 1,
    },
    {
      id: "questions-100",
      title: "100 preguntas",
      value: answers,
      target: 100,
    },
    {
      id: "questions-500",
      title: "500 preguntas",
      value: answers,
      target: 500,
    },
    {
      id: "first-exam",
      title: "Primer simulacro",
      value: exams.length,
      target: 1,
    },
    { id: "exams-5", title: "5 simulacros", value: exams.length, target: 5 },
    {
      id: "streak-7",
      title: "7 días de racha",
      value: currentStreak,
      target: 7,
    },
    ...topicMastery.map((t) => ({
      id: "topic-" + t.id,
      title: t.title + " dominado",
      value: t.value,
      target: t.target,
    })),
  ].map((a) => ({
    ...a,
    earned:
      a.value >= a.target || state.motivation.unlocked[a.id] !== undefined,
  }));
  return {
    day,
    missions,
    achievements,
    topicMastery,
    concepts: Object.entries(stats).map(([title, s]) => ({
      title,
      ...mastery(s),
    })),
    streak: currentStreak,
    bestScore: exams.length ? Math.max(...exams.map((a) => a.score)) : 0,
    level: levelProgress(state.xp),
  };
}
/** @param {LearningState} state @param {MotivationConfig} config @param {number} [now] @returns {import('./motivation-types.js').Milestone[]} */
export function syncMotivation(state, config, now = Date.now()) {
  const snapshot = motivationSnapshot(state, config, now);
  const g = state.motivation;
  const silent = !g.initialized;
  const changes = [];
  const claimed = g.missionClaims[snapshot.day] ?? [];
  for (const mission of snapshot.missions)
    if (mission.completed && !claimed.includes(mission.id)) {
      claimed.push(mission.id);
      if (!silent) {
        state.xp += mission.reward;
        changes.push({
          kind: "mission",
          title: "Misión completada",
          detail: mission.title + " · +" + mission.reward + " XP",
        });
      }
    }
  g.missionClaims[snapshot.day] = claimed;
  for (const achievement of snapshot.achievements)
    if (achievement.earned && g.unlocked[achievement.id] === undefined) {
      g.unlocked[achievement.id] = now;
      if (!silent)
        changes.push({
          kind: "achievement",
          title: "Logro desbloqueado",
          detail: achievement.title,
        });
    }
  for (const concept of snapshot.concepts)
    if (
      concept.status === "DOMINADO" &&
      !g.seenConcepts.includes(concept.title)
    ) {
      g.seenConcepts.push(concept.title);
      if (!silent)
        changes.push({
          kind: "concept",
          title: "Concepto dominado",
          detail: concept.title + " · sigue comprobándolo con repasos",
        });
    }
  const level = levelProgress(state.xp);
  if (level.level > g.highestLevel) {
    if (!silent)
      changes.unshift({
        kind: "level",
        title: "Nivel " + level.level + " — " + level.name,
        detail: "Tu constancia abre una nueva etapa.",
      });
    g.highestLevel = level.level;
  }
  if (snapshot.bestScore > g.bestScore) {
    if (!silent && g.bestScore > 0)
      changes.unshift({
        kind: "record",
        title: "Nuevo récord",
        detail: snapshot.bestScore.toFixed(2) + " / 10 en simulacro",
      });
    g.bestScore = snapshot.bestScore;
  }
  if (state.days[snapshot.day] && g.lastStreakDay !== snapshot.day) {
    g.lastStreakDay = snapshot.day;
    if (!silent && [1, 3, 7, 14, 30].includes(snapshot.streak))
      changes.push({
        kind: "streak",
        title:
          snapshot.streak +
          (snapshot.streak === 1 ? " día de racha" : " días de racha"),
        detail: "Un día más de constancia.",
      });
  }
  g.initialized = true;
  return changes;
}
