import React from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className='container mx-auto px-6 pt-20 pb-16 text-center max-w-7xl animate-fade-in'>
      <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 backdrop-blur-md'>
        <Sparkles className='w-3.5 h-3.5 animate-spin-slow' />
        <span>Học Tập Thông Minh - Đạt Điểm Số Cao</span>
      </div>

      <h1 className='text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground font-heading leading-tight sm:leading-none'>
        Chinh Phục Các Kỳ Thi Với <br />
        <span className='bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm'>
          Nền Tảng Luyện Thi Pro
        </span>
      </h1>

      <p className='mt-6 text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto font-medium leading-relaxed'>
        Trải nghiệm hệ thống thi thử trực tuyến thế hệ mới. Đầy đủ các loại câu hỏi trắc nghiệm, điền từ, nối đáp án,
        đúng/sai và tự luận với lời giải chi tiết, chuẩn cấu trúc đề thi.
      </p>

      <div className='mt-10 flex flex-wrap justify-center gap-4'>
        <Link to='/exams'>
          <Button className='btn-premium h-13 px-8 rounded-xl text-base font-bold flex items-center gap-2 group cursor-pointer'>
            <span>Khám Phá Đề Thi Ngay</span>
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </Button>
        </Link>
        <Link to='/login'>
          <Button
            variant='outline'
            className='h-13 px-8 rounded-xl text-base font-bold bg-background/40 hover:bg-muted/80 backdrop-blur-sm cursor-pointer border-border'
          >
            Đăng Nhập
          </Button>
        </Link>
      </div>
    </section>
  )
}
