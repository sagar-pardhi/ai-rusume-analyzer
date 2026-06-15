import { z } from "zod";

export const ResumeSchema = z.object({
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string().optional(),
    }),
  ),
  education: z.array(z.string()),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
  ),
});

export type ResumeData = z.infer<typeof ResumeSchema>;
