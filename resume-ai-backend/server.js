// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // If using Node.js < 18, install with: npm install node-fetch

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { resumeText, jobDescription, mock } = req.body;

  // ✅ Optional mock mode for development
  if (process.env.NODE_ENV === "development" && mock) {
    return res.json({
      match_score: 85,
      missing_keywords: ["Node.js", "TypeScript"],
      suggestions: "Add backend experience with Node.js and TypeScript.",
    });
  }

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: "Missing input data" });
  }

  const prompt = `
You are an API. Output ONLY valid JSON. Do NOT include any explanation, prefix, or suffix.

Compare the following resume with the job description.

DO NOT infer or expand the job description. ONLY use the exact words and phrases provided in the job description.

Return ONLY this JSON format:

{
  "match_score": number (0-100),
  "missing_keywords": [array of strings],
  "suggestions": "short suggestions"
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/cypher-alpha:free",
        messages: [
          { role: "system", content: "You are a helpful assistant that only returns JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    console.log("🔍 Raw AI response content:", content);

    let parsed;
    try {
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ Could not parse AI JSON:", content);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    return res.json(parsed);
  } catch (err) {
    console.error("❌ AI call failed:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});