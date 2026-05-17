import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import { 
  Users, 
  BookOpen, 
  Crown, 
  GraduationCap, 
  TrendingUp, 
  Check, 
  X, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  Calendar, 
  ShieldCheck,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  callFetchUser, 
  callFetchExam, 
  callFetchAllMembershipRequests, 
  callFetchExamSessions,
  callApproveMembershipRequest,
  callRejectMembershipRequest,
  callFetchCourses
} from "@/config/api";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  vipUsers: number;
  totalExams: number;
  premiumExams: number;
  totalSessions: number;
  totalRevenue: number;
  totalCourses: number;
  premiumCourses: number;
}

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Data States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }, []);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, examsRes, requestsRes, sessionsRes, coursesRes] = await Promise.all([
        callFetchUser("limit=1000"),
        callFetchExam("limit=1000"),
        callFetchAllMembershipRequests("limit=1000"), // get a larger batch for revenue calculation
        callFetchExamSessions("limit=1000"),
        callFetchCourses("limit=1000")
      ]);

      if (usersRes.data?.success) {
        setUsersList(usersRes.data?.data || []);
      }
      if (examsRes.data?.success) {
        setExamsList(examsRes.data?.data || []);
      }
      if (requestsRes.data?.success) {
        setMembershipRequests(requestsRes.data?.data || []);
      }
      if (sessionsRes.data?.success) {
        setSessionsList(sessionsRes.data?.data || []);
      }
      if (coursesRes.data && coursesRes.data.data) {
        setCoursesList(coursesRes.data.data);
      } else if (coursesRes.data?.success) {
        setCoursesList(coursesRes.data?.data || []);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      toast.error("Không thể đồng bộ dữ liệu thống kê từ hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Aggregate Stats
  const stats = useMemo<DashboardStats>(() => {
    const totalUsers = usersList.length;
    const vipUsers = usersList.filter(u => u.isPremium).length;
    const totalExams = examsList.length;
    const premiumExams = examsList.filter(e => e.isPremium).length;
    const totalSessions = sessionsList.length;
    const totalCourses = coursesList.length;
    const premiumCourses = coursesList.filter(c => c.isPremium).length;

    // Calculate revenue from APPROVED membership requests
    const totalRevenue = membershipRequests
      .filter(req => req.status === "APPROVED")
      .reduce((sum, req) => sum + (req.amount || 0), 0);

    return {
      totalUsers,
      vipUsers,
      totalExams,
      premiumExams,
      totalSessions,
      totalRevenue,
      totalCourses,
      premiumCourses
    };
  }, [usersList, examsList, membershipRequests, sessionsList, coursesList]);

  // Handle Membership Request
  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await callApproveMembershipRequest(id);
      if (res.data?.success) {
        toast.success("Đã phê duyệt yêu cầu nâng cấp VIP thành công!");
        // Update state locally
        setMembershipRequests(prev => 
          prev.map(item => item.id === id ? { ...item, status: "APPROVED" } : item)
        );
        callFetchUser("limit=1000").then(r => {
          if (r.data?.success) setUsersList(r.data?.data || []);
        });
      } else {
        toast.error(res.data?.message || "Duyệt yêu cầu thất bại!");
      }
    } catch (err: any) {
      toast.error("Đã xảy ra lỗi khi duyệt nâng cấp!");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await callRejectMembershipRequest(id);
      if (res.data?.success) {
        toast.success("Đã từ chối yêu cầu nâng cấp VIP!");
        setMembershipRequests(prev => 
          prev.map(item => item.id === id ? { ...item, status: "REJECTED" } : item)
        );
      } else {
        toast.error(res.data?.message || "Từ chối thất bại!");
      }
    } catch (err: any) {
      toast.error("Đã xảy ra lỗi khi từ chối yêu cầu!");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Format money to VND
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  // VIP Conversion Rate
  const vipConversionRate = stats.totalUsers > 0 
    ? Math.round((stats.vipUsers / stats.totalUsers) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-32 bg-muted rounded-2xl w-full" />
        
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>

        {/* Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl" />
          <div className="h-96 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto page-bg">
      
      {/* 1. Dashboard Premium Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/15 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Bảng Quản Trị Hệ Thống
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            {greeting}, <span className="text-primary">{user?.name || "Admin"}</span>!
          </h1>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Hôm nay là {formattedDate}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            Live Database Connected
          </span>
        </div>
      </div>

      {/* 2. Interactive KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Users */}
        <div className="group bg-card rounded-xl p-4 border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Tổng Học Sinh</span>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stats.totalUsers}</h3>
              <p className="text-[10px] text-primary font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" />
                {stats.vipUsers} thành viên VIP
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform flex-shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* KPI 2: Total Courses (E-Learning) */}
        <div className="group bg-card rounded-xl p-4 border border-border/80 shadow-xs hover:border-violet-500/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Khoá Học</span>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stats.totalCourses}</h3>
              <p className="text-[10px] text-violet-600 font-bold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" />
                {stats.premiumCourses} khoá chuyên sâu
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 group-hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* KPI 3: Total Exams */}
        <div className="group bg-card rounded-xl p-4 border border-border/80 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Đề Thi Hiện Có</span>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stats.totalExams}</h3>
              <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                {stats.premiumExams} đề thi Premium
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform flex-shrink-0">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* KPI 4: Total Attempts */}
        <div className="group bg-card rounded-xl p-4 border border-border/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Lượt Làm Bài</span>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stats.totalSessions}</h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Học sinh đang ôn tích cực
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* KPI 5: VIP Revenue */}
        <div className="group bg-card rounded-xl p-4 border border-border/80 shadow-xs hover:border-rose-500/40 hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-300" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Doanh Thu Premium</span>
              <h3 className="text-xl font-black text-foreground tracking-tight">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Doanh thu VIP trọn gói
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform flex-shrink-0">
              <Crown className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Analytics Visualizations & VIP Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Analytics SVG Sparkline Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/80 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-extrabold font-heading text-foreground">Hoạt Động Luyện Thi</h3>
              <p className="text-xs text-muted-foreground font-semibold">Thống kê xu hướng nộp đề thi gần đây</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              Tăng trưởng ổn định
            </div>
          </div>
          
          {/* Custom SVG Area Area Chart */}
          <div className="relative h-64 w-full flex items-end">
            <svg viewBox="0 0 500 200" className="w-full h-full text-primary" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4" />
              
              {/* Smooth Bezier Path */}
              <path 
                d="M 0 160 Q 80 120 160 140 T 320 80 T 420 50 T 500 70 L 500 200 L 0 200 Z" 
                fill="url(#areaGradient)" 
              />
              <path 
                d="M 0 160 Q 80 120 160 140 T 320 80 T 420 50 T 500 70" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              
              {/* Dots on peak values */}
              <circle cx="160" cy="140" r="4.5" className="fill-card stroke-primary stroke-2" />
              <circle cx="320" cy="80" r="4.5" className="fill-card stroke-primary stroke-2" />
              <circle cx="420" cy="50" r="4.5" className="fill-card stroke-primary stroke-2 animate-bounce" />
            </svg>
          </div>
          
          <div className="flex justify-between items-center border-t border-border/80 pt-4 mt-4 text-xs text-muted-foreground font-bold">
            <span>Tuần trước</span>
            <span>Giữa tuần</span>
            <span>Hôm nay</span>
          </div>
        </div>

        {/* Premium VIP Conversion Gauge card */}
        <div className="bg-card rounded-xl border border-border/80 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-extrabold font-heading text-foreground">Chuyển Đổi VIP</h3>
            <p className="text-xs text-muted-foreground font-semibold">Tỷ lệ học sinh đăng ký gói Premium</p>
          </div>

          <div className="flex justify-center items-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG circular dial */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="stroke-muted fill-none" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  className="stroke-amber-500 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="10" 
                  strokeDasharray={390}
                  strokeDashoffset={390 - (390 * vipConversionRate) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute text-center space-y-0.5">
                <span className="text-2xl font-black text-foreground">{vipConversionRate}%</span>
                <p className="text-[10px] text-muted-foreground font-extrabold uppercase">Tỷ Lệ VIP</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl">
            <p className="text-xs text-amber-600 font-bold leading-relaxed">
              <strong>{stats.vipUsers}</strong> trong tổng số <strong>{stats.totalUsers}</strong> học sinh đã nâng cấp trọn gói học tập Premium VIP.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Quick Actions Hub */}
      <div className="bg-card rounded-xl border border-border/80 p-6 shadow-xs animate-fade-in">
        <h3 className="text-base font-extrabold font-heading text-foreground mb-4">Lối Tắt Quản Trị Nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link 
            to="/admin/exam" 
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">Tạo Đề Thi Mới</span>
          </Link>

          <Link 
            to="/admin/course" 
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-violet-500/5 hover:border-violet-500/30 transition-all text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">Quản Lý Khóa Học</span>
          </Link>

          <Link 
            to="/admin/membership-request" 
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">Duyệt Yêu Cầu VIP</span>
          </Link>

          <Link 
            to="/admin/grading" 
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">Chấm Thi Tự Luận</span>
          </Link>

          <Link 
            to="/admin/question" 
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-rose-500/5 hover:border-rose-500/30 transition-all text-center group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-foreground">Thêm Câu Hỏi</span>
          </Link>
        </div>
      </div>

      {/* 5. Split Panels: Pending VIP Requests & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel A: Quick Billing Requests Approval Hub */}
        <div className="bg-card rounded-xl border border-border/80 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-extrabold font-heading text-foreground">Duyệt VIP Nhanh</h3>
              <p className="text-xs text-muted-foreground font-semibold">Các yêu cầu nâng cấp đang chờ xử lý</p>
            </div>
            <Link 
              to="/admin/membership-request" 
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              Xem tất cả
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {membershipRequests.filter(r => r.status === "PENDING").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Tuyệt vời!</p>
                  <p className="text-xs text-muted-foreground">Không có yêu cầu duyệt VIP nào đang chờ xử lý.</p>
                </div>
              </div>
            ) : (
              membershipRequests
                .filter(r => r.status === "PENDING")
                .slice(0, 3)
                .map((req) => (
                  <div 
                    key={req.id} 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/30 transition-all gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground truncate block">
                          {req.user?.name || req.user?.email || "Người dùng ẩn danh"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black text-amber-600 bg-amber-500/10 border border-amber-500/20">
                          {req.plan}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold">
                        Mã GD: <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono">{req.transactionCode}</code>
                      </p>
                      <p className="text-xs font-black text-rose-500">
                        {formatCurrency(req.amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="flex-1 sm:flex-initial h-9 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="flex-1 sm:flex-initial h-9 px-3 rounded-lg border border-border bg-background hover:bg-destructive/10 hover:text-destructive active:scale-95 text-foreground text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Panel B: Recent Submissions / Exam Sessions */}
        <div className="bg-card rounded-xl border border-border/80 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-extrabold font-heading text-foreground">Lượt Thi Mới Nhất</h3>
              <p className="text-xs text-muted-foreground font-semibold">Hoạt động thi thử của học sinh</p>
            </div>
            <Link 
              to="/admin/grading" 
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              Xem tất cả
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {sessionsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Chưa có lượt thi nào</p>
                  <p className="text-xs text-muted-foreground">Các lượt thi mới của học sinh sẽ xuất hiện tại đây.</p>
                </div>
              </div>
            ) : (
              sessionsList.slice(0, 3).map((session) => {
                const isPass = (session.score || 0) >= (session.exam?.passMarks || 50);
                return (
                  <div 
                    key={session.id} 
                    className="flex justify-between items-center p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/30 transition-all gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground truncate block">
                          {session.user?.name || session.user?.email || "Người dùng ẩn danh"}
                        </span>
                        {session.isCompleted ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPass 
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}>
                            {isPass ? "ĐẠT" : "TRƯỢT"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                            ĐANG THI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold truncate">
                        Bài thi: <span className="text-foreground">{session.exam?.title || "Không rõ"}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">
                        {session.isCompleted ? `${session.score} / ${session.exam?.totalMarks}` : "--"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {session.isCompleted ? "Đã nộp bài" : "Đang thực hiện"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
