import React from 'react'
import { Link, useLocation } from 'react-router'
import { BookOpen, Home, Crown, Trophy, GraduationCap, ChevronDown, Compass } from 'lucide-react'

export const Navigation: React.FC = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className='hidden md:flex items-center gap-1.5'>
      {/* 1. Trang Chủ */}
      <Link
        to='/'
        className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-300 border border-transparent ${
          currentPath === '/'
            ? 'bg-primary/10 text-primary border-primary/20 shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
      >
        <Home className='w-4 h-4' />
        <span>Trang Chủ</span>
      </Link>

      {/* 2. Học Tập & Ôn Thi (Dropdown) */}
      <div className='relative group py-2'>
        <button
          className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-all duration-300 cursor-pointer border border-transparent ${
            currentPath.startsWith('/courses') ||
            currentPath.startsWith('/course') ||
            currentPath.startsWith('/exams') ||
            currentPath.startsWith('/exam/')
              ? 'bg-primary/10 text-primary border-primary/20 shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <GraduationCap className='w-4 h-4 text-violet-500' />
          <span>Học Tập & Ôn Thi</span>
          <ChevronDown className='w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300' />
        </button>

        {/* Dropdown Container */}
        <div className='absolute top-full left-0 mt-1 w-80 rounded-2xl border border-border bg-card p-2 shadow-xl opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50'>
          <div className='space-y-1'>
            <Link to='/courses' className='flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors'>
              <div className='w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-500 flex-shrink-0'>
                <GraduationCap className='w-5 h-5' />
              </div>
              <div>
                <h4 className='text-xs font-black text-foreground'>Khoá Học E-Learning</h4>
                <p className='text-[10px] text-muted-foreground mt-0.5 leading-normal font-semibold'>
                  Bài giảng video sinh động kết hợp giáo án Google Doc và tài liệu VIP đính kèm.
                </p>
              </div>
            </Link>

            <Link to='/exams' className='flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors'>
              <div className='w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-500 flex-shrink-0'>
                <BookOpen className='w-5 h-5' />
              </div>
              <div>
                <h4 className='text-xs font-black text-foreground'>Kho Đề Thi Trắc Nghiệm</h4>
                <p className='text-[10px] text-muted-foreground mt-0.5 leading-normal font-semibold'>
                  Luyện đề thi THPT Quốc Gia, đề thi thử trường chuyên có đáp án chi tiết.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Cộng Đồng (Dropdown) */}
      <div className='relative group py-2'>
        <button
          className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-all duration-300 cursor-pointer border border-transparent ${
            currentPath.startsWith('/leaderboard') || currentPath.startsWith('/blog')
              ? 'bg-primary/10 text-primary border-primary/20 shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Compass className='w-4 h-4 text-emerald-500' />
          <span>Cộng Đồng</span>
          <ChevronDown className='w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300' />
        </button>

        {/* Dropdown Container */}
        <div className='absolute top-full left-0 mt-1 w-80 rounded-2xl border border-border bg-card p-2 shadow-xl opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50'>
          <div className='space-y-1'>
            <Link
              to='/leaderboard'
              className='flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors'
            >
              <div className='w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500 flex-shrink-0'>
                <Trophy className='w-5 h-5' />
              </div>
              <div>
                <h4 className='text-xs font-black text-foreground'>Bảng Vàng Danh Dự</h4>
                <p className='text-[10px] text-muted-foreground mt-0.5 leading-normal font-semibold'>
                  Vinh danh các thủ khoa, cao thủ thi đua điểm số cao trong các kỳ luyện đề.
                </p>
              </div>
            </Link>

            <Link to='/blog' className='flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors'>
              <div className='w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-500 flex-shrink-0'>
                <BookOpen className='w-5 h-5' />
              </div>
              <div>
                <h4 className='text-xs font-black text-foreground'>Cẩm Nang Ôn Thi</h4>
                <p className='text-[10px] text-muted-foreground mt-0.5 leading-normal font-semibold'>
                  Kinh nghiệm ôn thi THPTQG, tài liệu PDF lý thuyết trọng tâm chọn lọc.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Gói Premium */}
      <Link
        to='/premium'
        className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-300 border border-transparent ${
          currentPath === '/premium'
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs'
            : 'text-amber-500 hover:text-amber-600 hover:bg-amber-500/5'
        }`}
      >
        <Crown className='w-4 h-4 fill-amber-500/10' />
        <span>Gói Premium</span>
      </Link>
    </nav>
  )
}
