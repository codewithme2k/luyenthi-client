import React from 'react'
import { Crown, UserCheck } from 'lucide-react'

interface PremiumHeroProps {
  user: any;
  formatDate: (dateStr: string) => string;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ user, formatDate }) => {
  return (
    <div className="relative text-center max-w-3xl mx-auto mb-16 animate-fade-in">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 w-fit mx-auto mb-4 animate-pulse">
        <Crown className="w-3.5 h-3.5 fill-current" />
        NÂNG CẤP THÀNH VIÊN
      </span>
      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
        Mở Khóa Toàn Bộ <span className="gradient-text">Đề Thi VIP</span>
      </h1>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
        Học tập không giới hạn với hàng nghìn đề thi chất lượng cao, có lời giải chi tiết và công cụ chấm điểm AI chính xác nhất.
      </p>

      {user?.isPremium && (
        <div className="mt-8 glass border-primary/30 max-w-xl mx-auto p-4 rounded-2xl flex items-center gap-4 text-left shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
            <Crown className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-base">
              Tài khoản Premium đang hoạt động <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-0.5"><UserCheck className="w-3 h-3" /> VIP</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              Hạn dùng đến hết ngày: <strong className="text-foreground">{user.premiumUntil ? formatDate(user.premiumUntil) : 'Vô thời hạn'}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
