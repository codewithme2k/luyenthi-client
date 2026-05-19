import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import type { IExam, IQuestion } from "@/types/backend";
import { Button } from "@/components/ui/button";
import { Award, Target, CheckCircle2, XCircle, ArrowLeft, Clock, Eye } from "lucide-react";

interface ExamResultProps {
  exam: IExam;
  questions: IQuestion[];
  answers: Record<string, any>;
  timeSpent: number; // in seconds
  sessionId?: string;
  onBackToExams: () => void;
  serverResult?: {
    score: number;
    correct: number;
    incorrect: number;
    pending: number;
  };
}

export const ExamResult: React.FC<ExamResultProps> = ({ 
  exam, 
  questions, 
  answers, 
  timeSpent,
  sessionId,
  onBackToExams,
  serverResult
}) => {
  const navigate = useNavigate();
  const result = useMemo(() => {
    if (serverResult) {
      return {
        correct: serverResult.correct,
        incorrect: serverResult.incorrect,
        pending: serverResult.pending,
        score: serverResult.score,
        isPassed: serverResult.score >= exam.passMarks
      };
    }

    let correct = 0;
    let incorrect = 0;
    let pending = 0; // For ESSAY/FILL_BLANK
    let score = 0;

    questions.forEach((q) => {
      const qScore = q.score || (exam.totalMarks / questions.length);
      const userAnswer = answers[q.id];

      if (q.type === 'SINGLE_CHOICE' || q.type === 'TRUE_FALSE') {
        const correctOption = q.options?.find(o => o.isCorrect);
        if (userAnswer === correctOption?.id) {
          correct++;
          score += qScore;
        } else {
          incorrect++;
        }
      } else if (q.type === 'MULTIPLE_CHOICE') {
        const correctOptions = q.options?.filter(o => o.isCorrect).map(o => o.id) || [];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
        const isExactMatch = 
          correctOptions.length === userAnswers.length && 
          correctOptions.every(id => userAnswers.includes(id));
        
        if (isExactMatch) {
          correct++;
          score += qScore;
        } else {
          incorrect++;
        }
      } else {
        pending++;
      }
    });

    const isPassed = score >= exam.passMarks;

    return { correct, incorrect, pending, score, isPassed };
  }, [questions, answers, exam.totalMarks, exam.passMarks, serverResult]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl animate-fade-in">
      <div className="glass p-8 sm:p-12 rounded-3xl border border-border text-center">
        {/* Header Icon */}
        <div className="mb-8 relative inline-block">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${result.isPassed ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
            {result.isPassed ? <Award className="w-12 h-12" /> : <Target className="w-12 h-12" />}
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-muted-foreground/20 animate-spin-slow pointer-events-none" />
        </div>

        <h1 className="text-3xl font-extrabold font-heading mb-2 text-foreground">
          {result.isPassed ? 'Chúc mừng bạn đã vượt qua!' : 'Rất tiếc, bạn chưa đạt yêu cầu.'}
        </h1>
        <p className="text-muted-foreground font-medium text-lg mb-10">
          Kết quả bài thi: <span className="font-bold text-foreground">{exam.title}</span>
        </p>

        {/* Score Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Điểm số</span>
            <span className="text-3xl font-bold font-heading text-primary">{Math.round(result.score * 10) / 10}</span>
            <span className="text-xs text-muted-foreground">/ {exam.totalMarks} điểm</span>
          </div>
          <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 flex flex-col items-center justify-center gap-2">
            <span className="text-sm text-green-600 font-semibold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Đúng</span>
            <span className="text-3xl font-bold font-heading text-green-600">{result.correct}</span>
            <span className="text-xs text-green-600/70">câu hỏi</span>
          </div>
          <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex flex-col items-center justify-center gap-2">
            <span className="text-sm text-destructive font-semibold uppercase tracking-wider flex items-center gap-1"><XCircle className="w-4 h-4"/> Sai</span>
            <span className="text-3xl font-bold font-heading text-destructive">{result.incorrect}</span>
            <span className="text-xs text-destructive/70">câu hỏi</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col items-center justify-center gap-2">
            <span className="text-sm text-blue-600 font-semibold uppercase tracking-wider flex items-center gap-1"><Clock className="w-4 h-4"/> Thời gian</span>
            <span className="text-3xl font-bold font-heading text-blue-600">{formatTime(timeSpent)}</span>
            <span className="text-xs text-blue-600/70">đã dùng</span>
          </div>
        </div>

        {result.pending > 0 && (
          <div className="mb-10 p-4 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-sm font-medium">
            <AlertTriangle className="w-5 h-5 inline mr-2 align-text-bottom" />
            Có {result.pending} câu hỏi tự luận/điền khuyết đang chờ giáo viên chấm điểm thủ công. Điểm số trên có thể thay đổi.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={onBackToExams} variant="outline" className="border-border hover:bg-muted h-12 px-8 rounded-xl font-bold gap-2">
            <ArrowLeft className="w-5 h-5" />
            Trở Về Kho Đề Thi
          </Button>
          {sessionId && (
            <Button onClick={() => navigate(`/exam-result/${sessionId}`)} className="btn-premium h-12 px-8 rounded-xl font-bold gap-2">
              <Eye className="w-5 h-5" />
              Xem Chi Tiết Bài Làm
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Import AlertTriangle since it was used in pending message
import { AlertTriangle } from "lucide-react";
