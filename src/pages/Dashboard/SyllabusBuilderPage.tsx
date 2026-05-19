import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { callFetchCourseDetails, callBulkUploadSyllabus } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Layers, 
  Plus, 
  Trash2, 
  Edit,
  Save, 
  FileJson, 
  Play, 
  Check, 
  HelpCircle,
  Eye,
  X,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";

interface ILesson {
  id?: string;
  title: string;
  order: number;
  content: string;
  videoUrl: string;
  googleDocUrl: string;
  isFree: boolean;
}

interface IChapter {
  id?: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

export const SyllabusBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [jsonText, setJsonText] = useState("");
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Drag and Drop States
  const [draggedChapterIdx, setDraggedChapterIdx] = useState<number | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ chapterIdx: number; lessonIdx: number } | null>(null);

  // Lesson Edit Modal
  const [selectedLesson, setSelectedLesson] = useState<{ chapterIdx: number; lessonIdx: number } | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonVideo, setEditLessonVideo] = useState("");
  const [editLessonDoc, setEditLessonDoc] = useState("");
  const [editLessonContent, setEditLessonContent] = useState("");
  const [editLessonFree, setEditLessonFree] = useState(false);

  const fetchCourseData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await callFetchCourseDetails(id);
      if (res.data && res.data.data) {
        setCourseTitle(res.data.data.title);
        // Map database model structures to local state
        const localChapters = (res.data.data.chapters || []).map((ch: any) => ({
          title: ch.title,
          order: ch.order,
          lessons: (ch.lessons || []).map((l: any) => ({
            title: l.title,
            order: l.order,
            content: l.content || "",
            videoUrl: l.videoUrl || "",
            googleDocUrl: l.googleDocUrl || "",
            isFree: l.isFree || false
          }))
        }));
        setChapters(localChapters);
      }
    } catch (err) {
      console.error("Failed to load syllabus course details:", err);
      toast.error("Không thể tải thông tin giáo trình!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  // Bulk Save Syllabus to Backend
  const handleSaveSyllabus = async () => {
    if (!id) return;

    // Build ordered lists
    const cleanPayload = chapters.map((ch, chIdx) => ({
      title: ch.title,
      order: chIdx + 1,
      lessons: ch.lessons.map((l, lIdx) => ({
        title: l.title,
        order: lIdx + 1,
        content: l.content,
        videoUrl: l.videoUrl,
        googleDocUrl: l.googleDocUrl,
        isFree: l.isFree
      }))
    }));

    try {
      await callBulkUploadSyllabus(id, cleanPayload);
      toast.success("Đồng bộ giáo trình thành công!");
      fetchCourseData();
    } catch (err) {
      console.error("Failed to upload syllabus:", err);
      toast.error("Có lỗi xảy ra khi đồng bộ giáo trình!");
    }
  };

  // Drag and Drop Handlers
  const handleChapterDrop = (targetIdx: number) => {
    if (draggedChapterIdx === null || draggedChapterIdx === targetIdx) return;
    const list = [...chapters];
    const [removed] = list.splice(draggedChapterIdx, 1);
    list.splice(targetIdx, 0, removed);
    setChapters(list);
    setDraggedChapterIdx(null);
    toast.success("Đã đổi thứ tự chương học!");
  };

  const handleLessonDrop = (targetChapterIdx: number, targetLessonIdx: number) => {
    if (draggedLesson === null) return;
    const { chapterIdx: sourceChIdx, lessonIdx: sourceLIdx } = draggedLesson;
    
    const list = [...chapters];
    const [lessonToMove] = list[sourceChIdx].lessons.splice(sourceLIdx, 1);
    list[targetChapterIdx].lessons.splice(targetLessonIdx, 0, lessonToMove);
    setChapters(list);
    setDraggedLesson(null);
    toast.success("Đã đổi thứ tự bài giảng!");
  };

  const handleLessonDropOnChapter = (targetChapterIdx: number) => {
    if (draggedLesson === null) return;
    const { chapterIdx: sourceChIdx, lessonIdx: sourceLIdx } = draggedLesson;
    
    // If dropping in same chapter
    if (sourceChIdx === targetChapterIdx) return;
    
    const list = [...chapters];
    const [lessonToMove] = list[sourceChIdx].lessons.splice(sourceLIdx, 1);
    list[targetChapterIdx].lessons.push(lessonToMove);
    setChapters(list);
    setDraggedLesson(null);
    toast.success("Đã chuyển bài giảng sang chương học khác!");
  };

  // Chapter CRUD
  const handleAddChapter = () => {
    const newCh: IChapter = {
      title: `Chương ${chapters.length + 1}: Tiêu đề chương mới`,
      order: chapters.length + 1,
      lessons: []
    };
    setChapters([...chapters, newCh]);
    toast.info("Đã thêm chương học mới. Hãy chỉnh sửa tiêu đề chương nhé!");
  };

  const handleUpdateChapterTitle = (index: number, newTitle: string) => {
    const list = [...chapters];
    list[index].title = newTitle;
    setChapters(list);
  };

  const handleDeleteChapter = (index: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá chương này cùng tất cả bài học bên trong?")) {
      return;
    }
    const list = chapters.filter((_, idx) => idx !== index);
    setChapters(list);
    toast.warning("Đã xoá chương học.");
  };

  // Lesson CRUD
  const handleAddLesson = (chapterIndex: number) => {
    const list = [...chapters];
    const newLesson: ILesson = {
      title: `Bài ${list[chapterIndex].lessons.length + 1}: Tiêu đề bài học mới`,
      order: list[chapterIndex].lessons.length + 1,
      content: "",
      videoUrl: "",
      googleDocUrl: "",
      isFree: false
    };
    list[chapterIndex].lessons.push(newLesson);
    setChapters(list);
    toast.info("Đã thêm bài học mới!");
  };

  const handleDeleteLesson = (chIdx: number, lIdx: number) => {
    const list = [...chapters];
    list[chIdx].lessons = list[chIdx].lessons.filter((_, idx) => idx !== lIdx);
    setChapters(list);
    toast.warning("Đã xoá bài học.");
  };

  // Lesson Edit Modals trigger
  const handleOpenEditLesson = (chIdx: number, lIdx: number) => {
    const lesson = chapters[chIdx].lessons[lIdx];
    setSelectedLesson({ chapterIdx: chIdx, lessonIdx: lIdx });
    setEditLessonTitle(lesson.title);
    setEditLessonVideo(lesson.videoUrl || "");
    setEditLessonDoc(lesson.googleDocUrl || "");
    setEditLessonContent(lesson.content || "");
    setEditLessonFree(lesson.isFree);
  };

  const handleSaveLessonModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;
    const { chapterIdx, lessonIdx } = selectedLesson;
    const list = [...chapters];
    list[chapterIdx].lessons[lessonIdx] = {
      title: editLessonTitle,
      order: lessonIdx + 1,
      content: editLessonContent,
      videoUrl: editLessonVideo,
      googleDocUrl: editLessonDoc,
      isFree: editLessonFree
    };
    setChapters(list);
    setSelectedLesson(null);
    toast.success("Cập nhật bài học thành công!");
  };

  // Bulk JSON Import logic
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error("Dữ liệu JSON giáo trình phải là một mảng []");
      }

      // Check structure validity
      parsed.forEach((ch, chIdx) => {
        if (!ch.title) throw new Error(`Chương ở vị trí số ${chIdx + 1} thiếu trường "title"`);
        if (ch.lessons && !Array.isArray(ch.lessons)) {
          throw new Error("Dữ liệu lessons của chương phải là một mảng []");
        }
      });

      // Parse successfully
      const localChapters = parsed.map((ch, idx) => ({
        title: ch.title,
        order: ch.order || idx + 1,
        lessons: (ch.lessons || []).map((l: any, lIdx: number) => ({
          title: l.title || `Bài học ${lIdx + 1}`,
          order: l.order || lIdx + 1,
          content: l.content || "",
          videoUrl: l.videoUrl || "",
          googleDocUrl: l.googleDocUrl || "",
          isFree: !!l.isFree
        }))
      }));

      setChapters(localChapters);
      setShowJsonModal(false);
      toast.success("Nạp dữ liệu JSON giáo trình thành công!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Lỗi cú pháp JSON: ${err.message}`);
    }
  };

  const loadJsonTemplate = () => {
    const template = [
      {
        "title": "Chương 1: Tiêu đề chương học mẫu",
        "order": 1,
        "lessons": [
          {
            "title": "Bài 1: Nội quy và Phương pháp học tập (Video học thử)",
            "order": 1,
            "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "googleDocUrl": "",
            "content": "Đây là nội dung lý thuyết chi tiết của bài số 1...",
            "isFree": true
          },
          {
            "title": "Bài 2: Tài liệu đọc hiểu chuyên sâu (Nhúng Google Doc)",
            "order": 2,
            "videoUrl": "",
            "googleDocUrl": "https://docs.google.com/document/d/e/2PACX-1vSb-S49h9X-wLdI7F6Z4a8vF8c-2u_P2U9Hh210mB9Wd/pub?embedded=true",
            "content": "Đây là tài liệu lý thuyết được nhúng trực tiếp...",
            "isFree": false
          }
        ]
      }
    ];
    setJsonText(JSON.stringify(template, null, 2));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto page-bg animate-fade-in">
      {/* Top Breadcrumb Backer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin/course" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại Quản lý khoá học
          </Link>
          <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 block w-max">
            Thiết kế bài giảng thông minh
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-foreground font-heading mt-1 flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Giáo Trình: {courseTitle}
          </h1>
        </div>

        {/* Global Action Keys */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              loadJsonTemplate();
              setShowJsonModal(true);
            }} 
            variant="outline" 
            className="rounded-xl border-border font-bold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <FileJson className="w-4 h-4 text-violet-500" />
            <span>Nạp JSON</span>
          </Button>

          <Button 
            onClick={handleSaveSyllabus} 
            className="btn-premium rounded-xl cursor-pointer font-extrabold text-xs shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Giáo Trình</span>
          </Button>
        </div>
      </div>

      {/* Main syllabus builder interface split */}
      <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-6">
        {chapters.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-border/60">
            <HelpCircle className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-foreground">Giáo trình hiện đang trống</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Hãy tạo chương học mới bằng nút phía dưới hoặc nhấp vào "Nạp JSON" ở góc phải để nạp nhanh toàn bộ giáo án!
            </p>
            <div className="mt-4">
              <Button onClick={handleAddChapter} className="btn-premium rounded-xl text-xs font-bold shadow-sm">
                <Plus className="w-4 h-4 mr-1" /> Thêm Chương Đầu Tiên
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {chapters.map((ch, chIdx) => (
              <div 
                key={chIdx} 
                className="border border-border/70 rounded-2xl overflow-hidden bg-card/40 transition-all shadow-xs"
              >
                {/* Chapter Metadata Bar (Drop zone for reordering chapters) */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedChapterIdx !== null) {
                      handleChapterDrop(chIdx);
                    }
                  }}
                  className="bg-muted/30 px-5 py-4 border-b border-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Chapter Drag Handle (Only this handle initiates chapter drag) */}
                    <div 
                      draggable
                      onDragStart={() => {
                        setDraggedChapterIdx(chIdx);
                        setDraggedLesson(null);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-muted/80 cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
                      Chương {chIdx + 1}
                    </span>
                    <input
                      value={ch.title}
                      onChange={(e) => handleUpdateChapterTitle(chIdx, e.target.value)}
                      className="bg-transparent border-0 ring-0 focus-visible:ring-0 focus:outline-hidden text-sm font-extrabold text-foreground w-full p-0 font-heading"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddLesson(chIdx)}
                      className="h-8 rounded-lg text-[10px] font-bold text-violet-600 border-violet-500/20 hover:bg-violet-500/5 cursor-pointer gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Bài
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteChapter(chIdx)}
                      className="h-8 w-8 rounded-lg border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer flex items-center justify-center p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Chapter Lessons Lists (Drop zone for moving lessons into this chapter) */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedLesson !== null) {
                      handleLessonDropOnChapter(chIdx);
                    }
                  }}
                  className="divide-y divide-border/50 bg-card/10 min-h-[40px]"
                >
                  {ch.lessons.length === 0 ? (
                    <div className="p-4 text-center text-xs font-semibold text-muted-foreground italic">
                      Không có bài học nào trong chương này. Nhấp "Thêm Bài" phía trên để bắt đầu soạn!
                    </div>
                  ) : (
                    ch.lessons.map((lesson, lIdx) => (
                      <div 
                        key={lIdx} 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.stopPropagation();
                          if (draggedLesson !== null) {
                            handleLessonDrop(chIdx, lIdx);
                          }
                        }}
                        className="px-5 py-3.5 hover:bg-muted/10 transition-colors flex items-center justify-between gap-4 group/lesson border-l-2 border-transparent hover:border-violet-500/50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Lesson Drag Handle (Only this handle initiates lesson drag) */}
                          <div 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedLesson({ chapterIdx: chIdx, lessonIdx: lIdx });
                              setDraggedChapterIdx(null);
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-muted/80 text-muted-foreground/45 group-hover/lesson:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>

                          <Play className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground truncate">
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
                                  Học Thử
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-lg mt-0.5">
                              {lesson.videoUrl || "Chưa gắn video bài giảng"}
                            </p>
                          </div>
                        </div>

                        {/* Lesson Action Triggers */}
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditLesson(chIdx, lIdx)}
                            className="h-8 rounded-lg border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" /> Soạn
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteLesson(chIdx, lIdx)}
                            className="h-8 w-8 rounded-lg border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer flex items-center justify-center p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Bottom Add Chapter Trigger */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleAddChapter}
                className="btn-premium rounded-xl cursor-pointer font-extrabold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Thêm Chương Học Mới</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* JSON Import Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="text-base font-black text-foreground font-heading flex items-center gap-1.5">
                <FileJson className="w-5 h-5 text-violet-500 animate-pulse" />
                Nạp Giáo Trình Bằng JSON
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-muted/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm font-semibold">
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Dán cấu trúc thư mục chương và bài học dưới định dạng mảng JSON mẫu. 
                Hệ thống sẽ đồng bộ cấu trúc chương, bài giảng tương thích tự động.
              </p>

              <textarea
                rows={10}
                placeholder="Dán mã JSON giáo án tại đây..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full p-3 font-mono text-xs font-semibold bg-background/50 border border-border rounded-xl focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-offset-0"
              />

              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={loadJsonTemplate}
                  variant="outline"
                  className="rounded-xl border-border font-bold text-xs text-violet-600 border-violet-500/20 hover:bg-violet-500/5 cursor-pointer"
                >
                  Tải JSON Mẫu
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowJsonModal(false)}
                    variant="outline"
                    className="rounded-xl border-border font-bold text-xs cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    onClick={handleImportJson}
                    className="btn-premium rounded-xl font-extrabold text-xs shadow-md"
                  >
                    <Check className="w-4 h-4 mr-1" /> Nạp Dữ Liệu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Detailed Content Composer Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/10">
              <h3 className="text-base font-black text-foreground font-heading flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-primary animate-pulse" />
                Soạn Nội Dung Bài Học
              </h3>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-muted/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLessonModal} className="p-6 space-y-5 text-sm font-semibold">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Media Links */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-bold">Tiêu đề bài học *</label>
                    <Input
                      required
                      placeholder="Ví dụ: Bài 1: Sự đồng biến nghịch biến của hàm số"
                      value={editLessonTitle}
                      onChange={(e) => setEditLessonTitle(e.target.value)}
                      className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-bold">Trình phát 1: YouTube Video URL (nếu có)</label>
                    <Input
                      placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                      value={editLessonVideo}
                      onChange={(e) => setEditLessonVideo(e.target.value)}
                      className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-bold">Trình phát 2: Đường dẫn nhúng Google Doc (nếu có)</label>
                    <Input
                      placeholder="Ví dụ: https://docs.google.com/document/d/e/.../pub?embedded=true"
                      value={editLessonDoc}
                      onChange={(e) => setEditLessonDoc(e.target.value)}
                      className="rounded-xl border-border bg-background/50 focus-visible:ring-primary font-mono text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground leading-normal mt-1.5 font-medium">
                      🔑 Hướng dẫn: Mở Google Doc ➔ Tệp ➔ Chia sẻ ➔ Công bố lên web ➔ Chọn tab "Nhúng" ➔ Sao chép thuộc tính <code>src</code> trong thẻ iframe.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      id="freeCheckbox"
                      checked={editLessonFree}
                      onChange={(e) => setEditLessonFree(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer accent-primary"
                    />
                    <label htmlFor="freeCheckbox" className="text-xs font-extrabold text-foreground cursor-pointer flex items-center gap-1.5">
                      <span>Học viên chưa đăng ký VIP được xem thử (Free Lesson)</span>
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    </label>
                  </div>
                </div>

                {/* Right Column: Content/Rich Text area */}
                <div className="flex flex-col space-y-1 h-full">
                  <label className="text-xs text-muted-foreground font-bold">Nội dung bài học (HTML / Lý thuyết bổ trợ)</label>
                  <textarea
                    rows={12}
                    placeholder="Nhập nội dung tài liệu học tập, công thức toán lý hóa bổ trợ..."
                    value={editLessonContent}
                    onChange={(e) => setEditLessonContent(e.target.value)}
                    className="w-full flex-1 px-3 py-2 text-xs font-semibold bg-background/50 border border-border rounded-xl focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-offset-0 resize-none min-h-[220px] lg:min-h-[280px]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedLesson(null)}
                  className="rounded-xl border-border font-bold text-xs"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="btn-premium rounded-xl font-extrabold text-xs shadow-md"
                >
                  <Check className="w-4 h-4 mr-1" /> Áp Dụng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
