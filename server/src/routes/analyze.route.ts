import { Router } from "express";
import { analyzeResume } from "../services/resume.service";
import multer from "multer";

import {
  parseAndAnalyzeResume,
  analyzeJobReview,
} from "../services/analyze.service";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file required",
      });
    }

    const result = await parseAndAnalyzeResume(req.file.buffer);

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

router.post("/analyze-job", async (req, res) => {
  try {
    const { structuredResume, jobDescription } = req.body;

    if (!structuredResume) {
      return res.status(400).json({
        success: false,
        message: "Structured resume required",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description required",
      });
    }

    const result = await analyzeJobReview(structuredResume, jobDescription);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;
