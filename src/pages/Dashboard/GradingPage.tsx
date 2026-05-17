import { useEffect, useState } from "react";
import { callFetchExamSessions, callFetchSessionDetails, callGradeAnswer } from "@/config/api";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, FileText, AlertTriangle } from "lucide-react";
import Loading from "@/components/Layout/Loading";

export const GradingPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await callFetchExamSessions();
      if (res.data?.success) {
        setSessions(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi khi tải danh sách bài thi.");
    } finally {
      setIsLoading(false);
    }
  };

  const openSessionDetails = async (id: string) => {
    setIsLoadingDetails(true);
    setIsModalOpen(true);
    try {
      const res = await callFetchSessionDetails(id);
      if (res.data?.success) {
        setSelectedSession(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi khi tải chi tiết bài thi.");
      setIsModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleGrade = async (answerId: string, isCorrect: boolean) => {
    try {
      const res = await callGradeAnswer(answerId, isCorrect);
      if (res.data?.success) {
        toast.success("Đã lưu điểm thành công!");
        // Update local state to reflect changes instantly without re-fetching
        setSelectedSession((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            userAnswers: prev.userAnswers.map((ans: any) =>
              ans.id === answerId ? { ...ans, isCorrect } : ans
            )
          };
        });
        fetchSessions(); // Update the background list score silently
      }
    } catch (err) {
      toast.error("Lỗi khi lưu điểm.");
    }
  };

  return (
    <div className="p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Chấm Thi</h1>
          <p className="text-muted-foreground mt-1">Danh sách các bài làm của học sinh (Bao gồm Tự luận)</p>
        </div>
        <Button onClick={fetchSessions} variant="outline">Tải Lại</Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Học sinh</TableHead>
                <TableHead>Đề thi</TableHead>
                <TableHead>Thời gian nộp</TableHead>
                <TableHead className="text-right">Điểm số</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="font-semibold">{session.user?.name || "No name"}</div>
                    <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                  </TableCell>
                  <TableCell className="font-medium">{session.exam?.title}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleString('vi-VN')}</TableCell>
                  <TableCell className="text-right font-bold text-primary text-lg">
                    {Math.round(session.score * 10) / 10}
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      / {session.exam?.totalMarks}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {session.score >= session.exam?.passMarks ? (
                      <span className="text-xs px-2.5 py-1 bg-green-500/10 text-green-600 rounded-md font-bold uppercase">Đạt</span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 bg-destructive/10 text-destructive rounded-md font-bold uppercase">Chưa Đạt</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" onClick={() => openSessionDetails(session.id)} className="bg-blue-500/5 text-blue-600 border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Chấm Bài
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Chưa có bài thi nào được nộp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Grading Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[85vw] !max-w-[85vw] w-[85vw] h-[95vh] flex flex-col overflow-hidden p-0 gap-0 border-none shadow-2xl">
          <DialogHeader className="px-8 py-6 border-b border-border bg-muted/30 shrink-0">
            <DialogTitle className="text-3xl font-bold font-heading">
              Chi tiết bài làm - <span className="text-primary">{selectedSession?.user?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 bg-muted/10">
            {isLoadingDetails ? (
              <div className="py-20 flex justify-center h-full items-center"><Loading /></div>
            ) : selectedSession ? (
              <div className="space-y-4 max-w-7xl mx-auto">
                {selectedSession.userAnswers.map((answer: any, index: number) => {
                  const q = answer.question;
                  const isPending = q.type === 'ESSAY' && answer.isCorrect === null;
                  const isEssay = q.type === 'ESSAY' || q.type === 'FILL_BLANK';

                  return (
                    <div key={answer.id} className={`p-4 border rounded-xl transition-colors ${isPending
                      ? 'bg-amber-500/5 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                      : answer.isCorrect === false
                        ? 'bg-red-500/5 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                        : answer.isCorrect === true
                          ? 'bg-green-500/5 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.05)]'
                          : 'bg-card border-border hover:border-border/80'
                      }`}>
                      <div className="flex gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isEssay ? 'bg-amber-100 text-amber-700 shadow-inner' : 'bg-primary/10 text-primary shadow-inner'}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="font-semibold text-base text-foreground leading-snug" dangerouslySetInnerHTML={{ __html: q.content }} />
                          <div className="mt-2 flex gap-2">
                            <span className="px-2 py-0.5 bg-muted rounded-md text-xs font-semibold text-muted-foreground">{q.type}</span>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-bold">{q.score || (selectedSession.exam.totalMarks / selectedSession.userAnswers.length)} điểm</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-11">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                            Câu trả lời của học sinh:
                          </h4>
                          {q.type === 'SINGLE_CHOICE' || q.type === 'TRUE_FALSE' || q.type === 'MULTIPLE_CHOICE' ? (
                            <div className="space-y-2 mt-2">
                              {q.options?.map((opt: any) => {
                                let isSelected = false;
                                if (q.type === 'MULTIPLE_CHOICE') {
                                  try {
                                    const parsed = JSON.parse(answer.textContent || "[]");
                                    isSelected = Array.isArray(parsed) && parsed.includes(opt.id);
                                  } catch (e) {
                                    isSelected = false;
                                  }
                                } else {
                                  isSelected = answer.selectedOptionId === opt.id;
                                }

                                const isCorrectOpt = opt.isCorrect;

                                let borderClass = "border-border bg-background hover:border-primary/30";
                                let textClass = "text-foreground";
                                let icon = null;

                                if (isSelected && isCorrectOpt) {
                                  borderClass = "border-green-500 bg-green-500/10 shadow-sm shadow-green-500/20";
                                  textClass = "text-green-700 font-bold";
                                  icon = <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto shrink-0" />;
                                } else if (isSelected && !isCorrectOpt) {
                                  borderClass = "border-red-500 bg-red-500/10 shadow-sm shadow-red-500/20";
                                  textClass = "text-red-700 font-bold";
                                  icon = <XCircle className="w-4 h-4 text-red-600 ml-auto shrink-0" />;
                                } else if (!isSelected && isCorrectOpt) {
                                  borderClass = "border-green-500/40 bg-green-500/5 border-dashed";
                                  textClass = "text-green-600/80 font-semibold";
                                  icon = <CheckCircle2 className="w-4 h-4 text-green-600/40 ml-auto shrink-0" />;
                                }

                                return (
                                  <div key={opt.id} className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${borderClass}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-input'}`}>
                                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                    </div>
                                    <div className={`text-sm ${textClass}`} dangerouslySetInnerHTML={{ __html: opt.content }} />
                                    {icon}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-4 bg-muted/40 rounded-lg whitespace-pre-wrap font-medium text-foreground border border-border text-sm shadow-inner">
                                {answer.textContent || <span className="text-muted-foreground italic">(Học sinh bỏ trống)</span>}
                              </div>
                              {q.type === 'FILL_BLANK' && (
                                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Đáp án mẫu đúng: <span className="underline decoration-2 bg-emerald-100/50 px-1.5 py-0.5 rounded">{q.options?.find((opt: any) => opt.isCorrect)?.content || "Chưa cấu hình"}</span></span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {isEssay && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-border mt-4">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chấm Điểm:</span>
                            <div className="flex gap-3">
                              <Button
                                variant={answer.isCorrect === true ? "default" : "outline"}
                                className={`rounded-lg px-4 h-10 text-sm font-bold ${answer.isCorrect === true ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20" : "hover:text-green-600 hover:bg-green-50"}`}
                                onClick={() => handleGrade(answer.id, true)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> ĐÚNG (+ Điểm)
                              </Button>
                              <Button
                                variant={answer.isCorrect === false ? "destructive" : "outline"}
                                className={`rounded-lg px-4 h-10 text-sm font-bold ${answer.isCorrect === false ? "shadow-md shadow-red-600/20" : "hover:text-red-600 hover:bg-red-50"}`}
                                onClick={() => handleGrade(answer.id, false)}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> SAI (0 Điểm)
                              </Button>
                            </div>
                            {isPending && (
                              <div className="sm:ml-auto text-amber-600 text-sm flex items-center gap-2 font-bold bg-amber-100 px-3 py-1.5 rounded-lg animate-pulse shadow-sm">
                                <AlertTriangle className="w-4 h-4" /> Đang chờ chấm
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradingPage;
