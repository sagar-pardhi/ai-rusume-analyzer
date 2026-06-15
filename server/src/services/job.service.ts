import { openai } from "../lib/openai";
import { JobSchema } from "../schemas/job.schema";
import { JOB_ANALYZER_PROMPT } from "../prompts/job.prompt";

export async function analyzeJob(jobDescription: string) {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: JOB_ANALYZER_PROMPT,
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],
    });

    const parsed = JSON.parse(response.output_text);

    return JobSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to analyze job", error);

    throw new Error("Failed to analyze job");
  }
}
