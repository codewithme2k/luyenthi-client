import React from "react";
import { BookOpen } from "lucide-react";
import Loading from "@/components/Layout/Loading";
import { BlogCard } from "./BlogCard";
import type { IPost } from "@/types/backend";

interface BlogGridProps {
  posts: IPost[];
  loading: boolean;
}

export const BlogGrid: React.FC<BlogGridProps> = ({ posts, loading }) => {
  if (loading) {
    return (
      <section className="container mx-auto px-6 max-w-6xl py-6 min-h-[40vh] relative">
        <Loading />
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="container mx-auto px-6 max-w-6xl py-6 min-h-[40vh] relative">
        <div className="glass p-12 text-center rounded-2xl border border-border/80 max-w-md mx-auto my-10 space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-foreground">Không tìm thấy bài viết</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Thử tìm kiếm với từ khóa khác hoặc quay lại sau để đón đọc bài viết mới nhé!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 max-w-6xl py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <BlogCard key={post.id} post={post} index={idx} />
        ))}
      </div>
    </section>
  );
};
