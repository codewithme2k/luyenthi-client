import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Send, AlertTriangle } from "lucide-react";

interface ExamHeaderProps {
  title: string;
  timeLeft: number; // in seconds
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ title, timeLeft, onSubmit, isSubmitting }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft > 0 && timeLeft <= 300; // less than 5 minutes

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <h1 className="font-bold text-lg font-heading truncate max-w-[40%] sm:max-w-[50%]">
          {title}
        </h1>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-lg transition-colors ${isLowTime ? 'bg-destructive/10 border-destructive/30 text-destructive animate-pulse' : 'bg-muted/50 border-border text-foreground'}`}>
            {isLowTime ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            {formatTime(timeLeft)}
          </div>
          
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
            className="btn-premium rounded-xl font-bold gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Nộp Bài Ngay</span>
            <span className="sm:hidden">Nộp Bài</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
