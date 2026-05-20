import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createCategory, updateCategory } from '@/redux/slice/categorySlice'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { ICategory } from '@/types/backend'

export interface ICategoryFormProps {
  open: boolean
  setOpen: (v: boolean) => void
  dataUpdate: ICategory | null
  setDataUpdate: (v: ICategory | null) => void
  onSuccess: () => void
}

const CategoryFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: ICategoryFormProps) => {
  const { register, handleSubmit, reset } = useForm<Partial<ICategory>>()
  const dispatch = useAppDispatch()
  const { isFetching } = useAppSelector((state) => state.category)

  useEffect(() => {
    if (dataUpdate) {
      reset(dataUpdate)
    } else {
      reset({
        name: '',
        slug: ''
      })
    }
  }, [dataUpdate, reset, open])

  const onSubmit = async (data: Partial<ICategory>) => {
    try {
      if (dataUpdate) {
        await dispatch(updateCategory({ category: data, id: dataUpdate.id })).unwrap()
        toast.success('Category updated successfully')
      } else {
        await dispatch(createCategory(data)).unwrap()
        toast.success('Category created successfully')
      }
      setOpen(false)
      setDataUpdate(null)
      reset()
      onSuccess()
    } catch {
      toast.error(dataUpdate ? 'Failed to update category' : 'Failed to create category')
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? 'Update Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...register('name', { required: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='slug'>Slug</Label>
            <Input id='slug' {...register('slug', { required: true })} />
          </div>
          <Button type='submit' disabled={isFetching} className='w-full'>
            {isFetching ? 'Saving...' : dataUpdate ? 'Update Category' : 'Create Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormModal
