import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { callFetchPost } from "@/config/api";
import type { IPost } from "@/types/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Loading from "@/components/Layout/Loading";

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        // Fetch only published posts (active in public space)
        const res = await callFetchPost(`page=${page}&limit=${limit}&searchTerm=${searchTerm}&isPublished=true`);
        if (res.data && res.data.data) {
          // Filter out draft posts if any are returned
          const publishedOnly = res.data.data.filter((p: IPost) => p.isPublished);
          setPosts(publishedOnly);
          setTotalPages(Math.ceil((res.data.meta?.total || 0) / limit));
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAllPosts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  // Strip markdown symbols to generate a plain text excerpt
  const getExcerpt = (markdown: string, charLimit: number = 120) => {
    if (!markdown) return "";
    const cleanText = markdown
      .replace(/[#*`>_\-~]/g, "") // strip standard markdown characters
      .replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText.length > charLimit ? cleanText.substring(0, charLimit) + "..." : cleanText;
  };

  return (
    <div className="min-h-screen bg-background pb-16 page-bg overflow-hidden relative">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Header */}
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-11 h-12 bg-background/50 border-border rounded-xl text-sm font-semibold shadow-xs focus-visible:ring-primary backdrop-blur-xs"
          />
        </div>
      </section>

      {/* Grid Posts Section */}
      <section className="container mx-auto px-6 max-w-6xl py-6 min-h-[40vh] relative">
        {loading && <Loading />}

        {!loading && posts.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl border border-border/80 max-w-md mx-auto my-10 space-y-4">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-foreground">Không tìm thấy bài viết</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Thử tìm kiếm với từ khóa khác hoặc quay lại sau để đón đọc bài viết mới nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => {
              // Estimated reading time
              const readTime = Math.max(1, Math.round((post.content || "").split(/\s+/).length / 200));
              
              // Custom abstract covers
              const abstractGradients = [
                "from-blue-600/35 to-indigo-600/35",
                "from-purple-600/35 to-pink-600/35",
                "from-violet-600/35 to-fuchsia-600/35",
                "from-emerald-600/35 to-teal-600/35",
              ];
              const gradient = abstractGradients[idx % abstractGradients.length];

              return (
                <article 
                  key={post.id} 
                  className="glass rounded-2xl border border-border/80 flex flex-col justify-between overflow-hidden card-hover"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="w-full h-48 overflow-hidden relative border-b border-border/60 bg-muted shrink-0">
                      {post.thumbnail ? (
                        <img 
                          src={post.thumbnail} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex items-center justify-center`}>
                          <BookOpen className="w-12 h-12 text-foreground/20 animate-pulse" />
                        </div>
                      )}
                      
                      {/* Read Time Tag */}
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readTime} Phút Đọc
                      </span>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || "").toLocaleDateString('vi-VN')}
                        </span>
                        <span>•</span>
                        <span>Bởi {post.author?.name || "Admin"}</span>
                      </div>

                      <h3 className="font-extrabold text-lg sm:text-xl font-heading leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3">
                        {getExcerpt(post.content || "")}
                      </p>
                    </div>
                  </div>

                  {/* Read More Action */}
                  <div className="p-6 pt-0 border-t border-border/30 mt-4">
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary p-0 h-10 group/btn font-extrabold text-sm text-foreground/80 cursor-pointer">
                        <span>Đọc Bài Viết</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 w-10 rounded-xl cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-10 w-10 rounded-xl cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
