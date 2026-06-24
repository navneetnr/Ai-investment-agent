"use client";

import { useState } from "react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [investorStyle, setInvestorStyle] = useState("Balanced");
  const [result, setResult] = useState<any>(null); 
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Analyzing...");

  const handleAnalyze = async () => {
    if (!company.trim()) {
      alert("Please enter a company name");
      return;
    }

    let statusInterval: any;

    try {
      setLoading(true);
      setResult(null); 
      
      // Dynamic Production-Grade Loading Cycle
      setLoadingStatus("Connecting to Gemini via LangChain.js framework...");
      
      statusInterval = setInterval(() => {
        setLoadingStatus((prev) => {
          if (prev.includes("LangChain.js")) {
            return `Evaluating financial metrics for ${company} (${investorStyle} profile)...`;
          }
          if (prev.includes("Evaluating")) {
            return "Parsing Bull & Bear market risk cases...";
          }
          if (prev.includes("Parsing")) {
            return "Structuring clean JSON schema payload output...";
          }
          return "Connecting to Gemini via LangChain.js framework...";
        });
      }, 2000);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          investorStyle, 
        }),
      });

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (data.success) {
        setResult(data.data); 
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      if (statusInterval) clearInterval(statusInterval);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-8">
        AI Investment Research Agent
      </h1>

      <div className="max-w-4xl space-y-4">
        <input
          type="text"
          placeholder="Enter Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-4 rounded border border-gray-600 bg-black text-white focus:outline-none focus:border-white"
        />

        <select
          value={investorStyle}
          onChange={(e) => setInvestorStyle(e.target.value)}
          className="w-full p-4 rounded border border-gray-600 bg-black text-white focus:outline-none focus:border-white"
        >
          <option value="Conservative">Conservative</option>
          <option value="Balanced">Balanced</option>
          <option value="Aggressive">Aggressive</option>
        </select>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition disabled:bg-gray-500"
        >
          {loading ? loadingStatus : "Analyze Company"}
        </button>

        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-3xl font-bold mb-4">
              AI Analysis Dashboard
            </h2>

            {/* MAIN METRICS METERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-700 rounded p-4 text-center">
                <p className="text-gray-400 text-sm">Verdict</p>
                <p className={`text-2xl font-black mt-1 ${result.verdict === 'INVEST' ? 'text-green-400' : 'text-red-400'}`}>
                  {result.verdict}
                </p>
              </div>
              <div className="border border-gray-700 rounded p-4 text-center">
                <p className="text-gray-400 text-sm">Investment Score</p>
                <p className="text-2xl font-black text-yellow-400 mt-1">{result.score}/100</p>
              </div>
              <div className="border border-gray-700 rounded p-4 text-center">
                <p className="text-gray-400 text-sm">Confidence</p>
                <p className="text-2xl font-black text-purple-400 mt-1">{result.confidence}%</p>
              </div>
            </div>

            {/* OVERVIEW CARD */}
            <div className="border border-gray-700 rounded p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-300">Company Overview</h3>
              <p className="text-gray-400 leading-relaxed">{result.overview}</p>
            </div>

            {/* BULL AND BEAR COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-900/50 bg-green-950/10 rounded p-6">
                <h3 className="text-xl font-bold mb-3 text-green-400">🟢 Bull Case</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                  {result.bullCase?.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-red-900/50 bg-red-950/10 rounded p-6">
                <h3 className="text-xl font-bold mb-3 text-red-400">🔴 Bear Case</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                  {result.bearCase?.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* REASON THESIS */}
            <div className="border border-gray-700 rounded p-6 bg-gray-900/30">
              <h3 className="text-lg font-bold mb-1 text-gray-400">AI Thesis Reason</h3>
              <p className="text-gray-300 italic text-sm">"{result.reason}"</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}