import React, { useEffect, useState } from "react";
import { callFetchPost } from "@/config/api";
import type { IPost } from "@/types/backend";
import { BlogHero } from "@/components/Client/Blog/BlogHero";
import { BlogGrid } from "@/components/Client/Blog/BlogGrid";
import { BlogPagination } from "@/components/Client/Blog/BlogPagination";

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

  return (
    <div className="min-h-screen bg-background pb-16 page-bg overflow-hidden relative">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <BlogHero 
        searchTerm={searchTerm} 
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }} 
      />

      {/* Grid Posts Section */}
      <BlogGrid posts={posts} loading={loading} />

      {/* Pagination Controls */}
      <BlogPagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
};

export default BlogPage;
