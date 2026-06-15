import { Router } from "express";
import { analyzeJob } from "../services/job.service";

const router = Router();

router.post("/analyze-job", async (req, res) => {
  try {
    const { jobDescription } = req.body;

    const result = await analyzeJob(jobDescription);

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
