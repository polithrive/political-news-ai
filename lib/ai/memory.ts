export type StoryMemoryResult = {
  topic: string;
  previousEvents: string[];
};

export function getMockStoryMemory(): StoryMemoryResult {
  return {
    topic: "Political Story",
    previousEvents: [
      "Earlier developments will appear here.",
      "PoliticalPulse will remember previous milestones.",
      "Future versions will connect related stories over time.",
    ],
  };
}