import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExtractPdfText from "../assets/components/ExtractPdfText";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Button from "../assets/components/Button";

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setShowError(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: extractedText,
          jobDescription,
          mock: false,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        console.error("❌ Server returned error:", res.status, errorJson);
        setError(errorJson.suggestion || errorJson.error || "Something went wrong.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000); // Auto-hide after 5s
        return;
      }

      const result = await res.json();
      console.log("✅ AI Result from backend:", result);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      

      navigate("/result", { state: { aiResult: result } });
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Server is busy or offline. Try again later.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000); // Auto-hide after 5s
    } finally {
      setLoading(false);
    }
  };

  const isReady = resumeFile && jobDescription.trim();

  return (
    <div className="min-h-screen container bg-gray-50 flex flex-col items-center px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="md:mt-9 mt-0 text-3xl mb-5 max-w-6xl text-center md:text-7xl font-extrabold text-black"
      >
        Your Resume. Reimagined by{" "}
        <span className="bg-gradient-to-r from-[#121953] to-[#1532b4] bg-clip-text text-transparent">
          AI.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="md:mb-9 max-w-7xl text-sm text-center md:text-2xl font-light text-gray-900"
      >
        Match job descriptions. Uncover missing keywords. Land interviews faster.
      </motion.p>

      <div className="flex flex-col md:flex-row gap-10 max-w-5xl w-full">
        {/* Resume Upload */}
        <label
          htmlFor="resume-upload"
          className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center items-center w-full md:w-1/2 h-72 p-8 select-none"
        >
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="hidden"
          />
          <div className="flex flex-col items-center space-y-4">
            <div className="text-indigo-600 text-6xl"><img src="upload.png" className="w-15 h-auto max-w-md"></img> </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Your Resume
            </h2>
            <p className="text-gray-500 text-center max-w-xs">
              Click here or drag & drop your PDF resume to get started.
            </p>
            {resumeFile && (
              <p className="mt-4 text-indigo-700 font-medium truncate max-w-xs text-center">
                {resumeFile.name}
              </p>
            )}
          </div>
        </label>

        {/* Job Description */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 w-full md:w-1/2 h-72 p-8 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paste Job Description
          </h2>
          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition h-full w-full"
          />
        </div>
      </div>

      {/* Text Extractor */}
      <ExtractPdfText file={resumeFile} onExtractedText={setExtractedText} />

      {/* Analyze Button */}
      <Button
        onClick={handleAnalyze}
        disabled={!isReady || loading}
        className={`mt:w-2xl w-50 py-4 mt-8 ${!isReady || loading}`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {/* Loader */}
      {loading && (
        <div className="flex flex-row gap-2 mt-4">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      )}

      {/* Floating Toast-style Error */}
      {showError && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-800 shadow-md rounded-xl px-5 py-3 w-[90%] md:w-auto max-w-xl z-50"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm">{error}</span>
          </div>
          <div className="mt-2 h-1 bg-red-300 rounded">
            <div className="h-full bg-red-600 animate-slide w-full rounded" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
