import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getInsights } from "./controllers/insightsController.js";
import { getAiInsights } from "./controllers/aiController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/insights", getInsights);
app.post("/api/ai-insights", getAiInsights);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Performance Training Dashboard API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
