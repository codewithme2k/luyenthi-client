import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { callGetUserProgressById } from '@/config/api'
import Loading from '@/components/Layout/Loading'
import { BookOpen, Target, CheckCircle } from 'lucide-react'
import type { IUser } from '@/types/backend'

interface UserProgressModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  user: IUser | null
}

export default function UserProgressModal({ open, setOpen, user }: UserProgressModalProps) {
  const [loading, setLoading] = useState(false)
  const [progressData, setProgressData] = useState<any>(null)

  useEffect(() => {
    if (open && user?.id) {
      setLoading(true)
      callGetUserProgressById(user.id)
        .then((res) => {
          if (res?.data?.data) {
            setProgressData(res.data.data)
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setProgressData(null)
    }
  }, [open, user?.id])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-7xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 border-border/60 shadow-2xl backdrop-blur-xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-black text-foreground flex items-center gap-2'>
            <Target className='w-6 h-6 text-primary' /> Tiến độ học tập
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Báo cáo chi tiết tiến trình học của học viên <strong className='text-foreground'>{user?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='py-20 flex justify-center'>
            <Loading />
          </div>
        ) : !progressData ? (
          <div className='py-10 text-center text-muted-foreground italic text-sm'>
            Không tìm thấy dữ liệu học tập.
          </div>
        ) : (
          <div className='space-y-8 mt-4'>
            {/* Summary Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div className='bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner hover:shadow-primary/10 transition-all duration-300'>
                <span className='text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1.5 opacity-90'>Khoá đã học</span>
                <span className='text-4xl font-black text-foreground drop-shadow-sm'>{progressData.summary.coursesStarted}</span>
              </div>
              <div className='bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner hover:shadow-emerald-500/10 transition-all duration-300'>
                <span className='text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-1.5 opacity-90'>Bài đã xem</span>
                <span className='text-4xl font-black text-foreground drop-shadow-sm'>{progressData.summary.lessonsCompleted}</span>
              </div>
              <div className='bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner hover:shadow-indigo-500/10 transition-all duration-300'>
                <span className='text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-1.5 opacity-90'>Bài thi đã làm</span>
                <span className='text-4xl font-black text-foreground drop-shadow-sm'>{progressData.summary.examsCompleted}</span>
              </div>
            </div>

            {/* Courses Progress */}
            <div>
              <h3 className='text-sm font-extrabold flex items-center gap-2 mb-4 uppercase tracking-widest text-muted-foreground'>
                <BookOpen className='w-4 h-4' /> Khoá học đang tham gia
              </h3>

              {progressData.courses && progressData.courses.length > 0 ? (
                <div className='space-y-4'>
                  {progressData.courses.map((course: any) => (
                    <div key={course.id} className='bg-card/40 hover:bg-card/60 transition-colors duration-300 border border-border/80 p-5 rounded-2xl flex items-center gap-5 shadow-sm'>
                      <div className='w-24 h-16 bg-muted rounded-xl overflow-hidden border border-border flex-shrink-0 shadow-inner'>
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-primary/5 text-primary'>
                            <BookOpen className='w-6 h-6 opacity-50' />
                          </div>
                        )}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h4 className='font-bold text-sm truncate'>{course.title}</h4>
                        <div className='mt-2.5 flex items-center gap-3'>
                          <div className='flex-1 h-2 bg-muted dark:bg-neutral-800 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-indigo-500 to-primary transition-all duration-1000'
                              style={{ width: `${course.progress.percentage}%` }}
                            />
                          </div>
                          <span className='text-xs font-black text-primary w-10 text-right'>
                            {course.progress.percentage}%
                          </span>
                        </div>
                        <p className='text-[10px] font-semibold text-muted-foreground mt-1'>
                          Đã học {course.progress.completed} / {course.progress.total} bài
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-muted/30 p-4 rounded-xl text-center text-xs font-medium text-muted-foreground border border-border/50'>
                  Học viên chưa tham gia khoá học nào.
                </div>
              )}
            </div>

            {/* Recent Exams */}
            <div>
              <h3 className='text-sm font-extrabold flex items-center gap-2 mb-4 uppercase tracking-widest text-muted-foreground'>
                <CheckCircle className='w-4 h-4' /> Lịch sử làm bài thi
              </h3>

              {progressData.exams && progressData.exams.length > 0 ? (
                <div className='space-y-3'>
                  {progressData.exams.slice(0, 5).map((session: any) => (
                    <div key={session.id} className='bg-card/40 hover:bg-card/60 transition-colors duration-300 border border-border/80 px-5 py-4 rounded-2xl flex items-center justify-between shadow-sm'>
                      <div>
                        <h4 className='font-bold text-sm text-foreground'>{session.exam?.title || 'Bài thi không xác định'}</h4>
                        <p className='text-[11px] text-muted-foreground mt-1 font-medium'>
                          {new Date(session.startTime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className='text-right'>
                        {session.isCompleted ? (
                          <span className='inline-block bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase'>
                            Điểm: {session.score ?? 0}
                          </span>
                        ) : (
                          <span className='inline-block bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase'>
                            Đang làm
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {progressData.exams.length > 5 && (
                    <div className='text-center mt-2'>
                      <span className='text-[10px] text-muted-foreground font-semibold'>Và {progressData.exams.length - 5} bài thi khác...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className='bg-muted/30 p-4 rounded-xl text-center text-xs font-medium text-muted-foreground border border-border/50'>
                  Học viên chưa làm bài thi nào.
                </div>
              )}
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
