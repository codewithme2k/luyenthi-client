import React from 'react'
import { Medal, Crown } from 'lucide-react'

interface LeaderboardStudent {
  id: string
  name: string
  email: string
  avatarImg?: string
  isPremium?: boolean
  totalAttempts: number
  passedAttempts: number
  averageScore: number
  accuracyRate: number
}

interface LeaderboardPodiumProps {
  top1: LeaderboardStudent | null
  top2: LeaderboardStudent | null
  top3: LeaderboardStudent | null
  getImageUrl: (url: string | null | undefined) => string
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ top1, top2, top3, getImageUrl }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 max-w-3xl mx-auto'>
      {/* Podium Rank 2: Silver (Left) */}
      {top2 && (
        <div className='bg-card border border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-md relative order-2 md:order-1 h-[260px] hover:border-slate-400 hover:shadow-lg transition-all duration-300'>
          <div className='absolute -top-6 w-12 h-12 rounded-full bg-slate-300 border-4 border-card flex items-center justify-center text-slate-800 shadow-md'>
            <Medal className='w-6 h-6 fill-current' />
          </div>

          <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 bg-muted mb-3 relative'>
            {top2.avatarImg ? (
              <img src={getImageUrl(top2.avatarImg)} alt='Avatar' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-slate-500 font-black text-xl uppercase bg-slate-300/10'>
                {top2.name[0]}
              </div>
            )}
          </div>

          <span
            className={`text-sm font-extrabold flex items-center gap-1 ${
              top2.isPremium ? 'text-amber-500' : 'text-foreground'
            }`}
          >
            {top2.name}
            {top2.isPremium && <Crown className='w-3.5 h-3.5 fill-current' />}
          </span>
          <p className='text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-full'>{top2.email}</p>

          <div className='mt-4 pt-3 border-t border-border/60 w-full grid grid-cols-2 gap-2 text-center'>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Bài Đạt</span>
              <p className='text-sm font-black text-foreground'>{top2.passedAttempts}</p>
            </div>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Điểm TB</span>
              <p className='text-sm font-black text-primary'>{top2.averageScore}</p>
            </div>
          </div>
        </div>
      )}

      {/* Podium Rank 1: Gold (Center - Highlighted) */}
      {top1 && (
        <div className='bg-card border-2 border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative order-1 md:order-2 h-[300px] hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-amber-500/5 to-transparent'>
          <div className='absolute -top-7 w-14 h-14 rounded-full bg-amber-500 border-4 border-card flex items-center justify-center text-white shadow-lg animate-bounce-slow'>
            <Crown className='w-8 h-8 fill-current' />
          </div>

          <div className='w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500 bg-muted mb-4 relative'>
            {top1.avatarImg ? (
              <img src={getImageUrl(top1.avatarImg)} alt='Avatar' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-amber-500 font-black text-2xl uppercase bg-amber-500/10'>
                {top1.name[0]}
              </div>
            )}
          </div>

          <span
            className={`text-base font-extrabold flex items-center gap-1.5 ${
              top1.isPremium ? 'text-amber-500' : 'text-foreground'
            }`}
          >
            {top1.name}
            {top1.isPremium && <Crown className='w-4 h-4 fill-current' />}
          </span>
          <p className='text-[10px] text-muted-foreground font-semibold mt-0.5 truncate max-w-full'>{top1.email}</p>

          <div className='mt-5 pt-3 border-t border-border/60 w-full grid grid-cols-2 gap-2 text-center'>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Bài Đạt</span>
              <p className='text-base font-black text-foreground'>{top1.passedAttempts}</p>
            </div>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Điểm TB</span>
              <p className='text-base font-black text-primary'>{top1.averageScore}</p>
            </div>
          </div>
        </div>
      )}

      {/* Podium Rank 3: Bronze (Right) */}
      {top3 && (
        <div className='bg-card border border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-md relative order-3 h-[240px] hover:border-amber-700 hover:shadow-lg transition-all duration-300'>
          <div className='absolute -top-6 w-12 h-12 rounded-full bg-amber-700 border-4 border-card flex items-center justify-center text-white shadow-md'>
            <Medal className='w-6 h-6 fill-current' />
          </div>

          <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-amber-700 bg-muted mb-3 relative'>
            {top3.avatarImg ? (
              <img src={getImageUrl(top3.avatarImg)} alt='Avatar' className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-amber-700/50 font-black text-xl uppercase bg-amber-700/10'>
                {top3.name[0]}
              </div>
            )}
          </div>

          <span
            className={`text-sm font-extrabold flex items-center gap-1 ${
              top3.isPremium ? 'text-amber-500' : 'text-foreground'
            }`}
          >
            {top3.name}
            {top3.isPremium && <Crown className='w-3.5 h-3.5 fill-current' />}
          </span>
          <p className='text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-full'>{top3.email}</p>

          <div className='mt-4 pt-3 border-t border-border/60 w-full grid grid-cols-2 gap-2 text-center'>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Bài Đạt</span>
              <p className='text-sm font-black text-foreground'>{top3.passedAttempts}</p>
            </div>
            <div className='space-y-0.5'>
              <span className='text-[10px] font-black text-muted-foreground uppercase'>Điểm TB</span>
              <p className='text-sm font-black text-primary'>{top3.averageScore}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
