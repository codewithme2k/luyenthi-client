import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Layout/Loading'
import { Bookmark, BookOpen } from 'lucide-react'
import type { IPost } from '@/types/backend'

interface Props {
  savedPosts: IPost[]
  isLoading: boolean
}

export default function ProfileSavedPosts({ savedPosts, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className='py-20'>
        <Loading />
      </div>
    )
  }

  if (savedPosts.length === 0) {
    return (
      <div className='bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs'>
        <Bookmark className='w-12 h-12 mx-auto mb-3 text-muted-foreground/60 animate-pulse' />
        <h3 className='text-lg font-bold text-foreground'>Không có bài viết đã lưu</h3>
        <p className='text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed'>
          Bạn chưa lưu bất kỳ bài viết nào. Hãy ghé thăm trang Cẩm Nang, tìm kiếm những kiến thức bổ ích và lưu lại để
          ôn tập sau!
        </p>
        <Link to='/blog'>
          <Button className='mt-6 font-bold rounded-xl cursor-pointer'>Tới Trang Cẩm Nang</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {savedPosts.map((post) => (
        <div
          key={post.id}
          className='glass rounded-2xl border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group h-full bg-background/50'
        >
          {post.thumbnail ? (
            <div className='w-full h-44 overflow-hidden border-b border-border relative shrink-0'>
              <img
                src={post.thumbnail}
                alt={post.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              />
            </div>
          ) : (
            <div className='w-full h-44 bg-linear-to-br from-violet-500/10 via-primary/5 to-fuchsia-500/10 flex items-center justify-center border-b border-border shrink-0'>
              <BookOpen className='w-8 h-8 text-primary/40' />
            </div>
          )}
          <div className='p-5 flex flex-col justify-between grow'>
            <div className='space-y-2'>
              <span className='text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20 inline-block'>
                Cẩm Nang
              </span>
              <h3 className='font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight'>
                {post.title}
              </h3>
              <p className='text-xs text-muted-foreground line-clamp-3 leading-relaxed'>
                {post.content.replace(/[#*`>_-]/g, '').slice(0, 120)}...
              </p>
            </div>
            <div className='pt-4 border-t border-border mt-5 flex justify-between items-center shrink-0'>
              <span className='text-[10px] font-semibold text-muted-foreground'>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}
              </span>
              <Link to={`/blog/${post.slug}`}>
                <Button size='sm' className='font-bold rounded-lg text-xs h-8 cursor-pointer btn-premium'>
                  Đọc tiếp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
