import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  BarChart3,
  BrainCircuit
} from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16 page-bg overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-16 text-center max-w-7xl animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Học Tập Thông Minh - Đạt Điểm Số Cao</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground font-heading leading-tight sm:leading-none">
          Chinh Phục Các Kỳ Thi Với <br />
          <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            Nền Tảng Luyện Thi Pro
          </span>
        </h1>

        <p className="mt-6 text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
          Trải nghiệm hệ thống thi thử trực tuyến thế hệ mới. Đầy đủ các loại câu hỏi trắc nghiệm,
          điền từ, nối đáp án, đúng/sai và tự luận với lời giải chi tiết, chuẩn cấu trúc đề thi.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/exams">
            <Button className="btn-premium h-13 px-8 rounded-xl text-base font-bold flex items-center gap-2 group cursor-pointer">
              <span>Khám Phá Đề Thi Ngay</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="h-13 px-8 rounded-xl text-base font-bold bg-background/40 hover:bg-muted/80 backdrop-blur-sm cursor-pointer border-border">
              Đăng Nhập
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Platform Highlights */}
      <section className="container mx-auto px-6 max-w-6xl py-12">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-bold font-heading">Ưu Điểm Vượt Trội Của Hệ Thống</h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto">
            Chúng tôi xây dựng những công cụ tốt nhất để bạn tối ưu hóa thời gian và nâng cao điểm số thi thử.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Diverse Quiz Types */}
          <div className="glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl font-heading">Đa Dạng Loại Câu Hỏi</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Hỗ trợ 6 loại câu hỏi chuyên sâu bao gồm lựa chọn 1 đáp án, nhiều đáp án đúng,
                đúng/sai, điền vào chỗ trống, nối chéo đáp án và tự luận viết tay.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs text-primary font-bold">
              <span>Hỗ trợ thi toàn diện</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Interactive Analytics */}
          <div className="glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl font-heading">Theo Dõi Tiến Độ</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Ghi nhớ mọi lượt làm bài, thời gian hoàn thành, phân tích tỉ lệ trả lời đúng
                và chấm điểm tự luận chuẩn xác, hiển thị biểu đồ nâng cao.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs text-green-600 font-bold">
              <span>Đánh giá kết quả ngay</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Instant Explanations */}
          <div className="glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl font-heading">Lời Giải Chi Tiết</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Mỗi câu hỏi đều được biên soạn phần giải thích chi tiết, chỉ rõ các lỗi sai
                và phương pháp làm bài hiệu quả nhất để ghi nhớ kiến thức lâu dài.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-600 font-bold">
              <span>Học từ những sai sót</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Overview Section */}
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
    </div>
  );
};

export default HomePage;
