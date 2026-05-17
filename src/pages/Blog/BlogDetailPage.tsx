import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { callFetchPostBySlug, callToggleLikePost, callToggleSavePost } from "@/config/api";
import type { IPost } from "@/types/backend";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  Share2, 
  Heart,
  Bookmark,
  Sparkles
} from "lucide-react";
import Loading from "@/components/Layout/Loading";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

// Custom lightweight high-performance Markdown/MDX parser
const MarkdownPreview = ({ content }: { content: string }) => {
  const html = useMemo(() => {
    if (!content) return "";

    let parsed = content;

    // Escape HTML tags to prevent XSS
    parsed = parsed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks with syntax copy buttons
    parsed = parsed.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="my-6 rounded-2xl overflow-hidden border border-border/80 bg-slate-950 shadow-md">
        <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400">
          <span>${lang || "code"}</span>
          <span class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Copy</span>
        </div>
        <pre class="p-5 text-xs font-mono text-slate-100 overflow-x-auto whitespace-pre leading-relaxed"><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Inline code
    parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 rounded bg-muted font-mono text-xs text-primary font-bold">$1</code>');

    // GitHub-style Alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
    parsed = parsed.replace(/&gt;\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n([\s\S]*?)(?=\n&gt;|\n\n|\n$|$)/gi, (_, type, text) => {
      const typeLower = type.toUpperCase();
      let borderColors = "border-sky-500 bg-sky-500/5 text-sky-800 dark:text-sky-300";
      let title = "Thông tin";
      if (typeLower === "TIP") {
        borderColors = "border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300";
        title = "Gợi ý";
      } else if (typeLower === "WARNING") {
        borderColors = "border-amber-500 bg-amber-500/5 text-amber-800 dark:text-amber-300";
        title = "Cảnh báo";
      } else if (typeLower === "CAUTION" || typeLower === "IMPORTANT") {
        borderColors = "border-rose-500 bg-rose-500/5 text-rose-800 dark:text-rose-300";
        title = "Quan trọng";
      }

      return `<div class="my-5 p-4 border-l-4 rounded-r-2xl ${borderColors} shadow-xs">
        <p class="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">💡 ${title}</p>
        <p class="text-sm font-medium leading-relaxed">${text.replace(/&gt;\s?/g, "").trim()}</p>
      </div>`;
    });

    // Blockquotes
    parsed = parsed.replace(/&gt;\s*(.*)/g, '<blockquote class="border-l-4 border-primary/40 pl-5 py-1.5 italic my-6 text-muted-foreground">$1</blockquote>');

    // Headings
    parsed = parsed.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold font-heading text-foreground mt-8 mb-4 border-b border-border pb-2.5">$1</h1>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold font-heading text-foreground mt-7 mb-3 pb-1">$1</h2>');
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold font-heading text-foreground mt-6 mb-2">$1</h3>');

    // Horizontal Rule
    parsed = parsed.replace(/^\s*---\s*$/gim, '<hr class="my-8 border-border" />');

    // Bold, Italic, Strikethrough
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em class="italic text-foreground">$1</em>');
    parsed = parsed.replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>');

    // Unordered Lists
    parsed = parsed.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');
    parsed = parsed.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');

    // Ordered Lists
    parsed = parsed.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');

    // Wrap list items
    parsed = parsed.replace(/(<li.*<\/li>)/g, '<ul class="my-5 space-y-1.5">$1</ul>');
    // Remove consecutive nested ul tags
    parsed = parsed.replace(/<\/ul>\s*<ul class="my-5 space-y-1.5">/g, "");

    // Paragraphs
    const lines = parsed.split("\n");
    const wrappedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<div") || trimmed.startsWith("<pre") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<ul") || trimmed.startsWith("<li") || trimmed.startsWith("<hr")) {
        return line;
      }
      return `<p class="text-base leading-relaxed text-foreground/90 my-3">${line}</p>`;
    });

    return wrappedLines.join("\n");
  }, [content]);

  return (
    <div 
      className="prose dark:prose-invert max-w-none break-words leading-relaxed select-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated, user } = useAppSelector((state) => state.account);
  
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await callFetchPostBySlug(slug);
        if (res.data && res.data.data) {
          const p = res.data.data;
          setPost(p);
          setLikes(p.likedBy?.length || 0);
          if (user?.id) {
            setIsLiked(p.likedBy?.some((x: any) => x.userId === user.id) || false);
            setIsSaved(p.savedBy?.some((x: any) => x.userId === user.id) || false);
          }
        }
      } catch (err) {
        console.error("Failed to load post detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [slug, user?.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thích bài viết! ❤️");
      return;
    }
    if (!post) return;
    try {
      const res = await callToggleLikePost(post.id);
      if (res.data && res.data.success) {
        setIsLiked(res.data.data.isLiked);
        setLikes(res.data.data.count);
        if (res.data.data.isLiked) {
          toast.success("Đã thích bài viết! ❤️");
        } else {
          toast.success("Đã bỏ thích bài viết!");
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra khi thực hiện thích bài viết.");
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu bài viết! 🔖");
      return;
    }
    if (!post) return;
    try {
      const res = await callToggleSavePost(post.id);
      if (res.data && res.data.success) {
        setIsSaved(res.data.data.isSaved);
        if (res.data.data.isSaved) {
          toast.success("Đã lưu bài viết vào trang cá nhân! 🔖");
        } else {
          toast.success("Đã bỏ lưu bài viết!");
        }
      }
    } catch {
      toast.error("Có lỗi xảy ra khi thực hiện lưu bài viết.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết bài viết vào bộ nhớ tạm!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-20 text-center space-y-6">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto opacity-40 animate-bounce" />
        <h2 className="text-2xl font-black font-heading">Bài viết không tồn tại</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Có thể bài viết đã được gỡ xuống hoặc đường dẫn SEO của bài viết đã thay đổi.
        </p>
        <Link to="/blog">
          <Button className="btn-premium h-11 px-6 rounded-xl font-bold cursor-pointer mt-4">
            Quay Lại Cẩm Nang
          </Button>
        </Link>
      </div>
    );
  }

  const readTime = Math.max(1, Math.round((post.content || "").split(/\s+/).length / 200));

  return (
    <div className="min-h-screen bg-background pb-20 page-bg overflow-hidden relative">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Container - EXPANDED WIDTH TO 5XL */}
      <div className="container mx-auto px-6 max-w-7xl pt-10 relative">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 animate-fade-in shrink-0">
          <Link to="/blog">
            <Button variant="ghost" className="hover:bg-muted font-bold text-xs gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer text-muted-foreground hover:text-foreground transition-colors border border-border/40 bg-background/30 backdrop-blur-xs">
              <ArrowLeft className="w-4 h-4" />
              Quay lại Cẩm Nang
            </Button>
          </Link>
        </div>

        {/* Article Container */}
        <article className="glass rounded-3xl border border-border/80 p-6 sm:p-10 space-y-8 animate-fade-in shadow-xl bg-background/60 backdrop-blur-md">
          
          {/* Header Cover */}
          {post.thumbnail && (
            <div className="w-full h-[200px] sm:h-[400px] rounded-2xl overflow-hidden border border-border shadow-md">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Heading */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-violet-500/10 text-violet-600 text-xs font-bold border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin-slow" />
              Chia sẻ Kiến Thức
            </span>

            <h1 className="text-2xl sm:text-4xl font-black font-heading leading-tight text-foreground">
              {post.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 py-3 border-y border-border/60 text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{new Date(post.createdAt || "").toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{readTime} Phút Đọc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                <span>Tác giả: {post.author?.name || "Admin"}</span>
              </div>
            </div>
          </div>

          {/* Render MDX/Markdown Content */}
          <div className="py-2">
            <MarkdownPreview content={post.content || ""} />
          </div>

          {/* Engagement Actions footer */}
          <div className="pt-6 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 h-10 rounded-xl font-bold transition-all cursor-pointer ${
                  isLiked 
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 hover:text-rose-700" 
                    : "hover:bg-muted"
                }`}
              >
                <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>Thích ({likes})</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 h-10 rounded-xl font-bold transition-all cursor-pointer ${
                  isSaved 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:text-amber-700" 
                    : "hover:bg-muted"
                }`}
              >
                <Bookmark className={`w-4.5 h-4.5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                <span>{isSaved ? "Đã lưu" : "Lưu bài viết"}</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 h-10 rounded-xl font-bold hover:bg-muted cursor-pointer"
              >
                <Share2 className="w-4.5 h-4.5" />
                <span>Chia sẻ</span>
              </Button>
            </div>
            
            <div className="hidden sm:block text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
              © Nền Tảng Luyện Thi Pro
            </div>
          </div>

        </article>

      </div>
    </div>
  );
};
