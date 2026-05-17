import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategory } from "@/redux/slice/categorySlice";
import { fetchExam } from "@/redux/slice/examSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  Search,
  Award,
  Filter,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { IExam, ICategory } from "@/types/backend";

const UserExamPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: exams, isFetching: isExamsFetching, meta: examsMeta } = useAppSelector((state) => state.exam);
  const { data: categories, isFetching: isCategoriesFetching } = useAppSelector((state) => state.category);

  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Sync debounced search value with the URL param changes
  useEffect(() => {
    setDebouncedSearch(searchTerm);
  }, [searchTerm]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6; // Beautiful 3x2 grid

  // Selected Exam for Preview Modal
  const [previewExam, setPreviewExam] = useState<IExam | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchCategory({ query: "limit=100" }));
  }, [dispatch]);

  // Load exams when filters change
  useEffect(() => {
    let query = `page=${page}&limit=${limit}&isPublished=true`;
    if (debouncedSearch.trim() !== "") {
      query += `&searchTerm=${encodeURIComponent(debouncedSearch.trim())}`;
    }
    if (selectedCategoryId) {
      query += `&categoryId=${selectedCategoryId}`;
    }
    dispatch(fetchExam({ query }));
  }, [dispatch, page, debouncedSearch, selectedCategoryId]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  const handleStartExam = (exam: IExam) => {
    setPreviewExam(exam);
  };

  const confirmStartExam = () => {
    if (!previewExam) return;
    toast.success(`Đang tải đề thi "${previewExam.title}"... Chúc bạn làm bài đạt kết quả tốt!`);
    navigate(`/exam/${previewExam.slug}`);
    setPreviewExam(null);
  };

  const totalPages = Math.ceil((examsMeta?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-background pb-16 page-bg">
      {/* Dynamic Glowing Top Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header / Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-8 text-center max-w-4xl animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ Thống Luyện Thi Trực Tuyến Hàng Đầu</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading">
          Danh Sách Đề Thi Thử
        </h1>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-medium">
          Lựa chọn đề thi thử trắc nghiệm phù hợp với trình độ của bạn để bắt đầu ôn luyện ngay hôm nay.
        </p>
      </section>

      {/* Floating Search & Category Filter Panel */}
      <section className="container mx-auto px-6 max-w-5xl mb-10">
        <div className="glass p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đề thi..."
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setSearchParams({ searchTerm: val });
                } else {
                  setSearchParams({});
                }
              }}
              className="pl-10 h-11 bg-background/50 border-input focus-visible:ring-primary rounded-xl"
            />
          </div>

          {/* Category Chips Scroll Container */}
          <div className="w-full overflow-x-auto flex gap-2 py-1 scrollbar-thin select-none">
            {/* All Categories Chip */}
            <button
              onClick={() => handleCategorySelect(null)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 shrink-0 border cursor-pointer ${selectedCategoryId === null
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(139,92,246,0.3)] scale-[1.02]"
                  : "bg-background/40 hover:bg-muted border-border text-muted-foreground"
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tất cả</span>
            </button>

            {/* Dynamic Category Chips */}
            {isCategoriesFetching ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
              ))
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shrink-0 border cursor-pointer ${selectedCategoryId === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(139,92,246,0.3)] scale-[1.02]"
                      : "bg-background/40 hover:bg-muted border-border text-muted-foreground"
                    }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Main Content: Exam Grid */}
      <main className="container mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Danh Sách Đề Thi
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {examsMeta?.total || 0} đề thi khả dụng
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isExamsFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="glass p-6 rounded-2xl h-64 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
                <Skeleton className="h-7 w-3/4 rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 flex-1 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          /* Empty State */
          <div className="glass p-12 rounded-3xl text-center max-w-md mx-auto mt-8 flex flex-col items-center">
            <div className="p-4 bg-muted rounded-full text-muted-foreground mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">Không tìm thấy đề thi</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Không có đề thi nào phù hợp với tìm kiếm hoặc bộ lọc hiện tại của bạn. Vui lòng thử từ khóa khác.
            </p>
            <Button
              onClick={() => {
                setSearchParams({});
                setSelectedCategoryId(null);
              }}
              variant="outline"
              className="mt-6 rounded-xl"
            >
              Đặt Lại Bộ Lọc
            </Button>
          </div>
        ) : (
          /* Dynamic Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam: IExam & { category?: ICategory }) => (
              <div
                key={exam.id}
                className="glass p-6 rounded-2xl card-hover flex flex-col justify-between h-full border border-border"
              >
                <div>
                  {/* Card Header Tag */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                      {exam.category?.name || "Khác"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {exam.duration} phút
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-lg font-heading line-clamp-1 mb-2 hover:text-primary transition-colors cursor-pointer" title={exam.title}>
                    {exam.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 font-medium">
                    {exam.description || "Đề thi thử chất lượng cao giúp củng cố kiến thức và rèn luyện kỹ năng giải đề toàn diện."}
                  </p>
                </div>

                {/* Meta details & Action */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-green-500 shrink-0" />
                      <span>Tổng: {exam.totalMarks} đ</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Điểm đạt: {exam.passMarks} đ</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartExam(exam)}
                    className="btn-premium w-full h-11 rounded-xl font-bold flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    <span>Làm Bài Ngay</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isExamsFetching && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-1.5 select-none">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg h-9 w-9 p-0 flex items-center justify-center border cursor-pointer"
            >
              &lt;
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={`rounded-lg h-9 w-9 font-semibold border cursor-pointer ${page === i + 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/40 hover:bg-muted"
                  }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg h-9 w-9 p-0 flex items-center justify-center border cursor-pointer"
            >
              &gt;
            </Button>
          </div>
        )}
      </main>

      {/* Start Exam Preview Dialog (Preview & Modal) */}
      {previewExam && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass bg-background sm:max-w-[480px] w-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in border border-border">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 border border-primary/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading">{previewExam.title}</h3>
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
                  <span>{previewExam.duration} phút</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-green-500" /> Tổng số điểm đề
                  </span>
                  <span>{previewExam.totalMarks} điểm</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-500" /> Điểm để vượt qua
                  </span>
                  <span>{previewExam.passMarks} điểm</span>
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
                  onClick={() => setPreviewExam(null)}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl font-bold cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={confirmStartExam}
                  className="btn-premium flex-1 h-11 rounded-xl font-bold cursor-pointer"
                >
                  Bắt Đầu Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserExamPage;
