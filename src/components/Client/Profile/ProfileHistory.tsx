import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Loading from '@/components/Layout/Loading'
import { Eye } from 'lucide-react'
import type { NavigateFunction } from 'react-router'
import type { IExamSession } from '@/types/profile'

interface Props {
  sessions: IExamSession[]
  isLoading: boolean
  navigate: NavigateFunction
}

export default function ProfileHistory({ sessions, isLoading, navigate }: Props) {
  return (
    <div className='bg-card border border-border rounded-2xl overflow-hidden shadow-sm'>
      {isLoading ? (
        <div className='py-20'>
          <Loading />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/30 hover:bg-muted/30'>
              <TableHead className='py-4'>Đề thi</TableHead>
              <TableHead>Thời gian nộp bài</TableHead>
              <TableHead className='text-right'>Điểm số</TableHead>
              <TableHead className='text-center'>Kết quả</TableHead>
              <TableHead className='text-center'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className='font-semibold text-foreground py-4'>{session.exam?.title}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {new Date(session.createdAt).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell className='text-right font-bold text-primary text-lg'>
                    {Math.round(session.score * 10) / 10}
                    <span className='text-xs text-muted-foreground font-normal ml-1'>/ {session.exam?.totalMarks}</span>
                  </TableCell>
                  <TableCell className='text-center'>
                    {session.score >= (session.exam?.passMarks ?? 50) ? (
                      <span className='text-xs px-3 py-1 bg-green-500/10 text-green-600 rounded-md font-bold uppercase'>
                        Đạt
                      </span>
                    ) : (
                      <span className='text-xs px-3 py-1 bg-destructive/10 text-destructive rounded-md font-bold uppercase'>
                        Chưa Đạt
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => navigate(`/exam-result/${session.id}`)}
                      className='border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 gap-1 font-bold rounded-lg text-xs'
                    >
                      <Eye className='w-3.5 h-3.5' /> Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-16 text-muted-foreground'>
                  Bạn chưa hoàn thành bài thi nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
