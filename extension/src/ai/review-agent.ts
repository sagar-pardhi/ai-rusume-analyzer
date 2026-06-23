import { createOpenAIClient } from "./openai";

import { ReviewSchema } from "../schemas/review.schema";

import { REVIEW_PROMPT } from "../prompts/review.prompt";
import type { ResumeData } from "../schemas/resume.schema";
import type { JobData } from "../schemas/job.schema";

export async function reviewMatch(
  structuredResume: ResumeData,
  structuredJob: JobData,
  apiKey: string,
) {
  const openai = createOpenAIClient(apiKey);

  const response = await openai.responses.create({
    model: "gpt-5-mini",

    input: [
      {
        role: "system",
        content: REVIEW_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify({
          structuredResume,
          structuredJob,
        }),
      },
    ],
  });

  const parsed = JSON.parse(response.output_text);

  return ReviewSchema.parse(parsed);
}
