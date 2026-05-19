import React from 'react'
import { Link } from 'react-router'

interface FooterLinkItem {
  label: string
  to: string
}

interface FooterLinkGroup {
  title: string
  links: FooterLinkItem[]
}

export const FooterLinks: React.FC = () => {
  const linkGroups: FooterLinkGroup[] = [
    {
      title: 'Học Tập',
      links: [
        { label: 'Kho Đề Thi', to: '/exams' },
        { label: 'Bảng Xếp Hạng', to: '/leaderboard' },
        { label: 'Khóa Học Online', to: '/courses' },
        { label: 'Cẩm Nang Ôn Thi', to: '/blog' }
      ]
    },
    {
      title: 'Tính Năng',
      links: [
        { label: 'Nâng Cấp Premium', to: '/premium' },
        { label: 'Báo Cáo Năng Lực', to: '/profile' },
        { label: 'Bài Viết Đã Lưu', to: '/profile' },
        { label: 'Hồ Sơ Cá Nhân', to: '/profile' }
      ]
    },
    {
      title: 'Chính Sách & Hỗ Trợ',
      links: [
        { label: 'Điều Khoản Sử Dụng', to: '#' },
        { label: 'Chính Sách Bảo Mật', to: '#' },
        { label: 'Trung Tâm Trợ Giúp', to: '#' },
        { label: 'Liên Hệ Hợp Tác', to: '#' }
      ]
    }
  ]

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12'>
      {linkGroups.map((group) => (
        <div key={group.title} className='space-y-4'>
          <h3 className='text-xs font-black text-foreground uppercase tracking-widest leading-none'>{group.title}</h3>
          <ul className='space-y-2.5'>
            {group.links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className='text-sm font-semibold text-muted-foreground hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 block w-fit'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
