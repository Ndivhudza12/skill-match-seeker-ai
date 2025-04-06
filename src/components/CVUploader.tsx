
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { analyzeCVContent } from "@/utils/cvParser";
import { CVAnalysisResult } from "@/types";

interface CVUploaderProps {
  onAnalysisComplete: (result: CVAnalysisResult) => void;
}

export function CVUploader({ onAnalysisComplete }: CVUploaderProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvText, setCvText] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match(/(pdf|doc|docx|txt|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/i)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Read file as text
      const text = await readFileAsText(file);
      
      // Analyze CV
      const analysisResult = await analyzeCVContent(text);
      
      // Send results up
      onAnalysisComplete(analysisResult);
      
      toast({
        title: "CV Analysis Complete",
        description: "We've analyzed your CV and provided recommendations"
      });
    } catch (error) {
      toast({
        title: "Error Processing CV",
        description: "There was a problem analyzing your CV",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast, onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleTextAnalysis = async () => {
    if (!cvText.trim()) {
      toast({
        title: "Empty CV Text",
        description: "Please paste your CV text before analyzing",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Analyze pasted CV text
      const analysisResult = await analyzeCVContent(cvText);
      
      // Send results up
      onAnalysisComplete(analysisResult);
      
      toast({
        title: "CV Analysis Complete",
        description: "We've analyzed your CV and provided recommendations"
      });
    } catch (error) {
      toast({
        title: "Error Processing CV",
        description: "There was a problem analyzing your CV",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload Your CV</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-slate-100 rounded-full">
            <Upload size={32} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Drag and drop your CV here</p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, or TXT</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Or paste your CV text:</h3>
        <Textarea 
          placeholder="Paste CV text here..." 
          className="min-h-[120px]"
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />
      </div>
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        onClick={handleTextAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? "Analyzing CV..." : "Analyze CV"}
      </Button>
    </div>
  );
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
