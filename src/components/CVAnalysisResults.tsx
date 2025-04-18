
import { CheckCircle, AlertCircle, Building, GraduationCap, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CVAnalysisResult } from "@/types";

interface CVAnalysisResultsProps {
  analysisResult: CVAnalysisResult;
}

export function CVAnalysisResults({ analysisResult }: CVAnalysisResultsProps) {
  const { overallScore, skillsAnalysis, suggestedImprovements, workExperience, education } = analysisResult;
  
  // Function to determine strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong": return "bg-green-500";
      case "Medium": return "bg-orange-500";
      case "Weak": return "bg-red-500";
      default: return "bg-slate-300";
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Content Analysis</h2>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500" />
              <span className="font-medium">Overall Score</span>
            </div>
            <span className="font-semibold text-blue-600">{overallScore}/100</span>
          </div>
          <Progress value={overallScore} className="h-2.5 bg-slate-100" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Key Skills Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsAnalysis.map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{skill.name}</span>
                  {skill.yearsOfExperience && (
                    <span className="text-gray-500 text-xs ml-2">
                      {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                    </span>
                  )}
                </div>
                <span 
                  className={`font-medium ${
                    skill.strength === "Strong" ? "text-green-600" : 
                    skill.strength === "Medium" ? "text-orange-600" : 
                    "text-red-600"
                  }`}
                >
                  {skill.strength}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor(skill.strength)}`} 
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {workExperience && workExperience.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Work Experience</h3>
          <div className="space-y-3">
            {workExperience.map((work, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 p-2 rounded-full">
                    <Building size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{work.company}</h4>
                    <div className="flex flex-wrap gap-x-3 text-sm text-slate-600 mt-1">
                      <span className="flex items-center">
                        {work.title}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {work.years} {work.years === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Education</h3>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-purple-100 p-2 rounded-full">
                    <GraduationCap size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{edu.institution}</h4>
                    <div className="flex flex-wrap gap-x-3 text-sm text-slate-600 mt-1">
                      <span>{edu.degree}</span>
                      {edu.year !== "Not specified" && (
                        <span className="text-slate-500">{edu.year}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Suggested Improvements</h3>
        <div className="space-y-4">
          {suggestedImprovements.map((improvement, index) => (
            <div key={index} className="flex gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <AlertCircle size={18} className="text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
