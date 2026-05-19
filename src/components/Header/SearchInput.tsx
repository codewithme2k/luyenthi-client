import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const SearchInput: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const queryParam = searchParams.get('searchTerm') || ''
  const [value, setValue] = useState(queryParam)

  // Sync with URL search parameters
  useEffect(() => {
    setValue(queryParam)
  }, [queryParam])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      navigate(`/exams?searchTerm=${encodeURIComponent(value.trim())}`)
    } else {
      navigate('/exams')
    }
  }

  // If already on the exams page, we can also search on-change, otherwise on-submit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    if (location.pathname === '/exams') {
      if (val.trim()) {
        navigate(`/exams?searchTerm=${encodeURIComponent(val.trim())}`, { replace: true })
      } else {
        navigate('/exams', { replace: true })
      }
    }
  }

  return (
    <form onSubmit={handleSearchSubmit} className='hidden sm:block relative w-48 lg:w-64 max-w-xs group z-30'>
      <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
      <Input
        type='search'
        placeholder='Tìm nhanh đề thi...'
        value={value}
        onChange={handleInputChange}
        className='h-9 pl-9 bg-muted/40 hover:bg-muted/70 focus-visible:bg-background border-border hover:border-border focus-visible:ring-primary rounded-xl text-xs font-semibold'
      />
    </form>
  )
}
