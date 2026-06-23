import { z } from "zod";

export const JobSchema = z.object({
  title: z.string(),
  experience: z.string(),
  requiredSkills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  summary: z.string(),
});

export type JobData = z.infer<typeof JobSchema>;
