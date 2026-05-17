import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { callFetchSessionDetails } from "@/config/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Target,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Check,
  X,
  HelpCircle,
  FileText
} from "lucide-react";

export default function ExamResultDetailsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessionDetails = async () => {
      if (!sessionId) return;
      setIsLoading(true);
      try {
        const res = await callFetchSessionDetails(sessionId);
        if (res.data?.success && res.data?.data) {
          setSession(res.data.data);
        } else {
          toast.error("Không tìm thấy thông tin bài thi này!");
          navigate("/profile");
        }
      } catch (error) {
        toast.error("Lỗi khi tải chi tiết kết quả bài thi!");
        navigate("/profile");
      } finally {
        setIsLoading(false);
      }
    };
    loadSessionDetails();
  }, [sessionId, navigate]);

  // Tab filter state
  const [activeTab, setActiveTab] = useState<"ALL" | "CORRECT" | "INCORRECT" | "PENDING">("ALL");

  // Statistics & Processing Answers
  const resultStats = useMemo(() => {
    if (!session || !session.userAnswers) return { correct: 0, incorrect: 0, pending: 0, total: 0 };
    
    let correct = 0;
    let incorrect = 0;
    let pending = 0;

    session.userAnswers.forEach((ans: any) => {
      if (ans.isCorrect === true) {
        correct++;
      } else if (ans.isCorrect === false) {
        incorrect++;
      } else {
        pending++;
      }
    });

    return {
      correct,
      incorrect,
      pending,
      total: session.userAnswers.length
    };
  }, [session]);

  // Filtered answers list
  const filteredUserAnswers = useMemo(() => {
    if (!session || !session.userAnswers) return [];
    
    return session.userAnswers.filter((ans: any) => {
      if (activeTab === "ALL") return true;
      if (activeTab === "CORRECT") return ans.isCorrect === true;
      if (activeTab === "INCORRECT") return ans.isCorrect === false;
      if (activeTab === "PENDING") return ans.isCorrect === null || ans.isCorrect === undefined;
      return true;
    });
  }, [session, activeTab]);

  // Helpers to get correct option & parse answers
  const getMultipleChoiceUserOptions = (ans: any): string[] => {
    try {
      return JSON.parse(ans.textContent || "[]");
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-6 w-48 mb-8 rounded-lg" />
        <Skeleton className="h-64 w-full mb-8 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-96 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const exam = session.exam;
  const isPassed = session.score >= exam.passMarks;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Hồ Sơ Cá Nhân
      </button>

      {/* Hero Summary Card */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-border shadow-[0_10px_30px_rgba(0,0,0,0.02)] mb-8 relative overflow-hidden">
        {/* Background glow decorator */}
        <div className={`absolute -right-24 -top-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 ${isPassed ? 'bg-green-500' : 'bg-destructive'}`} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-3">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPassed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
              {isPassed ? (
                <>
                  <Award className="w-3.5 h-3.5" /> Đã vượt qua
                </>
              ) : (
                <>
                  <Target className="w-3.5 h-3.5" /> Chưa đạt yêu cầu
                </>
              )}
            </span>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              {exam.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4" />
                Đã nộp: {new Date(session.createdAt).toLocaleString("vi-VN")}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-4 h-4" />
                Tổng {resultStats.total} câu hỏi
              </span>
            </div>
          </div>

          {/* Large circular score representation */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border border-border/80 min-w-[150px] shadow-sm text-center">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Điểm của bạn</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-4xl font-extrabold font-heading text-primary">
                {Math.round(session.score * 10) / 10}
              </span>
              <span className="text-base text-muted-foreground font-semibold">
                /{exam.totalMarks}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground/80 mt-1.5 font-medium">Điểm chuẩn: {exam.passMarks} điểm</span>
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Tổng điểm</span>
          <span className="text-2xl font-bold text-foreground">{Math.round(session.score * 10) / 10} đ</span>
        </div>
        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 justify-center"><CheckCircle2 className="w-3.5 h-3.5" /> Đúng</span>
          <span className="text-2xl font-bold text-green-600">{resultStats.correct} câu</span>
        </div>
        <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="text-xs text-destructive font-bold uppercase tracking-wider flex items-center gap-1 justify-center"><XCircle className="w-3.5 h-3.5" /> Sai</span>
          <span className="text-2xl font-bold text-destructive">{resultStats.incorrect} câu</span>
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1 justify-center"><HelpCircle className="w-3.5 h-3.5" /> Chờ chấm</span>
          <span className="text-2xl font-bold text-blue-600">{resultStats.pending} câu</span>
        </div>
      </div>

      {/* Manual grading alert for essay questions */}
      {resultStats.pending > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-sm font-medium flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            Có <strong>{resultStats.pending} câu hỏi tự luận/điền khuyết</strong> chưa được chấm điểm hoặc đang đợi giáo viên chấm điểm thủ công. Điểm số chính thức của bạn có thể thay đổi sau khi có kết quả hoàn chỉnh.
          </div>
        </div>
      )}

      {/* Tabs Filter Section */}
      <div className="flex border-b border-border mb-6 overflow-x-auto whitespace-nowrap gap-1">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "ALL" ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Tất cả ({resultStats.total})
        </button>
        <button
          onClick={() => setActiveTab("CORRECT")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "CORRECT" ? 'border-green-500 text-green-600 bg-green-500/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <CheckCircle2 className="w-4 h-4 text-green-500" /> Đúng ({resultStats.correct})
        </button>
        <button
          onClick={() => setActiveTab("INCORRECT")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "INCORRECT" ? 'border-destructive text-destructive bg-destructive/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <XCircle className="w-4 h-4 text-destructive" /> Sai ({resultStats.incorrect})
        </button>
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "PENDING" ? 'border-blue-500 text-blue-600 bg-blue-500/5' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <HelpCircle className="w-4 h-4 text-blue-500" /> Chờ chấm / Khác ({resultStats.pending})
        </button>
      </div>

      {/* Question Details List */}
      <div className="space-y-6">
        {filteredUserAnswers.length > 0 ? (
          filteredUserAnswers.map((ans: any, idx: number) => {
            const q = ans.question;
            const options = q?.options || [];
            
            // Map types into human-readable text
            const getTypeName = (type: string) => {
              switch (type) {
                case 'SINGLE_CHOICE': return 'Trắc nghiệm (Một lựa chọn)';
                case 'MULTIPLE_CHOICE': return 'Trắc nghiệm (Nhiều lựa chọn)';
                case 'TRUE_FALSE': return 'Đúng / Sai';
                case 'ESSAY': return 'Tự luận';
                case 'FILL_BLANK': return 'Điền khuyết';
                default: return 'Khác';
              }
            };

            // Reconstruct choice state
            const isSingleChoice = q.type === 'SINGLE_CHOICE' || q.type === 'TRUE_FALSE';
            const isMultipleChoice = q.type === 'MULTIPLE_CHOICE';
            const isWrittenAnswer = q.type === 'ESSAY' || q.type === 'FILL_BLANK';

            const userSelectedOptionId = ans.selectedOptionId;
            const userSelectedMultipleIds = isMultipleChoice ? getMultipleChoiceUserOptions(ans) : [];

            return (
              <div key={ans.id} className="glass p-6 sm:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-4 relative transition-all hover:shadow-md">
                {/* Question Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold font-heading text-sm border border-primary/20">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {getTypeName(q.type)}
                    </span>
                  </div>
                  
                  {/* Status & Point Indicators */}
                  <div className="flex items-center gap-2">
                    {ans.isCorrect === true && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 border border-green-500/20">
                        Chính xác
                      </span>
                    )}
                    {ans.isCorrect === false && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                        Chưa chính xác
                      </span>
                    )}
                    {ans.isCorrect === null && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        Chờ chấm điểm
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/80">
                      {ans.isCorrect === true ? q.score : 0} / {q.score} điểm
                    </span>
                  </div>
                </div>

                {/* Question Title */}
                <div className="text-base sm:text-lg font-semibold leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: q.content }} />

                {/* Choice Rendering */}
                {isSingleChoice && (
                  <div className="space-y-2.5 mt-2">
                    {options.map((opt: any) => {
                      const isCorrectOption = opt.isCorrect;
                      const isUserChoice = userSelectedOptionId === opt.id;
                      
                      let optionStyle = "border-border hover:bg-muted/30 bg-background text-foreground";
                      let indicatorColor = "border-muted-foreground/30";
                      let iconNode = null;

                      if (isCorrectOption) {
                        optionStyle = "bg-green-500/5 border-green-500 text-green-900 dark:text-green-300 font-medium";
                        indicatorColor = "border-green-500 bg-green-500 text-white";
                        iconNode = <Check className="w-3 h-3 stroke-[3]" />;
                      } else if (isUserChoice && !isCorrectOption) {
                        optionStyle = "bg-destructive/5 border-destructive text-destructive font-medium";
                        indicatorColor = "border-destructive bg-destructive text-white";
                        iconNode = <X className="w-3 h-3 stroke-[3]" />;
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all ${optionStyle}`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${indicatorColor}`}>
                            {iconNode}
                          </div>
                          <span className="flex-1 leading-relaxed">{opt.content}</span>
                          {isUserChoice && (
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2 py-0.5 bg-muted/70 rounded-md">
                              Lựa chọn của bạn
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isMultipleChoice && (
                  <div className="space-y-2.5 mt-2">
                    {options.map((opt: any) => {
                      const isCorrectOption = opt.isCorrect;
                      const isUserChoice = userSelectedMultipleIds.includes(opt.id);

                      let optionStyle = "border-border hover:bg-muted/30 bg-background text-foreground";
                      let indicatorColor = "border-muted-foreground/30 rounded";
                      let iconNode = null;

                      if (isCorrectOption) {
                        optionStyle = "bg-green-500/5 border-green-500 text-green-900 dark:text-green-300 font-medium";
                        indicatorColor = "border-green-500 bg-green-500 text-white rounded";
                        iconNode = <Check className="w-3 h-3 stroke-[3]" />;
                      } else if (isUserChoice && !isCorrectOption) {
                        optionStyle = "bg-destructive/5 border-destructive text-destructive font-medium";
                        indicatorColor = "border-destructive bg-destructive text-white rounded";
                        iconNode = <X className="w-3 h-3 stroke-[3]" />;
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all ${optionStyle}`}
                        >
                          <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${indicatorColor}`}>
                            {iconNode}
                          </div>
                          <span className="flex-1 leading-relaxed">{opt.content}</span>
                          {isUserChoice && (
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2 py-0.5 bg-muted/70 rounded-md">
                              Lựa chọn của bạn
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isWrittenAnswer && (
                  <div className="space-y-3 mt-2">
                    <div className="p-4 rounded-xl border border-border bg-muted/20">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Câu trả lời của bạn:
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                        {ans.textContent ? (
                          ans.textContent
                        ) : (
                          <span className="italic text-muted-foreground font-normal">Không nhập câu trả lời.</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Question Explanation */}
                {q.explanation && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 text-sm">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold mb-1.5">
                      <span className="text-base">💡</span>
                      Giải thích đáp án:
                    </div>
                    <div 
                      className="text-muted-foreground leading-relaxed pl-6" 
                      dangerouslySetInnerHTML={{ __html: q.explanation }} 
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass p-12 rounded-2xl text-center text-muted-foreground border border-border">
            Không có câu hỏi nào khớp với bộ lọc hiện tại.
          </div>
        )}
      </div>
      
      {/* Bottom Actions */}
      <div className="mt-12 flex justify-center">
        <Button onClick={() => navigate("/profile")} className="btn-premium px-8 h-12 rounded-xl font-bold gap-2">
          Quay lại Trang Cá Nhân
        </Button>
      </div>
    </div>
  );
}
