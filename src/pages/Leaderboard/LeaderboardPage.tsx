import { useState, useEffect, useMemo } from "react";
import { callFetchExamSessions } from "@/config/api";
import { toast } from "sonner";

// Modular Sub-components
import { LeaderboardHeader } from "@/components/Client/Leaderboard/LeaderboardHeader";
import { LeaderboardFilters } from "@/components/Client/Leaderboard/LeaderboardFilters";
import { LeaderboardPodium } from "@/components/Client/Leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/Client/Leaderboard/LeaderboardTable";

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
      <div className="container max-w-7xl mx-auto py-10 px-4 space-y-8 animate-pulse">
        <div className="h-28 bg-muted rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-6 h-80 bg-muted/40 rounded-2xl p-6" />
        <div className="h-96 bg-muted rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 space-y-8 page-bg">
      
      {/* 1. Header Hero Banner */}
      <LeaderboardHeader />

      {/* 2. Interactive Filtering Controls */}
      <LeaderboardFilters 
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* 3. The Grand Podium (Top 3) */}
      {rankedStudents.length > 0 && !searchTerm && (
        <LeaderboardPodium 
          top1={top1}
          top2={top2}
          top3={top3}
          getImageUrl={getImageUrl}
        />
      )}

      {/* 4. Complete Runners-up List Table */}
      <LeaderboardTable 
        rankedStudents={rankedStudents}
        searchTerm={searchTerm}
        getImageUrl={getImageUrl}
      />

    </div>
  );
}
