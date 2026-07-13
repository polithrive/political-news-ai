import { openai } from "./client";

export type GenerateIntelligenceOptions = {
  systemPrompt: string;

  context: string;

  conversation: {
    role: "user" | "assistant";
    content: string;
  }[];

  question: string;

  model?: string;

  temperature?: number;

  maxTokens?: number;

  stream?: boolean;
};

export async function generateIntelligenceResponse(
  options: GenerateIntelligenceOptions
) {
  return openai.chat.completions.create({
    model: options.model ?? "gpt-4.1-mini",

    temperature:
      options.temperature ?? 0.2,

    max_tokens:
      options.maxTokens ?? 900,

    stream:
      options.stream ?? true,

    messages: [
      {
        role: "system",
        content: options.systemPrompt,
      },
      {
        role: "system",
        content: options.context,
      },
      ...options.conversation,
      {
        role: "user",
        content: options.question,
      },
    ],
  });
}