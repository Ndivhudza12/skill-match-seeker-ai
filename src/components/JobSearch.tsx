
import { useState, useEffect } from "react";
import { Job, Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, MapPin, CalendarDays, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobSearchProps {
  userSkills: Skill[];
}

export function JobSearch({ userSkills }: JobSearchProps) {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [minMatchScore, setMinMatchScore] = useState(85);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock jobs data
        const mockJobs = generateMockJobs(userSkills);
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } catch (error) {
        toast({
          title: "Error fetching jobs",
          description: "Unable to load job listings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userSkills.length > 0) {
      fetchJobs();
    }
  }, [userSkills, toast]);

  useEffect(() => {
    // Filter jobs based on search query and minimum match score
    let result = jobs;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    result = result.filter(job => job.matchScore >= minMatchScore);
    
    // Sort by match score
    result = [...result].sort((a, b) => {
      return sortOrder === "desc" 
        ? b.matchScore - a.matchScore 
        : a.matchScore - b.matchScore;
    });
    
    setFilteredJobs(result);
  }, [jobs, searchQuery, minMatchScore, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Job Match</CardTitle>
          <CardDescription>
            We've found jobs that match your skills profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company or skill..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Min match:</span>
              <Input
                type="number"
                min="0"
                max="100"
                className="w-20"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(parseInt(e.target.value) || 0)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleSortToggle}
                className="ml-2"
              >
                {sortOrder === "desc" ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowUp size={16} />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-pulse text-lg text-muted-foreground">
            Finding your perfect job matches...
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                No jobs match your current filters. Try adjusting your search or lowering the minimum match score.
              </p>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} userSkills={userSkills} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, userSkills }: { job: Job; userSkills: Skill[] }) {
  const { title, company, location, description, requirements, skills, salary, matchScore, postedDate } = job;

  const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
  
  // Split skills into matching and missing
  const matchingSkills = skills.filter(skill => 
    userSkillNames.includes(skill.toLowerCase())
  );
  const missingSkills = skills.filter(skill => 
    !userSkillNames.includes(skill.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: getMatchScoreColor(matchScore) }}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <Briefcase className="h-3.5 w-3.5" />
              {company}
              <span className="mx-1">•</span>
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Match Score:</span>
              <span 
                className="font-bold"
                style={{ color: getMatchScoreColor(matchScore) }}
              >
                {matchScore}%
              </span>
            </div>
            <Progress 
              value={matchScore} 
              className="h-1.5 w-32 mt-1" 
              indicatorClassName={getMatchScoreProgressClass(matchScore)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, i) => (
                <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {skill}
                </Badge>
              ))}
              {missingSkills.map((skill, i) => (
                <Badge key={i} variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-4 gap-4">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Posted {postedDate}
          </div>
          <div>{salary}</div>
        </div>
        <div>
          <Button>Apply Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper function to generate mock jobs
function generateMockJobs(userSkills: Skill[]): Job[] {
  const jobTitles = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer",
    "UI/UX Designer", "Product Manager", "DevOps Engineer",
    "Data Scientist", "Mobile Developer", "QA Engineer",
    "System Architect", "Technical Lead", "Scrum Master"
  ];
  
  const companies = [
    "TechCorp", "Innovate Inc", "DataWorks",
    "CloudSolutions", "DigitalFuture", "NextGen Technologies",
    "AppWorks", "CodeMasters", "Pixel Perfect",
    "ByteBuilders", "LogicLabs", "WebVision"
  ];
  
  const locations = [
    "San Francisco, CA", "New York, NY", "Austin, TX",
    "Seattle, WA", "Boston, MA", "Chicago, IL",
    "Los Angeles, CA", "Denver, CO", "Atlanta, GA",
    "Portland, OR", "Miami, FL", "Remote"
  ];
  
  const descriptions = [
    "Join our dynamic team developing cutting-edge applications that transform how users interact with technology.",
    "We're looking for a talented professional to help us build scalable and robust backend systems.",
    "Help us create intuitive user interfaces that deliver exceptional user experiences.",
    "Work with our cross-functional team to develop innovative solutions for complex business problems.",
    "Join our agile team developing products that make a real difference in people's lives."
  ];
  
  const salaryRanges = [
    "$80,000 - $100,000", "$90,000 - $120,000", "$100,000 - $130,000",
    "$110,000 - $140,000", "$120,000 - $150,000", "$130,000 - $160,000",
    "$140,000 - $170,000", "$150,000 - $180,000"
  ];
  
  const postedDates = [
    "Today", "Yesterday", "2 days ago", "3 days ago", 
    "4 days ago", "5 days ago", "1 week ago", "2 weeks ago"
  ];
  
  const commonRequirements = [
    "Bachelor's degree in Computer Science or related field",
    "Strong problem-solving skills",
    "Excellent communication and teamwork abilities",
    "Agile development experience",
    "Experience with CI/CD pipelines"
  ];
  
  const userSkillNames = userSkills.map(skill => skill.name);
  const mockJobs: Job[] = [];
  
  // Generate 10-15 jobs
  const numJobs = Math.floor(Math.random() * 6) + 10;
  
  for (let i = 0; i < numJobs; i++) {
    // Pick random title, company, etc.
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const salary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
    const postedDate = postedDates[Math.floor(Math.random() * postedDates.length)];
    
    // Generate requirements
    const requirements = [...commonRequirements].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Generate required skills - mix of user's skills and others
    const jobSkills = [];
    
    // Add some of user's skills (50-90%)
    const userSkillsCopy = [...userSkillNames];
    userSkillsCopy.sort(() => 0.5 - Math.random());
    
    const numUserSkillsToInclude = Math.floor(Math.random() * (userSkillNames.length * 0.4)) + 
                                  Math.floor(userSkillNames.length * 0.5);
    
    for (let j = 0; j < numUserSkillsToInclude && j < userSkillsCopy.length; j++) {
      jobSkills.push(userSkillsCopy[j]);
    }
    
    // Add some random other skills
    const otherSkills = [
      "Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Git", 
      "Agile", "Scrum", "REST API", "GraphQL", "MongoDB", "SQL",
      "Testing", "DevOps", "Machine Learning", "Data Analysis"
    ].filter(skill => !userSkillNames.includes(skill));
    
    otherSkills.sort(() => 0.5 - Math.random());
    const numOtherSkills = Math.floor(Math.random() * 4) + 1;
    
    for (let j = 0; j < numOtherSkills && j < otherSkills.length; j++) {
      jobSkills.push(otherSkills[j]);
    }
    
    // Calculate match score based on skills overlap
    const matchingSkills = jobSkills.filter(skill => 
      userSkillNames.includes(skill)
    );
    
    const matchScore = Math.min(
      100, 
      Math.round((matchingSkills.length / jobSkills.length) * 100)
    );
    
    mockJobs.push({
      id: `job-${i}`,
      title,
      company,
      location,
      description,
      requirements,
      skills: jobSkills,
      salary,
      matchScore,
      postedDate
    });
  }
  
  return mockJobs;
}

// Helper function to get color based on match score
function getMatchScoreColor(score: number): string {
  if (score >= 90) return "#10b981"; // green-500
  if (score >= 80) return "#22c55e"; // green-500
  if (score >= 70) return "#f59e0b"; // amber-500
  if (score >= 50) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

// Helper function to get progress class based on match score
function getMatchScoreProgressClass(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-green-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
}
