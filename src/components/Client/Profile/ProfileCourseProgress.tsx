import { Compass, BookOpen, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { NavigateFunction } from 'react-router'

interface CourseProgress {
  id: string
  title: string
  thumbnail: string | null
  slug: string
  progress: {
    completed: number
    total: number
    percentage: number
  }
}

interface Props {
  courses: CourseProgress[]
  summary: {
    examsCompleted: number
    coursesStarted: number
    lessonsCompleted: number
  }
  navigate: NavigateFunction
}

export default function ProfileCourseProgress({ courses, summary, navigate }: Props) {
  if (!courses || courses.length === 0) {
    return (
      <div className='bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs'>
        <Compass className='w-12 h-12 mx-auto mb-3 text-muted-foreground/60 animate-pulse' />
        <h3 className='text-lg font-bold text-foreground'>Chưa bắt đầu khóa học nào</h3>
        <p className='text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed'>
          Bạn chưa tham gia học khóa học nào. Hãy quay lại danh sách Khóa Học để bắt đầu hành trình của mình!
        </p>
        <Button onClick={() => navigate('/courses')} className='mt-6 font-bold rounded-xl'>
          Khám Phá Khóa Học
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0'>
            <BookOpen className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>
              Khóa Học Đang Tham Gia
            </span>
            <p className='text-xl font-black text-foreground mt-0.5'>{summary.coursesStarted}</p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0'>
            <CheckCircle className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>
              Bài Học Đã Hoàn Thành
            </span>
            <p className='text-xl font-black text-emerald-500 mt-0.5'>{summary.lessonsCompleted}</p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0'>
            <Compass className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>
              Đề Thi Đã Chinh Phục
            </span>
            <p className='text-xl font-black text-amber-500 mt-0.5'>{summary.examsCompleted}</p>
          </div>
        </div>
      </div>

      <div className='bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4'>
        <h3 className='text-base font-extrabold font-heading text-foreground mb-4 flex items-center gap-2'>
          <BookOpen className='text-primary w-5 h-5' /> Khóa học của bạn
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {courses.map((course) => (
            <div
              key={course.id}
              className='flex items-center gap-4 p-4 border border-border rounded-2xl bg-muted/10 hover:bg-muted/30 transition-colors'
            >
              <div className='w-24 h-16 shrink-0 bg-muted rounded-xl overflow-hidden'>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                    <BookOpen className='w-6 h-6' />
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-bold text-foreground truncate mb-1'>{course.title}</h4>
                <div className='flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-2'>
                  <span>
                    Hoàn thành {course.progress.completed}/{course.progress.total} bài học
                  </span>
                  <span className='text-primary'>{course.progress.percentage}%</span>
                </div>
                <Progress value={course.progress.percentage} className='h-1.5' />
              </div>
              <Button onClick={() => navigate(`/courses/${course.slug}`)} variant='outline' size='sm' className='shrink-0 rounded-xl cursor-pointer'>
                Tiếp tục học
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
