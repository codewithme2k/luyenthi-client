import { useState, useEffect, useMemo } from "react";
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Search,
  Sparkles
} from "lucide-react";
import { callFetchExamSessions } from "@/config/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface LeaderboardStudent {
  id: string;
  name: string;
  email: string;
  avatarImg?: string;
  isPremium?: boolean;
  totalAttempts: number;
  passedAttempts: number;
  averageScore: number;
  accuracyRate: number;
}

export default function LeaderboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"passed" | "score">("passed");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        // Fetch a large batch of system-wide sessions to aggregate
        const res = await callFetchExamSessions("limit=1000");
        if (res.data?.success) {
          setSessions(res.data?.data || []);
        }
      } catch (err) {
        console.error("Lỗi khi tải bảng xếp hạng:", err);
        toast.error("Không thể kết xuất dữ liệu bảng xếp hạng!");
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  // Aggregate sessions by student
  const aggregatedStudents = useMemo<LeaderboardStudent[]>(() => {
    const studentMap: Record<string, { name: string; email: string; sessions: any[]; avatarImg?: string; isPremium?: boolean }> = {};

    sessions.forEach(session => {
      if (!session.isCompleted || !session.user) return;
      const uid = session.user.id;
      if (!studentMap[uid]) {
        studentMap[uid] = {
          name: session.user.name || "Học sinh ẩn danh",
          email: session.user.email,
          avatarImg: session.user.profileImg,
          isPremium: session.user.isPremium,
          sessions: []
        };
      }
      studentMap[uid].sessions.push(session);
    });

    return Object.entries(studentMap).map(([id, student]) => {
      const totalAttempts = student.sessions.length;
      const passedAttempts = student.sessions.filter(s => s.score >= (s.exam?.passMarks || 50)).length;
      const averageScore = student.sessions.reduce((sum, s) => sum + s.score, 0) / totalAttempts;
      const totalMaxScore = student.sessions.reduce((sum, s) => sum + (s.exam?.totalMarks || 100), 0);
      const totalEarnedScore = student.sessions.reduce((sum, s) => sum + s.score, 0);
      const accuracyRate = totalMaxScore > 0 ? Math.round((totalEarnedScore / totalMaxScore) * 100) : 0;

      return {
        id,
        name: student.name,
        email: student.email,
        avatarImg: student.avatarImg,
        isPremium: student.isPremium,
        totalAttempts,
        passedAttempts,
        averageScore: Math.round(averageScore * 10) / 10,
        accuracyRate
      };
    });
  }, [sessions]);

  // Filter & Sort
  const rankedStudents = useMemo(() => {
    let filtered = aggregatedStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "passed") {
        // Primary: number of passed exams, Secondary: accuracy rate
        if (b.passedAttempts !== a.passedAttempts) {
          return b.passedAttempts - a.passedAttempts;
        }
        return b.accuracyRate - a.accuracyRate;
      } else {
        // Primary: average score, Secondary: passed exams
        if (b.averageScore !== a.averageScore) {
          return b.averageScore - a.averageScore;
        }
        return b.passedAttempts - a.passedAttempts;
      }
    });
  }, [aggregatedStudents, searchTerm, sortBy]);

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBackendUrl}${cleanUrl}`;
  };

  // Top 3 Podium Students
  const top1 = rankedStudents[0] || null;
  const top2 = rankedStudents[1] || null;
  const top3 = rankedStudents[2] || null;

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 px-4 space-y-8 animate-pulse">
        <div className="h-28 bg-muted rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-6 h-80 bg-muted/40 rounded-2xl p-6" />
        <div className="h-96 bg-muted rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8 page-bg">
      
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-background border border-amber-500/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 text-xs font-black border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Bảng Vàng Học Tập
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Bảng Xếp Hạng Cao Thủ Luyện Thi
          </h1>
          <p className="text-sm text-muted-foreground font-semibold max-w-xl leading-relaxed">
            Vinh danh những học sinh xuất sắc nhất có điểm thi trung bình vượt bậc và chăm chỉ ôn luyện vượt qua nhiều bài thi nhất trên hệ thống.
          </p>
        </div>
        
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner animate-pulse">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 fill-current" />
        </div>
      </div>

      {/* 2. Interactive Filtering Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-xs">
        
        {/* Toggle between dilgence and excellence */}
        <div className="flex bg-muted/65 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setSortBy("passed")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sortBy === "passed"
                ? "bg-background text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Chăm Chỉ (Bài thi đạt)
          </button>
          <button
            onClick={() => setSortBy("score")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sortBy === "score"
                ? "bg-background text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Điểm Số (Trung bình)
          </button>
        </div>

        {/* Search Student */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cao thủ..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/20 border-border/80 rounded-xl"
          />
        </div>

      </div>

      {/* 3. The Grand Podium (Top 3) */}
      {rankedStudents.length > 0 && !searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 max-w-3xl mx-auto">
          
          {/* Podium Rank 2: Silver (Left) */}
          {top2 && (
            <div className="bg-card border border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-md relative order-2 md:order-1 h-[260px] hover:border-slate-400 hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-6 w-12 h-12 rounded-full bg-slate-300 border-4 border-card flex items-center justify-center text-slate-800 shadow-md">
                <Medal className="w-6 h-6 fill-current" />
              </div>
              
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 bg-muted mb-3 relative">
                {top2.avatarImg ? (
                  <img src={getImageUrl(top2.avatarImg)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-black text-xl uppercase bg-slate-300/10">
                    {top2.name[0]}
                  </div>
                )}
              </div>

              <span className={`text-sm font-extrabold flex items-center gap-1 ${
                top2.isPremium ? "text-amber-500" : "text-foreground"
              }`}>
                {top2.name}
                {top2.isPremium && <Crown className="w-3.5 h-3.5 fill-current" />}
              </span>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-full">{top2.email}</p>
              
              <div className="mt-4 pt-3 border-t border-border/60 w-full grid grid-cols-2 gap-2 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Bài Đạt</span>
                  <p className="text-sm font-black text-foreground">{top2.passedAttempts}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Điểm TB</span>
                  <p className="text-sm font-black text-primary">{top2.averageScore}</p>
                </div>
              </div>
            </div>
          )}

          {/* Podium Rank 1: Gold (Center - Highlighted) */}
          {top1 && (
            <div className="bg-card border-2 border-amber-500/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative order-1 md:order-2 h-[290px] hover:border-amber-500 hover:scale-103 transition-all duration-300">
              <div className="absolute -top-7 w-14 h-14 rounded-full bg-amber-400 border-4 border-card flex items-center justify-center text-amber-950 shadow-lg animate-bounce">
                <Crown className="w-7 h-7 fill-current" />
              </div>
              
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-400 bg-muted mb-3 relative shadow-md">
                {top1.avatarImg ? (
                  <img src={getImageUrl(top1.avatarImg)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-600 font-black text-2xl uppercase bg-amber-400/10">
                    {top1.name[0]}
                  </div>
                )}
              </div>

              <span className="text-base font-extrabold flex items-center gap-1 text-amber-500 drop-shadow-xs">
                {top1.name}
                <Crown className="w-4 h-4 fill-current" />
              </span>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5 truncate max-w-full">{top1.email}</p>
              
              <div className="mt-4 pt-3 border-t border-amber-500/10 w-full grid grid-cols-2 gap-2 text-center bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Bài Đạt</span>
                  <p className="text-base font-black text-foreground">{top1.passedAttempts}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Điểm TB</span>
                  <p className="text-base font-black text-amber-600">{top1.averageScore}</p>
                </div>
              </div>
            </div>
          )}

          {/* Podium Rank 3: Bronze (Right) */}
          {top3 && (
            <div className="bg-card border border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-md relative order-3 md:order-3 h-[240px] hover:border-amber-600/40 hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-6 w-11 h-11 rounded-full bg-amber-700 border-4 border-card flex items-center justify-center text-white shadow-md">
                <Award className="w-5.5 h-5.5 fill-current" />
              </div>
              
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-700 bg-muted mb-3 relative">
                {top3.avatarImg ? (
                  <img src={getImageUrl(top3.avatarImg)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-900 font-black text-lg uppercase bg-amber-700/10">
                    {top3.name[0]}
                  </div>
                )}
              </div>

              <span className={`text-sm font-extrabold flex items-center gap-1 ${
                top3.isPremium ? "text-amber-500" : "text-foreground"
              }`}>
                {top3.name}
                {top3.isPremium && <Crown className="w-3.5 h-3.5 fill-current" />}
              </span>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-full">{top3.email}</p>
              
              <div className="mt-4 pt-3 border-t border-border/60 w-full grid grid-cols-2 gap-2 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Bài Đạt</span>
                  <p className="text-sm font-black text-foreground">{top3.passedAttempts}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Điểm TB</span>
                  <p className="text-sm font-black text-primary">{top3.averageScore}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. Complete Runners-up List Table */}
      <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-border/80 flex items-center gap-2">
          <Trophy className="text-amber-500 w-5 h-5" />
          <h3 className="text-base font-extrabold font-heading text-foreground">Danh Sách Xếp Hạng Chi Tiết</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 border-b border-border/80 text-xs font-black text-muted-foreground text-left uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">Hạng</th>
                <th className="py-4 px-4">Thành Viên</th>
                <th className="py-4 px-4 text-center">Tổng Lượt Thi</th>
                <th className="py-4 px-4 text-center">Số Bài Đạt</th>
                <th className="py-4 px-4 text-center">Độ Chính Xác</th>
                <th className="py-4 px-6 text-right">Điểm TB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rankedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              ) : (
                rankedStudents.map((student, index) => {
                  const rank = index + 1;
                  return (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-muted/30 transition-colors ${
                        rank <= 3 && !searchTerm ? "bg-amber-500/2" : ""
                      }`}
                    >
                      {/* Rank Indicator */}
                      <td className="py-4 px-6 text-center">
                        {rank === 1 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs items-center justify-center shadow-xs">1</span>
                        ) : rank === 2 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs items-center justify-center shadow-xs">2</span>
                        ) : rank === 3 ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs items-center justify-center shadow-xs">3</span>
                        ) : (
                          <span className="text-xs font-extrabold text-muted-foreground">{rank}</span>
                        )}
                      </td>

                      {/* Student Profile */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-muted shrink-0 relative flex items-center justify-center font-bold text-sm">
                            {student.avatarImg ? (
                              <img src={getImageUrl(student.avatarImg)} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              student.name[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className={`text-sm font-extrabold flex items-center gap-1 truncate ${
                              student.isPremium ? "text-amber-500 font-black" : "text-foreground"
                            }`}>
                              {student.name}
                              {student.isPremium && <Crown className="w-3.5 h-3.5 fill-current shrink-0" />}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium truncate block max-w-[200px] sm:max-w-xs">{student.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Total Attempts */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-bold text-foreground bg-muted/60 border border-border px-2 py-0.5 rounded">
                          {student.totalAttempts} lượt
                        </span>
                      </td>

                      {/* Passed attempts */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                          {student.passedAttempts} bài
                        </span>
                      </td>

                      {/* Accuracy Rate progress bar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
                            <div 
                              className={`h-full rounded-full ${
                                student.accuracyRate >= 80 ? "bg-emerald-500" : student.accuracyRate >= 50 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${student.accuracyRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-foreground shrink-0">{student.accuracyRate}%</span>
                        </div>
                      </td>

                      {/* Average Score */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-sm font-black text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-xl">
                          {student.averageScore}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
