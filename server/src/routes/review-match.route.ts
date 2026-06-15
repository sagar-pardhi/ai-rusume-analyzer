import { Router } from "express";
import { reviewMatch } from "../services/review.service";

const router = Router();

router.post("/review-match", async (req, res) => {
  try {
    const { resume, job } = req.body;

    const result = await reviewMatch(resume, job);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to review match",
    });
  }
});

export default router;
