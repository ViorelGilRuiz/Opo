/** @import { Question, Stat, LearningState, Result } from './types.js' */
export const DAY = 86400000;
/** @param {number} [now] */
export function dayKey(now = Date.now()) {
  const d = new Date(now);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
/** @returns {LearningState} */
export function initialState() {
  return {
    version: 2,
    studyTrack: "zaragoza-c1",
    motivation: {
      version: 1,
      initialized: false,
      unlocked: {},
      missionClaims: {},
      highestLevel: 1,
      bestScore: 0,
      lastStreakDay: "",
      seenConcepts: [],
    },
    teacher: { version: 1, level: "normal", attempts: [] },
    pedagogy: { version: 1, topics: {} },
    xp: 0,
    questions: {},
    events: [],
    attempts: [],
    days: {},
    completedLessons: [],
    feedback: {},
    dailyXpKeys: [],
    masteredConceptAwards: [],
    reportedProfile: {
      minutesPerDay: 120,
      priorities: [
        "ICMP",
        "IPv4 / IPv6",
        "Subnetting",
        "DNS",
        "ARP",
        "Puertos",
        "Ataques web",
        "Hash",
        "ACID",
        "FIFO / LIFO",
        "ALU / MMU",
      ],
      baseline:
        "Resultados comunicados: 19/30 y 18/30; no se han importado como intentos medidos.",
      goal: 75,
    },
  };
}
/** @returns {Stat} */
export function emptyStat() {
  return {
    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    blankCount: 0,
    lastSeenAt: 0,
    totalResponseTime: 0,
    recent: [],
    consecutive: 0,
    dueAt: 0,
    mastered: false,
  };
}
/** @param {Stat} [stat] */
export function mastery(stat) {
  if (!stat || !stat.attempts)
    return { score: 0, status: "NUEVO", accuracy: 0, averageResponseTime: 0 };
  const accuracy = (stat.correctCount / stat.attempts) * 100;
  const recent =
    (stat.recent.filter(Boolean).length / stat.recent.length) * 100;
  const score = Math.round(
    (accuracy * 0.55 + recent * 0.45) * Math.min(1, stat.attempts / 3),
  );
  const status =
    score < 40
      ? "REFORZAR"
      : score < 70
        ? "APRENDIENDO"
        : score < 85
          ? "CONSOLIDANDO"
          : stat.attempts >= 3 && stat.consecutive >= 3
            ? "DOMINADO"
            : "CONSOLIDANDO";
  return {
    score,
    status,
    accuracy,
    averageResponseTime: stat.totalResponseTime / stat.attempts,
  };
}
/** @param {LearningState} state @param {Question} q @param {number|null} pick @param {number} responseMs @param {number} [now] */
export function recordAnswer(state, q, pick, responseMs, now = Date.now()) {
  const stat = state.questions[q.id] ?? emptyStat();
  const correct = pick === q.answer;
  const blank = pick === null;
  const duration = Math.max(0, Math.min(responseMs, 2 * 60 * 60 * 1000));
  stat.attempts++;
  stat.correctCount += Number(correct);
  stat.incorrectCount += Number(!correct && !blank);
  stat.blankCount += Number(blank);
  stat.totalResponseTime += duration;
  stat.lastSeenAt = now;
  stat.recent = [...stat.recent, correct].slice(-5);
  stat.consecutive = correct ? stat.consecutive + 1 : 0;
  stat.dueAt =
    now +
    (correct
      ? [1, 3, 7, 14, 30][Math.min(stat.consecutive - 1, 4)] * DAY
      : 10 * 60000);
  const becameMastered = !stat.mastered && mastery(stat).status === "DOMINADO";
  stat.mastered = mastery(stat).status === "DOMINADO";
  state.questions[q.id] = stat;
  state.events.push({
    questionId: q.id,
    concept: q.concept,
    topic: q.topic,
    category: q.category,
    block: q.block,
    correct,
    blank,
    responseMs: duration,
    at: now,
  });
  const key = dayKey(now);
  const today = state.days[key] ?? {
    correct: 0,
    answered: 0,
    minutes: 0,
    lessons: 0,
    exams: 0,
  };
  today.correct += Number(correct);
  today.answered += Number(!blank);
  today.minutes += duration / 60000;
  state.days[key] = today;
  const xpKey = key + ":" + q.id;
  if (correct && !state.dailyXpKeys.includes(xpKey)) {
    state.xp += 10;
    state.dailyXpKeys.push(xpKey);
  }
  if (
    mastery(aggregate(state, "concept")[q.concept]).status === "DOMINADO" &&
    !state.masteredConceptAwards.includes(q.concept)
  ) {
    state.xp += 25;
    state.masteredConceptAwards.push(q.concept);
  }
  state.dailyXpKeys = state.dailyXpKeys.filter((k) => k.startsWith(key));
  return { correct, becameMastered, stat };
}
/** @param {Question[]} questions @param {(number|null)[]} picks @param {number} [penalty] @returns {Result} */
export function grade(questions, picks, penalty = undefined) {
  let correct = 0,
    wrong = 0,
    blank = 0;
  questions.forEach((q, i) => {
    if (picks[i] === null || picks[i] === undefined) blank++;
    else if (picks[i] === q.answer) correct++;
    else wrong++;
  });
  const n = questions.length;
  const direct = correct - questions.reduce((total,q,i)=>total+(picks[i]!==null && picks[i]!==undefined && picks[i]!==q.answer ? (penalty ?? q.scoringPenalty ?? 1/3) : 0),0);
  return {
    correct,
    wrong,
    blank,
    direct,
    raw: n ? (correct / n) * 10 : 0,
    score: n ? (Math.max(0, direct) / n) * 10 : 0,
    percent: n ? (correct / n) * 100 : 0,
  };
}
/** @template T @param {T[]} input @param {()=>number} [random] */
export function shuffled(input, random = Math.random) {
  const output = [...input];
  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}
/** @param {Question} q */
export function shuffleOptions(q) {
  if(/^(tai|aragon|zaragoza)-/.test(q.examSet))return {...q,options:[...q.options],rationales:[...q.rationales]};
  const indexes = shuffled(q.options.map((_, i) => i));
  return {
    ...q,
    options: indexes.map((i) => q.options[i]),
    rationales: indexes.map((i) => q.rationales[i] ?? ""),
    answer: indexes.indexOf(q.answer),
  };
}
/** @param {LearningState} state @param {Question} q @param {number} [now] */
export function priority(state, q, now = Date.now()) {
  const stat = state.questions[q.id];
  const seed = state.reportedProfile.priorities.includes(q.concept) ? 40 : 0;
  if (!stat) return 30 + seed;
  const m = mastery(stat);
  return (
    (stat.incorrectCount + stat.blankCount) * 8 +
    (100 - m.score) * 0.5 +
    (stat.dueAt <= now ? 60 : 0) +
    Math.min(20, (now - stat.lastSeenAt) / DAY) +
    seed * (m.score < 85 ? 1 : 0)
  );
}
/** @param {LearningState} state @param {Question[]} bank @param {{count:number;category?:string;block?:string;topic?:string;mode?:string}} options */
export function selectQuestions(state, bank, options) {
  let pool = bank.filter(
    (q) =>
      q.answer >= 0 &&
      (!options.category || q.category === options.category) &&
      (!options.block || q.block === options.block) &&
      (!options.topic || q.topic === options.topic),
  );
  if (options.mode === "errors")
    pool = pool.filter((q) => (state.questions[q.id]?.incorrectCount ?? 0) > 0);
  if (options.mode === "weak")
    pool = pool.filter(
      (q) =>
        state.reportedProfile.priorities.includes(q.concept) ||
        mastery(state.questions[q.id]).status === "REFORZAR",
    );
  pool = shuffled(pool);
  if (["smart", "weak", "errors"].includes(options.mode ?? ""))
    pool.sort((a, b) => priority(state, b) - priority(state, a));
  return pool.slice(0, options.count).map(shuffleOptions);
}
/** @param {LearningState} state @param {'concept'|'topic'|'category'|'block'} dimension */
export function aggregate(state, dimension) {
  /** @type {Record<string,Stat>} */ const result =
    /** @type {Record<string,Stat>} */ ({});
  for (const e of state.events) {
    const key = e[dimension];
    const s = result[key] ?? emptyStat();
    s.attempts++;
    s.correctCount += Number(e.correct);
    s.incorrectCount += Number(!e.correct && !e.blank);
    s.blankCount += Number(e.blank);
    s.lastSeenAt = Math.max(s.lastSeenAt, e.at);
    s.totalResponseTime += e.responseMs;
    s.recent = [...s.recent, e.correct].slice(-5);
    s.consecutive = e.correct ? s.consecutive + 1 : 0;
    result[key] = s;
  }
  return result;
}
/** @param {LearningState} state @param {string} id @param {number} [now] */
export function completeLesson(state, id, now = Date.now()) {
  if (state.completedLessons.includes(id)) return;
  state.completedLessons.push(id);
  const key = dayKey(now);
  const today = state.days[key] ?? {
    correct: 0,
    answered: 0,
    minutes: 0,
    lessons: 0,
    exams: 0,
  };
  today.lessons++;
  state.days[key] = today;
}
/** @param {LearningState} state @param {number} [now] */
export function streak(state, now = Date.now()) {
  let count = 0;
  const cursor = new Date(now);
  if (!state.days[dayKey(cursor.getTime())])
    cursor.setDate(cursor.getDate() - 1);
  while (state.days[dayKey(cursor.getTime())]) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
/** @param {Question[]} bank @param {number} practical */
export function officialSet(bank, practical) {
  const main = bank.filter(
    (q) => q.section === 0 && !q.reserve && q.answer >= 0,
  );
  const theoryReserves = bank.filter((q) => q.section === 0 && q.reserve);
  const practice = bank.filter(
    (q) => q.section === practical && !q.reserve && q.answer >= 0,
  );
  const practiceReserves = bank.filter(
    (q) => q.section === practical && q.reserve,
  );
  return [
    ...main,
    ...theoryReserves.slice(0, 80 - main.length),
    ...practice,
    ...practiceReserves.slice(0, 20 - practice.length),
  ];
}
