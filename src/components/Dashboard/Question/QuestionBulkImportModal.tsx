import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createQuestion } from '@/redux/slice/questionSlice'
import { fetchExam } from '@/redux/slice/examSlice'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export interface IQuestionBulkProps {
  open: boolean
  setOpen: (v: boolean) => void
  onSuccess: () => void
}

const QuestionBulkImportModal = ({ open, setOpen, onSuccess }: IQuestionBulkProps) => {
  const dispatch = useAppDispatch()
  const { data: exams } = useAppSelector((state) => state.exam)

  const [examId, setExamId] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    if (open) {
      dispatch(fetchExam({ query: 'limit=100' }))
      setExamId('')
      setJsonText('')
      setFileError(null)
      setParsedPreview(null)
      setIsImporting(false)
    }
  }, [dispatch, open])

  const handleJsonChange = (val: string) => {
    setJsonText(val)
    if (!val.trim()) {
      setParsedPreview(null)
      setFileError(null)
      return
    }
    try {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        setFileError('JSON must be an array of questions.')
        setParsedPreview(null)
        return
      }
      setFileError(null)
      setParsedPreview(parsed)
    } catch (e: any) {
      setFileError('Invalid JSON syntax: ' + e.message)
      setParsedPreview(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      handleJsonChange(text)
    }
    reader.onerror = () => {
      setFileError('Failed to read file.')
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!examId) {
      toast.error('Please select an exam first.')
      return
    }
    if (fileError || !parsedPreview || parsedPreview.length === 0) {
      toast.error('Please provide a valid JSON list of questions.')
      return
    }

    setIsImporting(true)
    let successCount = 0
    try {
      for (const q of parsedPreview) {
        // Clean options for types like ESSAY or FILL_BLANK which shouldn't have them
        const hasOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'MATCHING', 'FILL_BLANK'].includes(q.type)
        const cleanOptions = hasOptions
          ? q.options?.map((opt: any, index: number) => ({
              content: opt.content || '',
              isCorrect: !!opt.isCorrect,
              order: typeof opt.order === 'number' ? opt.order : index + 1
            }))
          : undefined

        const formattedQuestion = {
          examId,
          content: q.content || '',
          type: q.type || 'SINGLE_CHOICE',
          score: typeof q.score === 'number' ? q.score : 1,
          order: typeof q.order === 'number' ? q.order : successCount + 1,
          explanation: q.explanation || '',
          options: cleanOptions
        }

        await dispatch(createQuestion(formattedQuestion)).unwrap()
        successCount++
      }

      toast.success(`Successfully imported ${successCount} questions!`)
      setOpen(false)
      onSuccess()
    } catch (err: any) {
      console.error('Failed to import question at index ' + successCount, err)
      toast.error(
        `Import stopped. Successfully imported ${successCount}/${parsedPreview.length} questions. Error: ${err?.message || 'Unknown error'}`
      )
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=' sm:max-w-[1450px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Bulk Import Questions (JSON)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='importExamId'>Target Exam</Label>
            <Select onValueChange={setExamId} value={examId}>
              <SelectTrigger id='importExamId'>
                <SelectValue placeholder='Select an exam to import questions into' />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center justify-between border rounded-lg p-3 bg-muted/40'>
            <div className='space-y-0.5'>
              <h4 className='font-semibold text-sm'>Download Template</h4>
              <p className='text-xs text-muted-foreground'>Download the sample JSON file to see correct formatting.</p>
            </div>
            <a href='/templates/questions-template.json' download='questions-template.json'>
              <Button type='button' variant='outline' size='sm'>
                Download JSON Template
              </Button>
            </a>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='jsonFile'>Upload JSON File</Label>
            <Input id='jsonFile' type='file' accept='.json' onChange={handleFileUpload} className='cursor-pointer' />
          </div>

          <div className='relative flex py-2 items-center'>
            <div className='flex-grow border-t border-muted'></div>
            <span className='flex-shrink mx-4 text-xs text-muted-foreground uppercase'>Or paste raw JSON</span>
            <div className='flex-grow border-t border-muted'></div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='jsonText'>JSON Content</Label>
            <Textarea
              id='jsonText'
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder='Paste question array JSON here...'
              className='font-mono text-xs min-h-[150px] bg-muted/20'
            />
            {fileError && <p className='text-xs text-destructive font-medium mt-1'>{fileError}</p>}
          </div>

          {parsedPreview && (
            <div className='border rounded-lg p-3 bg-primary/5 space-y-2'>
              <div className='flex justify-between items-center text-xs font-semibold'>
                <span className='text-primary'>Parsed Preview Summary:</span>
                <span>{parsedPreview.length} questions found</span>
              </div>
              <div className='max-h-[120px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin'>
                {parsedPreview.map((q: any, i: number) => (
                  <div key={i} className='text-xs border rounded bg-card p-1.5 flex justify-between gap-4'>
                    <span className='truncate font-medium flex-1'>
                      {i + 1}. {q.content || 'Empty content'}
                    </span>
                    <span className='text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded h-fit shrink-0 font-semibold'>
                      {q.type || 'UNKNOWN'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type='submit'
            disabled={isImporting || !examId || !parsedPreview || parsedPreview.length === 0}
            className='w-full'
          >
            {isImporting ? 'Importing...' : `Import ${parsedPreview?.length || 0} Questions`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionBulkImportModal
