import React from 'react'
import { Sparkles, Trophy } from 'lucide-react'

export const LeaderboardHeader: React.FC = () => {
  return (
    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-background border border-amber-500/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs'>
      <div className='space-y-2 relative z-10'>
        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 text-xs font-black border border-amber-500/25'>
          <Sparkles className='w-3.5 h-3.5 fill-current' />
          Bảng Vàng Học Tập
        </span>
        <h1 className='text-2xl md:text-3xl font-extrabold font-heading text-foreground'>
          Bảng Xếp Hạng Cao Thủ Luyện Thi
        </h1>
        <p className='text-sm text-muted-foreground font-semibold max-w-xl leading-relaxed'>
          Vinh danh những học sinh xuất sắc nhất có điểm thi trung bình vượt bậc và chăm chỉ ôn luyện vượt qua nhiều bài
          thi nhất trên hệ thống.
        </p>
      </div>

      <div className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner animate-pulse'>
        <Trophy className='w-10 h-10 md:w-12 md:h-12 fill-current' />
      </div>
    </div>
  )
}
