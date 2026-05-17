import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email!')
      return
    }
    
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      toast.success('Đăng ký nhận tin thành công! Cảm ơn bạn.')
      setEmail('')
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-foreground uppercase tracking-widest leading-none">
        Nhận Tài Liệu & Đề Thi Mới
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
        Đăng ký nhận tin tức, bộ đề thi thử độc quyền và tài liệu ôn luyện hữu ích được cập nhật hàng tuần.
      </p>

      {isSubscribed ? (
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl text-xs font-bold w-fit animate-fade-in">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>Bạn đã đăng ký nhận tài liệu thành công!</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
          <Input
            type="email"
            placeholder="Email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl bg-background/50 border-border/80 text-sm focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all duration-300 px-4"
          >
            {isSubmitting ? (
              <span className="animate-pulse">...</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
