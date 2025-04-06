
import { v4 as uuid } from "uuid";
import { CVAnalysisResult, Skill, SkillAnalysis } from "@/types";

// List of skills we can detect in CVs - expanded for better matching
const DETECTABLE_SKILLS = [
  // Programming languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Ruby", "Swift", "Kotlin", "Go", "Rust",
  
  // Frontend
  "HTML", "CSS", "React", "Angular", "Vue.js", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS", "SASS", "LESS",
  "Redux", "Next.js", "Gatsby", "Material UI", "Chakra UI", "Styled Components", "Framer Motion", "D3.js",
  
  // Backend
  "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "Ruby on Rails", "ASP.NET", "FastAPI",
  "GraphQL", "REST API", "WebSockets", "Microservices", "Serverless",
  
  // Databases
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "Elasticsearch", "DynamoDB", "SQLite", 
  "Oracle", "MariaDB", "Cassandra", "Neo4j", "NoSQL",
  
  // DevOps / Cloud
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "GitHub Actions", "Travis CI",
  "Terraform", "Ansible", "Prometheus", "Grafana", "ELK Stack", "Nginx", "Apache",
  
  // Mobile
  "iOS", "Android", "React Native", "Flutter", "Xamarin", "Swift UI", "Jetpack Compose",
  
  // AI/ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision",
  "Data Science", "AI", "Neural Networks", "Pandas", "NumPy", "Data Mining", "Statistical Analysis",
  
  // Testing
  "Jest", "Cypress", "Selenium", "TestFlight", "JUnit", "Mocha", "Chai", "Testing Library", "Playwright",
  "Unit Testing", "Integration Testing", "E2E Testing", "TDD", "BDD",
  
  // Tools
  "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence", "Trello", "Slack", "Figma", "Sketch",
  "Adobe XD", "Photoshop", "Illustrator", "InVision", "Miro",
  
  // Methodologies
  "Agile", "Scrum", "Kanban", "Waterfall", "DevOps", "Lean", "Six Sigma",
  
  // Soft Skills
  "Project Management", "Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
  "Creativity", "Time Management", "Adaptability", "Customer Service", "Presentation Skills",
  
  // UI/UX
  "UI/UX Design", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture",
  "Interaction Design", "Visual Design", "UX Writing",
  
  // Business
  "Product Management", "Marketing", "SEO", "Content Creation", "Social Media", "Analytics", "Business Analysis",
  "Sales", "Customer Success", "Technical Writing", "Entrepreneurship",
  
  // Security
  "Cybersecurity", "OWASP", "Penetration Testing", "Security Auditing", "Encryption", "Authentication",
  "Authorization", "OAuth", "JWT", "SSO"
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
      ? "Your summary is too generic - tailor it to highlight your unique strengths. Focus on what differentiates you from other candidates."
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

// Improved CV content analysis with actual text processing
export const analyzeCVContent = async (content: string): Promise<CVAnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate analysis delay
    setTimeout(() => {
      // Extract detected skills from content
      const detectedSkills: SkillAnalysis[] = [];
      const normalizedContent = content.toLowerCase();
      
      // Count occurrences of skills in content
      const skillMatches = DETECTABLE_SKILLS.map(skill => {
        const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, 'gi');
        const matches = normalizedContent.match(regex) || [];
        return { 
          skill, 
          count: matches.length,
          // Check for variants like "skilled in X", "X expert", "years of X experience"
          contextHints: countContextualReferences(normalizedContent, skill.toLowerCase())
        };
      }).filter(match => match.count > 0 || match.contextHints > 0);
      
      // Take the top skills (those mentioned most often)
      const topSkills = skillMatches
        .sort((a, b) => (b.count + b.contextHints) - (a.count + a.contextHints))
        .slice(0, 8); // Take top 8 skills
      
      // Create skill analysis for each detected skill
      topSkills.forEach(match => {
        const score = calculateSkillScore(match.count, match.contextHints, content.length);
        
        let strength: "Strong" | "Medium" | "Weak";
        if (score >= 70) {
          strength = "Strong";
        } else if (score >= 40) {
          strength = "Medium";
        } else {
          strength = "Weak";
        }
        
        detectedSkills.push({
          name: match.skill,
          strength,
          score
        });
      });
      
      // Generate overall score (weighted average of skill scores + content quality factors)
      const contentQualityScore = assessContentQuality(content);
      const skillAverage = detectedSkills.reduce((sum, skill) => sum + skill.score, 0) / 
                           (detectedSkills.length || 1);
      
      const overallScore = Math.min(100, Math.max(0, Math.round(
        skillAverage * 0.6 + contentQualityScore * 0.4
      )));
      
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
    }, 1000);
  });
};

