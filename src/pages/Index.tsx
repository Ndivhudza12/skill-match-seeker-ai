
import { useState } from "react";
import { CVUploader } from "@/components/CVUploader";
import { CVAnalysisResults } from "@/components/CVAnalysisResults";
import { JobSearch } from "@/components/JobSearch";
import { CVAnalysisResult, Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [showJobs, setShowJobs] = useState(false);

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

  const handleMoveToJobSearch = () => {
    setShowJobs(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleBackToAnalysis = () => {
    setShowJobs(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {showJobs ? "Job Match Finder" : "CV Skills Analyzer"}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {showJobs 
              ? "Find jobs that match your skills and experience"
              : "Upload your CV to get a detailed analysis of your skills and customized recommendations"
            }
          </p>
        </header>

        {!showJobs ? (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <CVUploader 
                  onAnalysisComplete={handleAnalysisComplete}
                  onSkillsExtracted={setUserSkills}
                />
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

            {userSkills.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleMoveToJobSearch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  Find Matching Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToAnalysis}
              >
                ← Back to CV Analysis
              </Button>
            </div>
            <JobSearch userSkills={userSkills} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
