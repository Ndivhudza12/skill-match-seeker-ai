
import { useState } from "react";
import { CVUploader } from "@/components/CVUploader";
import { CVAnalysisResults } from "@/components/CVAnalysisResults";
import { CVAnalysisResult } from "@/types";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setAnalysisResult(result);
    // Scroll to results if on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight / 2,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CV Skills Analyzer
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload your CV to get a detailed analysis of your skills and customized recommendations to improve your job prospects
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <CVUploader onAnalysisComplete={handleAnalysisComplete} />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            {analysisResult ? (
              <CVAnalysisResults analysisResult={analysisResult} />
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div className="text-slate-400">
                  <p className="text-lg font-medium mb-2">CV Analysis Results</p>
                  <p className="text-sm">Upload or paste your CV text to see detailed analysis and recommendations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
