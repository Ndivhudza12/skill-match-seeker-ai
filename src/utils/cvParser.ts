
import { v4 as uuid } from "uuid";
import { CVAnalysisResult, SkillAnalysis } from "@/types";

// List of skills we can detect in CVs
const DETECTABLE_SKILLS = [
  "UI/UX Design",
  "Figma",
  "User Research",
  "Prototyping",
  "HTML/CSS",
  "Product Strategy",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST API",
  "SQL",
  "NoSQL",
  "MongoDB",
  "Agile",
  "Scrum",
  "DevOps",
  "Project Management",
  "Leadership",
];

// Suggestions based on analysis scores
const IMPROVEMENT_SUGGESTIONS = [
  {
    trigger: (results: CVAnalysisResult) => {
      return !results.skillsAnalysis.some(s => s.strength === "Strong");
    },
    title: "Add more quantifiable achievements to your experience section.",
    description: "Example: \"Increased user engagement by 45% through redesigned navigation\""
  },
  {
    trigger: (results: CVAnalysisResult) => {
      return results.skillsAnalysis.some(s => s.name === "Product Strategy" && s.strength === "Weak");
    },
    title: "Strengthen your product strategy skills to match senior positions.",
    description: "Consider adding relevant courses or projects that demonstrate strategic thinking."
  },
  {
    trigger: (results: CVAnalysisResult) => {
      return results.overallScore < 80;
    },
    title: "Your summary is too generic - tailor it to highlight your unique strengths.",
    description: "Focus on what differentiates you from other UX designers."
  },
  {
    trigger: (results: CVAnalysisResult) => {
      return !results.skillsAnalysis.some(s => s.name === "User Research" && s.strength !== "Weak");
    },
    title: "Improve your user research section by including specific methodologies used.",
    description: "Mention specific research methods like usability testing, interviews, or surveys you've conducted."
  },
  {
    trigger: (results: CVAnalysisResult) => {
      return true; // Always suggest this one
    },
    title: "Include more specific examples of projects you've worked on.",
    description: "Name specific products, features and your contributions to them."
  },
];

// Simulated CV content analysis
export const analyzeCVContent = async (content: string): Promise<CVAnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate analysis delay
    setTimeout(() => {
      // For the demo, we'll generate somewhat random results
      // In a real app this would use NLP to extract actual skills and experience
      
      const detectedSkills: SkillAnalysis[] = [];
      
      // Generate 6 random skills from our list
      const shuffledSkills = [...DETECTABLE_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 6);
      
      shuffledSkills.forEach(skill => {
        // Generate random score for this skill
        const score = Math.floor(Math.random() * 100);
        
        // Determine strength based on score
        let strength: "Strong" | "Medium" | "Weak";
        if (score >= 70) {
          strength = "Strong";
        } else if (score >= 40) {
          strength = "Medium";
        } else {
          strength = "Weak";
        }
        
        detectedSkills.push({
          name: skill,
          strength,
          score
        });
      });
      
      // Generate overall score (average of skill scores + random factor)
      const skillAverage = detectedSkills.reduce((sum, skill) => sum + skill.score, 0) / detectedSkills.length;
      const overallScore = Math.min(100, Math.max(0, Math.round(skillAverage + (Math.random() * 20 - 10))));
      
      // Generate suggestions based on analysis
      const analysisResult: CVAnalysisResult = {
        overallScore,
        skillsAnalysis: detectedSkills,
        suggestedImprovements: []
      };
      
      // Add relevant improvement suggestions
      IMPROVEMENT_SUGGESTIONS.forEach(suggestion => {
        if (suggestion.trigger(analysisResult)) {
          analysisResult.suggestedImprovements.push({
            title: suggestion.title,
            description: suggestion.description
          });
        }
      });
      
      // Limit to 3 suggestions
      analysisResult.suggestedImprovements = analysisResult.suggestedImprovements.slice(0, 3);
      
      resolve(analysisResult);
    }, 1500);
  });
};
