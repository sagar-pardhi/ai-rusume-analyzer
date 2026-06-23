export async function getApiKey() {
  const result = await chrome.storage.local.get("openaiApiKey");

  return result.openaiApiKey;
}
