import { config } from "dotenv";
config();

export async function analyzeResume(req, res) {
  const { resumeText, jobDescription, mock } = req.body;

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
You are an API. Output ONLY valid JSON...

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
    const raw = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;

    if (!raw) {
      return res.status(500).json({ error: "Empty response from AI" });
    }

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "AI request failed" });
  }
}
