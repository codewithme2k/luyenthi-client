import { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";
import { callFetchMySessions, callUpdateProfile, callUploadFile, callGetSavedPosts, callChangePassword } from "@/config/api";
import { updateAccount } from "@/redux/slice/accountSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, 
  History, 
  Save, 
  Camera, 
  Eye, 
  TrendingUp, 
  Award, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  Sparkles,
  CheckCircle,
  Bookmark,
  Lock,
  EyeOff
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/components/Layout/Loading";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.account.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(user?.profileImg || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // States for Change Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có độ dài từ 6 ký tự trở lên!");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!");
      return;
    }

    setIsChangingPassword(true);
    const toastId = toast.loading("Đang cập nhật mật khẩu...");
    try {
      const res = await callChangePassword(currentPassword, newPassword);
      if (res.data?.success) {
        toast.success("Đổi mật khẩu thành công!", { id: toastId });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data?.message || "Đổi mật khẩu thất bại!", { id: toastId });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Mật khẩu hiện tại không chính xác!";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 1. Aggregated learning analytics values
  const analyticsData = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;

    const total = sessions.length;
    const passed = sessions.filter(s => s.score >= (s.exam?.passMarks || 50)).length;
    const passRate = Math.round((passed / total) * 100);
    
    // Average score based on scaled percentage to 10 points
    const averageScore = sessions.reduce((sum, s) => {
      const examMax = s.exam?.totalMarks || 100;
      const pct = s.score / examMax;
      return sum + (pct * 10);
    }, 0) / total;
    
    const avgScore10 = Math.round(averageScore * 10) / 10;

    // Performance descriptor
    let performance = "Cần cố gắng";
    let performanceColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    if (avgScore10 >= 8.0) {
      performance = "Xuất sắc";
      performanceColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    } else if (avgScore10 >= 6.5) {
      performance = "Khá";
      performanceColor = "text-primary bg-primary/10 border-primary/20";
    } else if (avgScore10 >= 5.0) {
      performance = "Trung bình";
      performanceColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }

    // 2. Score progression (chronological oldest to newest)
    const chronologicalSessions = [...sessions].reverse();
    const scoreTrendPoints = chronologicalSessions.map((s) => {
      const examMax = s.exam?.totalMarks || 100;
      return Math.round((s.score / examMax) * 100);
    });

    // 3. Subject-based category analytics
    const categoryMap: Record<string, { name: string; attempts: number; passed: number; totalScorePct: number }> = {};
    sessions.forEach(s => {
      const catName = s.exam?.category?.name || "Khác";
      const isPassed = s.score >= (s.exam?.passMarks || 50);
      const examMax = s.exam?.totalMarks || 100;
      const pct = (s.score / examMax) * 100;

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, attempts: 0, passed: 0, totalScorePct: 0 };
      }
      categoryMap[catName].attempts += 1;
      if (isPassed) categoryMap[catName].passed += 1;
      categoryMap[catName].totalScorePct += pct;
    });

    const categoryStats = Object.values(categoryMap).map(cat => ({
      name: cat.name,
      attempts: cat.attempts,
      passed: cat.passed,
      passRate: Math.round((cat.passed / cat.attempts) * 100),
      avgScorePct: Math.round(cat.totalScorePct / cat.attempts)
    })).sort((a, b) => b.avgScorePct - a.avgScorePct);

    return {
      total,
      passed,
      passRate,
      avgScore10,
      performance,
      performanceColor,
      scoreTrendPoints,
      categoryStats
    };
  }, [sessions]);

  const renderScoreChart = () => {
    if (!analyticsData || analyticsData.scoreTrendPoints.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/20">
          <TrendingUp className="w-10 h-10 mb-2 text-muted-foreground/65 animate-bounce" />
          <p className="text-sm font-bold">Cần hoàn thành ít nhất 2 bài thi để vẽ biểu đồ tiến độ học tập</p>
          <p className="text-xs text-muted-foreground mt-1">Hãy ôn tập và thi tiếp để hệ thống cập nhật biểu đồ năng lực!</p>
        </div>
      );
    }

    const points = analyticsData.scoreTrendPoints;
    const width = 600;
    const height = 180;
    const padding = 30;
    
    // Scale factors
    const xScale = (width - padding * 2) / (points.length - 1);
    const yScale = (val: number) => {
      const activeHeight = height - padding * 2;
      return height - padding - (val / 100) * activeHeight;
    };

    // Build SVG path strings
    let linePath = "";
    let areaPath = "";

    points.forEach((pt, index) => {
      const x = padding + index * xScale;
      const y = yScale(pt);
      
      if (index === 0) {
        linePath = `M ${x} ${y}`;
        areaPath = `M ${x} ${height - padding} L ${x} ${y}`;
      } else {
        linePath += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }

      if (index === points.length - 1) {
        areaPath += ` L ${x} ${height - padding} Z`;
      }
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
          <span>Tỷ lệ điểm đạt (%) qua từng đợt thi (Cũ nhất ➔ Mới nhất)</span>
          <span className="text-primary flex items-center gap-1 font-black"><Sparkles className="w-3.5 h-3.5 fill-current" /> Tự động cập nhật</span>
        </div>
        <div className="w-full overflow-hidden bg-muted/10 border border-border/80 rounded-2xl p-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #8b5cf6)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-primary, #8b5cf6)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = yScale(val);
              return (
                <g key={val}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={width - padding} 
                    y2={y} 
                    stroke="var(--color-border, #e5e7eb)" 
                    strokeWidth="0.8" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padding - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[9px] font-bold fill-muted-foreground"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            <path d={areaPath} fill="url(#chart-area-grad)" />

            {/* Smooth glowing line path */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="var(--color-primary, #8b5cf6)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Interactive Data points */}
            {points.map((pt, index) => {
              const x = padding + index * xScale;
              const y = yScale(pt);
              return (
                <g key={index} className="group cursor-pointer">
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="5" 
                    fill="#ffffff" 
                    stroke="var(--color-primary, #8b5cf6)" 
                    strokeWidth="3" 
                  />
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="8" 
                    fill="var(--color-primary, #8b5cf6)" 
                    opacity="0" 
                    className="hover:opacity-10 transition-opacity" 
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
    const cleanBackendUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBackendUrl}${cleanUrl}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá nặng! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Đang tải ảnh đại diện lên...");
    try {
      const res = await callUploadFile(formData);
      if (res.data?.success) {
        const imageUrl = res.data.data.url;
        setProfileImg(imageUrl);
        toast.success("Tải ảnh lên thành công!", { id: toastId });
      } else {
        toast.error("Tải ảnh thất bại!", { id: toastId });
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối với máy chủ upload!", { id: toastId });
    }
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      contactNo: user?.contactNo || "",
      address: user?.address || "",
      gender: user?.gender || "male",
    }
  });

  useEffect(() => {
    fetchMySessions();
    fetchSavedPosts();
    if (user) {
      setValue("name", user.name || "");
      setValue("contactNo", user.contactNo || "");
      setValue("address", user.address || "");
      setValue("gender", user.gender || "male");
      setProfileImg(user.profileImg || null);
    }
  }, [user, setValue]);

  const fetchMySessions = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await callFetchMySessions();
      if (res.data?.success) {
        setSessions(res.data.data);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách lịch sử thi.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchSavedPosts = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await callGetSavedPosts();
      if (res.data?.success) {
        setSavedPosts(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bài viết đã lưu:", err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    const payload = { ...data, profileImg };
    try {
      const res = await callUpdateProfile(payload);
      if (res.data?.success) {
        toast.success("Cập nhật thông tin thành công!");
        // Update local Redux state
        dispatch(updateAccount({ user: { ...user, ...payload } }));
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user || !user.id) {
    return <Loading />;
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">Hồ Sơ Cá Nhân</h1>
        <p className="text-muted-foreground mt-2">Quản lý thông tin tài khoản và xem lịch sử các bài thi bạn đã hoàn thành.</p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="history" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
            <History className="w-4 h-4" /> Lịch sử thi
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
            <TrendingUp className="w-4 h-4" /> Báo cáo năng lực
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
            <Bookmark className="w-4 h-4" /> Bài viết đã lưu
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
            <User className="w-4 h-4" /> Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
            <Lock className="w-4 h-4" /> Bảo mật & Mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="animate-fade-in outline-none space-y-6">
          {!analyticsData ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs">
              <Compass className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60 animate-pulse" />
              <h3 className="text-lg font-bold text-foreground">Chưa có báo cáo năng lực</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                Bạn chưa hoàn thành bất kỳ bài thi nào. Hãy quay lại Kho Đề Thi, chinh phục thử thách để mở khóa các phân tích chi tiết!
              </p>
              <Button 
                onClick={() => navigate("/exams")} 
                className="mt-6 font-bold rounded-xl"
              >
                Tới Kho Đề Thi
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Total attempts */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Tổng Đề Thi</span>
                    <p className="text-xl font-black text-foreground mt-0.5">{analyticsData.total}</p>
                  </div>
                </div>

                {/* Passed count */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Bài Đạt</span>
                    <p className="text-xl font-black text-emerald-500 mt-0.5">{analyticsData.passed}</p>
                  </div>
                </div>

                {/* Avg Score */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Điểm Trung Bình</span>
                    <p className="text-xl font-black text-amber-600 mt-0.5">{analyticsData.avgScore10} <span className="text-xs text-muted-foreground font-semibold">/10</span></p>
                  </div>
                </div>

                {/* Performance level */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">Học Lực</span>
                    <p className={`text-xs font-black px-2 py-0.5 mt-1 rounded border inline-block ${analyticsData.performanceColor}`}>
                      {analyticsData.performance}
                    </p>
                  </div>
                </div>

              </div>

              {/* Chart Section */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-extrabold font-heading text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="text-primary w-5 h-5" /> Biểu đồ tiến độ
                </h3>
                {renderScoreChart()}
              </div>

              {/* Subject Breakdown */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold font-heading text-foreground flex items-center gap-2">
                  <GraduationCap className="text-primary w-5 h-5" /> Phân tích năng lực theo môn học
                </h3>
                <p className="text-xs text-muted-foreground font-semibold">Báo cáo chi tiết tỉ lệ vượt qua bài thi và điểm số trung bình của bạn trên từng danh mục môn học.</p>

                <div className="space-y-4 pt-2">
                  {analyticsData.categoryStats.map((cat, idx) => {
                    let colorClass = "bg-rose-500";
                    let textClass = "text-rose-500 bg-rose-500/10 border-rose-500/25";
                    if (cat.avgScorePct >= 75) {
                      colorClass = "bg-emerald-500";
                      textClass = "text-emerald-500 bg-emerald-500/10 border-emerald-500/25";
                    } else if (cat.avgScorePct >= 50) {
                      colorClass = "bg-amber-500";
                      textClass = "text-amber-500 bg-amber-500/10 border-amber-500/25";
                    }

                    return (
                      <div key={idx} className="border border-border/60 rounded-xl p-4 hover:bg-muted/15 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                          <div className="space-y-0.5">
                            <span className="text-sm font-extrabold text-foreground">{cat.name}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold block">Đã thi {cat.attempts} lần (Đạt {cat.passed}/{cat.attempts})</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded border uppercase leading-none">
                              Tỉ lệ Đạt: {cat.passRate}%
                            </span>
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg border leading-none ${textClass}`}>
                              Điểm TB: {Math.round((cat.avgScorePct / 10) * 10) / 10}/10
                            </span>
                          </div>
                        </div>

                        {/* Custom horizontal progress bar representing performance */}
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                          <div 
                            className={`h-full rounded-full ${colorClass}`}
                            style={{ width: `${cat.avgScorePct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="animate-fade-in outline-none">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {isLoadingHistory ? (
              <div className="py-20"><Loading /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="py-4">Đề thi</TableHead>
                    <TableHead>Thời gian nộp bài</TableHead>
                    <TableHead className="text-right">Điểm số</TableHead>
                    <TableHead className="text-center">Kết quả</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-semibold text-foreground py-4">
                          {session.exam?.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(session.createdAt).toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary text-lg">
                          {Math.round(session.score * 10) / 10}
                          <span className="text-xs text-muted-foreground font-normal ml-1">/ {session.exam?.totalMarks}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {session.score >= session.exam?.passMarks ? (
                            <span className="text-xs px-3 py-1 bg-green-500/10 text-green-600 rounded-md font-bold uppercase">Đạt</span>
                          ) : (
                            <span className="text-xs px-3 py-1 bg-destructive/10 text-destructive rounded-md font-bold uppercase">Chưa Đạt</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/exam-result/${session.id}`)}
                            className="border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 gap-1 font-bold rounded-lg text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                        Bạn chưa hoàn thành bài thi nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="animate-fade-in outline-none">
          {isLoadingSaved ? (
            <div className="py-20"><Loading /></div>
          ) : savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((post) => (
                <div key={post.id} className="glass rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group h-full bg-background/50">
                  {post.thumbnail ? (
                    <div className="w-full h-44 overflow-hidden border-b border-border relative shrink-0">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-violet-500/10 via-primary/5 to-fuchsia-500/10 flex items-center justify-center border-b border-border shrink-0">
                      <BookOpen className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20 inline-block">
                        Cẩm Nang
                      </span>
                      <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.content.replace(/[#*`>_\-]/g, "").slice(0, 120)}...
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border mt-5 flex justify-between items-center shrink-0">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <Link to={`/blog/${post.slug}`}>
                        <Button size="sm" className="font-bold rounded-lg text-xs h-8 cursor-pointer btn-premium">
                          Đọc tiếp
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60 animate-pulse" />
              <h3 className="text-lg font-bold text-foreground">Không có bài viết đã lưu</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                Bạn chưa lưu bất kỳ bài viết nào. Hãy ghé thăm trang Cẩm Nang, tìm kiếm những kiến thức bổ ích và lưu lại để ôn tập sau!
              </p>
              <Button 
                onClick={() => navigate("/blog")} 
                className="mt-6 font-bold rounded-xl cursor-pointer"
              >
                Tới Trang Cẩm Nang
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="animate-fade-in outline-none">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="text-primary w-5 h-5" /> Cập nhật thông tin
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
              {/* Profile Image Upload Component */}
              <div className="flex flex-col items-center sm:items-start gap-4 mb-6 pb-6 border-b border-border">
                <Label className="text-sm font-semibold text-muted-foreground">Ảnh Đại Diện</Label>
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all flex items-center justify-center bg-muted relative">
                    {profileImg ? (
                      <img src={getImageUrl(profileImg)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground uppercase">{user?.name?.charAt(0) || "U"}</div>
                    )}
                    {/* Hover mask */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Thay ảnh</span>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">Chấp nhận JPG, PNG, GIF. Kích thước tối đa 5MB.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và Tên</Label>
                  <Input id="name" {...register("name", { required: "Vui lòng nhập tên" })} className="bg-muted/30" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Không thể thay đổi)</Label>
                  <Input id="email" value={user?.email} disabled className="bg-muted opacity-60" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Số điện thoại</Label>
                  <Input id="contactNo" {...register("contactNo")} className="bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select onValueChange={(val) => setValue("gender", val)} defaultValue={user?.gender || "male"}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" {...register("address")} className="bg-muted/30" />
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto min-w-[140px] rounded-xl font-bold">
                  {isUpdating ? "Đang lưu..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="security" className="animate-fade-in outline-none">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Lock className="text-primary w-5 h-5" /> Bảo mật & Đổi mật khẩu
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Đổi mật khẩu định kỳ để nâng cao bảo mật cho tài khoản ôn thi của bạn.</p>
            
            <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
              
              {/* Mật khẩu hiện tại */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại..."
                    className="bg-muted/30 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                    className="bg-muted/30 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="bg-muted/30 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto min-w-[140px] rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all">
                  {isChangingPassword ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
                </Button>
              </div>

            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
