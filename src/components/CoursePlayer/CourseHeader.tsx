import React from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Crown, PanelRightClose, PanelRightOpen } from 'lucide-react'
import type { ICourseDetails } from '@/types/CoursePlayer'


interface CourseHeaderProps {
  course: ICourseDetails
  user: any
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (v: boolean) => void
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  user,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}) => {
  return (
    <div className='border-b border-border bg-card/50 backdrop-blur-md px-6 py-4 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Link
          to='/courses'
          className='w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-muted/50 transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <span className='text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20'>
            {course.category?.name || 'E-Learning'}
          </span>
          <h1 className='text-sm sm:text-base font-extrabold text-foreground truncate max-w-[280px] sm:max-w-lg mt-0.5 leading-none'>
            {course.title}
          </h1>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className='hidden lg:flex items-center gap-1.5 rounded-xl border-border font-bold text-xs h-9 cursor-pointer hover:bg-muted/50 transition-all'
        >
          {isSidebarCollapsed ? (
            <>
              <PanelRightOpen className='w-4 h-4 text-primary animate-pulse' />
              <span>Hiện giáo trình</span>
            </>
          ) : (
            <>
              <PanelRightClose className='w-4 h-4 text-muted-foreground' />
              <span>Ẩn giáo trình</span>
            </>
          )}
        </Button>

        {course.isPremium && !user?.isPremium && (
          <Link to='/premium'>
            <Button
              size='sm'
              className='bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs h-9 rounded-xl shadow-md flex items-center gap-1'
            >
              <Crown className='w-3.5 h-3.5 fill-current' />
              <span>Nâng Cấp Premium</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
