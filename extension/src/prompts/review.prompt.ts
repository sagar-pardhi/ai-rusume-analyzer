export const REVIEW_PROMPT = `
Compare the resume with the job.

Evaluate:

- skills match
- experience match
- project relevance

Return ONLY valid JSON.

{
  "matchScore": 0,
  "strengths": [],
  "missingSkills": [],
  "recommendations": [],
  "shouldApply": false,
  "summary": ""
}
`;
