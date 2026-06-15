import { openai } from "../lib/openai";
import { ReviewSchema } from "../schemas/review.schema";
import { REVIEW_PROMPT } from "../prompts/review.prompt";

export async function reviewMatch(resume: unknown, job: unknown) {
  try {
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
            resume,
            job,
          }),
        },
      ],
    });

    const parsed = JSON.parse(response.output_text);

    return ReviewSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to review match", error);

    throw new Error("Failed to review match");
  }
}
