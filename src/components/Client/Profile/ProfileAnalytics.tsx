import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, Award, GraduationCap, TrendingUp, Sparkles, Compass } from 'lucide-react'
import type { NavigateFunction } from 'react-router'
import type { IExamSession } from '@/types/profile'

interface Props {
  sessions: IExamSession[]
  navigate: NavigateFunction
}

type CategoryStat = {
  name: string
  attempts: number
  passed: number
  passRate: number
  avgScorePct: number
}

type AnalyticsData = {
  total: number
  passed: number
  passRate: number
  avgScore10: number
  performance: string
  performanceColor: string
  scoreTrendPoints: number[]
  categoryStats: CategoryStat[]
}

export default function ProfileAnalytics({ sessions, navigate }: Props) {
  const analyticsData = useMemo<AnalyticsData | null>(() => {
    if (!sessions || sessions.length === 0) return null

    const total = sessions.length
    const passed = sessions.filter((s) => s.score >= (s.exam?.passMarks ?? 50)).length
    const passRate = Math.round((passed / total) * 100)

    const averageScore =
      sessions.reduce((sum, s) => {
        const examMax = s.exam?.totalMarks || 100
        const pct = s.score / examMax
        return sum + pct * 10
      }, 0) / total

    const avgScore10 = Math.round(averageScore * 10) / 10

    let performance = 'Cần cố gắng'
    let performanceColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    if (avgScore10 >= 8.0) {
      performance = 'Xuất sắc'
      performanceColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    } else if (avgScore10 >= 6.5) {
      performance = 'Khá'
      performanceColor = 'text-primary bg-primary/10 border-primary/20'
    } else if (avgScore10 >= 5.0) {
      performance = 'Trung bình'
      performanceColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    }

    const chronologicalSessions = [...sessions].reverse()
    const scoreTrendPoints = chronologicalSessions.map((s) => {
      const examMax = s.exam?.totalMarks || 100
      return Math.round((s.score / examMax) * 100)
    })

    const categoryMap: Record<string, { name: string; attempts: number; passed: number; totalScorePct: number }> = {}
    sessions.forEach((s) => {
      const catName = s.exam?.category?.name || 'Khác'
      const isPassed = s.score >= (s.exam?.passMarks ?? 50)
      const examMax = s.exam?.totalMarks || 100
      const pct = (s.score / examMax) * 100

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, attempts: 0, passed: 0, totalScorePct: 0 }
      }
      categoryMap[catName].attempts += 1
      if (isPassed) categoryMap[catName].passed += 1
      categoryMap[catName].totalScorePct += pct
    })

    const categoryStats = Object.values(categoryMap)
      .map((cat) => ({
        name: cat.name,
        attempts: cat.attempts,
        passed: cat.passed,
        passRate: Math.round((cat.passed / cat.attempts) * 100),
        avgScorePct: Math.round(cat.totalScorePct / cat.attempts)
      }))
      .sort((a, b) => b.avgScorePct - a.avgScorePct)

    return {
      total,
      passed,
      passRate,
      avgScore10,
      performance,
      performanceColor,
      scoreTrendPoints,
      categoryStats
    }
  }, [sessions])

  const renderScoreChart = () => {
    if (!analyticsData || analyticsData.scoreTrendPoints.length < 2) {
      return (
        <div className='flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/20'>
          <TrendingUp className='w-10 h-10 mb-2 text-muted-foreground/65 animate-bounce' />
          <p className='text-sm font-bold'>Cần hoàn thành ít nhất 2 bài thi để vẽ biểu đồ tiến độ học tập</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Hãy ôn tập và thi tiếp để hệ thống cập nhật biểu đồ năng lực!
          </p>
        </div>
      )
    }

    const points = analyticsData.scoreTrendPoints
    const width = 600
    const height = 180
    const padding = 30

    const xScale = (width - padding * 2) / (points.length - 1)
    const yScale = (val: number) => {
      const activeHeight = height - padding * 2
      return height - padding - (val / 100) * activeHeight
    }

    let linePath = ''
    let areaPath = ''

    points.forEach((pt, index) => {
      const x = padding + index * xScale
      const y = yScale(pt)

      if (index === 0) {
        linePath = `M ${x} ${y}`
        areaPath = `M ${x} ${height - padding} L ${x} ${y}`
      } else {
        linePath += ` L ${x} ${y}`
        areaPath += ` L ${x} ${y}`
      }

      if (index === points.length - 1) {
        areaPath += ` L ${x} ${height - padding} Z`
      }
    })

    return (
      <div className='space-y-4'>
        <div className='flex justify-between items-center text-xs font-bold text-muted-foreground'>
          <span>Tỷ lệ điểm đạt (%) qua từng đợt thi (Cũ nhất ➔ Mới nhất)</span>
          <span className='text-primary flex items-center gap-1 font-black'>
            <Sparkles className='w-3.5 h-3.5 fill-current' /> Tự động cập nhật
          </span>
        </div>
        <div className='w-full overflow-hidden bg-muted/10 border border-border/80 rounded-2xl p-4'>
          <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-auto overflow-visible'>
            <defs>
              <linearGradient id='chart-area-grad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--color-primary, #8b5cf6)' stopOpacity='0.25' />
                <stop offset='100%' stopColor='var(--color-primary, #8b5cf6)' stopOpacity='0' />
              </linearGradient>
            </defs>

            {[0, 25, 50, 75, 100].map((val) => {
              const y = yScale(val)
              return (
                <g key={val}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke='var(--color-border, #e5e7eb)'
                    strokeWidth='0.8'
                    strokeDasharray='4 4'
                  />
                  <text
                    x={padding - 8}
                    y={y + 3}
                    textAnchor='end'
                    className='text-[9px] font-bold fill-muted-foreground'
                  >
                    {val}%
                  </text>
                </g>
              )
            })}

            <path d={areaPath} fill='url(#chart-area-grad)' />
            <path
              d={linePath}
              fill='none'
              stroke='var(--color-primary, #8b5cf6)'
              strokeWidth='3.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            {points.map((pt, index) => {
              const x = padding + index * xScale
              const y = yScale(pt)
              return (
                <g key={index} className='group cursor-pointer'>
                  <circle cx={x} cy={y} r='5' fill='#ffffff' stroke='var(--color-primary, #8b5cf6)' strokeWidth='3' />
                  <circle
                    cx={x}
                    cy={y}
                    r='8'
                    fill='var(--color-primary, #8b5cf6)'
                    opacity='0'
                    className='hover:opacity-10 transition-opacity'
                  />
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className='bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-xs'>
        <Compass className='w-12 h-12 mx-auto mb-3 text-muted-foreground/60 animate-pulse' />
        <h3 className='text-lg font-bold text-foreground'>Chưa có báo cáo năng lực</h3>
        <p className='text-sm text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed'>
          Bạn chưa hoàn thành bất kỳ bài thi nào. Hãy quay lại Kho Đề Thi, chinh phục thử thách để mở khóa các phân tích
          chi tiết!
        </p>
        <Button onClick={() => navigate('/exams')} className='mt-6 font-bold rounded-xl'>
          Tới Kho Đề Thi
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0'>
            <BookOpen className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>
              Tổng Đề Thi
            </span>
            <p className='text-xl font-black text-foreground mt-0.5'>{analyticsData.total}</p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0'>
            <CheckCircle className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>Bài Đạt</span>
            <p className='text-xl font-black text-emerald-500 mt-0.5'>{analyticsData.passed}</p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0'>
            <Award className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>
              Điểm Trung Bình
            </span>
            <p className='text-xl font-black text-amber-600 mt-0.5'>
              {analyticsData.avgScore10} <span className='text-xs text-muted-foreground font-semibold'>/10</span>
            </p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0'>
            <GraduationCap className='w-5 h-5' />
          </div>
          <div>
            <span className='text-[10px] font-black text-muted-foreground uppercase tracking-wider block'>Học Lực</span>
            <p
              className={`text-xs font-black px-2 py-0.5 mt-1 rounded border inline-block ${analyticsData.performanceColor}`}
            >
              {analyticsData.performance}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-card border border-border rounded-2xl p-6 shadow-xs'>
        <h3 className='text-base font-extrabold font-heading text-foreground mb-4 flex items-center gap-2'>
          <TrendingUp className='text-primary w-5 h-5' /> Biểu đồ tiến độ
        </h3>
        {renderScoreChart()}
      </div>

      <div className='bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4'>
        <h3 className='text-base font-extrabold font-heading text-foreground flex items-center gap-2'>
          <GraduationCap className='text-primary w-5 h-5' /> Phân tích năng lực theo môn học
        </h3>
        <p className='text-xs text-muted-foreground font-semibold'>
          Báo cáo chi tiết tỉ lệ vượt qua bài thi và điểm số trung bình của bạn trên từng danh mục môn học.
        </p>

        <div className='space-y-4 pt-2'>
          {analyticsData.categoryStats.map((cat, idx) => {
            let colorClass = 'bg-rose-500'
            let textClass = 'text-rose-500 bg-rose-500/10 border-rose-500/25'
            if (cat.avgScorePct >= 75) {
              colorClass = 'bg-emerald-500'
              textClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25'
            } else if (cat.avgScorePct >= 50) {
              colorClass = 'bg-amber-500'
              textClass = 'text-amber-500 bg-amber-500/10 border-amber-500/25'
            }

            return (
              <div key={idx} className='border border-border/60 rounded-xl p-4 hover:bg-muted/15 transition-all'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3'>
                  <div className='space-y-0.5'>
                    <span className='text-sm font-extrabold text-foreground'>{cat.name}</span>
                    <span className='text-[10px] text-muted-foreground font-semibold block'>
                      Đã thi {cat.attempts} lần (Đạt {cat.passed}/{cat.attempts})
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] font-black px-2 py-0.5 rounded border uppercase leading-none'>
                      Tỉ lệ Đạt: {cat.passRate}%
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg border leading-none ${textClass}`}>
                      Điểm TB: {Math.round((cat.avgScorePct / 10) * 10) / 10}/10
                    </span>
                  </div>
                </div>

                <div className='w-full bg-muted rounded-full h-2 overflow-hidden border border-border'>
                  <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${cat.avgScorePct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
