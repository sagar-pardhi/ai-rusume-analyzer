import { useState } from "react";
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
  const [resumeText, setResumeText] = useState("");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const extractJob = async () => {
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
  };

  const analyze = async () => {
    try {
      if (!resume) {
        alert("Upload resume first");
        return;
      }

      if (!jobData?.description) {
        alert("Extract job first");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("resume", resume);

      formData.append("jobDescription", jobData.description);

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setReview(data.data);
      setResumeText(data.text);
    } catch (error) {
      console.error(error);

      alert("Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-[400px]">
      <h1 className="font-bold text-lg">AI Resume Reviewer</h1>

      <button
        onClick={extractJob}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Extract Job
      </button>

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

          <pre
            style={{
              maxHeight: 200,
              overflow: "auto",
              fontSize: 10,
            }}
          >
            {jobData.description}
          </pre>
        </div>
      )}

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

      <button onClick={analyze}>Analyze Resume</button>

      {resumeText && (
        <textarea
          value={resumeText}
          readOnly
          rows={10}
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
        />
      )}

      {loading && <div>Analyzing Resume...</div>}

      {review && (
        <>
          <div
            style={{
              marginTop: "16px",
            }}
          >
            <h2>Match Score: {review?.matchScore}%</h2>

            <h3>{review?.shouldApply ? "✅ Apply" : "❌ Skip"}</h3>

            <p>{review?.summary}</p>
          </div>

          {review?.strengths?.length > 0 && (
            <>
              <h4>Strengths</h4>

              <ul>
                {review?.strengths?.map((strength) => (
                  <li key={strength}>✅ {strength}</li>
                ))}
              </ul>
            </>
          )}

          {review?.missingSkills?.length > 0 && (
            <>
              <h4>Missing Skills</h4>

              <ul>
                {review?.missingSkills?.map((skill) => (
                  <li key={skill}>❌ {skill}</li>
                ))}
              </ul>
            </>
          )}

          {review?.recommendations?.length > 0 && (
            <>
              <h4>Recommendations</h4>

              <ul>
                {review?.recommendations?.map((item) => (
                  <li key={item}>💡 {item}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
