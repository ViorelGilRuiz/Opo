export interface MotivationState {
  version: 1;
  initialized: boolean;
  unlocked: Record<string, number>;
  missionClaims: Record<string, string[]>;
  highestLevel: number;
  bestScore: number;
  lastStreakDay: string;
  seenConcepts: string[];
}
export interface MotivationTopic {
  id: string;
  title: string;
  concepts: { id: string; title: string; questionIds: string[] }[];
}
export interface MotivationConfig {
  topics: MotivationTopic[];
  networkTopicIds: string[];
  networkQuestionIds: string[];
  missionXP: number;
}
export interface Milestone {
  kind: string;
  title: string;
  detail: string;
}
