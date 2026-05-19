import React from 'react'
import { CheckCircle, TrendingUp, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LeaderboardFiltersProps {
  sortBy: 'passed' | 'score'
  onSortByChange: (val: 'passed' | 'score') => void
  searchTerm: string
  onSearchTermChange: (val: string) => void
}

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  sortBy,
  onSortByChange,
  searchTerm,
  onSearchTermChange
}) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-xs'>
      {/* Toggle between diligence and excellence */}
      <div className='flex bg-muted/65 p-1 rounded-xl w-full sm:w-auto'>
        <button
          onClick={() => onSortByChange('passed')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sortBy === 'passed' ? 'bg-background text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckCircle className='w-3.5 h-3.5' />
          Chăm Chỉ (Bài thi đạt)
        </button>
        <button
          onClick={() => onSortByChange('score')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            sortBy === 'score' ? 'bg-background text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className='w-3.5 h-3.5' />
          Điểm Số (Trung bình)
        </button>
      </div>

      {/* Search Student */}
      <div className='relative w-full sm:w-64'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Tìm kiếm cao thủ...'
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className='pl-9 bg-muted/20 border-border/80 rounded-xl'
        />
      </div>
    </div>
  )
}
