import React from "react";
import { GraduationCap, Clock, Award, CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IExam } from "@/types/backend";

interface StartExamModalProps {
  exam: IExam;
  onClose: () => void;
  onConfirm: () => void;
}

export const StartExamModal: React.FC<StartExamModalProps> = ({
  exam,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass bg-background sm:max-w-[480px] w-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in border border-border">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 border border-primary/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">{exam.title}</h3>
            <p className="text-xs text-muted-foreground uppercase font-extrabold tracking-wider bg-muted px-2.5 py-1 rounded-lg w-fit mx-auto border">
              Xác Nhận Làm Bài Thi
            </p>
          </div>

          {/* Exam Info Summary */}
          <div className="space-y-3 bg-muted/40 p-4 rounded-xl border border-border/60">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" /> Thời gian làm bài
              </span>
              <span>{exam.duration} phút</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Award className="w-4 h-4 text-green-500" /> Tổng số điểm đề
              </span>
              <span>{exam.totalMarks} điểm</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-500" /> Điểm để vượt qua
              </span>
              <span>{exam.passMarks} điểm</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" /> Hình thức thi
              </span>
              <span>Trắc nghiệm & Tự luận</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed text-center font-medium">
            ⚠️ **Lưu ý**: Sau khi bấm bắt đầu, đồng hồ đếm ngược sẽ bắt đầu chạy và bạn không thể tạm dừng. Hãy chắc chắn đường truyền Internet hoạt động ổn định.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-border pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11 rounded-xl font-bold cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={onConfirm}
              className="btn-premium flex-1 h-11 rounded-xl font-bold cursor-pointer"
            >
              Bắt Đầu Ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
