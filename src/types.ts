
export interface Skill {
  id: string;
  name: string;
  yearsOfExperience: number;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface SkillAnalysis {
  name: string;
  strength: "Strong" | "Medium" | "Weak";
  score: number; // 0-100
}

export interface CVAnalysisResult {
  overallScore: number;
  skillsAnalysis: SkillAnalysis[];
  suggestedImprovements: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary: string;
  matchScore: number;
  postedDate: string;
}
