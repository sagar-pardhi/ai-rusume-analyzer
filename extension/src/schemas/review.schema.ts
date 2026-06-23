import { z } from "zod";

export const ReviewSchema = z.object({
  matchScore: z.number(),
  strengths: z.array(z.string()),
  missingSkills: z.array(z.string()),
  recommendations: z.array(z.string()),
  shouldApply: z.boolean(),
  summary: z.string(),
});

export type ReviewData = z.infer<typeof ReviewSchema>;
