import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { callCreateMembershipRequest, callFetchMyMembershipRequests } from '@/config/api'
import { toast } from 'sonner'
import { fetchAccount } from '@/redux/slice/accountSlice'
import { 
  Crown, 
  Check, 
  X, 
  ArrowRight, 
  Copy, 
  QrCode, 
  Clock, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IRequestHistory {
  id: string
  plan: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  transactionCode: string
  createdAt: string
}

export const PremiumPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.account)
  const [selectedPlan, setSelectedPlan] = useState<'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR'>('ONE_YEAR')
  const [transactionCode, setTransactionCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [myRequests, setMyRequests] = useState<IRequestHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const plans = [
    {
      code: 'ONE_MONTH' as const,
      name: '1 Tháng',
      price: 99000,
      originalPrice: 99000,
      description: 'Phù hợp để ôn thi ngắn hạn, làm quen với đề thi chất lượng cao.',
      save: 0
    },
    {
      code: 'SIX_MONTHS' as const,
      name: '6 Tháng',
      price: 499000,
      originalPrice: 594000,
      description: 'Lựa chọn tiết kiệm cho một học kỳ ôn tập đầy đủ và hiệu quả.',
      save: 16
    },
    {
      code: 'ONE_YEAR' as const,
      name: '1 Năm',
      price: 899000,
      originalPrice: 1188000,
      description: 'Lựa chọn tốt nhất! Đảm bảo trọn gói ôn thi đỗ đại học/thi chuyển cấp.',
      save: 24,
      popular: true
    }
  ]

  const selectedPlanDetails = plans.find(p => p.code === selectedPlan)!

  const loadHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const res = await callFetchMyMembershipRequests('limit=5')
      if (res.data?.success) {
        setMyRequests(res.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép vào bộ nhớ tạm!')
  }

  const handleNextStep = () => {
    setStep(2)
  }

  const handleSubmitRequest = async () => {
    if (!transactionCode.trim()) {
      toast.error('Vui lòng nhập mã giao dịch ngân hàng!')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        plan: selectedPlan,
        amount: selectedPlanDetails.price,
        transactionCode: transactionCode.trim()
      }
      const res = await callCreateMembershipRequest(payload)
      if (res.data?.success) {
        toast.success(res.data.message || 'Gửi yêu cầu thành công!')
        setTransactionCode('')
        setStep(1)
        loadHistory()
        dispatch(fetchAccount())
      } else {
        toast.error(res.data?.message || 'Có lỗi xảy ra!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gửi yêu cầu. Vui lòng kiểm tra lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Chờ duyệt</span>
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit"><Check className="w-3 h-3" /> Thành công</span>
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit"><X className="w-3 h-3" /> Từ chối</span>
    }
  }

  return (
    <div className="min-h-screen bg-background page-bg pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Banner Section */}
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

        {/* main container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          
          {/* Plan Options Column (Left/Center) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.code
              return (
                <div 
                  key={p.code}
                  onClick={() => {
                    setSelectedPlan(p.code)
                    setStep(1)
                  }}
                  className={`relative glass rounded-2xl p-6 flex flex-col justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
                    isSelected 
                      ? 'border-primary/50 ring-2 ring-primary/20 shadow-[0_10px_30px_rgba(var(--primary),0.05)]' 
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-black bg-primary text-primary-foreground tracking-wider uppercase shadow-md">
                      PHỔ BIẾN NHẤT
                    </span>
                  )}
                  {p.save > 0 && (
                    <span className="absolute top-4 left-4 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Tiết kiệm {p.save}%
                    </span>
                  )}

                  <div className="pt-4">
                    <h3 className="font-extrabold text-lg text-foreground mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground min-h-[48px] line-clamp-3 leading-relaxed mb-4">{p.description}</p>
                    
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-3xl font-black text-foreground">{formatPrice(p.price)}</span>
                    </div>
                    {p.save > 0 && (
                      <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 block">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Chọn gói này</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Feature Comparison Box */}
            <div className="md:col-span-3 glass rounded-2xl p-6 border-border/50 mt-4">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-current" />
                So sánh Quyền Lợi Thành Viên
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="py-3 font-bold text-muted-foreground">Quyền lợi học tập</th>
                      <th className="py-3 px-4 font-bold text-muted-foreground text-center">Thành viên FREE</th>
                      <th className="py-3 px-4 font-extrabold text-primary text-center">Thành viên PREMIUM VIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-semibold text-foreground">Truy cập đề thi miễn phí</td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-semibold text-foreground">Xem đáp án & giải thích chi tiết</td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-semibold text-foreground flex items-center gap-1">
                        Làm đề thi Premium VIP 
                        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">HOT</span>
                      </td>
                      <td className="py-3 px-4 text-center"><X className="w-4.5 h-4.5 text-muted-foreground/30 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="py-3 font-semibold text-foreground">Không quảng cáo làm phiền</td>
                      <td className="py-3 px-4 text-center"><X className="w-4.5 h-4.5 text-muted-foreground/30 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Đội ngũ giáo viên hỗ trợ giải đáp 24/7</td>
                      <td className="py-3 px-4 text-center"><X className="w-4.5 h-4.5 text-muted-foreground/30 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Billing & Bank Transfer Column (Right) */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-6 border-primary/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

              <h3 className="font-extrabold text-xl mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Thanh Toán Đăng Ký
              </h3>

              {step === 1 ? (
                <div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 mb-6">
                    <span className="text-xs text-muted-foreground block mb-1">Gói đã chọn:</span>
                    <strong className="text-base text-foreground font-black block mb-3">{selectedPlanDetails.name}</strong>
                    
                    <div className="flex justify-between items-center text-sm border-t border-border/30 pt-3">
                      <span className="text-muted-foreground">Tổng số tiền:</span>
                      <strong className="text-lg font-black text-primary">{formatPrice(selectedPlanDetails.price)}</strong>
                    </div>
                  </div>

                  <Button 
                    onClick={handleNextStep}
                    className="w-full btn-premium py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                  >
                    Tiến Hành Thanh Toán
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-[10px] text-muted-foreground text-center mt-3 leading-normal">
                    * Bằng cách thanh toán, bạn đồng ý với Điều khoản Sử dụng và Chính sách Bảo mật của chúng tôi.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-4 bg-primary/10 w-fit px-2.5 py-1 rounded-md border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    BƯỚC 2: CHUYỂN KHOẢN VÀ XÁC NHẬN
                  </div>

                  {/* Transfer instruction card */}
                  <div className="space-y-4 mb-6">
                    
                    {/* Mock Bank QR code */}
                    <div className="mx-auto w-40 h-40 bg-white p-2 rounded-2xl border-2 border-primary/20 shadow-md flex flex-col justify-center items-center relative overflow-hidden">
                      {/* Stylized VietQR design */}
                      <div className="w-full h-full border border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center text-zinc-800 relative bg-zinc-50">
                        <QrCode className="w-24 h-24 text-zinc-800" />
                        <span className="text-[9px] font-black tracking-widest text-primary absolute bottom-1">VIETQR</span>
                      </div>
                      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                    </div>

                    <div className="space-y-2.5 text-sm p-4 rounded-2xl bg-muted/40 border border-border/50">
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Ngân hàng:</span>
                        <strong className="text-foreground">MB BANK (Quân Đội)</strong>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Số tài khoản:</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-foreground">19035619141013</strong>
                          <button onClick={() => copyToClipboard('19035619141013')} className="text-primary hover:text-primary/80"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Chủ tài khoản:</span>
                        <strong className="text-foreground uppercase">TRAN DUY PHONG</strong>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Số tiền:</span>
                        <strong className="text-primary font-black">{formatPrice(selectedPlanDetails.price)}</strong>
                      </div>

                      <div className="flex justify-between items-start text-xs border-t border-border/30 pt-2.5 mt-2">
                        <span className="text-muted-foreground">Nội dung ck:</span>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <strong className="text-foreground text-xs font-mono font-bold bg-muted border border-border px-1.5 py-0.5 rounded">
                              {`VIP ${selectedPlan === 'ONE_MONTH' ? '1T' : selectedPlan === 'SIX_MONTHS' ? '6T' : '1N'} ${user?.name || user?.email ? (user.name || user.email).split(' ')[0].toUpperCase() : 'USER'}`}
                            </strong>
                            <button onClick={() => copyToClipboard(`VIP ${selectedPlan === 'ONE_MONTH' ? '1T' : selectedPlan === 'SIX_MONTHS' ? '6T' : '1N'} ${user?.name || user?.email ? (user.name || user.email).split(' ')[0].toUpperCase() : 'USER'}`)} className="text-primary hover:text-primary/80"><Copy className="w-3.5 h-3.5" /></button>
                          </div>
                          <span className="text-[10px] text-amber-500 font-medium mt-1 block">(*) Vui lòng chuyển khoản đúng nội dung trên</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Transaction Code confirmation form */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-foreground block">
                      Mã Giao Dịch Ngân Hàng (Mã FT / Số bút toán):
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: FT260517004312 hoặc mã gd khác"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none text-xs font-semibold"
                    />

                    <div className="flex gap-2.5 pt-2">
                      <Button 
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-5 rounded-xl text-xs font-bold border border-border bg-background hover:bg-muted cursor-pointer"
                      >
                        Quay lại
                      </Button>
                      <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmitRequest}
                        className="flex-1 btn-premium py-5 rounded-xl text-xs font-bold text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? 'Đang gửi...' : 'Đã chuyển khoản'}
                      </Button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request History Section */}
        <div className="glass rounded-3xl p-6 border-border/50">
          <h3 className="font-extrabold text-xl mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Lịch Sử Yêu Cầu Nâng Cấp
          </h3>

          {isLoadingHistory ? (
            <div className="text-center py-6 text-muted-foreground text-sm font-medium">Đang tải lịch sử...</div>
          ) : myRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm font-semibold border-2 border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center gap-2 bg-muted/10">
              <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
              Bạn chưa gửi yêu cầu nâng cấp nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground font-extrabold">
                    <th className="py-3">Mã Giao Dịch</th>
                    <th className="py-3">Gói</th>
                    <th className="py-3">Số Tiền</th>
                    <th className="py-3">Ngày Gửi</th>
                    <th className="py-3 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border/20 text-xs font-semibold text-foreground last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="py-4 font-mono font-bold text-foreground">{req.transactionCode}</td>
                      <td className="py-4">
                        {req.plan === 'ONE_MONTH' ? '1 Tháng' : req.plan === 'SIX_MONTHS' ? '6 Tháng' : '1 Năm'}
                      </td>
                      <td className="py-4 font-extrabold text-primary">{formatPrice(req.amount)}</td>
                      <td className="py-4 text-muted-foreground">{formatDate(req.createdAt)}</td>
                      <td className="py-4 text-right flex justify-end">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default PremiumPage
