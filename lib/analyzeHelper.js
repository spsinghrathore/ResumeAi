import { config } from "dotenv";
config();

async function callOpenRouterWithRetry(prompt, model, apiKey, retries = 3, delayMs = 1500) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant that only returns JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const text = await response.text();
      console.warn(`Attempt ${attempt + 1} failed with status ${response.status}: ${text}`);

      if (response.status === 429 && attempt < retries - 1) {
        // Rate limit: wait and retry
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        // Other errors or out of retries
        throw new Error(`AI request failed with status ${response.status}: ${text}`);
      }
    }
  }
}

export async function analyzeResume(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" });
  }

  const { resumeText, jobDescription, mock } = req.body || {};

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
You are an API. Output ONLY valid JSON. Do NOT include any explanation or extra text.

Compare the following resume with the job description.

Instructions:
- Identify unique keywords or phrases from the job description.
- Count how many of those keywords appear in the resume text.
- Calculate match_score as: (matched_keywords / total_keywords) × 100.
- If no keywords are missing and suggestions aren’t needed, return a cheerful suggestion.

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
    const model = process.env.OPENROUTER_MODEL || "moonshotai/kimi-k2:free";
    const apiKey = process.env.OPENROUTER_API_KEY;

    const data = await callOpenRouterWithRetry(prompt, model, apiKey);

    if (!data.choices || !data.choices[0]) {
      throw new Error("AI response missing choices");
    }

    const raw = data.choices[0].message?.content || data.choices[0].text;
    console.log("🧠 RAW AI OUTPUT:", raw);

    if (!raw) {
      return res.status(500).json({ error: "Empty response from AI", full: data });
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("⚠️ Invalid AI response format:", raw);
      return res.status(500).json({ error: "Invalid AI response format", raw });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("❌ JSON parse error:", parseErr, raw);
      return res.status(500).json({ error: "Failed to parse AI JSON", details: parseErr.message });
    }

    return res.json(parsed);

  } catch (err) {
    console.error("❌ Exception calling AI:", err);
    return res.status(500).json({ error: "AI request failed", details: err.message });
  }
}
