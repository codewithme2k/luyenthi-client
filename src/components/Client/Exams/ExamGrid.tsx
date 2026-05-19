import React from 'react'
import { Filter, GraduationCap } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ExamCard } from './ExamCard'
import type { IExam } from '@/types/backend'

interface ExamGridProps {
  exams: IExam[]
  isExamsFetching: boolean
  limit: number
  totalExams: number
  onResetFilters: () => void
  onStartExam: (exam: IExam) => void
}

export const ExamGrid: React.FC<ExamGridProps> = ({
  exams,
  isExamsFetching,
  limit,
  totalExams,
  onResetFilters,
  onStartExam
}) => {
  return (
    <main className='container mx-auto px-6 max-w-6xl'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-bold font-heading flex items-center gap-2'>
            <GraduationCap className='w-5 h-5 text-primary' />
            Danh Sách Đề Thi
          </h2>
          <p className='text-xs text-muted-foreground font-medium mt-0.5'>{totalExams} đề thi khả dụng</p>
        </div>
      </div>

      {/* Loading State */}
      {isExamsFetching ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className='glass p-6 rounded-2xl h-64 space-y-4 animate-pulse'>
              <div className='flex justify-between'>
                <Skeleton className='h-5 w-20 rounded-md' />
                <Skeleton className='h-5 w-12 rounded-md' />
              </div>
              <Skeleton className='h-7 w-3/4 rounded-md' />
              <Skeleton className='h-12 w-full rounded-md' />
              <div className='flex gap-2'>
                <Skeleton className='h-8 flex-1 rounded-md' />
                <Skeleton className='h-8 flex-1 rounded-md' />
              </div>
            </div>
          ))}
        </div>
      ) : exams.length === 0 ? (
        /* Empty State */
        <div className='glass p-12 rounded-3xl text-center max-w-md mx-auto mt-8 flex flex-col items-center'>
          <div className='p-4 bg-muted rounded-full text-muted-foreground mb-4'>
            <Filter className='w-8 h-8' />
          </div>
          <h3 className='font-bold text-lg'>Không tìm thấy đề thi</h3>
          <p className='text-sm text-muted-foreground mt-2 max-w-xs mx-auto'>
            Không có đề thi nào phù hợp với tìm kiếm hoặc bộ lọc hiện tại của bạn. Vui lòng thử từ khóa khác.
          </p>
          <Button onClick={onResetFilters} variant='outline' className='mt-6 rounded-xl'>
            Đặt Lại Bộ Lọc
          </Button>
        </div>
      ) : (
        /* Dynamic Grid */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onStartExam={onStartExam} />
          ))}
        </div>
      )}
    </main>
  )
}
