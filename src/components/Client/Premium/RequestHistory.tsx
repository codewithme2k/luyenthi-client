import React from 'react'
import { FileText, AlertCircle, Clock, Check, X } from 'lucide-react'

interface RequestHistoryProps {
  myRequests: any[]
  isLoadingHistory: boolean
  formatPrice: (value: number) => string
  formatDate: (dateStr: string) => string
}

export const RequestHistory: React.FC<RequestHistoryProps> = ({
  myRequests,
  isLoadingHistory,
  formatPrice,
  formatDate
}) => {
  const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING':
        return (
          <span className='px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit'>
            <Clock className='w-3 h-3' /> Chờ duyệt
          </span>
        )
      case 'APPROVED':
        return (
          <span className='px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit'>
            <Check className='w-3 h-3' /> Thành công
          </span>
        )
      case 'REJECTED':
        return (
          <span className='px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit'>
            <X className='w-3 h-3' /> Từ chối
          </span>
        )
    }
  }

  return (
    <div className='glass rounded-3xl p-6 border-border/50'>
      <h3 className='font-extrabold text-xl mb-6 flex items-center gap-2'>
        <FileText className='w-5 h-5 text-primary' />
        Lịch Sử Yêu Cầu Nâng Cấp
      </h3>

      {isLoadingHistory ? (
        <div className='text-center py-6 text-muted-foreground text-sm font-medium'>Đang tải lịch sử...</div>
      ) : myRequests.length === 0 ? (
        <div className='text-center py-8 text-muted-foreground text-sm font-semibold border-2 border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center gap-2 bg-muted/10'>
          <AlertCircle className='w-8 h-8 text-muted-foreground/50' />
          Bạn chưa gửi yêu cầu nâng cấp nào.
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm border-collapse'>
            <thead>
              <tr className='border-b border-border/50 text-xs text-muted-foreground font-extrabold'>
                <th className='py-3'>Mã Giao Dịch</th>
                <th className='py-3'>Gói</th>
                <th className='py-3'>Số Tiền</th>
                <th className='py-3'>Ngày Gửi</th>
                <th className='py-3 text-right'>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req) => (
                <tr
                  key={req.id}
                  className='border-b border-border/20 text-xs font-semibold text-foreground last:border-0 hover:bg-muted/10 transition-colors'
                >
                  <td className='py-4 font-mono font-bold text-foreground'>{req.transactionCode}</td>
                  <td className='py-4'>
                    {req.plan === 'ONE_MONTH' ? '1 Tháng' : req.plan === 'SIX_MONTHS' ? '6 Tháng' : '1 Năm'}
                  </td>
                  <td className='py-4 font-extrabold text-primary'>{formatPrice(req.amount)}</td>
                  <td className='py-4 text-muted-foreground'>{formatDate(req.createdAt)}</td>
                  <td className='py-4 text-right flex justify-end'>{getStatusBadge(req.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
