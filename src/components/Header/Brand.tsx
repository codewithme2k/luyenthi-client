import React from 'react'
import { Link } from 'react-router'
import { GraduationCap } from 'lucide-react'

export const Brand: React.FC = () => {
  return (
    <Link to='/' className='flex items-center gap-2 group select-none'>
      <div className='w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300'>
        <GraduationCap className='w-6 h-6 animate-pulse-slow' />
      </div>
      <div className='flex flex-col'>
        <span className='text-lg font-extrabold font-heading tracking-tight leading-none bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
          Luyện Thi Pro
        </span>
        <span className='text-[9px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5'>
          Online Platform
        </span>
      </div>
    </Link>
  )
}
