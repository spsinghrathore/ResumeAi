import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../assets/components/Button";

function AnimatedScoreRing({ score }) {
  const [progress, setProgress] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    const fillInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= score) {
          clearInterval(fillInterval);
          return score;
        }
        return prev + 1;
      });
    }, 10);

    const numberInterval = setInterval(() => {
      setDisplayedScore((prev) => {
        if (prev >= score) {
          clearInterval(numberInterval);
          return score;
        }
        return prev + 1;
      });
    }, 20);

    return () => {
      clearInterval(fillInterval);
      clearInterval(numberInterval);
    };
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Match Score</h2>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#6366f1"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-700">
            {displayedScore}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.aiResult;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!result || typeof result !== "object") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          No analysis found. Please upload your resume and try again.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-neutral-800 transition"
        >
           Back to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-2xl font-bold animate-pulse">
          ResumeAi is preparing your results
        </div>
          <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-6 py-16">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-12 animate-fade-in-down">
        ── .✦ Your Resume Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Match Score */}
        <AnimatedScoreRing score={result.match_score ?? 0} />

        {/* Missing Keywords */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Missing Keywords</h2>
          {Array.isArray(result.missing_keywords) && result.missing_keywords.length ? (
            <div className="flex flex-wrap gap-2">
              {result.missing_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium shadow-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-green-600">None 🎉</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggestions</h2>
          <div className="flex flex-wrap gap-2">
            {typeof result.suggestions === "string" &&
              result.suggestions
                .split(/(?<=\.)\s+/)
                .filter(Boolean)
                .map((point, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {point}
                  </span>
                ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button
          onClick={() => navigate("/")}
        >
         Analyze Another 
        </Button>
      </div>
    </div>
  );
}