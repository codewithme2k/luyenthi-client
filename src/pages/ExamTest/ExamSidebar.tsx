import React from "react";
import type { IQuestion } from "@/types/backend";
import { CheckCircle2 } from "lucide-react";

interface ExamSidebarProps {
  questions: IQuestion[];
  answers: Record<string, any>;
  flags: Record<string, boolean>;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  questions,
  answers,
  flags,
  currentIndex,
  onNavigate
}) => {
  const answeredCount = Object.keys(answers).filter(k => {
    const val = answers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== "";
  }).length;

  return (
    <div className="glass p-5 rounded-2xl border border-border flex flex-col h-[calc(100vh-8rem)] min-h-[450px] shadow-sm">
      <div className="mb-4 pb-4 border-b border-border shrink-0">
        <h3 className="font-bold font-heading mb-2">Tiến độ làm bài</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-primary font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã làm: {answeredCount}/{questions.length}</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-primary h-2 transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-3 -mr-3">
        <div className="grid grid-cols-5 md:grid-cols-6 gap-3 pb-2 mt-2">
          {questions.map((q, index) => {
            const hasAnswered = answers[q.id] !== undefined && answers[q.id] !== "" && (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);
            const isCurrent = currentIndex === index;
            const isFlagged = flags[q.id];

            return (
              <button
                key={q.id}
                onClick={() => onNavigate(index)}
                className={`
                  w-full aspect-square flex flex-col items-center justify-center rounded-xl text-base font-bold transition-all duration-200 cursor-pointer border relative
                  ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.15] z-10 shadow-md' : 'hover:scale-110 hover:bg-muted'}
                  ${hasAnswered
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-background border-border text-muted-foreground'
                  }
                `}
              >
                {index + 1}
                {isFlagged && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] flex items-center justify-center bg-amber-100 rounded-full shadow-sm z-20">
                    🚩
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2.5 text-sm text-muted-foreground font-semibold shrink-0 cursor-default select-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/15 border border-primary/40" />
          <span>Câu đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-background border border-border" />
          <span>Câu chưa trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-xs">🚩</div>
          <span>Câu đã gắn cờ</span>
        </div>
      </div>
    </div>
  );
};
