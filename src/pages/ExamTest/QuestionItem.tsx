import React from "react";
import type { IQuestion } from "@/types/backend";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface QuestionItemProps {
  question: IQuestion;
  index: number;
  answer: any;
  onAnswerChange: (answer: any) => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  answer,
  onAnswerChange,
  isFlagged,
  onToggleFlag
}) => {
  const options = question.options || [];

  const handleSingleChoice = (optionId: string) => {
    onAnswerChange(optionId);
  };

  const handleMultipleChoice = (optionId: string) => {
    const currentAnswers = Array.isArray(answer) ? [...answer] : [];
    if (currentAnswers.includes(optionId)) {
      onAnswerChange(currentAnswers.filter(id => id !== optionId));
    } else {
      currentAnswers.push(optionId);
      onAnswerChange(currentAnswers);
    }
  };

  const renderOptions = () => {
    switch (question.type) {
      case "SINGLE_CHOICE":
      case "TRUE_FALSE":
        return (
          <div className="space-y-3 mt-6">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSingleChoice(opt.id as string)}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                  ${answer === opt.id
                    ? 'bg-primary/5 border-primary text-primary shadow-sm scale-[1.01]'
                    : 'bg-background hover:bg-muted/50 border-border hover:border-primary/40 hover:scale-[1.01]'
                  }
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${answer === opt.id ? 'border-primary' : 'border-muted-foreground/50'}
                `}>
                  {answer === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className={`text-base font-medium leading-relaxed ${answer === opt.id ? 'text-primary' : 'text-foreground'}`}>
                  {opt.content}
                </span>
              </div>
            ))}
          </div>
        );

      case "MULTIPLE_CHOICE":
        const selectedOptions = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-3 mt-6">
            {options.map((opt) => {
              const isChecked = selectedOptions.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => handleMultipleChoice(opt.id as string)}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${isChecked
                      ? 'bg-primary/5 border-primary text-primary shadow-sm scale-[1.01]'
                      : 'bg-background hover:bg-muted/50 border-border hover:border-primary/40 hover:scale-[1.01]'
                    }
                  `}
                >
                  <Checkbox
                    checked={isChecked}
                    className={`w-5 h-5 rounded border-2 transition-colors ${isChecked ? 'border-primary' : 'border-muted-foreground/50'}`}
                  />
                  <span className={`text-base font-medium leading-relaxed ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                    {opt.content}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case "FILL_BLANK":
      case "ESSAY":
        return (
          <div className="mt-6">
            <Textarea
              placeholder="Nhập câu trả lời của bạn vào đây..."
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="min-h-[150px] resize-y rounded-xl border-border focus-visible:ring-primary p-4 text-base"
            />
          </div>
        );

      default:
        return (
          <div className="mt-6 p-4 rounded-xl bg-muted text-muted-foreground text-center italic">
            Loại câu hỏi "{question.type}" chưa được hỗ trợ giao diện làm bài.
          </div>
        );
    }
  };

  return (
    <div className="glass p-5 sm:p-6 rounded-2xl border border-border animate-fade-in relative">
      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-heading text-lg border border-primary/20">
            {index + 1}
          </div>
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Câu hỏi {question.type === 'SINGLE_CHOICE' ? 'Một lựa chọn' : question.type === 'MULTIPLE_CHOICE' ? 'Nhiều lựa chọn' : question.type === 'TRUE_FALSE' ? 'Đúng / Sai' : question.type === 'ESSAY' ? 'Tự luận' : 'Điền khuyết'}
            {question.score && <span className="ml-3 normal-case text-primary bg-primary/10 px-2.5 py-1 rounded-md">{question.score} điểm</span>}
          </div>
        </div>

        {/* Flag Button */}
        {onToggleFlag && (
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${isFlagged
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600'
                : 'bg-background hover:bg-muted border-border text-muted-foreground'
              }`}
          >
            <span className="text-base">{isFlagged ? '🚩' : '🏳️'}</span>
            <span className="hidden sm:inline">{isFlagged ? 'Đã gắn cờ' : 'Gắn cờ'}</span>
          </button>
        )}
      </div>

      <div className="pt-1 mb-5">
        <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: question.content }} />
      </div>

      {renderOptions()}
    </div>
  );
};
