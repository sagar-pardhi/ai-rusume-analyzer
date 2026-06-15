import { openai } from "../lib/openai";

export async function analyzeResume(resumeText: string) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: `
You are an expert resume parser.

Extract:
- skills
- work experience
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

  const result = JSON.parse(response.output_text);

  return result;
}
