import { Question } from "./types.js";
export type Bucket = "weak" | "recent" | "spaced" | "new" | "retention";
export interface TrainingConfig {
  count: number;
  weights: Record<Bucket, number>;
  recentDays: number;
  questionCooldown: number;
  maxTopicRun: number;
  weakThreshold: number;
  lowAttempts: number;
  pressureStep: number;
  recoveryFactor: number;
}
export interface TrainingSession {
  config: TrainingConfig;
  selected: Question[];
  picks: (number | null)[];
  buckets: Bucket[];
  pressure: Record<string, number>;
  before: Record<string, number>;
  started: number;
  closed: boolean;
}
