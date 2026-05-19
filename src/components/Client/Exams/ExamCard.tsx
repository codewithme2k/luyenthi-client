import React from "react";
import { Crown, Clock, Award, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IExam } from "@/types/backend";

interface ExamCardProps {
  exam: IExam;
  onStartExam: (exam: IExam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onStartExam }) => {
  return (
    <div
      className={`glass p-6 rounded-2xl card-hover flex flex-col justify-between h-full border transition-all duration-300 ${
        exam.isPremium 
          ? "border-amber-500/35 shadow-[0_4px_25px_rgba(245,158,11,0.03)] hover:border-amber-500/60" 
          : "border-border"
      }`}
    >
      <div>
        {/* Card Header Tag */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
              {exam.category?.name || "Khác"}
            </span>
            {exam.isPremium && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/25 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-current" /> Premium
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {exam.duration} phút
          </span>
        </div>

        {/* Title & Description */}
        <h3 
          className={`font-bold text-lg font-heading line-clamp-1 mb-2 hover:text-primary transition-colors cursor-pointer ${
            exam.isPremium ? "text-amber-500" : "text-foreground"
          }`} 
          title={exam.title}
          onClick={() => onStartExam(exam)}
        >
          {exam.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 font-medium">
          {exam.description || "Đề thi thử chất lượng cao giúp củng cố kiến thức và rèn luyện kỹ năng giải đề toàn diện."}
        </p>
      </div>

      {/* Meta details & Action */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-green-500 shrink-0" />
            <span>Tổng: {exam.totalMarks} đ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Điểm đạt: {exam.passMarks} đ</span>
          </div>
        </div>

        <Button
          onClick={() => onStartExam(exam)}
          className={`w-full h-11 rounded-xl font-bold flex items-center justify-center gap-1.5 group cursor-pointer ${
            exam.isPremium 
              ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border border-amber-500/20 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20" 
              : "btn-premium"
          }`}
        >
          <span>{exam.isPremium ? "Làm Bài VIP" : "Làm Bài Ngay"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
