import { curriculum } from "./curriculum.mjs";
/** @type {import('../core/motivation-types.js').MotivationConfig} */
export const motivationConfig = {
  missionXP: 20,
  networkQuestionIds: [
    ...new Set(
      curriculum.topics
        .filter((t) =>
          ["osi", "tcpip", "ipv4", "subnetting", "dns"].includes(t.id),
        )
        .flatMap((t) => t.assessments.flatMap((a) => a.questionIds)),
    ),
  ],
  networkTopicIds: ["osi", "tcpip", "ipv4", "subnetting", "dns"],
  topics: curriculum.topics
    .filter((t) => ["osi", "subnetting", "sql"].includes(t.id))
    .map((t) => ({
      id: t.id,
      title: t.title,
      concepts: t.concepts.map((c) => ({
        id: c.id,
        title: c.title,
        questionIds: c.questionIds,
      })),
    })),
};
