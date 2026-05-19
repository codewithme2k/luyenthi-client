export type PremiumPlanCode = 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR'

export interface PremiumPlan {
  code: PremiumPlanCode
  name: string
  price: number
  originalPrice: number
  description: string
  save: number
  popular?: boolean
}

export const premiumPlans: PremiumPlan[] = [
  {
    code: 'ONE_MONTH',
    name: '1 Tháng',
    price: 99000,
    originalPrice: 99000,
    description: 'Phù hợp để ôn thi ngắn hạn, làm quen với đề thi chất lượng cao.',
    save: 0
  },
  {
    code: 'SIX_MONTHS',
    name: '6 Tháng',
    price: 499000,
    originalPrice: 594000,
    description: 'Lựa chọn tiết kiệm cho một học kỳ ôn tập đầy đủ và hiệu quả.',
    save: 16
  },
  {
    code: 'ONE_YEAR',
    name: '1 Năm',
    price: 899000,
    originalPrice: 1188000,
    description: 'Lựa chọn tốt nhất! Đảm bảo trọn gói ôn thi đỗ đại học/thi chuyển cấp.',
    save: 24,
    popular: true
  }
]

export interface PremiumPaymentConfig {
  bankName: string
  accountNumber: string
  accountOwner: string
}

export const premiumPaymentConfig: PremiumPaymentConfig = {
  bankName: 'MB BANK (Quân Đội)',
  accountNumber: '0967583134',
  accountOwner: 'DOAN QUOC HUU'
}
