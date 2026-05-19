import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { callCreateMembershipRequest, callFetchMyMembershipRequests } from '@/config/api'
import { toast } from 'sonner'
import { fetchAccount } from '@/redux/slice/accountSlice'

// Modular Sub-components
import { PremiumHero } from '@/components/Client/Premium/PremiumHero'
import { PlanOptions } from '@/components/Client/Premium/PlanOptions'
import { FeatureComparison } from '@/components/Client/Premium/FeatureComparison'
import { PaymentSidebar } from '@/components/Client/Premium/PaymentSidebar'
import { RequestHistory } from '@/components/Client/Premium/RequestHistory'

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

  return (
    <div className="min-h-screen bg-background page-bg pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Banner Section */}
        <PremiumHero user={user} formatDate={formatDate} />

        {/* main container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          
          {/* Plan Options Column (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            <PlanOptions 
              plans={plans}
              selectedPlan={selectedPlan}
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setStep(1);
              }}
              formatPrice={formatPrice}
            />

            {/* Feature Comparison Box */}
            <FeatureComparison />
          </div>

          {/* Billing & Bank Transfer Column (Right) */}
          <div className="lg:col-span-1">
            <PaymentSidebar 
              selectedPlan={selectedPlan}
              selectedPlanDetails={selectedPlanDetails}
              formatPrice={formatPrice}
              step={step}
              onNextStep={handleNextStep}
              onPrevStep={() => setStep(1)}
              transactionCode={transactionCode}
              onTransactionCodeChange={setTransactionCode}
              isSubmitting={isSubmitting}
              onSubmitRequest={handleSubmitRequest}
              user={user}
              copyToClipboard={copyToClipboard}
            />
          </div>
        </div>

        {/* Request History Section */}
        <RequestHistory 
          myRequests={myRequests}
          isLoadingHistory={isLoadingHistory}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />

      </div>
    </div>
  )
}

export default PremiumPage;
