import React from 'react'
import { Sparkles } from 'lucide-react'

export const ExamHero: React.FC = () => {
  return (
    <section className='container mx-auto px-6 pt-12 pb-8 text-center max-w-4xl animate-fade-in'>
      <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20 backdrop-blur-md'>
        <Sparkles className='w-3.5 h-3.5' />
        <span>Hệ Thống Luyện Thi Trực Tuyến Hàng Đầu</span>
      </div>
      <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading'>
        Danh Sách Đề Thi Thử
      </h1>
      <p className='mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-medium'>
        Lựa chọn đề thi thử trắc nghiệm phù hợp với trình độ của bạn để bắt đầu ôn luyện ngay hôm nay.
      </p>
    </section>
  )
}
