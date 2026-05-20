import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createExam, updateExam } from '@/redux/slice/examSlice'
import { fetchCategory } from '@/redux/slice/categorySlice'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import type { IExam } from '@/types/backend'

export interface IExamFormProps {
  open: boolean
  setOpen: (v: boolean) => void
  dataUpdate: IExam | null
  setDataUpdate: (v: IExam | null) => void
  onSuccess: () => void
}

const ExamFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IExamFormProps) => {
  const { register, handleSubmit, reset, control } = useForm<Partial<IExam>>()
  const dispatch = useAppDispatch()
  const { isFetching } = useAppSelector((state) => state.exam)
  const { data: categories } = useAppSelector((state) => state.category)

  useEffect(() => {
    if (open) {
      dispatch(fetchCategory({ query: 'limit=100' }))
    }
  }, [dispatch, open])

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate)
    } else {
      reset({
        title: '',
        slug: '',
        description: '',
        categoryId: '',
        duration: 0,
        totalMarks: 0,
        passMarks: 0,
        isPublished: false,
        isPremium: false
      })
    }
  }, [dataUpdate, reset, open])

  const onSubmit = async (data: Partial<IExam>) => {
    try {
      const formattedData = {
        ...data,
        duration: Number(data.duration),
        totalMarks: Number(data.totalMarks),
        passMarks: Number(data.passMarks),
        isPublished: !!data.isPublished,
        isPremium: !!data.isPremium
      }

      if (dataUpdate) {
        await dispatch(updateExam({ exam: formattedData, id: dataUpdate.id })).unwrap()
        toast.success('Exam updated successfully')
      } else {
        await dispatch(createExam(formattedData)).unwrap()
        toast.success('Exam created successfully')
      }
      setOpen(false)
      setDataUpdate(null)
      reset()
      onSuccess()
    } catch {
      toast.error(dataUpdate ? 'Failed to update exam' : 'Failed to create exam')
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
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? 'Update Exam' : 'Create New Exam'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' {...register('title', { required: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='slug'>Slug</Label>
            <Input id='slug' {...register('slug', { required: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <textarea
              id='description'
              {...register('description')}
              className='flex min-h-[85px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              placeholder='Nhập mô tả đề thi...'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='categoryId'>Category</Label>
            <Controller
              name='categoryId'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='duration'>Duration (m)</Label>
              <Input id='duration' type='number' {...register('duration', { required: true })} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='totalMarks'>Total Marks</Label>
              <Input id='totalMarks' type='number' {...register('totalMarks', { required: true })} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='passMarks'>Pass Marks</Label>
              <Input id='passMarks' type='number' {...register('passMarks', { required: true })} />
            </div>
          </div>

          <div className='flex gap-6 pt-2'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isPublished'
                {...register('isPublished')}
                className='w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 cursor-pointer'
              />
              <Label htmlFor='isPublished' className='font-semibold text-xs text-foreground cursor-pointer'>
                Publish Exam
              </Label>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isPremium'
                {...register('isPremium')}
                className='w-4 h-4 text-amber-500 bg-background border-border rounded focus:ring-amber-500 focus:ring-2 cursor-pointer'
              />
              <Label
                htmlFor='isPremium'
                className='font-bold text-xs text-amber-600 flex items-center gap-0.5 cursor-pointer'
              >
                👑 Premium VIP
              </Label>
            </div>
          </div>

          <Button type='submit' disabled={isFetching} className='w-full'>
            {isFetching ? 'Saving...' : dataUpdate ? 'Update Exam' : 'Create Exam'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExamFormModal
