import { z } from "zod";

export const ResumeSchema = z.object({
  skills: z.array(z.string()),
  experience: z.string(),
  education: z.array(z.string()),
  projects: z.array(z.string()),
  summary: z.string(),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
