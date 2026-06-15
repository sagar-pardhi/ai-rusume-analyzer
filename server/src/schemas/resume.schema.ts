import { z } from "zod";

export const ResumeSchema = z.object({
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
    }),
  ),
  education: z.array(z.string()),
  projects: z.array(z.string()),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
