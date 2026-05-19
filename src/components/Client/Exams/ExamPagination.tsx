import React from 'react'
import { Button } from '@/components/ui/button'

interface ExamPaginationProps {
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export const ExamPagination: React.FC<ExamPaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className='flex justify-center mt-12 gap-1.5 select-none'>
      <Button
        variant='outline'
        size='sm'
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className='rounded-lg h-9 w-9 p-0 flex items-center justify-center border cursor-pointer'
      >
        &lt;
      </Button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <Button
          key={i}
          variant={page === i + 1 ? 'default' : 'outline'}
          size='sm'
          onClick={() => onPageChange(i + 1)}
          className={`rounded-lg h-9 w-9 font-semibold border cursor-pointer ${
            page === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background/40 hover:bg-muted'
          }`}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant='outline'
        size='sm'
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className='rounded-lg h-9 w-9 p-0 flex items-center justify-center border cursor-pointer'
      >
        &gt;
      </Button>
    </div>
  )
}
