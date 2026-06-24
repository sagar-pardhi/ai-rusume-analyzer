import { useEffect, useState } from "react";
import type { JobDetails } from "./types/job";
import { extractPdfText } from "./lib/pdf";
import { analyzeResume } from "./ai/resume-agent";
import { analyzeJob } from "./ai/job-agent";
import type { ReviewData } from "./schemas/review.schema";
import { reviewMatch } from "./ai/review-agent";
import type { ResumeData } from "./schemas/resume.schema";
import { ApiKeySetup } from "./components/ApiKeySetup";
import { UnsupportedSite } from "./components/UnsupportedSite";
import { StatusCards } from "./components/StatusCards";
import { JobDetailsCard } from "./components/JobDetailsCard";
import { ResumeUpload } from "./components/ResumeUpload";
import { ReviewResults } from "./components/ReviewResults";

function App() {
  const [jobData, setJobData] = useState<JobDetails | null | undefined>(null);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [structuredResume, setStructuredResume] = useState<ResumeData | null>(
    null,
  );
  const [isNaukriPage, setIsNaukriPage] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");
  const [status, setStatus] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");

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
        setStructuredResume(result.structuredResume as ResumeData);
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
      console.log("Extracting Job...");

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
      console.log("Error Extracting Job:", error);
    } finally {
      console.log("Extracting Job Done");
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
      console.log("Extracting Resume...");
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
      console.error("Error Extracting Resume:", error);
    } finally {
      console.log("Extracting Resume Done");
      setLoading(false);
      setStatus("");
    }
  };

  const analyzeJobFit = async () => {
    if (!structuredResume) return;

    if (!jobData?.description) return;

    try {
      console.log("Analyzing Job Fit...");
      setLoading(true);

      console.log("Analyzeing Job Description...", jobData.description);
      const analyzeJobresult = await analyzeJob(
        jobData.description,
        savedApiKey,
      );
      console.log("Analyzed Job Data:", analyzeJobresult);

      if (!analyzeJobresult) return;

      setStatus("Analyzing Job Fit...");
      const result = await reviewMatch(
        structuredResume,
        analyzeJobresult,
        savedApiKey,
      );

      setReview(result);
    } catch (error) {
      console.error("Error Analyzing Job Fit:", error);
    } finally {
      console.log("Analyzing Job Fit Done");
      setLoading(false);
      setStatus("");
    }
  };

  const clearResume = () => {
    chrome.storage.local.remove("structuredResume");

    setStructuredResume(null);
    setReview(null);
  };

  return (
    <div className="w-[420px] min-h-[600px] bg-white p-4">
      {!savedApiKey && (
        <ApiKeySetup
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSave={saveApiKey}
        />
      )}

      {savedApiKey && (
        <>
          {!isNaukriPage && (
            <UnsupportedSite currentDomain={currentDomain} />
          )}

          {isNaukriPage && (
            <>
              <div className="mb-4">
                <h1 className="text-xl font-bold">AI Resume Reviewer</h1>

                <p className="text-sm text-gray-500">
                  Analyze Naukri jobs instantly
                </p>
              </div>

              <StatusCards
                onClearApiKey={clearApiKey}
                hasResume={!!structuredResume}
                extracting={extracting}
                hasJobData={!!jobData}
              />

              {structuredResume && (
                <button
                  onClick={clearResume}
                  className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Clear Resume
                </button>
              )}

              <button
                onClick={analyzeJobFit}
                className="mt-2 w-full rounded-lg bg-green-600 px-4 py-2 text-white"
              >
                Analyze Job Fit
              </button>

              {loading && (
                <div className="mt-3 text-center">{`⏳ ${status}`}</div>
              )}

              {jobData && <JobDetailsCard jobData={jobData} />}

              {!structuredResume && (
                <ResumeUpload onUpload={handleResumeUpload} />
              )}

              {review && <ReviewResults review={review} />}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
