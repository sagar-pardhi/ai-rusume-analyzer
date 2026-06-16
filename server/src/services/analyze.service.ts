import { PDFParse } from "pdf-parse";

import { analyzeResume } from "./resume.service";
import { analyzeJob } from "./job.service";
import { reviewMatch } from "./review.service";

export async function analyzeApplication(
  resumeBuffer: Buffer,
  jobDescription: string,
) {
  const parser = new PDFParse({
    data: resumeBuffer,
  });

  try {
    const pdfResult = await parser.getText();

    const resumeText = pdfResult.text;

    const structuredResume = await analyzeResume(resumeText);

    const structuredJob = await analyzeJob(jobDescription);

    const review = await reviewMatch(structuredResume, structuredJob);

    return {
      review,
      structuredResume,
      structuredJob,
    };
  } finally {
    await parser.destroy();
  }
}
