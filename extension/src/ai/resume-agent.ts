import { createOpenAIClient } from "./openai";

import { getApiKey } from "../lib/storage";

export async function analyzeResume(resumeText: string) {
  const apiKey = await getApiKey();

  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }

  const openai = createOpenAIClient(apiKey as string);

  const response = await openai.responses.create({
    model: "gpt-5-mini",

    input: [
      {
        role: "system",
        content: `
Extract:

- skills
- experience
- education
- projects

Return ONLY valid JSON.
`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ],
  });

  return JSON.parse(response.output_text);
}
