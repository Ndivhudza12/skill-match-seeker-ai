
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
  (results: CVAnalysisResult) => {
    return !results.skillsAnalysis.some(s => s.strength === "Strong") 
      ? "Add more quantifiable achievements to your experience section. Example: \"Increased user engagement by 45% through redesigned navigation\"" 
      : null;
  },
  (results: CVAnalysisResult) => {
    return results.skillsAnalysis.some(s => s.name === "Product Strategy" && s.strength === "Weak")
      ? "Strengthen your product strategy skills to match senior positions. Consider adding relevant courses or projects that demonstrate strategic thinking."
      : null;
  },
  (results: CVAnalysisResult) => {
    return results.overallScore < 80
      ? "Your summary is too generic - tailor it to highlight your unique strengths. Focus on what differentiates you from other UX designers."
      : null;
  },
  (results: CVAnalysisResult) => {
    return !results.skillsAnalysis.some(s => s.name === "User Research" && s.strength !== "Weak")
      ? "Improve your user research section by including specific methodologies used. Mention specific research methods like usability testing, interviews, or surveys you've conducted."
      : null;
  },
  (results: CVAnalysisResult) => {
    return "Include more specific examples of projects you've worked on. Name specific products, features and your contributions to them.";
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
      IMPROVEMENT_SUGGESTIONS.forEach(suggestionFn => {
        const suggestion = typeof suggestionFn === 'function' ? suggestionFn(analysisResult) : suggestionFn;
        if (suggestion) {
          analysisResult.suggestedImprovements.push(suggestion);
        }
      });
      
      // Limit to 3 suggestions
      analysisResult.suggestedImprovements = analysisResult.suggestedImprovements.slice(0, 3);
      
      resolve(analysisResult);
    }, 1500);
  });
};

// Add extractSkillsFromCV function from user's pasted code
export const extractSkillsFromCV = async (file: File) => {
  // This is a placeholder that would be replaced with actual CV parsing logic
  // For demo purposes, we'll return some mock skills
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // For this demo, we'll randomly select 5-15 skills from our common list
      const mockSkills = [];
      const numSkills = Math.floor(Math.random() * 10) + 5; // 5-15 skills
      
      for (let i = 0; i < numSkills; i++) {
        const skillName = DETECTABLE_SKILLS[Math.floor(Math.random() * DETECTABLE_SKILLS.length)];
        const yearsOfExperience = Math.floor(Math.random() * 10) + 1; // 1-10 years
        
        // Determine level based on years
        let level: "beginner" | "intermediate" | "advanced" | "expert" = "beginner";
        if (yearsOfExperience > 7) {
          level = "expert";
        } else if (yearsOfExperience > 4) {
          level = "advanced";
        } else if (yearsOfExperience > 2) {
          level = "intermediate";
        }
        
        mockSkills.push({
          id: uuid(),
          name: skillName,
          yearsOfExperience,
          level
        });
      }
      
      setTimeout(() => {
        resolve(mockSkills);
      }, 500);
    };
    
    reader.readAsText(file);
  });
};
