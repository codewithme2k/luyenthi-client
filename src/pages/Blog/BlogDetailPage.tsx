import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { callFetchPostBySlug, callToggleLikePost, callToggleSavePost } from "@/config/api";
import type { IPost } from "@/types/backend";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Heart,
  Bookmark,
  Sparkles,
  BookOpen
} from "lucide-react";
import Loading from "@/components/Layout/Loading";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { MarkdownPreview } from "@/components/Client/Blog/MarkdownPreview";

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
