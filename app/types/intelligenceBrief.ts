export type IntelligenceBrief = {
  intelligenceScore: number;
  confidence: number;
  readingTime: number;
  importance: "Low" | "Medium" | "High";
  generatedAt: string;
};