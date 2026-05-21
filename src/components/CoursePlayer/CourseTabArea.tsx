import React from 'react'
import { Clipboard, FileText, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ICourseDetails, ILesson } from '@/types/CoursePlayer'

interface CourseTabAreaProps {
  activeTab: 'video' | 'info' | 'notes'
  setActiveTab: (tab: 'video' | 'info' | 'notes') => void
  activeLesson: ILesson | null
  course: ICourseDetails
  isLocked: boolean | null
  notesText: string
  handleSaveNotes: (text: string) => void
  downloadNotes: () => void
}

export const CourseTabArea: React.FC<CourseTabAreaProps> = ({
  activeTab,
  setActiveTab,
  activeLesson,
  course,
  isLocked,
  notesText,
  handleSaveNotes,
  downloadNotes
}) => {
  return (
    <>
      {/* Tabs header: Content / Info / Notes */}
      <div className='flex gap-2 border-b border-border pb-px overflow-x-auto scrollbar-none'>
        <button
          onClick={() => setActiveTab('video')}
          className={`pb-3 text-sm font-extrabold px-1 transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'video' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <span className='flex items-center gap-1.5'>
            <FileText className='w-4 h-4' /> Nội Dung Bài Học
          </span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 text-sm font-extrabold px-1 transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <span className='flex items-center gap-1.5'>
            <Clipboard className='w-4 h-4' /> Sổ Tay Ghi Chú
          </span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-sm font-extrabold px-1 transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <span className='flex items-center gap-1.5'>
            <HelpCircle className='w-4 h-4' /> Mô Tả Khoá Học
          </span>
        </button>
      </div>

      {/* Tab Body */}
      <div className='bg-card/45 p-6 rounded-2xl border border-border/70 backdrop-blur-xs flex-1'>
        {activeTab === 'video' ? (
          <div>
            <h2 className='text-lg font-black text-foreground font-heading'>
              {activeLesson?.title || 'Chọn bài học để bắt đầu'}
            </h2>
            <div className='text-sm font-medium leading-relaxed text-muted-foreground mt-4 space-y-3'>
              {isLocked ? (
                <p className='text-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs font-semibold'>
                  🔒 Vui lòng nâng cấp Premium để đọc nội dung lý thuyết chi tiết của bài học này!
                </p>
              ) : activeLesson?.content ? (
                <div
                  className='prose prose-sm dark:prose-invert max-w-none font-sans'
                  dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                />
              ) : (
                <p className='italic text-xs text-muted-foreground'>Bài học này chưa có tài liệu đính kèm.</p>
              )}
            </div>
          </div>
        ) : activeTab === 'notes' && activeLesson ? (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-extrabold text-foreground flex items-center gap-1.5 leading-none'>
                <Clipboard className='w-4 h-4 text-indigo-500' /> Ghi chú học tập
              </h3>
              <Button
                variant='outline'
                size='sm'
                onClick={downloadNotes}
                disabled={!notesText.trim()}
                className='rounded-xl text-[10px] h-7 px-3.5 font-bold border-border/80 hover:bg-indigo-500/10 hover:text-indigo-500 cursor-pointer'
              >
                Tải File Ghi Chú (.txt)
              </Button>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => handleSaveNotes(e.target.value)}
              placeholder='Ghi nhanh công thức, từ vựng hoặc kiến thức cốt lõi của bài học này tại đây... Hệ thống sẽ tự động lưu lại cho bạn!'
              className='w-full h-40 rounded-2xl bg-background/50 border border-border/80 p-3.5 text-xs font-semibold leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-muted-foreground/60 resize-none shadow-inner'
            />
            <div className='text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5'>
              <span className='relative flex h-1.5 w-1.5'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500'></span>
              </span>
              <span>Đã tự động lưu ghi chú</span>
            </div>
          </div>
        ) : (
          <div>
            <h3 className='text-base font-bold text-foreground'>Về Khoá Học</h3>
            <p className='text-sm font-semibold text-muted-foreground leading-relaxed mt-3'>
              {course.description || 'Chưa có mô tả chi tiết cho khoá học này.'}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
