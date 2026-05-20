import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchQuestion,
  deleteQuestion,
  bulkDeleteQuestions
} from '@/redux/slice/questionSlice'
import { fetchExam } from '@/redux/slice/examSlice'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Loading from '@/components/Layout/Loading'
import type { IQuestion } from '@/types/backend'
import { Edit, Trash2, Plus, Search, Upload } from 'lucide-react'
import QuestionFormModal from '@/components/Dashboard/Question/QuestionFormModal'
import QuestionBulkImportModal from '@/components/Dashboard/Question/QuestionBulkImportModal'
export default function QuestionPage() {
  const dispatch = useAppDispatch()
  const { data: questions, isFetching, meta } = useAppSelector((state) => state.question)
  const { data: exams } = useAppSelector((state) => state.exam)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExamId, setSelectedExamId] = useState('ALL')
  const limit = 20
  const totalPages = Math.ceil((meta?.total || 0) / limit)
  const [openModal, setOpenModal] = useState(false)
  const [openBulkModal, setOpenBulkModal] = useState(false)
  const [dataUpdate, setDataUpdate] = useState<IQuestion | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  useEffect(() => {
    dispatch(fetchExam({ query: 'limit=1000' }))
  }, [dispatch])
  useEffect(() => {
    setSelectedIds([])
  }, [page, searchTerm, selectedExamId])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let query = `page=${page}&limit=${limit}&searchTerm=${searchTerm}`
      if (selectedExamId && selectedExamId !== 'ALL') {
        query += `&examId=${selectedExamId}`
      }
      dispatch(fetchQuestion({ query }))
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [dispatch, page, searchTerm, selectedExamId])
  const loadQuestions = () => {
    let query = `page=${page}&limit=${limit}&searchTerm=${searchTerm}`
    if (selectedExamId && selectedExamId !== 'ALL') {
      query += `&examId=${selectedExamId}`
    }
    dispatch(fetchQuestion({ query }))
  }
  const handleExamChange = (value: string) => {
    setSelectedExamId(value)
    setPage(1)
  }
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteQuestion({ id })).unwrap()
      toast.success('Question deleted successfully')
      loadQuestions()
    } catch {
      toast.error('Failed to delete question')
    }
  }
  const handleBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuestions({ ids: selectedIds })).unwrap()
      toast.success('Bulk deletion completed successfully')
      setSelectedIds([])
      loadQuestions()
    } catch {
      toast.error('Failed to perform bulk deletion')
    }
  }
  return (
    <div className='p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in'>
      {isFetching && !openModal && <Loading />}
      <QuestionFormModal
        open={openModal}
        setOpen={setOpenModal}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadQuestions}
      />
      <QuestionBulkImportModal open={openBulkModal} setOpen={setOpenBulkModal} onSuccess={loadQuestions} />
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Question Management</h1>
        <div className='flex items-center gap-4'>
          {/* Exam Filter Select Dropdown */}
          <div className='w-64'>
            <Select onValueChange={handleExamChange} value={selectedExamId}>
              <SelectTrigger>
                <SelectValue placeholder='Lọc theo bài thi' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Tất cả đề thi</SelectItem>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='relative w-64'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search questions...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className='pl-8'
            />
          </div>
          {selectedIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive'>
                  <Trash2 className='w-4 h-4 mr-2' /> Xóa hàng loạt ({selectedIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa hàng loạt câu hỏi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Việc này sẽ xóa vĩnh viễn {selectedIds.length} câu hỏi đã chọn
                    cùng với các câu trả lời liên quan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant='outline' onClick={() => setOpenBulkModal(true)}>
            <Upload className='w-4 h-4 mr-2' /> Bulk Import
          </Button>
          <Button
            onClick={() => {
              setDataUpdate(null)
              setOpenModal(true)
            }}
          >
            <Plus className='w-4 h-4 mr-2' /> Create Question
          </Button>
        </div>
      </div>
      <div className='border rounded-md bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox
                  checked={questions.length > 0 && questions.every((q) => selectedIds.includes(q.id))}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const newSelected = [...selectedIds]
                      questions.forEach((q) => {
                        if (!newSelected.includes(q.id)) newSelected.push(q.id)
                      })
                      setSelectedIds(newSelected)
                    } else {
                      const currentPageIds = questions.map((q) => q.id)
                      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
                    }
                  }}
                />
              </TableHead>
              <TableHead className='w-[10%]'>Order</TableHead>
              <TableHead className='w-[40%]'>Question Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(question.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds((prev) => [...prev, question.id])
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => id !== question.id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className='font-mono text-xs'>{question.order}</TableCell>
                  <TableCell className='max-w-[400px]'>
                    <p className='truncate font-medium' title={question.content}>
                      {question.content}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className='text-xs font-semibold px-2 py-1 bg-muted rounded'>{question.type}</span>
                  </TableCell>
                  <TableCell>{question.score}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setDataUpdate(question)
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
                              This action cannot be undone. This will permanently delete the question and its options.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(question.id)}>Continue</AlertDialogAction>
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