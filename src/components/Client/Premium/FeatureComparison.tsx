import React from 'react'
import { Crown, Check, X } from 'lucide-react'

export const FeatureComparison: React.FC = () => {
  return (
    <div className='glass rounded-2xl p-6 border-border/50 mt-4'>
      <h3 className='font-black text-xl mb-6 flex items-center gap-2'>
        <Crown className='w-5 h-5 text-amber-500 fill-current' />
        So sánh Quyền Lợi Thành Viên
      </h3>

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm border-collapse'>
          <thead>
            <tr className='border-b border-border/50'>
              <th className='py-3 font-bold text-muted-foreground'>Quyền lợi học tập</th>
              <th className='py-3 px-4 font-bold text-muted-foreground text-center'>Thành viên FREE</th>
              <th className='py-3 px-4 font-extrabold text-primary text-center'>Thành viên PREMIUM VIP</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-border/20'>
              <td className='py-3 font-semibold text-foreground'>Truy cập đề thi miễn phí</td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
            </tr>
            <tr className='border-b border-border/20'>
              <td className='py-3 font-semibold text-foreground'>Xem đáp án & giải thích chi tiết</td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
            </tr>
            <tr className='border-b border-border/20'>
              <td className='py-3 font-semibold text-foreground flex items-center gap-1'>
                Làm đề thi Premium VIP
                <span className='text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md'>
                  HOT
                </span>
              </td>
              <td className='py-3 px-4 text-center'>
                <X className='w-4.5 h-4.5 text-muted-foreground/30 mx-auto' />
              </td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
            </tr>
            <tr className='border-b border-border/20'>
              <td className='py-3 font-semibold text-foreground'>Không quảng cáo làm phiền</td>
              <td className='py-3 px-4 text-center'>
                <X className='w-4.5 h-4.5 text-muted-foreground/30 mx-auto' />
              </td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
            </tr>
            <tr>
              <td className='py-3 font-semibold text-foreground'>Đội ngũ giáo viên hỗ trợ giải đáp 24/7</td>
              <td className='py-3 px-4 text-center'>
                <X className='w-4.5 h-4.5 text-muted-foreground/30 mx-auto' />
              </td>
              <td className='py-3 px-4 text-center'>
                <Check className='w-4.5 h-4.5 text-emerald-500 mx-auto' />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
