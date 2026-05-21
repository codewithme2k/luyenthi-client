import React from 'react'
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, Lock, Play } from 'lucide-react'

import { toast } from 'sonner'
import type { ICourseDetails, ILesson } from '@/types/CoursePlayer'

interface CourseSidebarProps {
  course: ICourseDetails
  expandedChapters: Record<string, boolean>
  toggleChapter: (id: string) => void
  activeLesson: ILesson | null
  handleLessonSelect: (lesson: ILesson) => void
  completedLessons: string[]
  flatLessons: { lesson: ILesson; chapterId: string }[]
  hasAccess: boolean
  isLessonSequentiallyLocked: (id: string) => boolean
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  expandedChapters,
  toggleChapter,
  activeLesson,
  handleLessonSelect,
  completedLessons,
  flatLessons,
  hasAccess,
  isLessonSequentiallyLocked
}) => {
  return (
    <div className='w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col h-full transition-all duration-300 animate-in slide-in-from-right'>
      <div className='p-4 border-b border-border bg-card/65 backdrop-blur-xs'>
        <h3 className='text-xs font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5'>
          <BookOpen className='w-4 h-4 text-primary' /> Giáo trình khoá học
        </h3>

        {/* Elegant Progress Bar */}
        {flatLessons.length > 0 && (
          <div className='mt-3 bg-muted/40 rounded-xl p-3 border border-border/50'>
            <div className='flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5'>
              <span>Tiến độ học tập</span>
              <span className='text-primary font-black'>
                {Math.round((completedLessons.length / flatLessons.length) * 100)}% ({completedLessons.length}/
                {flatLessons.length})
              </span>
            </div>
            <div className='w-full h-1.5 bg-muted dark:bg-neutral-800 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out rounded-full'
                style={{ width: `${(completedLessons.length / flatLessons.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className='flex-1 overflow-y-auto divide-y divide-border'>
        {course.chapters.map((ch, chIdx) => {
          const isExpanded = !!expandedChapters[ch.id]
          return (
            <div key={ch.id} className='bg-card/30'>
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(ch.id)}
                className='w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer text-left'
              >
                <div className='flex-1 min-w-0 pr-2'>
                  <p className='text-[10px] font-black text-primary uppercase tracking-wider'>Chương {chIdx + 1}</p>
                  <h4 className='text-xs font-extrabold text-foreground truncate mt-0.5 leading-tight'>{ch.title}</h4>
                </div>
                {isExpanded ? (
                  <ChevronDown className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                ) : (
                  <ChevronRight className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                )}
              </button>

              {/* Chapter Lessons List */}
              {isExpanded && (
                <div className='bg-card/5 border-t border-border/50 divide-y divide-border/40'>
                  {ch.lessons.length === 0 ? (
                    <div className='p-4 text-center text-[10px] text-muted-foreground font-semibold italic'>
                      Chương học này trống
                    </div>
                  ) : (
                    ch.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id
                      const lessonLocked = !lesson.isFree && !hasAccess
                      const seqLocked = isLessonSequentiallyLocked(lesson.id)
                      const isDone = completedLessons.includes(lesson.id)

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (seqLocked) {
                              toast.error('Vui lòng hoàn thành bài học trước đó để mở khoá!')
                              return
                            }
                            handleLessonSelect(lesson)
                          }}
                          className={`w-full flex items-center justify-between px-5 py-3.5 transition-all text-left ${seqLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isActive
                            ? 'bg-primary/10 border-l-2 border-primary text-primary'
                            : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          <div className='flex items-start gap-2.5 flex-1 min-w-0'>
                            {lessonLocked || seqLocked ? (
                              <Lock className='w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5' />
                            ) : isDone ? (
                              <CheckCircle2 className='w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5 fill-emerald-500/10' />
                            ) : (
                              <Play
                                className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isActive ? 'text-primary animate-pulse' : 'text-muted-foreground/60'}`}
                              />
                            )}
                            <span
                              className={`text-xs font-bold leading-tight truncate ${isActive ? 'font-extrabold' : ''} ${isDone ? 'text-muted-foreground/60 line-through decoration-muted-foreground/45 font-medium' : ''}`}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          {lesson.isFree && !isActive && !isDone && (
                            <span className='text-[9px] font-black uppercase text-violet-500 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20 leading-none'>
                              Học thử
                            </span>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
