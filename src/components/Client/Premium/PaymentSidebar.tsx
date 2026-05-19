import React from 'react'
import { QrCode, ArrowRight, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IUser } from '@/types/backend'
import { premiumPaymentConfig } from '@/config/utils'

interface PaymentSidebarProps {
  selectedPlan: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR'
  selectedPlanDetails: {
    name: string
    price: number
  }
  formatPrice: (value: number) => string
  step: 1 | 2
  onNextStep: () => void
  onPrevStep: () => void
  transactionCode: string
  onTransactionCodeChange: (value: string) => void
  isSubmitting: boolean
  onSubmitRequest: () => void
  user?: IUser | null
  copyToClipboard: (text: string) => void
}

export const PaymentSidebar: React.FC<PaymentSidebarProps> = ({
  selectedPlan,
  selectedPlanDetails,
  formatPrice,
  step,
  onNextStep,
  onPrevStep,
  transactionCode,
  onTransactionCodeChange,
  isSubmitting,
  onSubmitRequest,
  user,
  copyToClipboard
}) => {
  return (
    <div className='glass rounded-3xl p-6 border-primary/20 shadow-xl relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl' />

      <h3 className='font-extrabold text-xl mb-4 flex items-center gap-2'>
        <QrCode className='w-5 h-5 text-primary' />
        Thanh Toán Đăng Ký
      </h3>

      {step === 1 ? (
        <div>
          <div className='p-4 rounded-2xl bg-muted/30 border border-border/50 mb-6'>
            <span className='text-xs text-muted-foreground block mb-1'>Gói đã chọn:</span>
            <strong className='text-base text-foreground font-black block mb-3'>{selectedPlanDetails.name}</strong>

            <div className='flex justify-between items-center text-sm border-t border-border/30 pt-3'>
              <span className='text-muted-foreground'>Tổng số tiền:</span>
              <strong className='text-lg font-black text-primary'>{formatPrice(selectedPlanDetails.price)}</strong>
            </div>
          </div>

          <Button
            onClick={onNextStep}
            className='w-full btn-premium py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5'
          >
            Tiến Hành Thanh Toán
            <ArrowRight className='w-4 h-4' />
          </Button>

          <p className='text-[10px] text-muted-foreground text-center mt-3 leading-normal'>
            * Bằng cách thanh toán, bạn đồng ý với Điều khoản Sử dụng và Chính sách Bảo mật của chúng tôi.
          </p>
        </div>
      ) : (
        <div className='animate-fade-in'>
          <div className='flex items-center gap-1.5 text-xs font-bold text-primary mb-4 bg-primary/10 w-fit px-2.5 py-1 rounded-md border border-primary/20'>
            <span className='w-1.5 h-1.5 rounded-full bg-primary animate-ping' />
            BƯỚC 2: CHUYỂN KHOẢN VÀ XÁC NHẬN
          </div>

          {/* Transfer instruction card */}
          <div className='space-y-4 mb-6'>
            {/* Mock Bank QR code */}
            <div className='mx-auto w-40 h-40 bg-white p-2 rounded-2xl border-2 border-primary/20 shadow-md flex flex-col justify-center items-center relative overflow-hidden'>
              {/* Stylized VietQR design */}
              <div className='w-full h-full border border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center text-zinc-800 relative bg-zinc-50'>
                <QrCode className='w-24 h-24 text-zinc-800' />
                <span className='text-[9px] font-black tracking-widest text-primary absolute bottom-1'>VIETQR</span>
              </div>
              <div className='absolute inset-0 bg-primary/5 pointer-events-none' />
            </div>

            <div className='space-y-2.5 text-sm p-4 rounded-2xl bg-muted/40 border border-border/50'>
              <div className='flex justify-between items-center text-xs'>
                <span className='text-muted-foreground'>Ngân hàng:</span>
                <strong className='text-foreground'>{premiumPaymentConfig.bankName}</strong>
              </div>

              <div className='flex justify-between items-center text-xs'>
                <span className='text-muted-foreground'>Số tài khoản:</span>
                <div className='flex items-center gap-1'>
                  <strong className='text-foreground'>{premiumPaymentConfig.accountNumber}</strong>
                  <button
                    onClick={() => copyToClipboard(premiumPaymentConfig.accountNumber)}
                    className='text-primary hover:text-primary/80 cursor-pointer'
                  >
                    <Copy className='w-3.5 h-3.5' />
                  </button>
                </div>
              </div>

              <div className='flex justify-between items-center text-xs'>
                <span className='text-muted-foreground'>Chủ tài khoản:</span>
                <strong className='text-foreground uppercase'>{premiumPaymentConfig.accountOwner}</strong>
              </div>

              <div className='flex justify-between items-center text-xs'>
                <span className='text-muted-foreground'>Số tiền:</span>
                <strong className='text-primary font-black'>{formatPrice(selectedPlanDetails.price)}</strong>
              </div>

              <div className='flex justify-between items-start text-xs border-t border-border/30 pt-2.5 mt-2'>
                <span className='text-muted-foreground'>Nội dung ck:</span>
                <div className='text-right'>
                  <div className='flex items-center gap-1 justify-end'>
                    <strong className='text-foreground text-xs font-mono font-bold bg-muted border border-border px-1.5 py-0.5 rounded'>
                      {`VIP ${selectedPlan === 'ONE_MONTH' ? '1T' : selectedPlan === 'SIX_MONTHS' ? '6T' : '1N'} ${user?.name || user?.email ? (user.name || user.email).split(' ')[0].toUpperCase() : 'USER'}`}
                    </strong>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `VIP ${selectedPlan === 'ONE_MONTH' ? '1T' : selectedPlan === 'SIX_MONTHS' ? '6T' : '1N'} ${user?.name || user?.email ? (user.name || user.email).split(' ')[0].toUpperCase() : 'USER'}`
                        )
                      }
                      className='text-primary hover:text-primary/80 cursor-pointer'
                    >
                      <Copy className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <span className='text-[10px] text-amber-500 font-medium mt-1 block'>
                    (*) Vui lòng chuyển khoản đúng nội dung trên
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Code confirmation form */}
          <div className='space-y-3'>
            <label className='text-xs font-extrabold text-foreground block'>
              Mã Giao Dịch Ngân Hàng (Mã FT / Số bút toán):
            </label>
            <input
              type='text'
              placeholder='Ví dụ: FT260517004312 hoặc mã gd khác'
              value={transactionCode}
              onChange={(e) => onTransactionCodeChange(e.target.value)}
              className='w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none text-xs font-semibold'
            />

            <div className='flex gap-2.5 pt-2'>
              <Button
                variant='ghost'
                onClick={onPrevStep}
                className='w-1/3 py-5 rounded-xl text-xs font-bold border border-border bg-background hover:bg-muted cursor-pointer'
              >
                Quay lại
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={onSubmitRequest}
                className='flex-1 btn-premium py-5 rounded-xl text-xs font-bold text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer'
              >
                {isSubmitting ? 'Đang gửi...' : 'Đã chuyển khoản'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
