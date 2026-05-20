import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setLogoutAction } from '@/redux/slice/accountSlice'
import {
  Menu,
  X,
  Home,
  BookOpen,
  LogOut,
  User,
  LayoutDashboard,
  ShieldCheck,
  Crown,
  Trophy,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { callLogout } from '@/config/api'

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useAppSelector((state) => state.account)
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER'

  const handleLogout = async () => {
    try {
      await callLogout()
    } catch (error) {
      console.error('Backend logout error:', error)
    }
    dispatch(setLogoutAction())
    toast.success('Đã đăng xuất thành công!')
    navigate('/')
    setIsOpen(false)
  }

  return (
    <div className='md:hidden'>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className='w-10 h-10 rounded-xl border border-border flex items-center justify-center bg-background/50 hover:bg-muted/50 transition-colors cursor-pointer'>
            <Menu className='w-5 h-5 text-foreground' />
          </button>
        </SheetTrigger>

        <SheetContent
          side='right'
          showCloseButton={false}
          className='w-[280px] p-6 flex flex-col justify-between h-full bg-card border-l border-border'
        >
          <div className='space-y-6'>
            {/* Drawer Header */}
            <div className='flex justify-between items-center pb-4 border-b border-border'>
              <SheetTitle className='font-extrabold font-heading text-primary text-base'>Menu Điều Hướng</SheetTitle>
              <SheetDescription className='sr-only'>Menu điều hướng di động của Luyện Thi Pro</SheetDescription>
              <button
                onClick={() => setIsOpen(false)}
                className='w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-muted cursor-pointer'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Vertical Navigation Links (2-Level Categorized Menu) */}
            <nav className='flex flex-col gap-5'>
              {/* Category 1: Tổng Quan */}
              <div className='space-y-1'>
                <span className='text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2.5 block mb-1'>
                  Tổng quan
                </span>
                <Link
                  to='/'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${currentPath === '/'
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                >
                  <Home className='w-4 h-4' />
                  <span>Trang Chủ</span>
                </Link>
                <Link
                  to='/premium'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors border border-transparent ${currentPath === '/premium'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15 shadow-xs'
                    : 'text-amber-500 hover:bg-amber-500/5'
                    }`}
                >
                  <Crown className='w-4 h-4 fill-amber-500/10' />
                  <span>Gói Premium</span>
                </Link>
              </div>

              {/* Category 2: Học Tập & Luyện Đề */}
              <div className='space-y-1'>
                <span className='text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2.5 block mb-1'>
                  Học tập & Luyện đề
                </span>
                <Link
                  to='/courses'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${currentPath.startsWith('/courses')
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                >
                  <GraduationCap className='w-4 h-4 text-violet-500' />
                  <span>Khoá Học E-Learning</span>
                </Link>
                <Link
                  to='/exams'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${currentPath === '/exams' || currentPath.startsWith('/exam/')
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                >
                  <BookOpen className='w-4 h-4 text-sky-500' />
                  <span>Kho Đề Thi Trắc Nghiệm</span>
                </Link>
              </div>

              {/* Category 3: Tương Tác & Cộng Đồng */}
              <div className='space-y-1'>
                <span className='text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2.5 block mb-1'>
                  Cộng đồng & Cẩm nang
                </span>
                <Link
                  to='/leaderboard'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${currentPath === '/leaderboard'
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                >
                  <Trophy className='w-4 h-4 text-amber-500' />
                  <span>Bảng Vàng Danh Dự</span>
                </Link>
                <Link
                  to='/blog'
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${currentPath === '/blog' || currentPath.startsWith('/blog/')
                    ? 'bg-primary/10 text-primary border border-primary/15 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                >
                  <BookOpen className='w-4 h-4 text-violet-500' />
                  <span>Cẩm Nang Ôn Thi</span>
                </Link>
              </div>
            </nav>
          </div>

          {/* Bottom Actions Area (Auth Options) */}
          <div className='border-t border-border pt-6 mt-6 space-y-4'>
            {isAuthenticated ? (
              <div className='space-y-4'>
                {/* Logged In Info */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl bg-muted/40 border ${user?.isPremium ? 'border-amber-500/35' : 'border-border'
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${user?.isPremium
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                      : 'bg-primary/10 border-primary/20 text-primary'
                      }`}
                  >
                    {user?.isPremium ? (
                      <Crown className='w-5 h-5 fill-current' />
                    ) : isAdminOrManager ? (
                      <ShieldCheck className='w-5 h-5' />
                    ) : (
                      <User className='w-5 h-5' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-muted-foreground font-semibold uppercase leading-none flex items-center gap-1.5'>
                      {user.role}
                      {user?.isPremium && (
                        <span className='text-[9px] font-black text-amber-500 bg-amber-500/15 px-1 py-0.2 rounded border border-amber-500/20 leading-none'>
                          VIP
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-sm font-bold truncate leading-snug mt-1.5 ${user?.isPremium ? 'text-amber-500 font-extrabold' : 'text-foreground'
                        }`}
                    >
                      {user.name || user.email}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {isAdminOrManager && (
                  <Link
                    to='/admin'
                    onClick={() => setIsOpen(false)}
                    className='flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-bold text-sm border border-border/80 shadow-sm'
                  >
                    <LayoutDashboard className='w-4 h-4' />
                    <span>Trang Quản Trị</span>
                  </Link>
                )}

                <Link
                  to='/profile'
                  onClick={() => setIsOpen(false)}
                  className='flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-foreground font-bold text-sm border border-border/80 shadow-sm'
                >
                  <User className='w-4 h-4' />
                  <span>Hồ Sơ Cá Nhân</span>
                </Link>

                <Link
                  to='/premium'
                  onClick={() => setIsOpen(false)}
                  className='flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 transition-colors text-foreground font-bold text-sm border border-border/80 shadow-sm'
                >
                  <Crown className='w-4 h-4 text-amber-500 fill-amber-500/10' />
                  <span className='text-amber-500'>Nâng Cấp Premium</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className='flex w-full items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-foreground font-bold text-sm border border-border/80 shadow-sm cursor-pointer text-left'
                >
                  <LogOut className='w-4 h-4' />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                {/* Not Logged In Buttons */}
                <Link to='/login' onClick={() => setIsOpen(false)} className='w-full'>
                  <Button className='btn-premium w-full h-11 rounded-xl font-extrabold cursor-pointer'>
                    Đăng Nhập
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
