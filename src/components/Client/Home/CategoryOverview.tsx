import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

export const CategoryOverview: React.FC = () => {
  return (
    <section className="container mx-auto px-6 max-w-7xl py-12">
      <div className="glass p-8 rounded-3xl border border-border/60 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-primary/5 via-violet-500/5 to-transparent">
        <div className="space-y-4 text-center md:text-left max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold border border-violet-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Phục Vụ Mọi Nhu Cầu Học Tập</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading">Luyện Thi Mọi Lĩnh Vực</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Từ ôn thi THPT Quốc Gia, Đánh giá năng lực, đến các chứng chỉ ngoại ngữ phổ biến,
            hệ thống luôn cung cấp các bộ đề thi thử chất lượng cao được thiết kế khoa học.
          </p>
        </div>
        <Link to="/exams" className="w-full md:w-auto">
          <Button className="btn-premium w-full md:w-auto h-12 px-6 rounded-xl font-bold flex items-center justify-center gap-2 group cursor-pointer">
            <span>Bắt Đầu Ôn Luyện</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
