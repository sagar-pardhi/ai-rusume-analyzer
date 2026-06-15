import express from "express";
import cors from "cors";

import reviewRoutes from "./routes/review.route";
import analyzeRoutes from "./routes/analyze.route";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", reviewRoutes);
app.use("/api", analyzeRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
  });
});

export default app;
