interface ApiKeySetupProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
}

export function ApiKeySetup({
  apiKey,
  onApiKeyChange,
  onSave,
}: ApiKeySetupProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">OpenAI API Key</h2>

      <p className="text-sm text-gray-500 mt-1">
        Enter your OpenAI API key to use the extension.
      </p>

      <input
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="sk-..."
        className="mt-3 w-full rounded border p-2"
      />

      <button
        onClick={onSave}
        className="mt-3 w-full rounded bg-black px-4 py-2 text-white"
      >
        Save API Key
      </button>
    </div>
  );
}
