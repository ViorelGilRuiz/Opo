import type { Question, Result } from "./types.js";
import type { ContentBlock, Source } from "./pedagogy-types.js";
export type TeacherLevel = "zero" | "normal" | "exam" | "advanced";
export type TeacherMode =
  "easy" | "technical" | "example" | "scheme" | "question" | "assessment";
export interface TeacherContext {
  topicId?: string;
  conceptId?: string;
  questionId?: string;
  search?: string;
}
export interface TeacherRequest {
  context: TeacherContext;
  level: TeacherLevel;
  mode: TeacherMode;
  excludeQuestionIds: string[];
}
export interface TeacherTopic {
  id: string;
  title: string;
  coverage: "published" | "partial";
  concepts: { id: string; title: string }[];
}
export interface TeacherQuestion {
  question: Question;
  hints: string[];
}
export interface TeacherResponse {
  kind: "explanation" | "activity" | "unavailable";
  title: string;
  blocks: ContentBlock[];
  sources: Source[];
  coverage: "published" | "partial";
  notice: string;
  context: TeacherContext;
  questions: TeacherQuestion[];
}
export interface TeacherProvider {
  id: string;
  label: string;
  topics: TeacherTopic[];
  respond: (
    request: TeacherRequest,
    options: { signal: AbortSignal },
  ) => Promise<TeacherResponse>;
}
export interface TeacherAttempt {
  id: string;
  mode: "question" | "assessment";
  questionIds: string[];
  picks: (number | null)[];
  assistedQuestionIds: string[];
  result: Result;
  at: number;
}
export interface TeacherState {
  version: 1;
  level: TeacherLevel;
  attempts: TeacherAttempt[];
}
export interface TeacherNote {
  topicId: string;
  hints: string[];
  advanced: string;
}
