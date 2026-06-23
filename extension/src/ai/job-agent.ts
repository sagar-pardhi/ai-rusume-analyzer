import { createOpenAIClient } from "./openai";

import { JobSchema } from "../schemas/job.schema";

import { JOB_PROMPT } from "../prompts/job.prompt";

export async function analyzeJob(jobDescription: string, apiKey: string) {
  const openai = createOpenAIClient(apiKey);

  const response = await openai.responses.create({
    model: "gpt-5-mini",

    input: [
      {
        role: "system",
        content: JOB_PROMPT,
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
  });

  const parsed = JSON.parse(response.output_text);

  return JobSchema.parse(parsed);
}
