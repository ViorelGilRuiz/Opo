export interface Question {
  provenance?: OfficialProvenance;
  id: string;
  track: string;
  category: string;
  block: string;
  topic: string;
  concept: string;
  subtopic: string;
  difficulty: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  rationales: string[];
  trick: string;
  source: string;
  examSet: string;
  section?: number;
  reserve?: boolean;
  context?: string;
  page?: number;
  number?: number;
  originalPage?: string;
  contextPages?: string[];
  reviewedExplanation?: boolean;
  hints?: string[];
  scoringPenalty?: number;
  teaching?: {
    simple: string;
    technical: string;
    example: string;
    commonError: string;
    schema: string[];
  };
}
export interface Stat {
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  blankCount: number;
  lastSeenAt: number;
  totalResponseTime: number;
  recent: boolean[];
  consecutive: number;
  dueAt: number;
  mastered: boolean;
}
export interface AnswerEvent {
  questionId: string;
  concept: string;
  topic: string;
  category: string;
  block: string;
  correct: boolean;
  blank: boolean;
  responseMs: number;
  at: number;
}
export interface Attempt {
  sessionOptions?: SessionOptions;
  id: string;
  kind: string;
  questionIds: string[];
  picks: (number | null)[];
  optionOrders?: string[][];
  at: number;
  elapsedMs: number;
  correct: number;
  wrong: number;
  blank: number;
  raw: number;
  score: number;
  percent: number;
  direct: number;
  sections?: Record<
    string,
    {
      correct: number;
      wrong: number;
      blank: number;
      direct: number;
      score: number;
    }
  >;
}
export interface SessionDraft {
  options?: SessionOptions;
  kind: "practice" | "exam" | "official";
  createdAt: number;
  elapsedMs: number;
  questionIds: string[];
  picks: (number | null)[];
  durations: number[];
  flags: boolean[];
  recorded: boolean[];
  current: number;
}
export interface LearningState {
  draft?: SessionDraft;
  motivation: import("./motivation-types.js").MotivationState;
  teacher: import("./teacher-types.js").TeacherState;
  pedagogy: import("./pedagogy-types.js").PedagogyState;
  studyTrack?: "tai" | "aragon-c1" | "zaragoza-c1";
  notes?: Record<string, string>;
  version: 2;
  xp: number;
  questions: Record<string, Stat>;
  events: AnswerEvent[];
  attempts: Attempt[];
  days: Record<
    string,
    {
      correct: number;
      answered: number;
      minutes: number;
      lessons: number;
      exams: number;
    }
  >;
  completedLessons: string[];
  feedback: Record<string, string>;
  dailyXpKeys: string[];
  masteredConceptAwards: string[];
  reportedProfile: {
    minutesPerDay: number;
    priorities: string[];
    baseline: string;
    goal: number;
  };
}
export interface Lesson {
  id: string;
  title: string;
  topic: string;
  category: string;
  block: string;
  prerequisite: string | null;
  basic: string;
  technical: string;
  example: string;
  analogy: string;
  trap: string;
  rule: string;
  exercise: string;
  exerciseAnswer: string;
  questionId: string;
}
export interface Result {
  correct: number;
  wrong: number;
  blank: number;
  raw: number;
  score: number;
  percent: number;
  direct: number;
}

export interface OfficialProvenance {
  administration: string;
  body: string;
  call: string;
  year: number;
  exercise: number;
  originalNumber: string;
  documentUrl: string;
  documentHash: string;
  keyUrl: string;
  keyHash: string;
  sourcePage: string;
  reference: string;
  validation: string;
  reserve: boolean;
  annulled: boolean;
}
export interface SessionOptions {
  largeText?: boolean;
  hideClock?: boolean;
  title?: string;
  budgetMs?: number;
  penalty?: number;
  mode?: string;
  rulesVerified?: boolean;
  scoringLabel?: string;
}
