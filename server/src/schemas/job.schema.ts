import { z } from "zod";

export const JobSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  experienceRequired: z.string(),
  roleSummary: z.string(),
});

export type JobData = z.infer<typeof JobSchema>;
