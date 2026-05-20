import {
  LayoutDashboard,
  Users,
  Tags,
  FileText,
  BookOpen,
  LogOut,
  HelpCircle,
  ClipboardCheck,
  Crown,
  BookMarked,
  GraduationCap
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router'
import { useAppSelector } from '@/redux/hooks'
import { callLogout } from '@/config/api'
import { toast } from 'sonner'

const items = [
  {
    title: 'Bảng Điều Khiển',
    url: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Quản Lý Học Sinh',
    url: '/admin/user',
    icon: Users
  },
  {
    title: 'Danh Mục Đề Thi',
    url: '/admin/category',
    icon: Tags
  },
  {
    title: 'Quản Lý Đề Thi',
    url: '/admin/exam',
    icon: BookOpen
  },
  {
    title: 'Quản Lý Khoá Học',
    url: '/admin/courses',
    icon: GraduationCap
  },
  {
    title: 'Ngân Hàng Câu Hỏi',
    url: '/admin/question',
    icon: HelpCircle
  },
  {
    title: 'Bài Viết & Tin Tức',
    url: '/admin/post',
    icon: FileText
  },
  {
    title: 'Chấm Thi Tự Luận',
    url: '/admin/grading',
    icon: ClipboardCheck
  },
  {
    title: 'Phê Duyệt VIP',
    url: '/admin/membership-request',
    icon: Crown
  }
]

export function AppSidebar() {
  const location = useLocation()
  const user = useAppSelector((state) => state.account.user)

  const handleLogout = async () => {
    try {
      await callLogout()
      toast.success('Đăng xuất thành công!')
      window.location.href = '/login'
    } catch {
      toast.error('Đăng xuất thất bại!')
    }
  }

  return (
    <Sidebar className='border-r border-border/80 bg-card shadow-xs'>
      {/* 1. Premium Logo Header */}
      <SidebarHeader className='p-6 border-b border-border/80'>
        <div className='flex items-center gap-3 group cursor-pointer'>
          <div className='w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-md shadow-primary/20 relative overflow-hidden transition-transform duration-500 group-hover:scale-105'>
            <BookMarked className='w-5 h-5 relative z-10' />
            <div className='absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
          </div>
          <div className='flex flex-col'>
            <span className='font-extrabold font-heading text-base leading-none text-foreground tracking-tight'>
              Luyện Thi Pro
            </span>
            <span className='text-[9px] font-black text-primary tracking-wider uppercase mt-1.5 leading-none'>
              Hệ Thống Admin
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* 2. Sidebar Navigation Items */}
      <SidebarContent className='p-3'>
        <SidebarGroup className='p-0'>
          <SidebarGroupLabel className='px-4 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-3'>
            Danh Mục Quản Lý
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1.5'>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`w-full rounded-xl transition-all duration-300 flex items-center gap-3 px-4 py-3 h-11 border border-transparent font-bold cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary border-primary/15 shadow-[0_4px_12px_-2px_rgba(139,92,246,0.12)]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:translate-x-1'
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Redesigned User Card & Logout Footer */}
      <SidebarFooter className='p-4 border-t border-border/80 bg-background/30'>
        <SidebarMenu className='gap-2'>
          {/* User Profile Badge */}
          <SidebarMenuItem>
            <div className='flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/65 transition-all duration-300 cursor-pointer group'>
              <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner group-hover:scale-105 transition-transform duration-300'>
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className='flex-1 min-w-0'>
                <span className='px-1.5 py-0.5 rounded text-[8px] font-black text-primary bg-primary/10 border border-primary/25 uppercase tracking-wider leading-none'>
                  {user?.role || 'ADMIN'}
                </span>
                <p className='text-xs font-extrabold text-foreground truncate mt-1.5 leading-none'>
                  {user?.name || 'Quản Trị Viên'}
                </p>
                <p className='text-[10px] text-muted-foreground truncate leading-none mt-1'>{user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>

          {/* Elegant Logout Action Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className='w-full h-10 rounded-xl font-bold text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-xs'
            >
              <LogOut className='w-3.5 h-3.5' />
              <span>Đăng Xuất Hệ Thống</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
