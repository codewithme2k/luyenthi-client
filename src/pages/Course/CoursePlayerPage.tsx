import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { callFetchCourseDetails } from "@/config/api";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Lock, 
  Crown,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Tv,
  FileText,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import Loading from "@/components/Layout/Loading";

interface ILesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  googleDocUrl?: string | null;
  order: number;
  isFree: boolean;
}

interface IChapter {
  id: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

interface ICourseDetails {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnail: string | null;
  isPremium: boolean;
  chapters: IChapter[];
  category?: { name: string; slug: string } | null;
}

export const CoursePlayerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAppSelector((state) => state.account);
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"video" | "info">("video");
  const [playerMode, setPlayerMode] = useState<"video" | "doc">("video");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await callFetchCourseDetails(slug);
        if (res.data && res.data.data) {
          const courseData = res.data.data as ICourseDetails;
          setCourse(courseData);

          // Find first lesson to auto-select
          let firstLesson: ILesson | null = null;
          const initialExpanded: Record<string, boolean> = {};

          if (courseData.chapters && courseData.chapters.length > 0) {
            courseData.chapters.forEach((ch, index) => {
              initialExpanded[ch.id] = index === 0; // expand first chapter by default
              if (index === 0 && ch.lessons && ch.lessons.length > 0) {
                firstLesson = ch.lessons[0];
              }
            });
          }
          setExpandedChapters(initialExpanded);
          if (firstLesson) {
            setActiveLesson(firstLesson);
          }
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
        toast.error("Không thể tải thông tin bài học!");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  // Auto detect best media player view mode
  useEffect(() => {
    if (activeLesson) {
      if (activeLesson.videoUrl) {
        setPlayerMode("video");
      } else if (activeLesson.googleDocUrl) {
        setPlayerMode("doc");
      }
    }
  }, [activeLesson]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const getYoutubeEmbedUrl = (url: string | null | undefined) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return url;
  };

  // Navigation: find next or previous lessons in the flat curriculum order
  const getFlatLessons = (): { lesson: ILesson; chapterId: string }[] => {
    if (!course) return [];
    const list: { lesson: ILesson; chapterId: string }[] = [];
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        list.push({ lesson: l, chapterId: ch.id });
      });
    });
    return list;
  };

  const navigateLesson = (direction: "next" | "prev") => {
    const flat = getFlatLessons();
    if (!activeLesson || flat.length === 0) return;
    const currentIndex = flat.findIndex((item) => item.lesson.id === activeLesson.id);

    if (direction === "next" && currentIndex < flat.length - 1) {
      const nextItem = flat[currentIndex + 1];
      setActiveLesson(nextItem.lesson);
      // Auto expand next chapter if collapsed
      setExpandedChapters(prev => ({ ...prev, [nextItem.chapterId]: true }));
    } else if (direction === "prev" && currentIndex > 0) {
      const prevItem = flat[currentIndex - 1];
      setActiveLesson(prevItem.lesson);
      // Auto expand prev chapter if collapsed
      setExpandedChapters(prev => ({ ...prev, [prevItem.chapterId]: true }));
    }
  };

  const flatLessons = getFlatLessons();
  const activeIndex = activeLesson ? flatLessons.findIndex(item => item.lesson.id === activeLesson.id) : -1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background py-20 text-center">
        <h3 className="text-xl font-bold text-foreground">Không tìm thấy khoá học</h3>
        <p className="text-muted-foreground mt-2">Đường dẫn khoá học không chính xác hoặc đã bị ẩn.</p>
        <Link to="/courses" className="mt-4 inline-block">
          <Button className="btn-premium rounded-xl">Quay lại Khoá Học</Button>
        </Link>
      </div>
    );
  }

  // Check VIP access logic on Client to render appropriate Player overlay
  const hasAccess =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER" ||
    course.isPremium === false ||
    user?.isPremium === true;

  const isLocked = activeLesson && !activeLesson.isFree && !hasAccess;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/courses" className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {course.category?.name || "E-Learning"}
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-foreground truncate max-w-[280px] sm:max-w-lg mt-0.5 leading-none">
              {course.title}
            </h1>
          </div>
        </div>

        {course.isPremium && !user?.isPremium && (
          <Link to="/premium">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Nâng Cấp Premium</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Main split player layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Video & Description */}
        <div className="flex-1 flex flex-col bg-card/20 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Player Box */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-black relative shadow-xl">
            {isLocked ? (
              /* Locked VIP Overlay */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white z-20">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-amber-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Crown className="w-5 h-5 fill-current" />
                  Bài học VIP giới hạn
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mt-2 font-medium leading-relaxed">
                  Bài học này nằm trong khoá học chuyên sâu Premium. Vui lòng đăng ký tài khoản VIP để mở khoá bài giảng này và các tính năng đặc quyền khác.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Link to="/premium">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs px-5 shadow-lg">
                      Nâng Cấp Premium Ngay
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link to="/login">
                      <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 rounded-xl text-xs">
                        Đăng Nhập
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Elegant Mode Toggle Toolbar if both video and doc are available */}
                {activeLesson?.videoUrl && activeLesson?.googleDocUrl && (
                  <div className="absolute top-3 right-3 z-30 flex items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-1 gap-1 shadow-lg">
                    <button
                      onClick={() => setPlayerMode("video")}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        playerMode === "video"
                          ? "bg-primary text-primary-foreground animate-none"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <Tv className="w-3 h-3" />
                      <span>Video</span>
                    </button>
                    <button
                      onClick={() => setPlayerMode("doc")}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        playerMode === "doc"
                          ? "bg-primary text-primary-foreground animate-none"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Tài Liệu</span>
                    </button>
                  </div>
                )}

                {playerMode === "video" && activeLesson?.videoUrl ? (
                  /* YouTube Embed Video Player */
                  <iframe
                    src={getYoutubeEmbedUrl(activeLesson.videoUrl)}
                    title={activeLesson.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : playerMode === "doc" && activeLesson?.googleDocUrl ? (
                  /* Google Doc Iframe Embed */
                  <iframe
                    src={activeLesson.googleDocUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0 absolute inset-0 bg-white"
                    allowFullScreen
                  />
                ) : activeLesson?.videoUrl ? (
                  /* YouTube Embed Video Player (Fallback) */
                  <iframe
                    src={getYoutubeEmbedUrl(activeLesson.videoUrl)}
                    title={activeLesson.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeLesson?.googleDocUrl ? (
                  /* Google Doc Iframe Embed (Fallback) */
                  <iframe
                    src={activeLesson.googleDocUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0 absolute inset-0 bg-white"
                    allowFullScreen
                  />
                ) : (
                  /* Video & Doc Not Available Fallback */
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-neutral-950 text-muted-foreground z-10">
                    <Tv className="w-12 h-12 mb-3 opacity-60 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">Không có Bài Giảng</h4>
                    <p className="text-xs mt-1 max-w-xs">Bài học này hiện chưa đính kèm Video bài giảng hoặc Tài liệu Google Doc.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Next / Prev Quick Controls */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateLesson("prev")}
              disabled={activeIndex <= 0}
              className="rounded-xl border-border font-bold text-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Bài trước
            </Button>
            <span className="text-xs font-bold text-muted-foreground">
              Bài {activeIndex + 1} / {flatLessons.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateLesson("next")}
              disabled={activeIndex >= flatLessons.length - 1}
              className="rounded-xl border-border font-bold text-xs cursor-pointer"
            >
              Bài tiếp theo <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          {/* Tabs header: Content / Info */}
          <div className="flex gap-2 border-b border-border pb-px">
            <button
              onClick={() => setActiveTab("video")}
              className={`pb-3 text-sm font-extrabold px-1 transition-all border-b-2 cursor-pointer ${
                activeTab === "video"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Nội Dung Bài Học
              </span>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-3 text-sm font-extrabold px-1 transition-all border-b-2 cursor-pointer ${
                activeTab === "info"
                  ? "border-transparent text-primary" // style toggle placeholder
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Mô Tả Khoá Học
              </span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="bg-card/45 p-6 rounded-2xl border border-border/70 backdrop-blur-xs flex-1">
            {activeTab === "video" ? (
              <div>
                <h2 className="text-lg font-black text-foreground font-heading">
                  {activeLesson?.title || "Chọn bài học để bắt đầu"}
                </h2>
                <div className="text-sm font-medium leading-relaxed text-muted-foreground mt-4 space-y-3">
                  {isLocked ? (
                    <p className="text-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs font-semibold">
                      🔒 Vui lòng nâng cấp Premium để đọc nội dung lý thuyết chi tiết của bài học này!
                    </p>
                  ) : activeLesson?.content ? (
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none font-sans"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
                    />
                  ) : (
                    <p className="italic text-xs text-muted-foreground">Bài học này chưa có tài liệu đính kèm.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-foreground">Về Khoá Học</h3>
                <p className="text-sm font-semibold text-muted-foreground leading-relaxed mt-3">
                  {course.description || "Chưa có mô tả chi tiết cho khoá học này."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Syllabus Navigation Sidebar */}
        <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col h-full">
          <div className="p-4 border-b border-border bg-card/65 backdrop-blur-xs">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" /> Giáo trình khoá học
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {course.chapters.map((ch, chIdx) => {
              const isExpanded = !!expandedChapters[ch.id];
              return (
                <div key={ch.id} className="bg-card/30">
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(ch.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[10px] font-black text-primary uppercase tracking-wider">
                        Chương {chIdx + 1}
                      </p>
                      <h4 className="text-xs font-extrabold text-foreground truncate mt-0.5 leading-tight">
                        {ch.title}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {/* Chapter Lessons List */}
                  {isExpanded && (
                    <div className="bg-card/5 border-t border-border/50 divide-y divide-border/40">
                      {ch.lessons.length === 0 ? (
                        <div className="p-4 text-center text-[10px] text-muted-foreground font-semibold italic">
                          Chương học này trống
                        </div>
                      ) : (
                        ch.lessons.map((lesson) => {
                          const isActive = activeLesson?.id === lesson.id;
                          const lessonLocked = !lesson.isFree && !hasAccess;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full flex items-center justify-between px-5 py-3.5 transition-all text-left cursor-pointer ${
                                isActive
                                  ? "bg-primary/10 border-l-2 border-primary text-primary"
                                  : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                {lessonLocked ? (
                                  <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Play className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isActive ? "text-primary animate-pulse" : "text-muted-foreground/60"}`} />
                                )}
                                <span className={`text-xs font-bold leading-tight truncate ${isActive ? "font-extrabold" : ""}`}>
                                  {lesson.title}
                                </span>
                              </div>

                              {lesson.isFree && !isActive && (
                                <span className="text-[9px] font-black uppercase text-violet-500 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20 leading-none">
                                  Học thử
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
