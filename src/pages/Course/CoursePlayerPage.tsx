import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { callFetchCourseDetails, callFetchLessonDetails, callToggleLessonProgress } from '@/config/api'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/ui/button'
import {
  Lock,
  Crown,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Tv,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import Loading from '@/components/Layout/Loading'
import ReactPlayer from 'react-player'
import { CourseHeader } from '@/components/CoursePlayer/CourseHeader'
import { CourseSidebar } from '@/components/CoursePlayer/CourseSidebar'
import { CourseTabArea } from '@/components/CoursePlayer/CourseTabArea'
import type { ICourseDetails, ILesson } from '@/types/CoursePlayer'




export const CoursePlayerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { user, isAuthenticated } = useAppSelector((state) => state.account)
  const [course, setCourse] = useState<ICourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'video' | 'info' | 'notes'>('video')
  const [playerMode, setPlayerMode] = useState<'video' | 'doc'>('video')
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [notesText, setNotesText] = useState('')
  const [hasWatchedEnough, setHasWatchedEnough] = useState(false)

  const handleLessonSelect = async (lesson: ILesson) => {
    try {
      setHasWatchedEnough(false)
      const res = await callFetchLessonDetails(lesson.id)
      if (res.data && res.data.data) {
        setActiveLesson(res.data.data)
      } else {
        setActiveLesson(lesson)
      }
    } catch (error) {
      console.error('Failed to fetch lesson details', error)
      setActiveLesson(lesson)
    }
  }

  // Load lesson notes when active lesson changes
  useEffect(() => {
    if (activeLesson) {
      const stored = localStorage.getItem('luyenthi-lesson-notes')
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Record<string, string>
          setNotesText(parsed[activeLesson.id] || '')
        } catch (e) {
          console.error(e)
        }
      } else {
        setNotesText('')
      }
    }
  }, [activeLesson])

  // Handle saving notes
  const handleSaveNotes = (text: string) => {
    if (!activeLesson) return
    setNotesText(text)

    const stored = localStorage.getItem('luyenthi-lesson-notes')
    let notesMap: Record<string, string> = {}
    if (stored) {
      try {
        notesMap = JSON.parse(stored)
      } catch (e) {
        console.error(e)
      }
    }
    notesMap[activeLesson.id] = text
    localStorage.setItem('luyenthi-lesson-notes', JSON.stringify(notesMap))
  }

  // Export notes to txt file
  const downloadNotes = () => {
    if (!activeLesson || !notesText.trim()) return
    const element = document.createElement('a')
    const file = new Blob(
      [
        `GHI CHÚ HỌC TẬP - LUYỆN THI PRO\n`,
        `Khóa học: ${course?.title}\n`,
        `Bài học: ${activeLesson.title}\n`,
        `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n`,
        `-------------------------------------------\n\n`,
        notesText
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    element.href = URL.createObjectURL(file)
    element.download = `GhiChu_${activeLesson.title.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Đã xuất file ghi chú thành công!')
  }

  // Load completed lessons from LocalStorage when course details load
  useEffect(() => {
    if (course) {
      const stored = localStorage.getItem('luyenthi-watched-progress')
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Record<string, string[]>
          if (parsed[course.slug]) {
            setCompletedLessons(parsed[course.slug])
          }
        } catch (e) {
          console.error('Error reading watched progress:', e)
        }
      }
    }
  }, [course])

  // Toggle lesson completion state
  const toggleLessonCompletion = async (lessonId: string) => {
    if (!course) return

    let updated: string[]
    const isNowCompleted = !completedLessons.includes(lessonId)

    if (isNowCompleted) {
      updated = [...completedLessons, lessonId]
      toast.success('Chúc mừng! Bạn đã hoàn thành bài học này. 🎉')
    } else {
      updated = completedLessons.filter((id) => id !== lessonId)
      toast.success('Đã hủy đánh dấu hoàn thành bài học.')
    }

    setCompletedLessons(updated)

    // Fire API call in background
    if (isAuthenticated) {
      callToggleLessonProgress(lessonId).catch((err) => {
        console.error('Failed to sync lesson progress', err)
      })
    }

    setCompletedLessons(updated)

    // Save to LocalStorage
    const stored = localStorage.getItem('luyenthi-watched-progress')
    let progressMap: Record<string, string[]> = {}
    if (stored) {
      try {
        progressMap = JSON.parse(stored)
      } catch (e) {
        console.error(e)
      }
    }
    progressMap[course.slug] = updated
    localStorage.setItem('luyenthi-watched-progress', JSON.stringify(progressMap))
  }

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return
      setLoading(true)
      try {
        const res = await callFetchCourseDetails(slug)
        if (res.data && res.data.data) {
          const courseData = res.data.data as ICourseDetails
          setCourse(courseData)

          // Load completed lessons from LocalStorage synchronously
          let completedIds: string[] = []
          const stored = localStorage.getItem('luyenthi-watched-progress')
          if (stored) {
            try {
              const parsed = JSON.parse(stored) as Record<string, string[]>
              if (parsed[courseData.slug]) {
                completedIds = parsed[courseData.slug]
              }
            } catch (e) {
              console.error('Error reading watched progress:', e)
            }
          }
          setCompletedLessons(completedIds)

          // Find first UNWATCHED lesson to auto-select
          let targetLesson: ILesson | null = null
          let targetChapterId: string | null = null
          const initialExpanded: Record<string, boolean> = {}

          if (courseData.chapters && courseData.chapters.length > 0) {
            // Flatten all lessons
            const flat: { lesson: ILesson; chapterId: string }[] = []
            courseData.chapters.forEach((ch) => {
              ch.lessons.forEach((l) => {
                flat.push({ lesson: l, chapterId: ch.id })
              })
            })

            // Find first unwatched lesson
            const firstUnwatched = flat.find((item) => !completedIds.includes(item.lesson.id))

            if (firstUnwatched) {
              targetLesson = firstUnwatched.lesson
              targetChapterId = firstUnwatched.chapterId
            } else if (flat.length > 0) {
              // If all lessons are already watched, default to the first lesson
              targetLesson = flat[0].lesson
              targetChapterId = flat[0].chapterId
            }

            // Expand only the chapter containing the active lesson
            courseData.chapters.forEach((ch) => {
              initialExpanded[ch.id] = targetChapterId ? ch.id === targetChapterId : false
            })
          }

          setExpandedChapters(initialExpanded)
          if (targetLesson) {
            handleLessonSelect(targetLesson)
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err)
        toast.error('Không thể tải thông tin bài học!')
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [slug])

  // Auto detect best media player view mode
  useEffect(() => {
    if (activeLesson) {
      console.log('🔍 [DEBUG] activeLesson.videoUrl:', activeLesson.videoUrl)
      console.log('🔍 [DEBUG] ReactPlayer component:', ReactPlayer)

      if (activeLesson.videoUrl) {
        setPlayerMode('video')
      } else if (activeLesson.googleDocUrl) {
        setPlayerMode('doc')
      }
    }
  }, [activeLesson])

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  // Convert any YouTube link format to a standard watch URL for ReactPlayer
  const getStandardYoutubeUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.includes('youtube.com/watch?v=')) return url
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/watch?v=${match[2]}`
    }
    return url
  }

  // Navigation: find next or previous lessons in the flat curriculum order
  const getFlatLessons = (): { lesson: ILesson; chapterId: string }[] => {
    if (!course) return []
    const list: { lesson: ILesson; chapterId: string }[] = []
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        list.push({ lesson: l, chapterId: ch.id })
      })
    })
    return list
  }

  const isLessonSequentiallyLocked = (lessonId: string): boolean => {
    const flat = getFlatLessons()
    const index = flat.findIndex((item) => item.lesson.id === lessonId)
    if (index <= 0) return false
    const prevLessonId = flat[index - 1].lesson.id
    return !completedLessons.includes(prevLessonId)
  }

  const navigateLesson = (direction: 'next' | 'prev') => {
    const flat = getFlatLessons()
    if (!activeLesson || flat.length === 0) return
    const currentIndex = flat.findIndex((item) => item.lesson.id === activeLesson.id)

    if (direction === 'next' && currentIndex < flat.length - 1) {
      const nextItem = flat[currentIndex + 1]
      if (isLessonSequentiallyLocked(nextItem.lesson.id)) {
        toast.error('Vui lòng hoàn thành bài học hiện tại để học tiếp!')
        return
      }
      handleLessonSelect(nextItem.lesson)
      // Auto expand next chapter if collapsed
      setExpandedChapters((prev) => ({ ...prev, [nextItem.chapterId]: true }))
    } else if (direction === 'prev' && currentIndex > 0) {
      const prevItem = flat[currentIndex - 1]
      handleLessonSelect(prevItem.lesson)
      // Auto expand prev chapter if collapsed
      setExpandedChapters((prev) => ({ ...prev, [prevItem.chapterId]: true }))
    }
  }

  const flatLessons = getFlatLessons()
  const activeIndex = activeLesson ? flatLessons.findIndex((item) => item.lesson.id === activeLesson.id) : -1

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Loading />
      </div>
    )
  }

  if (!course) {
    return (
      <div className='min-h-screen bg-background py-20 text-center'>
        <h3 className='text-xl font-bold text-foreground'>Không tìm thấy khoá học</h3>
        <p className='text-muted-foreground mt-2'>Đường dẫn khoá học không chính xác hoặc đã bị ẩn.</p>
        <Link to='/courses' className='mt-4 inline-block'>
          <Button className='btn-premium rounded-xl'>Quay lại Khoá Học</Button>
        </Link>
      </div>
    )
  }

  // Check VIP access logic on Client to render appropriate Player overlay
  const hasAccess =
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'MANAGER' ||
    course.isPremium === false ||
    user?.isPremium === true

  const isLocked = activeLesson && !activeLesson.isFree && !hasAccess

  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      <CourseHeader
        course={course}
        user={user}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main split player layout */}
      <div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
        {/* Left Side: Video & Description */}
        <div className='flex-1 flex flex-col bg-card/20 overflow-y-auto p-4 sm:p-6 space-y-6'>
          {/* Player Box */}
          <div className='aspect-video w-full rounded-2xl overflow-hidden border border-border bg-black relative shadow-xl'>
            {isLocked ? (
              /* Locked VIP Overlay */
              <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white z-20'>
                <div className='w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 animate-bounce'>
                  <Lock className='w-7 h-7' />
                </div>
                <h3 className='text-lg sm:text-xl font-black text-amber-500 uppercase tracking-wide flex items-center gap-1.5'>
                  <Crown className='w-5 h-5 fill-current' />
                  Bài học VIP giới hạn
                </h3>
                <p className='text-xs sm:text-sm text-neutral-300 max-w-md mt-2 font-medium leading-relaxed'>
                  Bài học này nằm trong khoá học chuyên sâu Premium. Vui lòng đăng ký tài khoản VIP để mở khoá bài giảng
                  này và các tính năng đặc quyền khác.
                </p>
                <div className='mt-6 flex flex-wrap gap-3 justify-center'>
                  <Link to='/premium'>
                    <Button className='bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs px-5 shadow-lg'>
                      Nâng Cấp Premium Ngay
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link to='/login'>
                      <Button
                        variant='outline'
                        className='border-neutral-700 text-white hover:bg-neutral-800 rounded-xl text-xs'
                      >
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
                  <div className='absolute top-3 right-3 z-30 flex items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-1 gap-1 shadow-lg'>
                    <button
                      onClick={() => setPlayerMode('video')}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${playerMode === 'video'
                        ? 'bg-primary text-primary-foreground animate-none'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <Tv className='w-3 h-3' />
                      <span>Video</span>
                    </button>
                    <button
                      onClick={() => setPlayerMode('doc')}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${playerMode === 'doc'
                        ? 'bg-primary text-primary-foreground animate-none'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <BookOpen className='w-3 h-3' />
                      <span>Tài Liệu</span>
                    </button>
                  </div>
                )}

                {playerMode === 'video' && activeLesson?.videoUrl ? (
                  <ReactPlayer
                    src={getStandardYoutubeUrl(activeLesson.videoUrl)}
                    width='100%'
                    height='100%'
                    controls
                    onTimeUpdate={(e) => {
                      const target = e.currentTarget
                      if (target.duration > 0) {
                        const played = target.currentTime / target.duration
                        if (played >= 0.5 && !hasWatchedEnough) {
                          setHasWatchedEnough(true)
                        }
                      }
                    }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                ) : playerMode === 'doc' && activeLesson?.googleDocUrl ? (
                  /* Google Doc Iframe Embed */
                  <iframe
                    src={activeLesson.googleDocUrl}
                    title={activeLesson.title}
                    className='w-full h-full border-0 absolute inset-0 bg-white'
                    allowFullScreen
                  />
                ) : activeLesson?.videoUrl ? (
                  /* YouTube Embed Video Player (Fallback) */
                  <ReactPlayer
                    src={getStandardYoutubeUrl(activeLesson.videoUrl)}
                    width='100%'
                    height='100%'
                    controls
                    onTimeUpdate={(e) => {
                      const target = e.currentTarget
                      if (target.duration > 0) {
                        const played = target.currentTime / target.duration
                        if (played >= 0.5 && !hasWatchedEnough) {
                          setHasWatchedEnough(true)
                        }
                      }
                    }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                ) : activeLesson?.googleDocUrl ? (
                  /* Google Doc Iframe Embed (Fallback) */
                  <iframe
                    src={activeLesson.googleDocUrl}
                    title={activeLesson.title}
                    className='w-full h-full border-0 absolute inset-0 bg-white'
                    allowFullScreen
                  />
                ) : (
                  /* Video & Doc Not Available Fallback */
                  <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-neutral-950 text-muted-foreground z-10'>
                    <Tv className='w-12 h-12 mb-3 opacity-60 text-primary' />
                    <h4 className='text-sm font-bold text-foreground'>Không có Bài Giảng</h4>
                    <p className='text-xs mt-1 max-w-xs'>
                      Bài học này hiện chưa đính kèm Video bài giảng hoặc Tài liệu Google Doc.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Next / Prev Quick Controls */}
          <div className='flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateLesson('prev')}
              disabled={activeIndex <= 0}
              className='rounded-xl border-border font-bold text-xs cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4 mr-1.5' /> Bài trước
            </Button>

            {activeLesson && (
              <Button
                variant={completedLessons.includes(activeLesson.id) ? 'default' : 'outline'}
                size='sm'
                onClick={() => toggleLessonCompletion(activeLesson.id)}
                disabled={!completedLessons.includes(activeLesson.id) && playerMode === 'video' && !hasWatchedEnough}
                className={`rounded-xl font-bold text-xs cursor-pointer transition-all duration-300 ${completedLessons.includes(activeLesson.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:text-white shadow-md shadow-emerald-600/10'
                  : 'border-border hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30'
                  }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 mr-1.5 ${completedLessons.includes(activeLesson.id) ? 'fill-white text-emerald-600' : ''}`}
                />
                <span>{completedLessons.includes(activeLesson.id) ? 'Đã Hoàn Thành' : (playerMode === 'video' && !hasWatchedEnough ? 'Xem 50% Video để Hoàn Thành' : 'Đánh Dấu Hoàn Thành')}</span>
              </Button>
            )}

            <span className='text-xs font-bold text-muted-foreground hidden sm:inline-block'>
              Bài {activeIndex + 1} / {flatLessons.length}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateLesson('next')}
              disabled={
                activeIndex >= flatLessons.length - 1 ||
                (activeIndex >= 0 &&
                  activeIndex < flatLessons.length - 1 &&
                  isLessonSequentiallyLocked(flatLessons[activeIndex + 1].lesson.id))
              }
              className='rounded-xl border-border font-bold text-xs cursor-pointer'
            >
              Bài tiếp theo <ArrowRight className='w-4 h-4 ml-1.5' />
            </Button>
          </div>

          {/* Tabs header: Content / Info / Notes */}
          <CourseTabArea
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeLesson={activeLesson}
            course={course}
            isLocked={isLocked}
            notesText={notesText}
            handleSaveNotes={handleSaveNotes}
            downloadNotes={downloadNotes}
          />
        </div>

        {/* Right Side: Syllabus Navigation Sidebar */}
        {!isSidebarCollapsed && (
          <CourseSidebar
            course={course}
            expandedChapters={expandedChapters}
            toggleChapter={toggleChapter}
            activeLesson={activeLesson}
            handleLessonSelect={handleLessonSelect}
            completedLessons={completedLessons}
            flatLessons={flatLessons}
            hasAccess={hasAccess}
            isLessonSequentiallyLocked={isLessonSequentiallyLocked}
          />
        )}
      </div>
    </div>
  )
}
