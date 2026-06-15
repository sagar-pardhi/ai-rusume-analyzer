import { Router } from "express";
import { analyzeResume } from "../services/resume.service";

const router = Router();

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

export default router;
