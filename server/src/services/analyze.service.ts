import { PDFParse } from "pdf-parse";

import { analyzeResume } from "./resume.service";
import { analyzeJob } from "./job.service";
import { reviewMatch } from "./review.service";

export async function parseAndAnalyzeResume(resumeBuffer: Buffer) {
  const parser = new PDFParse({
    data: resumeBuffer,
  });

  try {
    const pdfResult = await parser.getText();

    const resumeText = pdfResult.text;

    const structuredResume = await analyzeResume(resumeText);

    return {
      structuredResume,
    };
  } finally {
    await parser.destroy();
  }
}

export async function analyzeJobReview(
  structuredResume: any,
  jobDescription: string,
) {
  const structuredJob = await analyzeJob(jobDescription);

  const review = await reviewMatch(structuredResume, structuredJob);

  return {
    review,
    structuredJob,
  };
}
