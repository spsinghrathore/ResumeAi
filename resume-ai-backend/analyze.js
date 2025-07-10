// analyze.js
import { config } from "dotenv";
config();

export async function analyzeResume(req, res) {
  const { resumeText, jobDescription, mock } = req.body;

  // ✅ Mock mode for local testing
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

DO NOT infer or expand the job description. ONLY use the exact words and phrases provided.

Instructions:
- Identify unique keywords or phrases from the job description.
- Count how many of those keywords appear in the resume text.
- Calculate match_score as: (matched_keywords / total_keywords) × 100
- If no keywords are missing and suggestions aren’t needed, return a cheerful suggestion like:
  "🎉 Your resume perfectly aligns with the job description! You're ready to apply with confidence."

Return ONLY this JSON format:

{
  "match_score": number (0-100),
  "missing_keywords": [array of strings],
  "suggestions": "short suggestions or motivation"
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
        model: process.env.OPENROUTER_MODEL || "openrouter/cypher-alpha:free",
        messages: [
          { role: "system", content: "You are a helpful assistant that only returns JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    // console.log("🧾 Full AI response:", data);

    // ✅ Supports both chat-style and text-style responses
    const raw = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;

    if (!raw) {
      console.error("❌ AI response content is empty or missing");
      return res.status(500).json({ error: "Empty response from AI" });
    }

    console.log("🔍 Raw AI response content:", raw);

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in AI response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("❌ Could not parse AI JSON:", raw);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    return res.json(parsed);
  } catch (err) {
    console.error("❌ AI call failed:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}