
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface SkillInputProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

export function SkillInput({ skills, setSkills }: SkillInputProps) {
  const [newSkill, setNewSkill] = useState("");
  const [yearsExp, setYearsExp] = useState("1");
  const [level, setLevel] = useState<Skill["level"]>("beginner");

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check if skill already exists (case-insensitive)
    const skillExists = skills.some(
      skill => skill.name.toLowerCase() === newSkill.trim().toLowerCase()
    );
    
    if (skillExists) {
      // Update existing skill
      const updatedSkills = skills.map(skill => {
        if (skill.name.toLowerCase() === newSkill.trim().toLowerCase()) {
          return {
            ...skill,
            yearsOfExperience: parseInt(yearsExp),
            level
          };
        }
        return skill;
      });
      setSkills(updatedSkills);
    } else {
      // Add new skill
      const skillToAdd: Skill = {
        id: uuid(),
        name: newSkill.trim(),
        yearsOfExperience: parseInt(yearsExp),
        level
      };
      setSkills([...skills, skillToAdd]);
    }
    
    // Reset form
    setNewSkill("");
    setYearsExp("1");
    setLevel("beginner");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Input 
            placeholder="Add skill (e.g. React, Python)" 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1"
          />

          <Select
            value={yearsExp}
            onValueChange={setYearsExp}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Years" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(15)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {i + 1} {i === 0 ? 'year' : 'years'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={level}
            onValueChange={(value) => setLevel(value as Skill["level"])}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="button" 
          onClick={handleAddSkill}
          className="w-full flex items-center gap-1"
        >
          <Plus size={16} />
          Add Skill
        </Button>
      </div>
      
      {skills.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Your Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className={`${getLevelClass(skill.level)} px-2 py-1 flex items-center gap-1`}
              >
                <span>{skill.name} ({skill.yearsOfExperience}y)</span>
                <button 
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getLevelClass(level: Skill["level"]): string {
  switch(level) {
    case "beginner":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "intermediate":
      return "bg-green-50 text-green-800 border-green-200";
    case "advanced":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "expert":
      return "bg-orange-50 text-orange-800 border-orange-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
}
