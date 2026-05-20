import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchExam, deleteExam } from '@/redux/slice/examSlice'
import { Button } from '@/components/ui/button'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'


import { toast } from 'sonner'
import Loading from '@/components/Layout/Loading'
import type { IExam } from '@/types/backend'
import { Edit, Trash2, Plus, Search } from 'lucide-react'

import ExamFormModal from '@/components/Dashboard/Exam/ExamFormModal'

export default function ExamPage() {
  const dispatch = useAppDispatch()
  const { data: exams, isFetching, meta } = useAppSelector((state) => state.exam)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const limit = 10
  const totalPages = Math.ceil((meta?.total || 0) / limit)

  const [openModal, setOpenModal] = useState(false)
  const [dataUpdate, setDataUpdate] = useState<IExam | null>(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchExam({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }))
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [dispatch, page, searchTerm])

  const loadExams = () => {
    dispatch(fetchExam({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }))
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteExam({ id })).unwrap()
      toast.success('Exam deleted successfully')
      loadExams()
    } catch {
      toast.error('Failed to delete exam')
    }
  }

  return (
    <div className='p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in'>
      {isFetching && !openModal && <Loading />}

      <ExamFormModal
        open={openModal}
        setOpen={setOpenModal}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadExams}
      />

      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Exam Management</h1>
        <div className='flex gap-4'>
          <div className='relative w-64'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search exams...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className='pl-8'
            />
          </div>
          <Button
            onClick={() => {
              setDataUpdate(null)
              setOpenModal(true)
            }}
          >
            <Plus className='w-4 h-4 mr-2' /> Create Exam
          </Button>
        </div>
      </div>

      <div className='border rounded-md bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  No exams found.
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className='font-medium'>{exam.title}</TableCell>
                  <TableCell className='font-mono text-xs'>{exam.categoryId.substring(0, 8)}</TableCell>
                  <TableCell>{exam.duration}m</TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-1 items-start'>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${exam.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {exam.isPremium && (
                        <span className='px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200'>
                          👑 Premium
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setDataUpdate(exam)
                          setOpenModal(true)
                        }}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive' size='sm'>
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the exam.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(exam.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className='mt-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href='#'
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < totalPages) setPage(page + 1)
                  }}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
