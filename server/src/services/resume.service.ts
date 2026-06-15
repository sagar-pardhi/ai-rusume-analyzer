import { openai } from "../lib/openai";
import { ResumeSchema } from "../schemas/resume.schema";
import { RESUME_ANALYZER_PROMPT } from "../prompts/resume.prompt";

export async function analyzeResume(resumeText: string) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: RESUME_ANALYZER_PROMPT,
      },
      {
        role: "user",
        content: resumeText,
      },
    ],
  });

  try {
    const parsed = JSON.parse(response.output_text);

    return ResumeSchema.parse(parsed);
  } catch (err) {
    console.log("Failed to parse resume", err);
    throw new Error("Failed to parse resume");
  }
}
