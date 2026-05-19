import React from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <section className="container mx-auto px-6 pt-16 pb-10 text-center max-w-4xl animate-fade-in">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-5 border border-violet-500/20 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin-slow" />
        <span>Góc Chia Sẻ & Cẩm Nang Ôn Thi</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading leading-tight">
        Cẩm Nang{" "}
        <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-xs">
          Học Tập & Bí Quyết
        </span>{" "}
        Đạt Điểm Tuyệt Đối
      </h1>

      <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
        Nơi tổng hợp các chuyên đề kiến thức trọng tâm, mẹo làm đề thi trắc nghiệm siêu tốc 
        và những lời khuyên hữu ích từ các giáo viên giàu kinh nghiệm.
      </p>

      {/* Search input bar */}
      <div className="mt-8 max-w-md mx-auto relative group">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Tìm kiếm bài viết, mẹo ôn tập..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 bg-background/50 border-border rounded-xl text-sm font-semibold shadow-xs focus-visible:ring-primary backdrop-blur-xs"
        />
      </div>
    </section>
  );
};
