import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { callFetchCourses, callFetchCategory } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Crown,
  PlayCircle
} from "lucide-react";
import Loading from "@/components/Layout/Loading";

interface ICategory {
  id: string;
  name: string;
  slug: string;
}

interface ICourse {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail: string | null;
  isPublished: boolean;
  isPremium: boolean;
  categoryId: string | null;
  category: { name: string; slug: string } | null;
  _count?: { chapters: number };
}

export const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Load Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await callFetchCategory();
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Load Courses
  useEffect(() => {
    const fetchCoursesList = async () => {
      setLoading(true);
      try {
        const catFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
        const res = await callFetchCourses(
          `page=${page}&limit=${limit}&searchTerm=${searchTerm}&isPublished=true${catFilter}`
        );
        if (res.data && res.data.data) {
          setCourses(res.data.data);
          setTotalPages(Math.ceil((res.data.meta?.total || 0) / limit));
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCoursesList();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [page, searchTerm, selectedCategory]);

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60";
    if (url.startsWith("http")) return url;
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || "";
    const cleanBackend = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBackend}${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-background pb-16 page-bg overflow-hidden relative">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="container mx-auto px-6 pt-16 pb-8 text-center max-w-4xl animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5 border border-primary/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin-slow" />
          <span>Học Phần E-Learning Toàn Diện</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading leading-tight">
          Khoá Học{" "}
          <span className="bg-gradient-to-r from-primary via-violet-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-xs">
            Bồi Dưỡng Chuyên Sâu
          </span>{" "}
          Mọi Môn Học
        </h1>

        <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Tìm kiếm các khoá học chất lượng cao, bài giảng trực quan sinh động giúp bạn 
          tự tin làm chủ kiến thức nền tảng và bứt phá điểm số cao trong các kì thi sắp tới.
        </p>

        {/* Search input bar */}
        <div className="mt-8 max-w-md mx-auto relative group">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm khoá học nâng cao..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-11 h-12 bg-background/50 border-border rounded-xl text-sm font-semibold shadow-xs focus-visible:ring-primary backdrop-blur-xs"
          />
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center items-center">
          <button
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background/40 hover:bg-muted/80 text-muted-foreground border-border"
            }`}
          >
            Tất Cả Khoá Học
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/40 hover:bg-muted/80 text-muted-foreground border-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Course List Grid */}
      <section className="container mx-auto px-6 max-w-6xl mt-4">
        {loading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/80 backdrop-blur-md max-w-lg mx-auto">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">Không tìm thấy khoá học nào</h3>
            <p className="text-muted-foreground text-xs font-semibold mt-1">
              Thử tìm kiếm với cụm từ khác hoặc chọn danh mục học tập khác xem sao.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`group bg-card rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full overflow-hidden ${
                    course.isPremium 
                      ? "border-amber-500/20 hover:border-amber-500/50" 
                      : "border-border hover:border-primary/45"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video w-full overflow-hidden relative bg-muted/40">
                    <img
                      src={getImageUrl(course.thumbnail)}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* VIP/Premium Badge */}
                    {course.isPremium && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-amber-950 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        <span>VIP Premium</span>
                      </div>
                    )}
                    {/* Category tag */}
                    {course.category && (
                      <div className="absolute bottom-3 left-3 bg-background/90 text-foreground px-2 py-0.5 rounded-md text-[10px] font-bold border border-border shadow-xs">
                        {course.category.name}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium mt-2 leading-relaxed line-clamp-3">
                        {course.description || "Chưa có mô tả ngắn về khoá học ôn luyện này."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-semibold">
                      <div className="flex items-center gap-1">
                        <Layers className="w-4 h-4 text-primary/70" />
                        <span>{course._count?.chapters || 0} Chương Học</span>
                      </div>

                      <Link to={`/course/${course.slug}`}>
                        <Button
                          size="sm"
                          className={`rounded-lg cursor-pointer font-bold text-xs ${
                            course.isPremium
                              ? "bg-amber-500 hover:bg-amber-600 text-amber-950"
                              : "btn-premium"
                          }`}
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1" />
                          Học Ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="rounded-lg border-border"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Trước
                </Button>
                <span className="text-xs font-bold text-muted-foreground px-3">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="rounded-lg border-border"
                >
                  Sau <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
