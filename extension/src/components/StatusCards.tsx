interface StatusCardsProps {
  onClearApiKey: () => void;
  hasResume: boolean;
  extracting: boolean;
  hasJobData: boolean;
}

export function StatusCards({
  onClearApiKey,
  hasResume,
  extracting,
  hasJobData,
}: StatusCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="rounded-lg border p-3">
        <div className="font-medium">✅ OpenAI Connected</div>

        <button
          onClick={onClearApiKey}
          className="mt-2 text-sm text-red-500"
        >
          Change API Key
        </button>
      </div>

      <div className="rounded-lg border p-3">
        <div className="text-sm text-gray-500">Resume</div>

        <div className="font-medium">
          {hasResume ? "✅ Uploaded" : "❌ Missing"}
        </div>
      </div>

      <div className="rounded-lg border p-3">
        <div className="text-sm text-gray-500">Job Status</div>

        <div className="font-medium">
          {extracting
            ? "⏳ Extracting..."
            : hasJobData
              ? "✅ Extracted"
              : "❌ Not Found"}
        </div>
      </div>
    </div>
  );
}
