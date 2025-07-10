import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExtractPdfText from "../assets/components/ExtractPdfText";

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
  setLoading(true);
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
      const errorText = await res.text();
      console.error("❌ Server returned error:", res.status, errorText);
      alert("Server error: " + res.status);
      return;
    }

    const result = await res.json();
    console.log("✅ AI Result from backend:", result);

    navigate("/result", { state: { aiResult: result } });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    alert("Analysis failed");
  } finally {
    setLoading(false);
  }
};


  const isReady = resumeFile && jobDescription.trim();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-16">
      <h1 className="md:mt-9 mt-0 text-3xl mb-5 max-w-6xl text-center md:text-7xl font-extrabold   text-gray-900">
        Your Resume. Reimagined by AI.
      </h1>
      <p className="md:mb-9   max-w-7xl text-sm text-center md:text-2xl font-light  text-gray-900">Match job descriptions. Uncover missing keywords. Land interviews faster.</p>

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
            <div className="text-indigo-600 text-6xl">📄</div>
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

      <ExtractPdfText file={resumeFile} onExtractedText={setExtractedText} />

      <button
        onClick={handleAnalyze}
        disabled={!isReady || loading}
        className={`w-2xl py-4 mt-8 rounded-3xl text-white text-lg font-semibold transition duration-300 ${
          !isReady || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-neutral-800"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="text-black text-xl font-bold animate-pulse">ResumeAi is thinking...</div>
        </div>
      )}
    </div>
  );
}