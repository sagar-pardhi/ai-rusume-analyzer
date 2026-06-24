import type { ReviewData } from "../schemas/review.schema";

interface ReviewResultsProps {
  review: ReviewData;
}

export function ReviewResults({ review }: ReviewResultsProps) {
  return (
    <>
      <div className="mt-4 rounded-xl border p-4">
        <div className="text-sm text-gray-500">Match Score</div>

        <div className="text-4xl font-bold">
          {review.matchScore}%
        </div>
      </div>

      {review.strengths?.length > 0 && (
        <div className="mt-4 rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Strengths</h3>

          <ul className="space-y-2">
            {review.strengths.map((item) => (
              <li key={item}>✅ {item}</li>
            ))}
          </ul>
        </div>
      )}

      {review.missingSkills?.length > 0 && (
        <div className="mt-4 rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Missing Skills</h3>

          <ul className="space-y-2">
            {review.missingSkills.map((item) => (
              <li key={item}>❌ {item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-xl border p-4">
        <h3 className="font-semibold mb-2">Suggestion</h3>

        <div
          className={`mt-3 rounded-lg p-3 font-medium ${
            review.shouldApply ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {review.shouldApply ? "🚀 Strong Apply" : "⚠️ Skip"}
        </div>
      </div>

      {review.recommendations?.length > 0 && (
        <div className="mt-4 rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Recommendations</h3>

          <ul className="space-y-2">
            {review.recommendations.map((item) => (
              <li key={item}>💡 {item}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
