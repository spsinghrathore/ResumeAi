// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeResume } from "./analyze.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", analyzeResume);

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});