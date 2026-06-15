import { Router } from "express";
import { analyzeResume } from "../services/resume.service";
import multer from "multer";

import { analyzeApplication } from "../services/analyze.service";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    const structuredResume = await analyzeResume(resumeText);

    res.json({
      success: true,
      data: structuredResume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
    });
  }
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description required",
      });
    }

    const result = await analyzeApplication(req.file.buffer, jobDescription);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
});

export default router;
