import { useEffect, useState } from "react";
import type { JobDetails } from "./types/job";
import { extractPdfText } from "./lib/pdf";
import { analyzeResume } from "./ai/resume-agent";
import { analyzeJob } from "./ai/job-agent";
import type { JobData } from "./schemas/job.schema";
// import type { JobData } from "./schemas/job.schema";

interface ReviewResult {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  recommendations: string[];
  shouldApply: boolean;
  summary: string;
}

function App() {
  const [jobData, setJobData] = useState<JobDetails | null | undefined>(null);
  // const [resume, setResume] = useState<File | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [structuredResume, setStructuredResume] = useState<Record<
    string,
    string
  > | null>(null);

  const [isNaukriPage, setIsNaukriPage] = useState(false);

  const [currentDomain, setCurrentDomain] = useState("");
  // const [resumeText, setResumeText] = useState("");
  const [status, setStatus] = useState("");

  const [apiKey, setApiKey] = useState("");

  const [savedApiKey, setSavedApiKey] = useState("");

  const [, setStructuredJob] = useState<JobData | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["openaiApiKey"], (result) => {
      if (result.openaiApiKey) {
        setSavedApiKey(result.openaiApiKey as string);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["structuredResume"], (result) => {
      if (result.structuredResume) {
        setStructuredResume(result.structuredResume as Record<string, string>);
      }
    });
  }, []);

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      return;
    }

    await chrome.storage.local.set({
      openaiApiKey: apiKey,
    });

    setSavedApiKey(apiKey);

    setApiKey("");
  };

  const clearApiKey = async () => {
    await chrome.storage.local.remove("openaiApiKey");

    setSavedApiKey("");
  };

  const extractJob = async () => {
    try {
      setExtracting(true);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) return;

      const result = await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        func: () => {
          const title =
            document.querySelector("#job_header h1")?.textContent?.trim() || "";

          const company =
            document.querySelector("#job_header a")?.textContent?.trim() || "";

          const experience =
            document
              .querySelector(
                "#job_header > div.styles_jhc__top__BUxpc > div.styles_jhc__left__tg9m8 > div.styles_jhc__exp-salary-container__NXsVd > div.styles_jhc__exp__k_giM > span",
              )
              ?.textContent?.trim() || "";

          const location =
            document
              .querySelector(
                "#job_header > div.styles_jhc__top__BUxpc > div.styles_jhc__left__tg9m8 > div.styles_jhc__loc___Du2H > span > a",
              )
              ?.textContent?.trim() || "";

          const skills = Array.from(
            document.querySelectorAll(".styles_key-skill__GIPn_ a span"),
          ).map((el) => el.textContent?.trim() || "");

          const description =
            document
              .querySelector(".styles_job-desc-container__txpYf")
              ?.textContent?.trim() || "";

          return {
            title,
            company,
            experience,
            location,
            skills,
            description,
          };
        },
      });

      console.log(result[0].result);

      setJobData(result[0].result);
    } catch (error) {
      console.log(error);
    } finally {
      setExtracting(false);
    }
  };

  useEffect(() => {
    const checkCurrentSite = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.url) return;

      const url = new URL(tab.url);

      setCurrentDomain(url.hostname);

      const isNaukri = url.hostname.includes("naukri.com");

      setIsNaukriPage(isNaukri);

      return isNaukri;
    };

    const init = async () => {
      const isNaukri = await checkCurrentSite();

      if (isNaukri) {
        await extractJob();
      }
    };

    init();
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);
      setStatus("Extracting PDF...");

      const text = await extractPdfText(file);

      setStatus("Analyzing Resume...");
      const structuredResume = await analyzeResume(text);

      setStructuredResume(structuredResume);

      setStatus("Saving Resume...");
      await chrome.storage.local.set({
        structuredResume,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobData?.description) return;

    const result = await analyzeJob(jobData.description, savedApiKey);

    console.log(result);

    setStructuredJob(result);
  };

  const clearResume = () => {
    chrome.storage.local.remove("structuredResume");

    setStructuredResume(null);
    setReview(null);
  };

  return (
    <div className="w-[420px] min-h-[600px] bg-white p-4">
      {!savedApiKey && (
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">OpenAI API Key</h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter your OpenAI API key to use the extension.
          </p>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="mt-3 w-full rounded border p-2"
          />

          <button
            onClick={saveApiKey}
            className="mt-3 w-full rounded bg-black px-4 py-2 text-white"
          >
            Save API Key
          </button>
        </div>
      )}

      {savedApiKey && (
        <>
          {!isNaukriPage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="font-semibold text-red-700">
                Unsupported Website
              </h3>

              <p className="mt-1 text-sm text-red-600">
                This extension currently works only on Naukri.com job pages.
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Current site: {currentDomain}
              </p>
            </div>
          )}

          {isNaukriPage && (
            <>
              <div className="mb-4">
                <h1 className="text-xl font-bold">AI Resume Reviewer</h1>

                <p className="text-sm text-gray-500">
                  Analyze Naukri jobs instantly
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border p-3">
                  <div className="font-medium">✅ OpenAI Connected</div>

                  <button
                    onClick={clearApiKey}
                    className="mt-2 text-sm text-red-500"
                  >
                    Change API Key
                  </button>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Resume</div>

                  <div className="font-medium">
                    {structuredResume ? "✅ Uploaded" : "❌ Missing"}
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-sm text-gray-500">Job Status</div>

                  <div className="font-medium">
                    {extracting
                      ? "⏳ Extracting..."
                      : jobData
                        ? "✅ Extracted"
                        : "❌ Not Found"}
                  </div>
                </div>
              </div>

              {jobData && (
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <strong>Title:</strong> {jobData.title}
                  </div>

                  <div>
                    <strong>Company:</strong> {jobData.company}
                  </div>

                  <div>
                    <strong>Experience:</strong> {jobData.experience}
                  </div>

                  <div>
                    <strong>Location:</strong> {jobData.location}
                  </div>

                  <div>
                    <strong>Skills:</strong>
                  </div>

                  <ul>
                    {jobData.skills?.map((skill: string) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>

                  <div className="mt-3">
                    <strong>Job Description</strong>

                    <p className="mt-2 rounded-lg border p-3 text-sm">
                      {jobData.description}
                    </p>
                  </div>
                </div>
              )}

              {!structuredResume && (
                <>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                  />
                </>
              )}

              {structuredResume && (
                <>
                  <button
                    onClick={clearResume}
                    className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Clear Resume
                  </button>
                </>
              )}

              <button
                onClick={handleAnalyzeJob}
                className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Analyze Job
              </button>

              {/* {resumeText && (
                <textarea
                  value={resumeText}
                  readOnly
                  rows={10}
                  className="w-full border mt-2"
                />
              )} */}

              {loading && <div className="mt-3 text-center">{status}</div>}

              {review && (
                <>
                  {review && (
                    <div className="mt-4 rounded-xl border p-4">
                      <div className="text-sm text-gray-500">Match Score</div>

                      <div className="text-4xl font-bold">
                        {review.matchScore}%
                      </div>
                    </div>
                  )}

                  {review?.strengths?.length > 0 && (
                    <div className="mt-4 rounded-xl border p-4">
                      <h3 className="font-semibold mb-2">Strengths</h3>

                      <ul className="space-y-2">
                        {review.strengths.map((item) => (
                          <li key={item}>✅ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review?.missingSkills?.length > 0 && (
                    <div className="mt-4 rounded-xl border p-4">
                      <h3 className="font-semibold mb-2">Missing Skills</h3>

                      <ul className="space-y-2">
                        {review.missingSkills.map((item) => (
                          <li key={item}>❌ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review && (
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
                  )}

                  {review?.recommendations?.length > 0 && (
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
