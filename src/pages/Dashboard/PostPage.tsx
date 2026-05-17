import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPost, createPost, updatePost, deletePost } from "@/redux/slice/postSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";
import type { IPost } from "@/types/backend";
import { Edit, Trash2, Plus, Search } from "lucide-react";

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  dataUpdate: IPost | null;
  setDataUpdate: (v: IPost | null) => void;
  onSuccess: () => void;
}

import { 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Code, 
  Quote, 
  Divide, 
  AlertTriangle, 
  Eye, 
  Sparkles, 
  FileText,
  Clock
} from "lucide-react";

// Helper function to generate clean slugs dynamically
const generateSlug = (title: string) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "") // remove special chars
    .replace(/(\s+)/g, "-") // replace spaces with -
    .replace(/-+/g, "-") // remove duplicate -
    .trim();
};

// Custom lightweight high-performance Markdown/MDX live preview renderer
const MarkdownPreview = ({ content }: { content: string }) => {
  const html = useMemo(() => {
    if (!content) return "<p class='text-muted-foreground italic text-center py-10'>Chưa có nội dung xem trước. Hãy nhập nội dung Markdown bên trái...</p>";

    let parsed = content;

    // Escape HTML tags to prevent XSS
    parsed = parsed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks with custom dark styling
    parsed = parsed.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="my-4 rounded-xl overflow-hidden border border-border/80 bg-slate-950 shadow-md">
        <div class="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400">
          <span>${lang || "code"}</span>
          <span class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Copy</span>
        </div>
        <pre class="p-4 text-xs font-mono text-slate-100 overflow-x-auto whitespace-pre"><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Inline code
    parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary font-bold">$1</code>');

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

      return `<div class="my-4 p-4 border-l-4 rounded-r-xl ${borderColors} shadow-xs">
        <p class="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">💡 ${title}</p>
        <p class="text-sm font-medium leading-relaxed">${text.replace(/&gt;\s?/g, "").trim()}</p>
      </div>`;
    });

    // Blockquotes
    parsed = parsed.replace(/&gt;\s*(.*)/g, '<blockquote class="border-l-4 border-primary/40 pl-4 py-1 italic my-4 text-muted-foreground">$1</blockquote>');

    // Headings
    parsed = parsed.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold font-heading text-foreground mt-6 mb-3 border-b border-border pb-2">$1</h1>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold font-heading text-foreground mt-5 mb-2.5 pb-1">$1</h2>');
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold font-heading text-foreground mt-4 mb-2">$1</h3>');

    // Horizontal Rule
    parsed = parsed.replace(/^\s*---\s*$/gim, '<hr class="my-6 border-border" />');

    // Bold, Italic, Strikethrough
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em class="italic text-foreground">$1</em>');
    parsed = parsed.replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>');

    // Unordered Lists
    parsed = parsed.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc pl-1.5 text-sm my-1 leading-relaxed text-foreground">$1</li>');
    parsed = parsed.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc pl-1.5 text-sm my-1 leading-relaxed text-foreground">$1</li>');

    // Ordered Lists
    parsed = parsed.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal pl-1.5 text-sm my-1 leading-relaxed text-foreground">$1</li>');

    // Wrap list items
    parsed = parsed.replace(/(<li.*<\/li>)/g, '<ul class="my-4 space-y-1">$1</ul>');
    // Remove consecutive nested ul tags
    parsed = parsed.replace(/<\/ul>\s*<ul class="my-4 space-y-1">/g, "");

    // Paragraphs
    const lines = parsed.split("\n");
    const wrappedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<div") || trimmed.startsWith("<pre") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<ul") || trimmed.startsWith("<li") || trimmed.startsWith("<hr")) {
        return line;
      }
      return `<p class="text-sm leading-relaxed text-foreground/90 my-2">${line}</p>`;
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

const PostFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<IPost>>();
  const dispatch = useAppDispatch();
  const { isFetching } = useAppSelector((state) => state.post);
  const account = useAppSelector((state) => state.account);

  const postContent = watch("content") || "";

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate);
    } else {
      reset({
        title: "",
        slug: "",
        content: "",
        thumbnail: "",
        authorId: account.user.id || "",
        isPublished: false
      });
    }
  }, [dataUpdate, reset, open, account.user.id]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    setValue("slug", generateSlug(val));
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = "";
    if (syntax === "bold") replacement = `**${selected || "chữ đậm"}**`;
    else if (syntax === "italic") replacement = `*${selected || "chữ nghiêng"}*`;
    else if (syntax === "h1") replacement = `# ${selected || "Tiêu đề 1"}`;
    else if (syntax === "h2") replacement = `## ${selected || "Tiêu đề 2"}`;
    else if (syntax === "code") replacement = `\`\`\`javascript\n${selected || "// viết mã ở đây"}\n\`\`\``;
    else if (syntax === "quote") replacement = `> ${selected || "Trích dẫn"}`;
    else if (syntax === "divider") replacement = `\n---\n`;
    else if (syntax === "alert") replacement = `> [!NOTE]\n> ${selected || "Đây là ghi chú quan trọng!"}`;
    else if (syntax === "warning") replacement = `> [!WARNING]\n> ${selected || "Chú ý cảnh báo này!"}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setValue("content", newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const onSubmit = async (data: Partial<IPost>) => {
    try {
      const cleanPayload = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        thumbnail: data.thumbnail,
        isPublished: data.isPublished,
        authorId: data.authorId || account.user.id
      };
      if (dataUpdate) {
        await dispatch(updatePost({ post: cleanPayload, id: dataUpdate.id })).unwrap();
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await dispatch(createPost(cleanPayload)).unwrap();
        toast.success("Tạo bài viết mới thành công!");
      }
      setOpen(false);
      setDataUpdate(null);
      reset();
      onSuccess();
    } catch {
      toast.error(dataUpdate ? "Không thể cập nhật bài viết" : "Không thể tạo bài viết mới");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) setDataUpdate(null);
    }}>
      <DialogContent className="sm:max-w-[92vw] !max-w-[92vw] w-[92vw] h-[92vh] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-background">
        
        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 md:px-8 border-b border-border bg-muted/20 shrink-0">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <Sparkles className="w-3 h-3 fill-current" />
                CMS Editor Siêu Cấp v2
              </span>
              <h2 className="text-xl md:text-2xl font-black font-heading text-foreground">
                {dataUpdate ? "Hiệu Chỉnh Bài Viết" : "Tạo Mới Bài Viết"}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 bg-muted/65 p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setValue("isPublished", false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    !watch("isPublished")
                      ? "bg-background text-yellow-600 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Nháp (Draft)
                </button>
                <button
                  type="button"
                  onClick={() => setValue("isPublished", true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    watch("isPublished")
                      ? "bg-background text-emerald-600 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Công khai (Publish)
                </button>
              </div>

              <Button type="submit" disabled={isFetching} className="font-extrabold cursor-pointer h-10 px-5 shadow-md shadow-primary/20">
                {isFetching ? "Đang lưu..." : (dataUpdate ? "Cập Nhật Bài" : "Đăng Bài Viết")}
              </Button>
            </div>
          </div>

          {/* Settings Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b border-border bg-card shrink-0">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Tiêu đề bài viết</Label>
              <Input 
                id="title" 
                placeholder="Ví dụ: Hướng dẫn giải nhanh Toán trắc nghiệm THPT Quốc gia..."
                {...register("title", { required: true })} 
                onChange={onTitleChange}
                className="bg-muted/10 border-border/80 rounded-xl text-sm font-semibold h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Đường dẫn SEO (Slug)</Label>
              <Input 
                id="slug" 
                placeholder="tu-dong-sinh-ra..."
                {...register("slug", { required: true })} 
                className="bg-muted/10 border-border/80 rounded-xl text-sm font-mono h-10 text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Ảnh bìa (Cover URL)</Label>
              <Input 
                id="thumbnail" 
                placeholder="https://images.unsplash.com/photo..."
                {...register("thumbnail")} 
                className="bg-muted/10 border-border/80 rounded-xl text-sm h-10"
              />
            </div>
          </div>

          {/* Main Splitted Editor & Previewer */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Panel: Markdown Editor */}
            <div className="flex-1 flex flex-col border-r border-border overflow-hidden bg-card">
              
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("bold")} title="Chữ đậm"><Bold className="w-3.5 h-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("italic")} title="Chữ nghiêng"><Italic className="w-3.5 h-3.5" /></Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("h1")} title="Tiêu đề 1"><Heading1 className="w-3.5 h-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("h2")} title="Tiêu đề 2"><Heading2 className="w-3.5 h-3.5" /></Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("code")} title="Khối mã nguồn"><Code className="w-3.5 h-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("quote")} title="Trích dẫn"><Quote className="w-3.5 h-3.5" /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-foreground" onClick={() => insertMarkdown("divider")} title="Đường kẻ ngang"><Divide className="w-3.5 h-3.5" /></Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button type="button" variant="ghost" size="icon" className="h-8-w-8 px-2 h-8 w-auto gap-1 text-[10px] font-black hover:bg-muted text-blue-600 dark:text-blue-400" onClick={() => insertMarkdown("alert")} title="Hộp thông tin"><Sparkles className="w-3 h-3" /> Note</Button>
                <Button type="button" variant="ghost" size="icon" className="h-8-w-8 px-2 h-8 w-auto gap-1 text-[10px] font-black hover:bg-muted text-amber-600 dark:text-amber-400" onClick={() => insertMarkdown("warning")} title="Hộp cảnh báo"><AlertTriangle className="w-3 h-3" /> Warning</Button>
              </div>

              {/* Textarea */}
              <div className="flex-1 p-4 overflow-hidden relative">
                <textarea
                  id="editor-textarea"
                  placeholder="### Viết bài bằng Markdown/MDX ở đây...
Sử dụng các thanh công cụ phía trên để định dạng cực nhanh.

> [!NOTE]
> Đây là một hộp thông tin lấp lánh màu xanh HSL!

Bạn có thể viết công thức, chèn hình ảnh, bảng biểu và danh sách học tập cực kỳ dễ dàng."
                  {...register("content", { required: true })}
                  className="w-full h-full resize-none bg-transparent outline-none border-none font-mono text-sm leading-relaxed text-foreground select-text placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Bottom stats */}
              <div className="px-4 py-2 border-t border-border bg-muted/20 shrink-0 flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Ký tự: {postContent.length}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Đọc ước tính: {Math.max(1, Math.round(postContent.split(/\s+/).length / 200))} phút</span>
              </div>
            </div>

            {/* Right Panel: Live MDX Preview */}
            <div className="flex-1 flex flex-col bg-muted/10 overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/40 shrink-0 flex justify-between items-center">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Giao Diện MDX Xem Trước (Live Preview)
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-background/55">
                <div className="max-w-2xl mx-auto space-y-4">
                  {/* Article header preview */}
                  {watch("title") && (
                    <div className="space-y-3 pb-6 border-b border-border">
                      {watch("thumbnail") && (
                        <div className="w-full h-40 rounded-xl overflow-hidden border border-border shadow-xs bg-muted">
                          <img src={watch("thumbnail")} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h1 className="text-3xl font-black font-heading leading-tight text-foreground">{watch("title")}</h1>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-muted">Tác giả: {dataUpdate?.author?.name || account?.user?.name || "Admin"}</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  )}

                  {/* Render content */}
                  <MarkdownPreview content={postContent} />
                </div>
              </div>
            </div>

          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function PostPage() {
  const dispatch = useAppDispatch();
  const { data: posts, isFetching, meta } = useAppSelector((state) => state.post);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const totalPages = Math.ceil((meta?.total || 0) / limit);

  const [openModal, setOpenModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IPost | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchPost({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  const loadPosts = () => {
    dispatch(fetchPost({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }));
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deletePost({ id })).unwrap();
      toast.success("Post deleted successfully");
      loadPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in">
      {isFetching && !openModal && <Loading />}
      
      <PostFormModal 
        open={openModal} 
        setOpen={setOpenModal} 
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadPosts} 
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Button onClick={() => {
            setDataUpdate(null);
            setOpenModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>{post.author?.name || "Admin"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setDataUpdate(post);
                          setOpenModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
