import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createQuestion, updateQuestion } from '@/redux/slice/questionSlice'
import { fetchExam } from '@/redux/slice/examSlice'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import type { IQuestion } from '@/types/backend'
import { Plus, X } from 'lucide-react'

export interface IQuestionFormProps {
  open: boolean
  setOpen: (v: boolean) => void
  dataUpdate: IQuestion | null
  setDataUpdate: (v: IQuestion | null) => void
  onSuccess: () => void
}

const QuestionFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IQuestionFormProps) => {
  const { register, handleSubmit, reset, control, watch } = useForm<Partial<IQuestion>>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options' as any
  })

  const dispatch = useAppDispatch()
  const { isFetching } = useAppSelector((state) => state.question)
  const { data: exams } = useAppSelector((state) => state.exam)

  const questionType = watch('type')

  useEffect(() => {
    if (open) {
      dispatch(fetchExam({ query: 'limit=100' }))
    }
  }, [dispatch, open])

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate)
    } else {
      reset({
        content: '',
        type: 'SINGLE_CHOICE',
        score: 1,
        order: 0,
        explanation: '',
        examId: '',
        options: [
          { content: '', isCorrect: false, order: 0 },
          { content: '', isCorrect: false, order: 1 }
        ]
      })
    }
  }, [dataUpdate, reset, open])

  const onSubmit = async (data: Partial<IQuestion>) => {
    try {
      // Build clean options array
      const cleanOptions =
        data.type === 'ESSAY'
          ? undefined
          : data.options?.map((opt: any, index: number) => ({
              content: opt.content || '',
              isCorrect: !!opt.isCorrect,
              order: index
            }))

      const formattedData = {
        examId: data.examId,
        content: data.content,
        type: data.type,
        score: Number(data.score) || 0,
        order: Number(data.order) || 0,
        explanation: data.explanation || '',
        options: cleanOptions
      }

      if (dataUpdate) {
        await dispatch(updateQuestion({ question: formattedData as any, id: dataUpdate.id })).unwrap()
        toast.success('Question updated successfully')
      } else {
        await dispatch(createQuestion(formattedData as any)).unwrap()
        toast.success('Question created successfully')
      }
      setOpen(false)
      setDataUpdate(null)
      reset()
      onSuccess()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(dataUpdate ? 'Failed to update question' : 'Failed to create question')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setDataUpdate(null)
      }}
    >
      <DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? 'Update Question' : 'Create New Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='examId'>Exam</Label>
              <Controller
                name='examId'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an exam' />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='order'>Order</Label>
              <Input id='order' type='number' {...register('order', { required: true })} />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>Question Content</Label>
            <Textarea
              id='content'
              {...register('content', { required: true })}
              placeholder='Enter question content...'
              className='min-h-[100px]'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='type'>Type</Label>
              <Controller
                name='type'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='SINGLE_CHOICE'>Single Choice</SelectItem>
                      <SelectItem value='MULTIPLE_CHOICE'>Multiple Choice</SelectItem>
                      <SelectItem value='TRUE_FALSE'>True/False</SelectItem>
                      <SelectItem value='FILL_BLANK'>Fill Blank</SelectItem>
                      <SelectItem value='MATCHING'>Matching</SelectItem>
                      <SelectItem value='ESSAY'>Essay</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='score'>Score</Label>
              <Input id='score' type='number' {...register('score', { required: true })} />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='explanation'>Explanation (Optional)</Label>
            <Textarea
              id='explanation'
              {...register('explanation')}
              placeholder='Enter explanation for the correct answer...'
            />
          </div>

          {questionType !== 'ESSAY' && (
            <div className='space-y-4 border-t pt-4'>
              <div className='flex justify-between items-center'>
                <Label>Answer Options</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ content: '', isCorrect: false, order: fields.length })}
                >
                  <Plus className='w-4 h-4 mr-1' /> Add Option
                </Button>
              </div>

              <div className='space-y-3'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex items-start gap-3 group'>
                    <div className='flex items-center h-10'>
                      <Controller
                        name={`options.${index}.isCorrect` as any}
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                      />
                    </div>
                    <div className='flex-1'>
                      <Input
                        {...register(`options.${index}.content` as any, { required: true })}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 opacity-0 group-hover:opacity-100'
                      onClick={() => remove(index)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type='submit' disabled={isFetching} className='w-full sticky bottom-0'>
            {isFetching ? 'Saving...' : dataUpdate ? 'Update Question' : 'Create Question'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default QuestionFormModal
