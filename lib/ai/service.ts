import { openai } from "@/lib/ai/client";

export async function createChatCompletion(
  model: string,
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[],
  temperature = 0.3
) {
  return openai.chat.completions.create({
    model,
    messages,
    temperature,
  });
}