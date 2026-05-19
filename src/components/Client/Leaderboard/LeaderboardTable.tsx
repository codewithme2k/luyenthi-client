import React from 'react'
import { Crown, Trophy } from 'lucide-react'

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

interface LeaderboardTableProps {
  rankedStudents: LeaderboardStudent[]
  searchTerm: string
  getImageUrl: (url: string | null | undefined) => string
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ rankedStudents, searchTerm, getImageUrl }) => {
  return (
    <div className='bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs'>
      <div className='p-5 border-b border-border/80 flex items-center gap-2'>
        <Trophy className='text-amber-500 w-5 h-5' />
        <h3 className='text-base font-extrabold font-heading text-foreground'>Danh Sách Xếp Hạng Chi Tiết</h3>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-muted/40 border-b border-border/80 text-xs font-black text-muted-foreground text-left uppercase tracking-wider'>
              <th className='py-4 px-6 text-center w-16'>Hạng</th>
              <th className='py-4 px-4'>Thành Viên</th>
              <th className='py-4 px-4 text-center'>Tổng Lượt Thi</th>
              <th className='py-4 px-4 text-center'>Số Bài Đạt</th>
              <th className='py-4 px-4 text-center'>Độ Chính Xác</th>
              <th className='py-4 px-6 text-right'>Điểm TB</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/60'>
            {rankedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className='text-center py-16 text-muted-foreground'>
                  Không tìm thấy học sinh nào.
                </td>
              </tr>
            ) : (
              rankedStudents.map((student, index) => {
                const rank = index + 1
                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-muted/30 transition-colors ${rank <= 3 && !searchTerm ? 'bg-amber-500/2' : ''
                      }`}
                  >
                    {/* Rank Indicator */}
                    <td className='py-4 px-6 text-center'>
                      {rank === 1 ? (
                        <span className='inline-flex w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs items-center justify-center shadow-xs'>
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className='inline-flex w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs items-center justify-center shadow-xs'>
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className='inline-flex w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs items-center justify-center shadow-xs'>
                          3
                        </span>
                      ) : (
                        <span className='text-xs font-extrabold text-muted-foreground'>{rank}</span>
                      )}
                    </td>

                    {/* Student Profile */}
                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-lg overflow-hidden border border-border bg-muted shrink-0 relative flex items-center justify-center font-bold text-sm'>
                          {student.avatarImg ? (
                            <img
                              src={getImageUrl(student.avatarImg)}
                              alt='Avatar'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            student.name[0].toUpperCase()
                          )}
                        </div>
                        <div className='min-w-0'>
                          <span
                            className={`text-sm font-extrabold flex items-center gap-1 truncate ${student.isPremium ? 'text-amber-500 font-black' : 'text-foreground'
                              }`}
                          >
                            {student.name}
                            {student.isPremium && <Crown className='w-3.5 h-3.5 fill-current shrink-0' />}
                          </span>
                          <span className='text-[10px] text-muted-foreground font-medium truncate block max-w-[200px] sm:max-w-xs'>
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Attempts */}
                    <td className='py-4 px-4 text-center'>
                      <span className='text-xs font-bold text-foreground bg-muted/60 border border-border px-2 py-0.5 rounded'>
                        {student.totalAttempts} lượt
                      </span>
                    </td>

                    {/* Passed attempts */}
                    <td className='py-4 px-4 text-center'>
                      <span className='text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded'>
                        {student.passedAttempts} bài
                      </span>
                    </td>

                    {/* Accuracy Rate progress bar */}
                    <td className='py-4 px-4'>
                      <div className='flex items-center justify-center gap-2 max-w-[120px] mx-auto'>
                        <div className='w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border'>
                          <div
                            className={`h-full rounded-full ${student.accuracyRate >= 80
                                ? 'bg-emerald-500'
                                : student.accuracyRate >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            style={{ width: `${student.accuracyRate}%` }}
                          />
                        </div>
                        <span className='text-xs font-black text-foreground shrink-0'>{student.accuracyRate}%</span>
                      </div>
                    </td>

                    {/* Average Score */}
                    <td className='py-4 px-6 text-right'>
                      <span className='text-sm font-black text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-xl'>
                        {student.averageScore}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
