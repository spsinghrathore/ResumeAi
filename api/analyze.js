import { analyzeResume } from "../lib/analyzeHelper.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await analyzeResume(req, res);
}
