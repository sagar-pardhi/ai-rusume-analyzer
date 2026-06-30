# AI Resume Reviewer for Naukri.com

An AI-powered Chrome Extension that analyzes your resume against **Naukri.com** job listings using OpenAI. The extension automatically extracts job information from the current job page, compares it with your resume, and provides an ATS-style match score along with personalized recommendations.

> 🚀 Fully serverless — No backend required. Everything runs locally inside the Chrome Extension.

---

## ✨ Features

- 📄 Upload your resume (PDF)
- 🤖 AI-powered resume analysis using OpenAI
- 💼 Automatically extracts job details from Naukri.com
- 📊 ATS-style resume match score
- ✅ Highlights resume strengths
- ❌ Identifies missing skills
- 💡 Personalized improvement suggestions
- 💾 Stores analyzed resume locally using Chrome Storage
- 🔑 Uses your own OpenAI API key
- ⚡ No backend or server required

---

# Demo Flow

```text
               First Time Setup

        Enter OpenAI API Key
                  │
                  ▼
          Upload Resume (PDF)
                  │
                  ▼
         Extract Resume Text
                  │
                  ▼
         Analyze Resume with AI
                  │
                  ▼
      Save Structured Resume Locally


             Daily Usage

        Open Naukri Job Page
                  │
                  ▼
          Open Extension
                  │
                  ▼
     Job Automatically Extracted
                  │
                  ▼
          Analyze Job Match
                  │
                  ▼
          AI Match Report
```

---

# Screenshots

> Add screenshots here

- Home Screen
- OpenAI API Key Setup
- Resume Ready
- Job Extracted
- Match Score
- Recommendations

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3

## AI

- OpenAI Responses API
- GPT-5 Mini

## PDF Parsing

- pdfjs-dist

## Validation

- Zod

## Storage

- Chrome Storage API

---

# Project Structure

```text
src
│
├── ai
│   ├── openai.ts
│   ├── resume-agent.ts
│   ├── job-agent.ts
│   └── reviewer-agent.ts
│
├── prompts
│   ├── resume.prompt.ts
│   ├── job.prompt.ts
│   └── review.prompt.ts
│
├── schemas
│   ├── resume.schema.ts
│   ├── job.schema.ts
│   └── review.schema.ts
│
├── lib
│   ├── pdf.ts
│   ├── storage.ts
│   └── utils.ts
│
├── components
│
├── App.tsx
│
└── main.tsx
```

---

# Architecture

```text
                    Chrome Extension

                  User Uploads Resume
                           │
                           ▼
                    PDF.js (Local)
                           │
                           ▼
                  Resume Agent (OpenAI)
                           │
                           ▼
             Structured Resume (Local Storage)

──────────────────────────────────────────────────────────

                User Opens Naukri Job Page
                           │
                           ▼
             Auto Extract Job Information
                           │
                           ▼
                    Job Agent (OpenAI)
                           │
                           ▼
                 Structured Job Details

──────────────────────────────────────────────────────────

            Structured Resume
                    +
             Structured Job
                    │
                    ▼
            Reviewer Agent (OpenAI)
                    │
                    ▼
             Match Score & Suggestions
```

---

# How It Works

## 1. Resume Analysis

The user uploads a PDF resume.

The extension:

- Extracts text using PDF.js
- Sends the text to OpenAI
- Converts the resume into structured JSON
- Saves the structured resume in Chrome Storage

Example:

```json
{
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": [
    {
      "company": "ABC",
      "role": "Frontend Developer"
    }
  ],
  "education": [],
  "projects": []
}
```

---

## 2. Job Analysis

Whenever the extension is opened on a Naukri job page:

- Job Title
- Company
- Experience
- Skills
- Description

are automatically extracted.

OpenAI converts them into structured data.

Example:

```json
{
  "title": "Frontend Developer",
  "requiredSkills": ["React", "TypeScript", "AWS"],
  "experience": "3+ years",
  "responsibilities": ["Develop scalable web applications"]
}
```

---

## 3. Resume Review

The extension compares the structured resume with the structured job description.

Example response:

```json
{
  "matchScore": 86,
  "strengths": ["Strong React experience", "TypeScript expertise"],
  "missingSkills": ["AWS", "Docker"],
  "recommendations": [
    "Add cloud deployment projects",
    "Highlight CI/CD experience"
  ],
  "shouldApply": true,
  "summary": "Good overall match with minor skill gaps."
}
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ai-resume-reviewer.git

cd ai-resume-reviewer
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development

```bash
npm run dev
```

---

## Build Extension

```bash
npm run build
```

---

## Load Extension

1. Open Chrome

2. Navigate to

```
chrome://extensions
```

3. Enable **Developer Mode**

4. Click **Load unpacked**

5. Select the generated `dist` folder

---

# Using the Extension

## First Time

1. Install the extension
2. Enter your OpenAI API Key
3. Upload your resume
4. Wait for resume analysis
5. Resume is stored locally

---

## Daily Usage

1. Open any Naukri job listing
2. Open the extension
3. Job details are extracted automatically
4. Click **Analyze Job**
5. View AI-powered insights

---

# OpenAI API Key

This extension uses **your own OpenAI API key**.

Your API key is:

- Stored only in Chrome Local Storage
- Never sent to any custom backend
- Never shared with anyone
- Used only to communicate directly with the OpenAI API

Generate your API key from:

https://platform.openai.com/api-keys

---

# Supported Websites

Currently Supported

- ✅ Naukri.com

Planned Support

- LinkedIn
- Indeed
- Wellfound
- Instahyre

---

# Privacy

Your data remains under your control.

- Resume PDF is processed locally
- Resume text is extracted locally
- Structured resume is stored locally
- No backend server
- No database
- No user accounts
- No analytics

The only external service used is the OpenAI API for AI-powered analysis.

---

# Future Improvements

- Resume Tailoring
- Cover Letter Generator
- Interview Question Generator
- ATS Keyword Optimizer
- Resume Version Manager
- Job History
- Cached AI Responses
- Multiple Resume Profiles
- Export Report as PDF
- Dark Mode
- Support for More Job Portals

---

# Why This Project?

Recruiters often use Applicant Tracking Systems (ATS) to filter resumes before they reach a human recruiter.

This extension helps job seekers:

- Measure resume-job compatibility
- Identify missing skills
- Improve resumes before applying
- Save time during job applications
- Make data-driven application decisions

---

# License

MIT License

---

# Author

**Your Name**

GitHub: https://github.com/yourusername
