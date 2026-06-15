import { Router } from "express";
import { analyzeResume } from "../services/resume.service";

const router = Router();

router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeText } = req.body;

    const result = await analyzeResume(resumeText);

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
