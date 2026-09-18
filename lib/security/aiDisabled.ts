export function isAiDisabled(): boolean {
  const value = process.env.AI_DISABLED?.trim().toLowerCase();

  return value === "1" || value === "true" || value === "yes" || value === "on";
}