// Improved skill extraction that actually reads CV content
export const extractSkillsFromCV = async (file: File): Promise<Skill[]> => {
  try {
    // Get text content from file
    const text = await readFileAsText(file);
    
    // Process text to extract skills
    const extractedSkills: Skill[] = [];
    const normalizedText = text.toLowerCase();
    
    // Look for each detectable skill in the text
    for (const skillName of DETECTABLE_SKILLS) {
      const normalizedSkill = skillName.toLowerCase();
      
      // Look for direct mentions of the skill
      const regex = new RegExp(`\\b${normalizedSkill}\\b`, 'gi');
      const matches = normalizedText.match(regex) || [];
      
      // Look for contextual references to experience with the skill
      const contextualMatches = countContextualReferences(normalizedText, normalizedSkill);
      
      // If we found mentions of this skill
      if (matches.length > 0 || contextualMatches > 0) {
        // Estimate years of experience based on context
        const yearsOfExperience = estimateYearsOfExperience(normalizedText, normalizedSkill);
        
        // Determine level based on years and context
        let level: "beginner" | "intermediate" | "advanced" | "expert" = "beginner";
        if (yearsOfExperience > 7 || normalizedText.includes(`expert ${normalizedSkill}`)) {
          level = "expert";
        } else if (yearsOfExperience > 4 || normalizedText.includes(`advanced ${normalizedSkill}`)) {
          level = "advanced";
        } else if (yearsOfExperience > 1 || contextualMatches > 1) {
          level = "intermediate";
        }
        
        extractedSkills.push({
          id: uuid(),
          name: skillName,
          yearsOfExperience,
          level
        });
      }
    }
    
    // If we couldn't extract enough skills, add some based on job titles and common correlations
    if (extractedSkills.length < 5) {
      const additionalSkills = inferSkillsFromJobTitles(normalizedText);
      
      for (const skill of additionalSkills) {
        if (!extractedSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
          extractedSkills.push(skill);
        }
      }
    }
    
    return extractedSkills;
  } catch (error) {
    console.error("Error extracting skills:", error);
    return []; // Return empty array in case of error
  }
};

// Helper function to count contextual references to skills
function countContextualReferences(text: string, skill: string): number {
  const contextPhrases = [
    `experience with ${skill}`, 
    `${skill} experience`,
    `skilled in ${skill}`,
    `proficient in ${skill}`,
    `knowledge of ${skill}`,
    `worked with ${skill}`,
    `familiar with ${skill}`,
    `expertise in ${skill}`,
    `${skill} developer`,
    `${skill} engineer`
  ];
  
  return contextPhrases.reduce((count, phrase) => {
    return count + (text.includes(phrase) ? 1 : 0);
  }, 0);
}

// Helper function to estimate years of experience for a skill
function estimateYearsOfExperience(text: string, skill: string): number {
  // Look for patterns like "X years of [skill] experience" or "[skill] (X years)"
  const yearPatterns = [
    new RegExp(`(\\d+)\\s*(?:\\+\\s*)?years?\\s*(?:of)?\\s*${skill}\\s*experience`, 'i'),
    new RegExp(`${skill}\\s*(?:experience)?\\s*\\(\\s*(\\d+)\\s*(?:\\+\\s*)?years?`, 'i'),
    new RegExp(`experience\\s*(?:with|in)\\s*${skill}\\s*(?:for)?\\s*(\\d+)\\s*(?:\\+\\s*)?years?`, 'i')
  ];
  
  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  // Default based on mention patterns
  const contextMatches = countContextualReferences(text, skill);
  if (contextMatches > 2) return 3;
  if (contextMatches > 0) return 2;
  return 1;
}

// Helper function to infer skills from job titles
function inferSkillsFromJobTitles(text: string): Skill[] {
  const inferredSkills: Skill[] = [];
  
  const titleSkillMap: Record<string, string[]> = {
    "frontend developer": ["HTML", "CSS", "JavaScript", "React"],
    "backend developer": ["Node.js", "Express", "SQL", "REST API"],
    "full stack": ["JavaScript", "HTML", "CSS", "Node.js", "SQL"],
    "ui/ux designer": ["UI/UX Design", "Figma", "User Research", "Wireframing"],
    "data scientist": ["Python", "Machine Learning", "Statistical Analysis", "Data Mining"],
    "devops engineer": ["Docker", "Kubernetes", "CI/CD", "AWS"],
    "mobile developer": ["iOS", "Android", "React Native", "Swift"],
    "product manager": ["Product Management", "Agile", "User Research", "Wireframing"],
  };
  
  // Check for job titles in text
  for (const [title, skills] of Object.entries(titleSkillMap)) {
    if (text.includes(title)) {
      skills.forEach(skill => {
        inferredSkills.push({
          id: uuid(),
          name: skill,
          yearsOfExperience: 2,
          level: "intermediate"
        });
      });
    }
  }
  
  return inferredSkills;
}

// Helper function to calculate skill score based on mentions
function calculateSkillScore(mentions: number, contextualMentions: number, contentLength: number): number {
  // Base score from mentions, adjusted for document length
  const normalizedLength = Math.max(500, Math.min(contentLength, 3000));
  const lengthFactor = 1500 / normalizedLength; // Normalize for document length
  
  // Base score calculation (more mentions = higher score)
  let score = Math.min(100, (mentions * 20 + contextualMentions * 30) * lengthFactor);
  
  return Math.round(score);
}

// Helper function to assess overall content quality
function assessContentQuality(content: string): number {
  let score = 50; // Base score
  
  // Length factor (longer CVs tend to be more detailed)
  const length = content.length;
  if (length > 3000) score += 15;
  else if (length > 1500) score += 10;
  else if (length < 500) score -= 15;
  
  // Check for quantifiable achievements (numbers, percentages)
  const achievementPatterns = [/increased|improved|reduced|achieved|delivered|managed|led|created|built|developed/gi];
  const quantifierPatterns = [/\d+%|\$\d+|\d+ times|\d+ team members|\d+ projects/gi];
  
  const achievements = content.match(achievementPatterns) || [];
  const quantifiers = content.match(quantifierPatterns) || [];
  
  score += Math.min(20, achievements.length * 2);
  score += Math.min(15, quantifiers.length * 3);
  
  // Check for structure and formatting
  const hasSections = /education|experience|skills|projects|summary|objective|achievements/gi.test(content);
  const hasBulletPoints = content.includes('•') || content.includes('-') || content.includes('*');
  
  if (hasSections) score += 10;
  if (hasBulletPoints) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

// Helper function to read file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
