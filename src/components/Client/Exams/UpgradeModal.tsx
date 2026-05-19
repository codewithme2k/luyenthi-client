import React from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  onClose,
  onUpgrade,
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass bg-background sm:max-w-[480px] w-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in border border-amber-500/25">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2 border border-amber-500/20 animate-pulse">
              <Crown className="w-8 h-8 fill-current animate-bounce-slow" />
            </div>
            <h3 className="text-2xl font-black font-heading text-amber-500">Mở Khóa Gói Premium VIP 👑</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg w-fit mx-auto">
              NỘI DUNG ĐỘC QUYỀN VIP
            </p>
          </div>

          <div className="text-sm text-foreground/80 leading-relaxed text-center font-semibold">
            Đề thi thử này chỉ dành riêng cho thành viên <strong>Premium VIP</strong>. Bạn sẽ mở khóa hàng trăm đề thi VIP khác kèm lời giải chi tiết và hỗ trợ 24/7 từ giáo viên.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-border pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11 rounded-xl font-bold cursor-pointer"
            >
              Để sau
            </Button>
            <Button
              onClick={onUpgrade}
              className="btn-premium flex-1 h-11 rounded-xl font-bold cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-current" /> Nâng Cấp Ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
