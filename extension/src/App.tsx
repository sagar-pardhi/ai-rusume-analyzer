import { useEffect, useState } from "react";
import type { JobDetails } from "./types/job";

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
  const [resume, setResume] = useState<File | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [structuredResume, setStructuredResume] = useState<Record<
    string,
    string
  > | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["structuredResume"], (result) => {
      if (result.structuredResume) {
        setStructuredResume(result.structuredResume as Record<string, string>);
      }
    });
  }, []);

  useEffect(() => {
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
              document.querySelector("#job_header h1")?.textContent?.trim() ||
              "";

            const company =
              document.querySelector("#job_header a")?.textContent?.trim() ||
              "";

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

    extractJob();
  }, []);

  const uploadResume = async () => {
    try {
      if (!resume) {
        alert("Upload resume first");
        return;
      }

      if (!jobData?.description) {
        alert("Extract job first");
        return;
      }

      setUploadingResume(true);

      const formData = new FormData();

      formData.append("resume", resume);

      // formData.append("jobDescription", jobData.description);

      const response = await fetch("http://localhost:5000/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      console.log(data);

      setReview(data.data.review);

      chrome.storage.local.set({
        structuredResume: data.data.structuredResume,
      });

      setStructuredResume(data.data.structuredResume);
    } catch (error) {
      console.error(error);

      alert("Failed to analyze");
    } finally {
      setUploadingResume(false);
    }
  };

  const analyzeResume = async () => {
    try {
      if (!structuredResume) {
        alert("Upload resume first");
        return;
      }

      if (!jobData?.description) {
        alert("Job not found");
        return;
      }

      setLoading(true);

      const response = await fetch("http://localhost:5000/api/analyze-job", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          structuredResume,
          jobDescription: jobData.description,
        }),
      });

      const data = await response.json();

      setReview(data.data.review);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearResume = () => {
    chrome.storage.local.remove("structuredResume");

    setStructuredResume(null);
    setReview(null);
  };

  return (
    <div className="w-[420px] min-h-[600px] bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">AI Resume Reviewer</h1>

        <p className="text-sm text-gray-500">Analyze Naukri jobs instantly</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm text-gray-500">Resume</div>

          <div className="font-medium">
            {structuredResume || resume ? "✅ Uploaded" : "❌ Missing"}
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
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setResume(file);
              }
            }}
          />

          <button
            onClick={uploadResume}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Upload Resume
          </button>
        </>
      )}

      {structuredResume && (
        <>
          <div className="rounded-lg border p-3 mt-3">✅ Resume Ready</div>

          <button
            onClick={analyzeResume}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Analyze Resume
          </button>

          <button
            onClick={clearResume}
            className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Clear Resume
          </button>
        </>
      )}

      {uploadingResume && (
        <div className="mt-3 text-center">⏳ Uploading Resume...</div>
      )}
      {loading && <div className="mt-3 text-center">⏳ Analyzing...</div>}

      {review && (
        <>
          {review && (
            <div className="mt-4 rounded-xl border p-4">
              <div className="text-sm text-gray-500">Match Score</div>

              <div className="text-4xl font-bold">{review.matchScore}%</div>
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
    </div>
  );
}

export default App;
