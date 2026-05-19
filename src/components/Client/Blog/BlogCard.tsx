import React from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react'
import type { IPost } from '@/types/backend'

interface BlogCardProps {
  post: IPost
  index: number
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  // Estimated reading time
  const readTime = Math.max(1, Math.round((post.content || '').split(/\s+/).length / 200))

  // Custom abstract covers
  const abstractGradients = [
    'from-blue-600/35 to-indigo-600/35',
    'from-purple-600/35 to-pink-600/35',
    'from-violet-600/35 to-fuchsia-600/35',
    'from-emerald-600/35 to-teal-600/35'
  ]
  const gradient = abstractGradients[index % abstractGradients.length]

  // Strip markdown symbols to generate a plain text excerpt
  const getExcerpt = (markdown: string, charLimit: number = 120) => {
    if (!markdown) return ''
    const cleanText = markdown
      .replace(/[#*`>_\-~]/g, '') // strip standard markdown characters
      .replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    return cleanText.length > charLimit ? cleanText.substring(0, charLimit) + '...' : cleanText
  }

  return (
    <article className='glass rounded-2xl border border-border/80 flex flex-col justify-between overflow-hidden card-hover'>
      <div>
        {/* Cover Photo */}
        <div className='w-full h-48 overflow-hidden relative border-b border-border/60 bg-muted shrink-0'>
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-tr ${gradient} flex items-center justify-center`}>
              <BookOpen className='w-12 h-12 text-foreground/20 animate-pulse' />
            </div>
          )}

          {/* Read Time Tag */}
          <span className='absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            {readTime} Phút Đọc
          </span>
        </div>

        {/* Metadata & Title */}
        <div className='p-6 space-y-3'>
          <div className='flex items-center gap-4 text-xs font-bold text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Calendar className='w-3.5 h-3.5' />
              {new Date(post.createdAt || '').toLocaleDateString('vi-VN')}
            </span>
            <span>•</span>
            <span>Bởi {post.author?.name || 'Admin'}</span>
          </div>

          <h3 className='font-extrabold text-lg sm:text-xl font-heading leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors'>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className='text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3'>
            {getExcerpt(post.content || '')}
          </p>
        </div>
      </div>

      {/* Read More Action */}
      <div className='p-6 pt-0 border-t border-border/30 mt-4'>
        <Link to={`/blog/${post.slug}`}>
          <Button
            variant='ghost'
            className='w-full justify-between hover:bg-primary/5 hover:text-primary p-0 h-10 group/btn font-extrabold text-sm text-foreground/80 cursor-pointer'
          >
            <span>Đọc Bài Viết</span>
            <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
          </Button>
        </Link>
      </div>
    </article>
  )
}
