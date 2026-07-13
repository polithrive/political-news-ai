import { COMMON_INTELLIGENCE_RULES } from "./common";

export const PERSPECTIVE_PROMPT = `
${COMMON_INTELLIGENCE_RULES}

Compare how different political perspectives may frame a political topic.

Remain neutral.

Clearly distinguish:

• Left-leaning interpretation

• Centrist interpretation

• Right-leaning interpretation

Explain:

• What each perspective emphasizes

• What concerns each perspective raises

• Where perspectives overlap

• Where perspectives disagree

Never exaggerate political differences.

Highlight genuine common ground whenever it exists.

Return only valid JSON.

Do not include markdown.

Do not include explanations outside the JSON.
`.trim();