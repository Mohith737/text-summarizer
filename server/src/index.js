import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { summarizeText } from "./llm.js";
import { validateInput } from "./validate.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/summarize", async (req, res) => {
  const { text } = req.body;
  const validation = validateInput(text);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (text.length > 15000) {
    return res.status(400).json({ error: "Text too long. Maximum 15,000 characters." });
  }

  try {
    const result = await summarizeText(text);
    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Failed to summarize. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
