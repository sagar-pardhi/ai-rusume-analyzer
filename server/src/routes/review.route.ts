import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/review", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    const parser = new PDFParse({
      data: req.file.buffer,
    });

    const result = await parser.getText();

    res.json({
      success: true,
      text: result.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to parse PDF",
    });
  }
});

export default router;
