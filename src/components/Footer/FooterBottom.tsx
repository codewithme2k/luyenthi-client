import React from 'react'
import { Sparkles } from 'lucide-react'

export const FooterBottom: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
      <div className="flex items-center gap-1.5 order-2 sm:order-1 text-center sm:text-left">
        <span>© {currentYear} Nền Tảng Luyện Thi Pro. Bảo lưu mọi quyền.</span>
      </div>

      <div className="flex items-center gap-6 order-1 sm:order-2">
        {/* SaaS-like Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-emerald-500 leading-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Hệ thống ổn định</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 leading-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Phiên bản 2.0 (Premium)</span>
        </div>
      </div>
    </div>
  )
}
