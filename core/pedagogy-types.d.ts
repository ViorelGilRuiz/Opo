import type { Question, Result } from "./types.js";
export type StepId =
  "introduction" | "concepts" | "example" | "exercise" | "minitest" | "review";
export type LevelId = "foundation" | "practice" | "exam" | "review";
export interface Source {
  id: string;
  title: string;
  url: string;
  kind: "standard" | "documentation" | "official-program" | "historical-exam";
  version: string;
  checkedAt: string;
}
export type ContentBlock =
  | { type: "text" | "callout" | "code"; title: string; body: string }
  | { type: "table"; title: string; headers: string[]; rows: string[][] }
  | { type: "steps" | "layers"; title: string; items: string[] };
export interface Concept {
  id: string;
  title: string;
  simple: string;
  technical: string;
  example: string;
  commonError: string;
  memory: string;
  difficulty: "foundation" | "practice" | "exam";
  questionIds: string[];
  sourceIds: string[];
}
export type Exercise = {
  id: string;
  conceptIds: string[];
  prompt: string;
  explanation: string;
  hint: string;
} & (
  | { type: "choice"; options: string[]; answer: number }
  | { type: "number"; answer: number; unit: string }
);
export interface Assessment {
  id: Exclude<LevelId, "review">;
  title: string;
  questionIds: string[];
  passPercent: number;
}
export interface CourseTopic {
  assessmentPolicy?: "official-only";
  id: string;
  revision: number;
  title: string;
  block: string;
  category: string;
  summary: string;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  officialRefs: string[];
  sourceIds: string[];
  objectives: string[];
  introduction: ContentBlock[];
  concepts: Concept[];
  example: ContentBlock[];
  exercises: Exercise[];
  assessments: Assessment[];
  review: ContentBlock[];
}
export interface CurriculumArea {
  id: string;
  title: string;
  block: string;
  officialRefs: string[];
  topicIds: string[];
  legacyTopics: string[];
  coverage: string;
}
export interface Curriculum {
  id: string;
  revision: number;
  title: string;
  programSourceId: string;
  steps: { id: StepId; title: string }[];
  sources: Source[];
  areas: CurriculumArea[];
  topics: CourseTopic[];
}
export interface ExerciseAttempt {
  value: number;
  correct: boolean;
  at: number;
}
export interface AssessmentAttempt {
  id: string;
  level: LevelId;
  questionIds: string[];
  picks: (number | null)[];
  at: number;
  result: Result;
  passed: boolean;
}
export interface TopicProgress {
  revision: number;
  step: StepId;
  completedSteps: StepId[];
  exerciseAttempts: Record<string, ExerciseAttempt>;
  assessments: AssessmentAttempt[];
  reviewDueAt: number;
  lastStudiedAt: number;
}
export interface PedagogyState {
  version: 1;
  topics: Record<string, TopicProgress>;
}
export type QuestionBank = Question[];
