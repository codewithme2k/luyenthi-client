import React from 'react'
import { BrainCircuit, BarChart3, BookOpen, CheckCircle2 } from 'lucide-react'

export const FeatureHighlights: React.FC = () => {
  return (
    <section className='container mx-auto px-6 max-w-6xl py-12'>
      <div className='text-center mb-16 space-y-3'>
        <h2 className='text-3xl font-bold font-heading'>Ưu Điểm Vượt Trội Của Hệ Thống</h2>
        <p className='text-muted-foreground font-medium max-w-xl mx-auto'>
          Chúng tôi xây dựng những công cụ tốt nhất để bạn tối ưu hóa thời gian và nâng cao điểm số thi thử.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Card 1: Diverse Quiz Types */}
        <div className='glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between'>
          <div className='space-y-4'>
            <div className='w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary'>
              <BrainCircuit className='w-6 h-6' />
            </div>
            <h3 className='font-bold text-xl font-heading'>Đa Dạng Loại Câu Hỏi</h3>
            <p className='text-sm text-muted-foreground leading-relaxed font-medium'>
              Hỗ trợ 6 loại câu hỏi chuyên sâu bao gồm lựa chọn 1 đáp án, nhiều đáp án đúng, đúng/sai, điền vào chỗ
              trống, nối chéo đáp án và tự luận viết tay.
            </p>
          </div>
          <div className='mt-6 flex items-center gap-1.5 text-xs text-primary font-bold'>
            <span>Hỗ trợ thi toàn diện</span>
            <CheckCircle2 className='w-4 h-4' />
          </div>
        </div>

        {/* Card 2: Interactive Analytics */}
        <div className='glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between'>
          <div className='space-y-4'>
            <div className='w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600'>
              <BarChart3 className='w-6 h-6' />
            </div>
            <h3 className='font-bold text-xl font-heading'>Theo Dõi Tiến Độ</h3>
            <p className='text-sm text-muted-foreground leading-relaxed font-medium'>
              Ghi nhớ mọi lượt làm bài, thời gian hoàn thành, phân tích tỉ lệ trả lời đúng và chấm điểm tự luận chuẩn
              xác, hiển thị biểu đồ nâng cao.
            </p>
          </div>
          <div className='mt-6 flex items-center gap-1.5 text-xs text-green-600 font-bold'>
            <span>Đánh giá kết quả ngay</span>
            <CheckCircle2 className='w-4 h-4' />
          </div>
        </div>

        {/* Card 3: Instant Explanations */}
        <div className='glass p-8 rounded-2xl border border-border/80 card-hover flex flex-col justify-between'>
          <div className='space-y-4'>
            <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600'>
              <BookOpen className='w-6 h-6' />
            </div>
            <h3 className='font-bold text-xl font-heading'>Lời Giải Chi Tiết</h3>
            <p className='text-sm text-muted-foreground leading-relaxed font-medium'>
              Mỗi câu hỏi đều được biên soạn phần giải thích chi tiết, chỉ rõ các lỗi sai và phương pháp làm bài hiệu
              quả nhất để ghi nhớ kiến thức lâu dài.
            </p>
          </div>
          <div className='mt-6 flex items-center gap-1.5 text-xs text-amber-600 font-bold'>
            <span>Học từ những sai sót</span>
            <CheckCircle2 className='w-4 h-4' />
          </div>
        </div>
      </div>
    </section>
  )
}
