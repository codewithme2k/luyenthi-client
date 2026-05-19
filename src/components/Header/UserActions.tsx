import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setLogoutAction } from '@/redux/slice/accountSlice'
import { Button } from '@/components/ui/button'
import { LogOut, User, LayoutDashboard, ChevronDown, ShieldCheck, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { callLogout } from '@/config/api'

export const UserActions: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.account)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await callLogout()
    } catch (error) {
      console.error('Backend logout error:', error)
    }
    dispatch(setLogoutAction())
    toast.success('Đã đăng xuất thành công!')
    navigate('/')
    setDropdownOpen(false)
  }

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER'

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || ''
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${cleanBackendUrl}${cleanUrl}`
  }

  if (isAuthenticated) {
    return (
      <div className='relative z-50'>
        {/* User Dropdown Trigger */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted/40 transition-all duration-300 font-semibold text-sm cursor-pointer'
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-sm ${
              user?.isPremium
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                : 'bg-primary/10 border-primary/20 text-primary'
            }`}
          >
            {user?.profileImg ? (
              <img src={getImageUrl(user.profileImg)} alt='Avatar' className='w-full h-full object-cover' />
            ) : user?.isPremium ? (
              <Crown className='w-4 h-4 fill-current' />
            ) : isAdminOrManager ? (
              <ShieldCheck className='w-4 h-4' />
            ) : (
              <User className='w-4 h-4' />
            )}
          </div>
          <span
            className={`max-w-[100px] truncate hidden md:inline-block ${user?.isPremium ? 'text-amber-500 font-bold' : 'text-foreground'}`}
          >
            {user?.name || user?.email || 'Người dùng'}
          </span>
          {user?.isPremium && (
            <span className='text-[10px] font-black text-amber-500 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/20 scale-90 hidden md:inline-block leading-none'>
              VIP
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground hidden md:inline-block transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            {/* Click-away Overlay backdrop */}
            <div className='fixed inset-0 z-40 cursor-default' onClick={() => setDropdownOpen(false)} />

            <div className='absolute right-0 mt-2 w-52 rounded-2xl border border-border/60 bg-popover/90 backdrop-blur-md p-2 shadow-2xl z-50 animate-fade-in font-medium text-sm'>
              <div className='px-3 py-2 border-b border-border mb-1 text-xs text-muted-foreground flex justify-between items-center'>
                <div>
                  Vai trò: <span className='font-bold text-foreground uppercase'>{user?.role || 'USER'}</span>
                </div>
                {user?.isPremium && (
                  <span className='text-[10px] font-extrabold text-amber-500 flex items-center gap-0.5'>
                    <Crown className='w-3 h-3 fill-current' /> VIP
                  </span>
                )}
              </div>

              {isAdminOrManager && (
                <Link
                  to='/admin'
                  onClick={() => setDropdownOpen(false)}
                  className='flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-semibold'
                >
                  <LayoutDashboard className='w-4 h-4' />
                  <span>Trang Quản Trị</span>
                </Link>
              )}

              <Link
                to='/profile'
                onClick={() => setDropdownOpen(false)}
                className='flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-semibold'
              >
                <User className='w-4 h-4' />
                <span>Hồ Sơ Cá Nhân</span>
              </Link>

              <Link
                to='/premium'
                onClick={() => setDropdownOpen(false)}
                className='flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 transition-colors text-foreground font-semibold'
              >
                <Crown className='w-4 h-4 text-amber-500 fill-amber-500/10' />
                <span className='text-amber-500'>Nâng Cấp Premium</span>
              </Link>

              <button
                onClick={handleLogout}
                className='flex w-full items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-foreground font-semibold cursor-pointer text-left'
              >
                <LogOut className='w-4 h-4' />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  // Not authenticated
  return (
    <div className='flex items-center gap-2'>
      <Link to='/login'>
        <Button className='btn-premium h-10 px-5 rounded-xl font-extrabold cursor-pointer'>Đăng Nhập</Button>
      </Link>
    </div>
  )
}
